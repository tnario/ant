import { ServerRequest } from "https://deno.land/std@0.78.0/http/server.ts";

export type Req = ServerRequest & {
  params: Record<string, string>;
  query: Record<string, string>;
};

export type Callback = (
  req: any,
  params: Record<string, string>,
  query: Record<string, string>,
) => Promise<void>;

export type HTTPMethod = "GET" | "POST" | "DELETE" | "PUT";
