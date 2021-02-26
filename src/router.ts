import { createRouteController, Route, RouteController } from "./containers.ts";
import { CallBack } from "./types.ts";
import { sanitizePath } from "./utilities.ts";

export interface Router extends RouteController {
  _middleware: CallBack[];
  _routes: Route[];
  use: (...middleware: CallBack[]) => void;
}

export function createRouter(): Router {
  const routerLevelHandlers: CallBack[] = [];
  const { routesTable, routeController } = createRouteController();

  function use(...middleware: CallBack[]) {
    routerLevelHandlers.push(...middleware);
  }

  return {
    get _middleware() {
      return routerLevelHandlers;
    },

    get _routes() {
      return routesTable;
    },
    use,
    ...routeController,
  };
}

export type RouterContainer = {
  prefix: string;
  middleware: CallBack[];
  routes: Route[];
};

export function router(prefix: string, ...middleware: CallBack[]) {
  return function (routes: Route[] = []): RouterContainer {
    for (const route of routes) {
      route.path = sanitizePath([prefix, route.path].join("/"));
      route.routerPath = prefix;
    }

    return {
      prefix,
      middleware,
      routes,
    };
  };
}
