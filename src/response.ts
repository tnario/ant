import { Response } from "https://deno.land/std@0.83.0/http/server.ts";
import { Cookie, setCookie } from "https://deno.land/std@0.83.0/http/cookie.ts";

export class ResponseCtx {
  #data: Response;

  #headers: Headers = new Headers();

  #meta: Object = {};

  #done: boolean;

  constructor(done_sig: boolean, init?: Response) {
    this.#data = init || {};
    this.#done = done_sig;
  }

  status(code: number) {
    this.#data.status = code;
    return this;
  }

  cookie(c: Cookie) {
    setCookie(this.#data, c);
    return this;
  }

  set(...headers: [string, string][]) {
    for (const [k, v] of headers) {
      this.#headers.set(k, v);
    }

    return this;
  }

  send(d: Uint8Array | Deno.Reader | string) {
    this.#done = true;

    this.#data.headers = this.#headers;
    this.#data.body = d;

    const json = () => this.#headers.set("content-type", "application/json");
    const text = () => this.#headers.set("content-type", "text/plain");
    const type = (contentType: string) =>
      this.#headers.set("content-type", contentType);

    return { json, text, type };
  }
}
