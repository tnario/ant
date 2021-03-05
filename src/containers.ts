import { HttpMethod } from "./constants.ts";
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
