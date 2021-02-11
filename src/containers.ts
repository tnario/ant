import { HTTP_METHOD } from "./constants.ts";
import { CallBack } from "./types.ts";

export class Route {
  method: string;
  path: string;
  callbacks: CallBack[];
  routerPath: string | undefined;

  constructor(method: string, path: string, callbacks: CallBack[]) {
    this.method = method;
    this.path = path;
    this.callbacks = callbacks;
  }
}

export class RouteNode {
  children: Record<string, RouteNode> = {};
  callbacks: CallBack[];
  routerPath: string | undefined;
  params: Record<number, string>;

  constructor(
    callbacks?: CallBack[],
    params?: Record<number, string>,
    routerPath?: string
  ) {
    this.callbacks = callbacks || [];
    this.params = params || {};
    this.routerPath = routerPath;
  }
}

export class RouteBuilder {
  protected routesTable: Route[] = [];

  constructor() {}

  get<P = any, Q = any>(path: string, ...callbacks: CallBack<P, Q>[]) {
    this.routesTable.push(new Route(HTTP_METHOD.GET, path, callbacks));

    return this;
  }

  post<P = any, Q = any, B = any>(
    path: string,
    ...callbacks: CallBack<P, Q, B>[]
  ) {
    this.routesTable.push(new Route(HTTP_METHOD.POST, path, callbacks));

    return this;
  }
  delete<P = any, Q = any>(path: string, ...callbacks: CallBack<P, Q>[]) {
    this.routesTable.push(new Route(HTTP_METHOD.DELETE, path, callbacks));

    return this;
  }
  put<P = any, Q = any>(path: string, ...callbacks: CallBack<P, Q>[]) {
    this.routesTable.push(new Route(HTTP_METHOD.PUT, path, callbacks));

    return this;
  }
  options<P = any, Q = any>(path: string, ...callbacks: CallBack<P, Q>[]) {
    this.routesTable.push(new Route(HTTP_METHOD.OPTIONS, path, callbacks));

    return this;
  }

  patch<P = any, Q = any>(path: string, ...callbacks: CallBack<P, Q>[]) {
    this.routesTable.push(new Route(HTTP_METHOD.PATCH, path, callbacks));

    return this;
  }

  head<P = any, Q = any>(path: string, ...callbacks: CallBack<P, Q>[]) {
    this.routesTable.push(new Route(HTTP_METHOD.HEAD, path, callbacks));

    return this;
  }

  trace<P = any, Q = any>(path: string, ...callbacks: CallBack<P, Q>[]) {
    this.routesTable.push(new Route(HTTP_METHOD.TRACE, path, callbacks));

    return this;
  }

  connect<P = any, Q = any>(path: string, ...callbacks: CallBack<P, Q>[]) {
    this.routesTable.push(new Route(HTTP_METHOD.CONNECT, path, callbacks));

    return this;
  }
}
