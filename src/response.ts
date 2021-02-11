import { Response } from "https://deno.land/std@0.83.0/http/server.ts";
import {
  Cookie,
  deleteCookie,
  setCookie,
} from "https://deno.land/std@0.83.0/http/cookie.ts";
import {
  ANT_VERSION,
  BodyInformationHeaders,
  ContentTypes,
} from "./constants.ts";
import { HeaderController } from "./headers.ts";

export class ResponseCtx extends HeaderController {
  #data: Response;

  #done: boolean;

  constructor(done_sig: boolean, init?: Response) {
    super();

    this.#data = init || {};
    this.#data.headers = this.h;

    // Set default response headers
    this.h.set("Server", ANT_VERSION);

    this.#done = done_sig;
  }

  status(code: number) {
    this.#data.status = code;
    return {
      send: (d: Uint8Array | Deno.Reader | string) => this.send(d),
      redirect: (to: string) => this.redirect(to),
    };
  }

  get cookie() {
    const set = (c: Cookie) => setCookie(this.#data, c);
    const del = (name: string) => deleteCookie(this.#data, name);

    return { set, delete: del };
  }

  private redirect(to: string) {
    this.#done = true;
    this.h.set("Location", to);
  }

  private send(d: Uint8Array | Deno.Reader | string) {
    // Set response date
    this.h.set("Date", new Date().toUTCString());

    this.#data.body = d;

    this.#done = true;

    const json = () =>
      this.h.set(
        BodyInformationHeaders.contentType,
        ContentTypes.applicationJson
      );

    const text = () =>
      this.h.set(BodyInformationHeaders.contentType, ContentTypes.textPlain);

    const html = () =>
      this.h.set(BodyInformationHeaders.contentType, ContentTypes.textHtml);

    const xml = () =>
      this.h.set(BodyInformationHeaders.contentType, ContentTypes.textXml);

    const type = (contentType: string) =>
      this.h.set(BodyInformationHeaders.contentType, contentType);

    return { json, text, type, html, xml };
  }
}

export function headers(res: Response) {
  if (res.headers === undefined) {
    res.headers = new Headers();
  }

  function set([name, value]: [string, string]) {
    res.headers?.set(name, value);
    return headers(res);
  }

  function del(name: string) {
    res.headers?.delete(name);
    return headers(res);
  }

  return { set, delete: del };
}
