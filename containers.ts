import {
  Response,
  ServerRequest,
} from "https://deno.land/std@0.83.0/http/server.ts";
import { Cookie, setCookie } from "https://deno.land/std@0.83.0/http/cookie.ts";
import { CallBack } from "./types.ts";

export class Route {
  method: string;
  path: string;
  callbacks: CallBack[];

  constructor(method: string, path: string, callbacks: CallBack[]) {
    this.method = method;
    this.path = path;
    this.callbacks = callbacks;
  }
}

export class RouteNode {
  children: Record<string, RouteNode> = {};
  callbacks: CallBack[];
  params: Record<number, string>;

  constructor(callbacks?: CallBack[], params?: Record<number, string>) {
    this.callbacks = callbacks || [];
    this.params = params || {};
  }
}

export class ResponseCtx {
  #data: Response = {};

  #headers: Headers = new Headers();

  #meta: Object = {};

  constructor() {}

  status(code: number) {
    this.#data.status = code;
    return this;
  }

  cookie(c: Cookie) {
    setCookie(this.#data, c);
    return this;
  }

  set(h: Record<string, string>) {
    const keys = Object.keys(h);

    for (const k of keys) {
      this.#headers.set(k, h[k]);
    }

    return this;
  }

  get _data() {
    return this.#data;
  }

  get meta() {
    return this.#meta;
  }

  send(d: Uint8Array | Deno.Reader | string) {
    this.#data.headers = this.#headers;
    this.#data.body = d;
  }
}
