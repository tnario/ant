import { HTTP_METHOD } from "./constants.ts";
import { Route } from "./containers.ts";
import { CallBack } from "./types.ts";

export default class Router {
  protected routeTable: Route[] = [];
  protected beforeMiddleware: CallBack[] = [];

  constructor() {}

  get middleware() {
    return this.beforeMiddleware;
  }

  get routes() {
    return this.routeTable;
  }

  useBefore(...middleware: CallBack[]) {
    this.beforeMiddleware.push(...middleware);
  }

  get<P = any, Q = any>(path: string, ...callbacks: CallBack<P, Q>[]) {
    this.routeTable.push(new Route(HTTP_METHOD.GET, path, callbacks));

    return this;
  }

  post<P = any, Q = any, B = any>(
    path: string,
    ...callbacks: CallBack<P, Q, B>[]
  ) {
    this.routeTable.push(new Route(HTTP_METHOD.POST, path, callbacks));

    return this;
  }
  delete<P = any, Q = any>(path: string, ...callbacks: CallBack<P, Q>[]) {
    this.routeTable.push(new Route(HTTP_METHOD.DELETE, path, callbacks));

    return this;
  }
  put<P = any, Q = any>(path: string, ...callbacks: CallBack<P, Q>[]) {
    this.routeTable.push(new Route(HTTP_METHOD.PUT, path, callbacks));

    return this;
  }
}
