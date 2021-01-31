import { RouteBuilder } from "./containers.ts";
import { CallBack } from "./types.ts";

export class Router extends RouteBuilder {
  #beforeMiddleware: CallBack[] = [];

  constructor() {
    super();
  }

  get _middleware() {
    return this.#beforeMiddleware;
  }

  get _routes() {
    return this.routesTable;
  }

  use(...middleware: CallBack[]) {
    this.#beforeMiddleware.push(...middleware);
  }
}
