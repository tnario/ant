import {
  HTTPOptions,
  serve,
  Server,
} from "https://deno.land/std@0.83.0/http/server.ts";
import Router from "./router.ts";
import { RouteNode } from "./containers.ts";
import { parseQueryString } from "./utilities.ts";

export default class Application extends Router {
  #server: Server;
  #routeTree: Record<string, RouteNode> = {};

  constructor(addr: string | HTTPOptions) {
    super();

    this.#server = serve(addr);
  }

  private compileRouteTree() {
    for (const route of this.routeTable) {
      if (!(route.method in this.#routeTree)) {
        this.#routeTree[route.method] = new RouteNode();
      }

      let node = this.#routeTree[route.method];
      const lastIndex = route.path.length - 1;

      for (let i = 0; i < lastIndex; i++) {
        const seg = route.path[i];

        if (!(seg in node.children)) {
          node.children[seg] = new RouteNode();
        }

        node = node.children[seg];
      }

      node.children[route.path[lastIndex]] = new RouteNode(
        route.callbacks,
        route.params
      );
    }
  }

  private getRoute(method: string, url: string) {
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

  async run() {
    this.compileRouteTree();

    for await (const req of this.#server) {
      try {
        const routeNode = this.getRoute(req.method, req.url);

        if (routeNode === undefined) {
          throw new Error("Not Found 404");
        }

        const { callbacks } = routeNode;

        for await (const callback of callbacks) {
          callback(req);
        }
      } catch (error) {
        req.respond({ status: 500 });
        console.log(error);
      }
    }
  }
}
