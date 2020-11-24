import {
  HTTPOptions,
  serve,
} from "https://deno.land/std@0.78.0/http/server.ts";
import { Node, Storage } from "./base.ts";
import { HTTP_METHOD } from "./constants.ts";
import Router from "./router.ts";
import { getPathParams, getQueryParams, transformPath } from "./utils.ts";

export default class Server extends Storage {
  public tree: Record<string, Node>;

  private httpMethods: string[];

  constructor() {
    super();

    this.tree = {};
    this.httpMethods = Object.values(HTTP_METHOD);
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

  private compileRoutesTree() {
    this.tree = this.httpMethods.reduce(
      (branch: Record<string, Node>, method) => {
        const groupedRoutes = this.routes.filter((route) =>
          route.method === method
        );

        if (!groupedRoutes.length) return branch;

        branch[method] = groupedRoutes.reduce((branchAccumulator, route) => {
          route.path.reduce((node, segment, currIndex) => {
            if (!node.children[segment]) {
              node.children[segment] = new Node();
            }

            // Last Node
            if (currIndex === route.path.length - 1) {
              node.children[segment].paramsMap = route.paramsMap;
              node.children[segment].callback = route.callback;
            }

            return node.children[segment];
          }, branchAccumulator);

          return branchAccumulator;
        }, new Node());

        return branch;
      },
      {},
    );
  }

  async run(addr: string | HTTPOptions) {
    const badRequestError = {
      status: 404,
      body: "404 Not Found!",
    };

    const getRouteNode = (
      method: string,
      path: string[],
    ): Node | undefined => {
      let routeNode: Node | undefined = this.tree[method];

      for (let i = 0; i < path.length; i++) {
        if (routeNode.children.hasOwnProperty("*")) {
          routeNode = routeNode.children["*"];
          continue;
        } else if (routeNode.children.hasOwnProperty(path[i])) {
          routeNode = routeNode.children[path[i]];
          continue;
        }

        routeNode = undefined;
        break;
      }
      return routeNode;
    };

    this.compileRoutesTree();

    const server = serve(addr);

    // Running Server Process
    for await (const req of server) {
      const { url, method } = req;
      const [pathString, queryString] = url.split("?");

      const queryParams = getQueryParams(queryString);
      const pathSegments = transformPath(pathString);

      const routeNode = getRouteNode(method, pathSegments);

      if (!routeNode || !routeNode.callback) {
        req.respond(badRequestError);
      } else {
        const { callback, paramsMap } = routeNode;

        const params = getPathParams(pathSegments, paramsMap);

        callback(req, params, queryParams);
      }
    }
  }
}
