import { ServerRequest } from "https://deno.land/std@0.83.0/http/server.ts";
import { ResponseCtx } from "./containers.ts";
import { RequestCtx } from "./request.ts";

export type NextFn = () => Promise<void> | void;

export type Context = {
  req: ServerRequest;
  params: Record<string, string>;
  query: Record<string, string>;
};

export type CallBack<P = any, Q = any, B = any> = (
  req: RequestCtx<P, Q, B>,
  res: ResponseCtx,
  next: NextFn
) => Promise<void>;

export type RouteData = {
  callbacks: CallBack[];
  params: Record<string, string>;
  query: Record<string, string>;
};
