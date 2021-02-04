import {
  HTTPOptions,
  HTTPSOptions,
  Response,
  serve,
  Server,
  serveTLS,
} from "https://deno.land/std@0.83.0/http/server.ts";
import { Router } from "./router.ts";
import { RouteBuilder, RouteNode } from "./containers.ts";
import { parseQueryString, parseRoute } from "./utilities.ts";
import { CallBack, ErrorCallBack, RouteData } from "./types.ts";
import { RequestCtx } from "./request.ts";
import { ResponseCtx } from "./response.ts";

export class Application extends RouteBuilder {
  #routeTree: Record<string, RouteNode> = {};
  #appMiddleware: CallBack[] = [];
  #routerMiddleware: CallBack[] = [];
  #errorHandlers: ErrorCallBack[] = [];

  constructor() {
    super();
  }

  group(path: string, ...routers: Router[]) {
    for (const router of routers) {
      this.#routerMiddleware.push(...router._middleware);
      for (const route of router._routes) {
        route.path = path + route.path;
        this.routesTable.push(route);
      }
    }
  }

  use(...middleware: CallBack[]) {
    return this.#appMiddleware.push(...middleware);
  }

  private compileRouteTree() {
    for (const route of this.routesTable) {
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

    // Check if route was registered
    if (node.callbacks.length === 0) {
      return undefined;
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

  error(...steps: ErrorCallBack[]) {
    this.#errorHandlers.push(...steps);
  }

  async runHTTP(addr: string | HTTPOptions, cb?: () => void) {
    cb && cb();

    const server = serve(addr);

    await this.runServer(server);
  }

  async runHTTPS(addr: HTTPSOptions, cb?: () => void) {
    cb && cb();

    const server = serveTLS(addr);

    await this.runServer(server);
  }

  private async runServer(server: Server) {
    this.compileRouteTree();

    for await (const req of server) {
      // Ignore /favicon.ico
      if (req.url === "/favicon.ico") {
        req.respond({
          status: 404,
          body: `${req.method} ${req.url} 404 (Not Found)`,
        });
        continue;
      }

      const routeNode = this.getRoute(req.method, req.url);

      if (routeNode === undefined) {
        req.respond({
          status: 400,
          body: `${req.method} ${req.url} 400 (Bad Request)`,
        });
        continue;
      }

      const { callbacks, params, query } = routeNode;

      const requestCtx = new RequestCtx(req, params, query);

      const callbackStack = [
        ...this.#appMiddleware, // Application-Level
        ...this.#routerMiddleware, // Router-Level
        ...callbacks, // Route-Level
      ];

      let DONE = false;
      let error;

      const responsePayload: Response = {
        // Default response values
        status: 200,
      };
      const responseCtx = new ResponseCtx(DONE, responsePayload);

      const errorFn = (err: any) => {
        error = err;
        DONE = true;
      };

      // Process incoming request
      for (const cb of callbackStack) {
        try {
          if (DONE) break;

          await cb(requestCtx, responseCtx, errorFn);
        } catch (e) {
          error = e;
          break;
        }
      }

      // If no errors, send back the response
      if (!error) {
        req.respond(responsePayload);
        continue;
      }

      let ERROR_DONE = false;

      const errorResponse: Response = {
        // Default error response
        status: 500,
      };
      const errorResponseCtx = new ResponseCtx(ERROR_DONE, errorResponse);

      // Handle the error
      for (const ecb of this.#errorHandlers) {
        try {
          if (ERROR_DONE) break;

          await ecb(error, requestCtx, errorResponseCtx);
        } catch (e) {
          console.error(e);
        }
      }

      // Send error response
      req.respond(errorResponse);
    }
  }
}
