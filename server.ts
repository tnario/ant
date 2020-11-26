import {
  HTTPOptions,
  serve,
} from "https://deno.land/std@0.78.0/http/server.ts";
import { Node, Route, Storage } from "./base.ts";
import { ERROR_404, ERROR_500 } from "./constants.ts";
import Router from "./router.ts";
import { getPathParams, getQueryParams, transformPath } from "./utils.ts";

export default class Server extends Storage {
  public tree: Record<string, Node>;

  constructor() {
    super();

    this.tree = {};
  }

  useRouter(path: string, router: Router) {
    const pathSegments = transformPath(path);

    for (const route of router.getRoutes()) {
      route.path.shift();
      route.path.unshift(...pathSegments);

      this.routes.push(route);
    }

    return this;
  }

  private generate() {
    // Sort Routes
    const methods = [];
    const sortedRoutes: Record<string, Route[]> = {};
    for (const route of this.routes) {
      if (!sortedRoutes[route.method]) {
        methods.push(route.method);
        sortedRoutes[route.method] = [];
      }

      sortedRoutes[route.method].push(route);
    }

    // Generate Route Tree
    for (const method of methods) {
      const routes = sortedRoutes[method];

      const branch = new Node();
      for (const route of routes) {
        let node = branch;

        const len = route.path.length - 1;
        for (let i = 0; i < len; i++) {
          const segment = route.path[i];

          if (!node.children[segment]) {
            node.children[segment] = new Node();
          }

          node = node.children[segment];
        }

        node.children[route.path[len]] = new Node(
          route.callback,
          route.paramsMap,
        );
      }

      this.tree[method] = branch;
    }
  }

  async run(addr: string | HTTPOptions) {
    this.generate();

    const server = serve(addr);

    // Running Server Process
    for await (const req of server) {
      try {
        const { url, method } = req;

        const [pathString, queryString] = url.split("?");
        const queryParams = getQueryParams(queryString);
        const pathSegments = transformPath(pathString);

        // Get Route Node
        let node = this.tree[method];
        for (let i = 0; i < pathSegments.length; i++) {
          if (node.children.hasOwnProperty("*")) {
            node = node.children["*"];
          } else {
            node = node.children[pathSegments[i]];
          }
        }

        if (!node?.callback) {
          req.respond(ERROR_404);
          continue;
        }

        const { callback, paramsMap } = node;
        const params = getPathParams(pathSegments, paramsMap);

        // Execute Route Callback
        callback(req, params, queryParams);
      } catch (error) {
        req.respond(ERROR_500);
      }
    }
  }
}
