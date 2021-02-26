import {
  HTTPOptions,
  HTTPSOptions,
  Response,
  serve,
  Server,
  serveTLS,
} from "http/server.ts";
import { walkSync } from "fs/mod.ts";
import { Router, RouterContainer } from "./router.ts";
import {
  createRouteController,
  Route,
  RouteController,
  RouteNode,
} from "./containers.ts";
import { parseQueryString, parseRoute } from "./utilities.ts";
import { CallBack, ErrorCallBack } from "./types.ts";
import { createRequestContext } from "./request.ts";
import { createResponseContext } from "./response.ts";
import { MediaType } from "./constants.ts";

export interface Application extends RouteController {
  group: (path: string, ...routers: Router[]) => void;
  use: (...middleware: CallBack[]) => void;
  error: (...steps: ErrorCallBack[]) => void;
  listenHTTP: (addr: string | HTTPOptions, cb?: () => void) => Promise<void>;
  listenHTTPS: (addr: HTTPSOptions, cb?: () => void) => Promise<void>;
  static: (prefix: string, root: string, options?: StaticOptions) => void;
}

type StaticOptions = {
  exts?: string[];
};

export function createApplication(): Application {
  const routeTree: Record<string, RouteNode> = {};
  const appHandlers: CallBack[] = [];
  const routerHandlerMap: Record<string, CallBack[]> = {};
  const errorHandlers: ErrorCallBack[] = [];

  const { routesTable, routeController } = createRouteController();

  function _static(prefix: string, root: string, options?: StaticOptions) {
    const fileStack = options
      ? walkSync(root, { exts: options.exts })
      : walkSync(root);

    const mediaTypes: Record<string, string> = {
      html: MediaType.TextHtml,
      css: MediaType.TextCss,
      js: MediaType.TextJavascript,
      txt: MediaType.TextPlain,
      json: MediaType.ApplicationJson,
    };

    for (const f of fileStack) {
      if (f.isDirectory) continue;
      const path =
        "/" +
        [
          ...prefix.split("/").filter((x) => x !== ""),
          ...f.path
            .split("/")
            .filter((x) => x !== "")
            .slice(1),
        ].join("/");

      routeController.get(path, async (req, res) => {
        const [_, ext] = f.name.split(".");
        const document = await Deno.readFile(f.path);

        res.contentType = mediaTypes[ext] || MediaType.TextPlain;
        res.body = document;
        res.send(200);
      });
    }
  }

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
    // 0 check if requirements are fulfiled before running the server.
    if (errorHandlers.length === 0) {
      throw new Error("Error handling is not implemented!");
    }

    // 1. generate route tree
    for (const route of routesTable) {
      // 1.1 create root branch if non-existing
      if (!(route.method in routeTree)) {
        routeTree[route.method] = new RouteNode();
      }

      let node = routeTree[route.method];

      // 1.2 parse route path
      const [pathSegments, paramMap] = parseRoute(route.path);
      const lastIndex = pathSegments.length - 1;

      // 1.3 begin nesting route path
      for (let i = 0; i < lastIndex; i++) {
        const seg = pathSegments[i];

        // 1.3.1 create a new route layer
        if (!(seg in node.children)) {
          node.children[seg] = new RouteNode();
        }

        // 1.3.2 go to the next layer
        node = node.children[seg];
      }

      // 1.4 if layer exists, insert required route data
      if (node.children[pathSegments[lastIndex]]) {
        node.children[pathSegments[lastIndex]].callbacks = route.callbacks;
        node.children[pathSegments[lastIndex]].params = paramMap;
        node.children[pathSegments[lastIndex]].routerPath = route.routerPath;
        break;
      }

      // 1.5 if layer is non-existing, create new layer with required route data
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
    static: _static,
    listenHTTP,
    listenHTTPS,
    group,
    use,
    error,
    ...routeController,
  };
}

async function runServer(
  server: Server,
  appMiddleware: CallBack[],
  routerMiddlewareMap: Record<string, CallBack[]>,
  routeTable: Route[],
  errorMiddleware: ErrorCallBack[]
) {
  // 1. generate route tree
  const routeTree: Record<string, RouteNode> = {};
  for (const route of routeTable) {
    // 1.1 create root branch if non-existing
    if (!(route.method in routeTree)) {
      routeTree[route.method] = new RouteNode();
    }

    let node = routeTree[route.method];

    // 1.2 parse route path
    const [pathSegments, paramMap] = parseRoute(route.path);
    const lastIndex = pathSegments.length - 1;

    // 1.3 begin nesting route path
    for (let i = 0; i < lastIndex; i++) {
      const seg = pathSegments[i];

      // 1.3.1 create a new route layer
      if (!(seg in node.children)) {
        node.children[seg] = new RouteNode();
      }

      // 1.3.2 go to the next layer
      node = node.children[seg];
    }

    // 1.4 if layer exists, insert required route data
    if (node.children[pathSegments[lastIndex]]) {
      node.children[pathSegments[lastIndex]].callbacks = route.callbacks;
      node.children[pathSegments[lastIndex]].params = paramMap;
      node.children[pathSegments[lastIndex]].routerPath = route.routerPath;
      break;
    }

    // 1.5 if layer is non-existing, create new layer with required route data
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
    if (routerPath) {
      routerHandlers = routerMiddlewareMap[routerPath];
    }

    const callbackStack = [
      ...appMiddleware, // Application-Level
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
    for (const ecb of errorMiddleware) {
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

export function serveHTTP(addr: string | HTTPOptions, cb?: () => void) {
  const server = serve(addr);
  return function (...routers: RouterContainer[]) {
    const routerMiddlewareMap: Record<string, CallBack[]> = {};
    return async function (
      middleware: CallBack[] = [],
      routes: Route[] = [],
      error: ErrorCallBack[]
    ) {
      const routeTable: Route[] = routes;

      for (const router of routers) {
        routerMiddlewareMap[router.prefix] = router.middleware;
        routeTable.push(...router.routes);
      }

      console.log(routeTable);

      cb && cb();
      await runServer(
        server,
        middleware,
        routerMiddlewareMap,
        routeTable,
        error
      );
    };
  };
}

export function serveHTTPS(addr: HTTPSOptions, cb?: () => void) {
  const server = serveTLS(addr);
  return function (...routers: RouterContainer[]) {
    const routerMiddlewareMap: Record<string, CallBack[]> = {};
    return async function (
      middleware: CallBack[] = [],
      routes: Route[] = [],
      error: ErrorCallBack[]
    ) {
      const routeTable: Route[] = routes;

      for (const router of routers) {
        routerMiddlewareMap[router.prefix] = router.middleware;
        routeTable.push(...router.routes);
      }

      cb && cb();
      await runServer(
        server,
        middleware,
        routerMiddlewareMap,
        routeTable,
        error
      );
    };
  };
}
