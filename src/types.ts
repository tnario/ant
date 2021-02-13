import { ServerRequest } from "https://deno.land/std@0.83.0/http/server.ts";
import { RequestContext } from "./request.ts";
import { ResponseContext } from "./response.ts";

export type ErrorFn = (err: any) => Promise<void> | void;

export type Context = {
  req: ServerRequest;
  params: Record<string, string>;
  query: Record<string, string>;
};

export type CallBack<P = any, Q = any, B = any> = (
  req: RequestContext<P, Q, B>,
  res: ResponseContext,
  error: ErrorFn
) => Promise<void>;

export type ErrorCallBack<P = any, Q = any, B = any> = (
  err: any,
  req: RequestContext<P, Q, B>,
  res: ResponseContext
) => Promise<void>;

export type RouteData = {
  routerPath?: string;
  callbacks: CallBack[];
  params: Record<string, string>;
  query: Record<string, string>;
};
