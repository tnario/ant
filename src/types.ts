import { ServerRequest } from "https://deno.land/std@0.83.0/http/server.ts";
import { RequestCtx } from "./request.ts";
import { ResponseCtx } from "./response.ts";

export type ErrorFn = (err: any) => Promise<void> | void;

export type Context = {
  req: ServerRequest;
  params: Record<string, string>;
  query: Record<string, string>;
};

export type CallBack<P = any, Q = any, B = any> = (
  req: RequestCtx<P, Q, B>,
  res: ResponseCtx,
  error: ErrorFn
) => Promise<void>;

export type ErrorCallBack<P = any, Q = any, B = any> = (
  err: any,
  req: RequestCtx<P, Q, B>,
  res: ResponseCtx
) => Promise<void>;

export type RouteData = {
  callbacks: CallBack[];
  params: Record<string, string>;
  query: Record<string, string>;
};
