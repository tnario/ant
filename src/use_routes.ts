import { HttpMethod } from "./constants.ts";
import { Route } from "./containers.ts";
import { CallBack } from "./types.ts";

export interface UseRoutes {
  get: <P = any, Q = any>(path: string, ...callbacks: CallBack<P, Q>[]) => void;
  post: <P = any, Q = any, B = any>(
    path: string,
    ...callbacks: CallBack<P, Q, B>[]
  ) => void;
  delete: <P = any, Q = any>(
    path: string,
    ...callbacks: CallBack<P, Q>[]
  ) => void;
  put: <P = any, Q = any>(path: string, ...callbacks: CallBack<P, Q>[]) => void;
  options: <P = any, Q = any>(
    path: string,
    ...callbacks: CallBack<P, Q>[]
  ) => void;
  patch: <P = any, Q = any>(
    path: string,
    ...callbacks: CallBack<P, Q>[]
  ) => void;
  head: <P = any, Q = any>(
    path: string,
    ...callbacks: CallBack<P, Q>[]
  ) => void;
  trace: <P = any, Q = any>(
    path: string,
    ...callbacks: CallBack<P, Q>[]
  ) => void;
  connect: <P = any, Q = any>(
    path: string,
    ...callbacks: CallBack<P, Q>[]
  ) => void;
}

export function useRoutes(): [Route[], UseRoutes] {
  const container: Route[] = [];

  function get<P = any, Q = any>(path: string, ...callbacks: CallBack<P, Q>[]) {
    container.push(new Route(HttpMethod.GET, path, callbacks));
  }

  function post<P = any, Q = any, B = any>(
    path: string,
    ...callbacks: CallBack<P, Q, B>[]
  ) {
    container.push(new Route(HttpMethod.POST, path, callbacks));
  }
  function del<P = any, Q = any>(path: string, ...callbacks: CallBack<P, Q>[]) {
    container.push(new Route(HttpMethod.DELETE, path, callbacks));
  }
  function put<P = any, Q = any>(path: string, ...callbacks: CallBack<P, Q>[]) {
    container.push(new Route(HttpMethod.PUT, path, callbacks));
  }
  function options<P = any, Q = any>(
    path: string,
    ...callbacks: CallBack<P, Q>[]
  ) {
    container.push(new Route(HttpMethod.OPTIONS, path, callbacks));
  }

  function patch<P = any, Q = any>(
    path: string,
    ...callbacks: CallBack<P, Q>[]
  ) {
    container.push(new Route(HttpMethod.PATCH, path, callbacks));
  }

  function head<P = any, Q = any>(
    path: string,
    ...callbacks: CallBack<P, Q>[]
  ) {
    container.push(new Route(HttpMethod.HEAD, path, callbacks));
  }

  function trace<P = any, Q = any>(
    path: string,
    ...callbacks: CallBack<P, Q>[]
  ) {
    container.push(new Route(HttpMethod.TRACE, path, callbacks));
  }

  function connect<P = any, Q = any>(
    path: string,
    ...callbacks: CallBack<P, Q>[]
  ) {
    container.push(new Route(HttpMethod.CONNECT, path, callbacks));
  }

  return [
    container,
    {
      get,
      post,
      delete: del,
      put,
      options,
      patch,
      head,
      trace,
      connect,
    },
  ];
}
