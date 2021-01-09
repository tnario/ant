import { Route } from "./containers.ts";
import { CallBack } from "./types.ts";

export default class Router {
  protected routeTable: Route[] = [];

  constructor() {}

  get(path: string, ...callbacks: CallBack[]) {
    this.routeTable.push(new Route("GET", path, callbacks));

    return this;
  }

  post(path: string, ...callbacks: CallBack[]) {
    this.routeTable.push(new Route("POST", path, callbacks));

    return this;
  }
}
