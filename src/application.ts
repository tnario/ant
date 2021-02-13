import {
  HTTPOptions,
  HTTPSOptions,
  Response,
  serve,
  Server,
  serveTLS,
} from "https://deno.land/std@0.83.0/http/server.ts";
import { Router } from "./router.ts";
import {
  createRouteController,
  RouteController,
  RouteNode,
} from "./containers.ts";
import { parseQueryString, parseRoute } from "./utilities.ts";
import { CallBack, ErrorCallBack } from "./types.ts";
import { createRequestContext } from "./request.ts";
import { createResponseContext } from "./response.ts";

export interface Application extends RouteController {
  group: (path: string, ...routers: Router[]) => void;
  use: (...middleware: CallBack[]) => void;
  error: (...steps: ErrorCallBack[]) => void;
  listenHTTP: (addr: string | HTTPOptions, cb?: () => void) => Promise<void>;
  listenHTTPS: (addr: HTTPSOptions, cb?: () => void) => Promise<void>;
}

export function createApplication(): Application {
  const routeTree: Record<string, RouteNode> = {};
  const appHandlers: CallBack[] = [];
  const routerHandlerMap: Record<string, CallBack[]> = {};
  const errorHandlers: ErrorCallBack[] = [];
  const { routesTable, routeController } = createRouteController();

  function group(path: string, ...routers: Router[]) {
    for (const router of routers) {
      if (!(path in routerHandlerMap)) {
        routerHandlerMap[path] = [];
      }
      routerHandlerMap[path].push(...router._middleware);
      for (const route of router._routes) {
        route.path = path + route.path;
        route.routerPath = path;
        routesTable.push(route);
      }
    }
  }

  function use(...middleware: CallBack[]) {
    appHandlers.push(...middleware);
  }

  function error(...steps: ErrorCallBack[]) {
    errorHandlers.push(...steps);
  }

  // private
  async function runServer(server: Server) {
    // 1. generate route tree
    for (const route of routesTable) {
      if (!(route.method in routeTree)) {
        routeTree[route.method] = new RouteNode();
      }

      let node = routeTree[route.method];
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
        paramMap,
        route.routerPath
      );
    }

    // 2. run web server
    serverLoop: for await (const req of server) {
      // 2.1 Ignore /favicon.ico
      if (req.url === "/favicon.ico") {
        req.respond({
          status: 404,
          body: `${req.method} ${req.url} 404 (Not Found)`,
        });
        continue;
      }

      // 2.2 get route and its data from the routeTree

      // 2.2.1 parse the request url
      const [route, queryString] = req.url.split("?");
      const pathSegments = ["/", ...route.split("/").filter((x) => x !== "")];

      // 2.2.2 traverse through the routeTree and
      // find route that was requested
      let node = routeTree[req.method];
      const paramIndexes: number[] = [];
      for (let i = 0; i < pathSegments.length && node !== undefined; i++) {
        const seg = pathSegments[i];

        if ("*" in node.children) {
          node = node.children["*"];
          paramIndexes.push(i);
          continue;
        }

        node = node.children[seg];
      }

      // 2.2.3 if route is non-existing, respond with status 400
      if (node === undefined || (node && node.callbacks.length === 0)) {
        req.respond({
          status: 400,
          body: `${req.method} ${req.url} 400 (Bad Request)`,
        });
        continue serverLoop;
      }

      // 2.2.4 get all required data from requested route
      const query = queryString ? parseQueryString(queryString) : {};
      const { callbacks, routerPath } = node;
      const params: Record<string, string> = {};
      for (const i of paramIndexes) {
        params[node.params[i]] = pathSegments[i];
      }

      const reqCtx = await createRequestContext(req, params, query);

      let routerHandlers: CallBack[] = [];
      if (routerPath && routerHandlerMap[routerPath] !== undefined) {
        routerHandlers = routerHandlerMap[routerPath];
      }

      const callbackStack = [
        ...appHandlers, // Application-Level
        ...routerHandlers, // Router-Level
        ...callbacks, // Route-Level
      ];

      let DONE = false;

      const responsePayload: Response = {
        // Default response values
        status: 200,
      };

      const resCtx = createResponseContext(responsePayload, DONE);

      let err;
      function errorFn(e: any) {
        err = e;
        DONE = true;
      }

      // Process incoming request
      for (let i = 0; i < callbackStack.length; i++) {
        try {
          if (DONE) break;

          await callbackStack[i](reqCtx, resCtx, errorFn);
        } catch (e) {
          err = e;
          break;
        }
      }

      // If no errors, send back the response
      if (!err) {
        req.respond(responsePayload);
        continue;
      }

      let ERROR_DONE = false;

      const errorResponse: Response = {
        // Default error response
        status: 500,
      };

      const errResCtx = createResponseContext(errorResponse, ERROR_DONE);

      // Handle the error
      for (const ecb of errorHandlers) {
        try {
          if (ERROR_DONE) break;

          await ecb(err, reqCtx, errResCtx);
        } catch (e) {
          console.error(e);
        }
      }

      // Send error response
      req.respond(errorResponse);
    }
  }

  async function listenHTTP(addr: string | HTTPOptions, cb?: () => void) {
    cb && cb();

    const server = serve(addr);

    await runServer(server);
  }

  async function listenHTTPS(addr: HTTPSOptions, cb?: () => void) {
    cb && cb();

    const server = serveTLS(addr);

    await runServer(server);
  }

  return {
    listenHTTP,
    listenHTTPS,
    group,
    use,
    error,
    ...routeController,
  };
}
