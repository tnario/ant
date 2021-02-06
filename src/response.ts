import { Response } from "https://deno.land/std@0.83.0/http/server.ts";
import {
  Cookie,
  deleteCookie,
  setCookie,
} from "https://deno.land/std@0.83.0/http/cookie.ts";
import { ANT_VERSION, ContentTypes } from "./constants.ts";
import { HeaderFactory } from "./headers.ts";

export class ResponseCtx extends HeaderFactory {
  #data: Response;

  #done: boolean;

  constructor(done_sig: boolean, init?: Response) {
    super();
    this.#data = init || {};

    // Set default response headers
    this.headers.set("Server", ANT_VERSION);

    this.#done = done_sig;
  }

  status(code: number) {
    this.#data.status = code;
    return { send: (d: Uint8Array | Deno.Reader | string) => this.send(d) };
  }

  get cookie() {
    const set = (c: Cookie) => setCookie(this.#data, c);
    const del = (name: string) => deleteCookie(this.#data, name);

    return { set, delete: del };
  }

  send(d: Uint8Array | Deno.Reader | string) {
    // Set response date
    this.h.set("Date", new Date().toUTCString());

    this.#data.headers = this.h;
    this.#data.body = d;

    this.#done = true;

    const json = () => this.h.set("content-type", ContentTypes.applicationJson);

    const text = () => this.h.set("content-type", ContentTypes.textPlain);

    const html = () => this.h.set("content-type", ContentTypes.textHtml);

    const xml = () => this.h.set("content-type", ContentTypes.textXml);

    const type = (contentType: string) =>
      this.h.set("content-type", contentType);

    return { json, text, type, html, xml };
  }
}
