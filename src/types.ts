import { ServerRequest } from "https://deno.land/std@0.83.0/http/server.ts";

export type CallBack = (req: ServerRequest) => Promise<void>;
