import { CallBack } from "./types.ts";

export class Route {
  method: string;
  path: string;
  callbacks: CallBack[];

  constructor(method: string, path: string, callbacks: CallBack[]) {
    this.method = method;
    this.path = path;
    this.callbacks = callbacks;
  }
}

export class RouteNode {
  children: Record<string, RouteNode> = {};
  callbacks: CallBack[];
  params: Record<number, string>;

  constructor(callbacks?: CallBack[], params?: Record<number, string>) {
    this.callbacks = callbacks || [];
    this.params = params || {};
  }
}
