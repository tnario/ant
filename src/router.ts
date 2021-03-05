import { Route } from "./containers.ts";
import { CallBack } from "./types.ts";
import { sanitizePath } from "./utilities.ts";

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
