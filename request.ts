import { ServerRequest } from "https://deno.land/std@0.83.0/http/server.ts";
import { CONTENT_TYPES } from "./constants.ts";

type BodyType = "json" | "text" | "raw";

export class RequestCtx<
  P = Record<string, string>,
  Q = Record<string, string>,
  B = any
> {
  params: P;
  query: Q;
  #serverRequest: ServerRequest;

  constructor(req: ServerRequest, params: P, query: Q) {
    this.#serverRequest = req;
    this.params = params;
    this.query = query;
  }

  get url() {
    return this.#serverRequest.url;
  }

  get method() {
    return this.#serverRequest.method;
  }

  get headers() {
    return this.#serverRequest.headers;
  }

  get body() {
    const decoder = new TextDecoder();

    const getJson = async () => {
      const buffer = await Deno.readAll(this.#serverRequest.body);

      return JSON.parse(decoder.decode(buffer));
    };

    const getText = async () => {
      const buffer = await Deno.readAll(this.#serverRequest.body);

      return decoder.decode(buffer);
    };

    const getRaw = async () => {
      const buffer = await Deno.readAll(this.#serverRequest.body);

      return buffer;
    };

    return {
      get json() {
        return getJson();
      },
      get text() {
        return getText();
      },
      get raw() {
        return getRaw();
      },
    };
  }
}
