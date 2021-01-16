import {
  HTTPOptions,
  Response,
  serve,
  Server,
} from "https://deno.land/std@0.83.0/http/server.ts";
import Router from "./router.ts";
import { ResponseCtx, RouteNode } from "./containers.ts";
import { parseQueryString, parseRoute } from "./utilities.ts";
import { CallBack, RouteData } from "./types.ts";
import { RequestCtx } from "./request.ts";

export class Application extends Router {
  #server: Server;
  #routeTree: Record<string, RouteNode> = {};

  constructor(addr: string | HTTPOptions) {
    super();

    this.#server = serve(addr);
  }

  mount(path: string, router: Router) {
    for (const route of router.routes) {
      route.path = path + route.path;
      this.routeTable.push(route);
    }
  }

  private compileRouteTree() {
    for (const route of this.routeTable) {
      if (!(route.method in this.#routeTree)) {
        this.#routeTree[route.method] = new RouteNode();
      }

      let node = this.#routeTree[route.method];
      const [pathSegments, paramMap] = parseRoute(route.path);
      const lastIndex = pathSegments.length - 1;

      for (let i = 0; i < lastIndex; i++) {
        const seg = pathSegments[i];

        if (!(seg in node.children)) {
          node.children[seg] = new RouteNode();
        }

        node = node.children[seg];
      }

      node.children[pathSegments[lastIndex]] = new RouteNode(
        route.callbacks,
        paramMap
      );
    }
  }

  private getRoute(method: string, url: string): RouteData | undefined {
    if (!(method in this.#routeTree)) {
      return undefined;
    }

    const [route, queryString] = url.split("?");
    const pathSegments = ["/", ...route.split("/").filter((x) => x !== "")];

    let node = this.#routeTree[method];
    const paramIndexes: number[] = [];

    for (let i = 0; i < pathSegments.length; i++) {
      const seg = pathSegments[i];

      if ("*" in node.children) {
        node = node.children["*"];
        paramIndexes.push(i);
        continue;
      } else if (!(seg in node.children)) {
        return undefined;
      }

      node = node.children[seg];
    }

    const params: Record<string, string> = {};
    for (const i of paramIndexes) {
      params[node.params[i]] = pathSegments[i];
    }

    return {
      callbacks: node.callbacks,
      params,
      query: queryString ? parseQueryString(queryString) : {},
    };
  }

  private async runPipeline(
    req: RequestCtx,
    res: ResponseCtx,
    callbacks: CallBack[]
  ) {
    let prevIndex = -1;

    const execNext = async (index: number): Promise<void> => {
      if (index === prevIndex) {
        throw new Error("next() called multiple times!");
      }

      prevIndex = index;

      const callback = callbacks[index];

      if (callback !== undefined) {
        await callback(req, res, () => execNext(index + 1));
      }
    };

    await execNext(0);
  }

  async run() {
    this.compileRouteTree();

    for await (const req of this.#server) {
      try {
        const routeNode = this.getRoute(req.method, req.url);

        if (routeNode === undefined) {
          throw new Error("Not Found 404");
        }

        const { callbacks, params, query } = routeNode;

        const requestCtx = new RequestCtx(req, params, query);
        const responseCtx = new ResponseCtx();

        this.runPipeline(requestCtx, responseCtx, [
          ...this.beforeMiddleware,
          ...callbacks,
        ]);

        req.respond(responseCtx._data);
      } catch (error) {
        req.respond({ status: 500 });
        console.log(error);
      }
    }
  }
}
