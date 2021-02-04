import { ServerRequest } from "https://deno.land/std@0.83.0/http/server.ts";
import {
  Cookie,
  setCookie,
  getCookies,
} from "https://deno.land/std@0.83.0/http/cookie.ts";

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

  get cookies() {
    const set = (c: Cookie) => setCookie(this.#serverRequest, c);
    const get = () => getCookies(this.#serverRequest);

    return { set, get };
  }

  get ip() {
    return (this.#serverRequest.conn.remoteAddr as Deno.NetAddr).hostname;
  }

  get proto() {
    return this.#serverRequest.proto;
  }

  get protoMajor() {
    return this.#serverRequest.protoMajor;
  }

  get protoMinor() {
    return this.#serverRequest.protoMinor;
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

    const getJson = async (): Promise<B> => {
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
