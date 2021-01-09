import { CallBack } from "./types.ts";
import { parseRoute } from "./utilities.ts";

export class Route {
  method: string;
  path: string[];
  params: Record<number, string>;
  callbacks: CallBack[];

  constructor(method: string, path: string, callbacks: CallBack[]) {
    const [parsedPath, parsedParams] = parseRoute(path);
    this.method = method;
    this.path = parsedPath;
    this.params = parsedParams;
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
