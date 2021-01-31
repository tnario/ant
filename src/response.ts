import { Response } from "https://deno.land/std@0.83.0/http/server.ts";
import {
  Cookie,
  deleteCookie,
  setCookie,
} from "https://deno.land/std@0.83.0/http/cookie.ts";
import { CONTENT_TYPES } from "./constants.ts";

export class ResponseCtx {
  #data: Response;

  #headers: Headers = new Headers();

  #done: boolean;

  constructor(done_sig: boolean, init?: Response) {
    this.#data = init || {};
    this.#done = done_sig;
  }

  status(code: number) {
    this.#data.status = code;
    return { send: (d: Uint8Array | Deno.Reader | string) => this.send(d) };
  }

  get cookies() {
    const set = (c: Cookie) => setCookie(this.#data, c);
    const del = (name: string) => deleteCookie(this.#data, name);

    return { set, delete: del };
  }

  get headers() {
    return this.#headers;
  }

  send(d: Uint8Array | Deno.Reader | string) {
    this.#data.headers = this.#headers;
    this.#data.body = d;

    this.#done = true;

    const json = () =>
      this.#headers.set("content-type", CONTENT_TYPES.APPLICATION_JSON);

    const text = () =>
      this.#headers.set("content-type", CONTENT_TYPES.TEXT_PLAIN);

    const html = () =>
      this.#headers.set("content-type", CONTENT_TYPES.TEXT_HTML);

    const xml = () => this.#headers.set("content-type", CONTENT_TYPES.TEXT_XML);

    const type = (contentType: string) =>
      this.#headers.set("content-type", contentType);

    return { json, text, type, html, xml };
  }
}
