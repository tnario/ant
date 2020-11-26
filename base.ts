import { HTTP_METHOD } from "./constants.ts";
import { normalizePath } from "./utils.ts";
import { Callback } from "./types.ts";

export class Node {
  public children: Record<string, Node>;

  public callback: Callback | undefined;

  public paramsMap: string[][];

  constructor();
  constructor(callback: Callback, paramsMap: string[][]);
  constructor(p1?: any, p2?: any) {
    this.children = {};
    this.callback = p1 || undefined;
    this.paramsMap = p2 || [];
  }
}

export class Route {
  public id: number;

  public method: string;

  public path: string[];

  public callback: Callback;

  public paramsMap: string[][];

  constructor(
    id: number,
    method: string,
    fullpath: string,
    callback: Callback,
  ) {
    const [pathString] = fullpath.split("?");
    const [path, paramsMap] = normalizePath(pathString);

    this.paramsMap = paramsMap;
    this.id = id;
    this.method = method;
    this.path = path;
    this.callback = callback;
  }
}

export class Storage {
  protected routes: Route[];

  constructor() {
    this.routes = [];
  }

  getRoutes() {
    return this.routes;
  }

  get(path: string, callback: Callback) {
    this.routes.push(
      new Route(
        this.routes.length,
        HTTP_METHOD.GET,
        path,
        callback,
      ),
    );

    return this;
  }

  post(path: string, callback: Callback) {
    this.routes.push(
      new Route(this.routes.length, HTTP_METHOD.POST, path, callback),
    );

    return this;
  }

  delete(path: string, callback: Callback) {
    this.routes.push(
      new Route(
        this.routes.length,
        HTTP_METHOD.DELETE,
        path,
        callback,
      ),
    );

    return this;
  }
}
