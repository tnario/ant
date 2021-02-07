// The header groups were constructed using the reference from
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers (2021-02-06)

export class HeaderFactory {
  protected h: Headers;

  constructor(init?: Headers) {
    this.h = init || new Headers();
  }

  get headers() {
    return this.h;
  }

  get bodyInformation() {
    const contentLength = (value: string) => {
      this.h.set("Content-Length", value);
      return this.bodyInformation;
    };

    const contentType = (value: string) => {
      this.h.set("Content-Type", value);
      return this.bodyInformation;
    };

    const contentEncoding = (value: string) => {
      this.h.set("Content-Encoding", value);
      return this.bodyInformation;
    };

    const contentLanguage = (value: string) => {
      this.h.set("Content-Language", value);
      return this.bodyInformation;
    };

    const contentLocation = (value: string) => {
      this.h.set("Content-Location", value);
      return this.bodyInformation;
    };

    return {
      contentLength,
      contentType,
      contentEncoding,
      contentLanguage,
      contentLocation,
    };
  }

  get downloads() {
    const contentDisposition = (value: string) => {
      this.h.set("Content-Disposition", value);
      return this.downloads;
    };

    return { contentDisposition };
  }

  get doNotTrack() {
    const dnt = (value: "0" | "1" | "null") => {
      this.h.set("DNT", value);
      return this.doNotTrack;
    };

    const tk = (value: string) => {
      this.h.set("Tk", value);
      return this.doNotTrack;
    };

    return { dnt, tk };
  }

  get authentication() {
    const authorization = (value: string) => {
      this.h.set("Authorization", value);
      return this.authentication;
    };

    const wwwAuthenticate = (value: string) => {
      this.h.set("WWW-Authenticate", value);
      return this.authentication;
    };

    const proxyAuthenticate = (value: string) => {
      this.h.set("Proxy-Authenticate", value);
      return this.authentication;
    };

    const proxyAuthorization = (value: string) => {
      this.h.set("Proxy-Authorization", value);
      return this.authentication;
    };

    return {
      authorization,
      wwwAuthenticate,
      proxyAuthenticate,
      proxyAuthorization,
    };
  }

  get caching() {
    const age = (value: string) => {
      this.h.set("Age", value);
      return this.caching;
    };

    const cacheControl = (value: string) => {
      this.h.set("Cache-Control", value);
      return this.caching;
    };

    const clearSiteData = (value: string) => {
      this.h.set("Clear-Site-Data", value);
      return this.caching;
    };

    const expires = (value: string) => {
      this.h.set("Expires", value);
      return this.caching;
    };

    const pragma = (value: string) => {
      this.h.set("Pragma", value);
      return this.caching;
    };

    const warning = (value: string) => {
      this.h.set("Warning", value);
      return this.caching;
    };

    return { age, cacheControl, clearSiteData, expires, pragma, warning };
  }

  get conditionals() {
    const lastModified = (value: string) => {
      this.h.set("Last-Modified", value);
      return this.conditionals;
    };

    const etag = (value: string) => {
      this.h.set("ETag", value);
      return this.conditionals;
    };

    const ifMatch = (value: string) => {
      this.h.set("If-Match", value);
      return this.conditionals;
    };

    const ifNoneMatch = (value: string) => {
      this.h.set("If-None-Match", value);
      return this.conditionals;
    };

    const ifModifiedSince = (value: string) => {
      this.h.set("If-Modified-Since", value);
      return this.conditionals;
    };

    const ifUnmodifiedSince = (value: string) => {
      this.h.set("If-Unmodified-Since", value);
      return this.conditionals;
    };

    const vary = (value: string) => {
      this.h.set("Vary", value);
      return this.conditionals;
    };

    return {
      lastModified,
      etag,
      ifMatch,
      ifNoneMatch,
      ifModifiedSince,
      ifUnmodifiedSince,
      vary,
    };
  }

  get connectionManagment() {
    const connection = (value: string) => {
      this.h.set("Connection", value);
      return this.connectionManagment;
    };

    const keepAlive = (value: string) => {
      this.h.set("Keep-Alive", value);
      return this.connectionManagment;
    };

    return { connection, keepAlive };
  }

  get contentNegotiation() {
    const accept = (value: string) => {
      this.h.set("Accept", value);
      return this.contentNegotiation;
    };

    const acceptCharset = (value: string) => {
      this.h.set("Accept-Charset", value);
      return this.contentNegotiation;
    };

    const acceptEncoding = (value: string) => {
      this.h.set("Accept-Encoding", value);
      return this.contentNegotiation;
    };

    const acceptLanguage = (value: string) => {
      this.h.set("Accept-Language", value);
      return this.contentNegotiation;
    };

    return { accept, acceptCharset, acceptEncoding, acceptLanguage };
  }

  get controls() {
    const expect = (value: string) => {
      this.h.set("Expect", value);
      return this.controls;
    };

    return { expect };
  }

  get cookies() {
    const cookie = (value: string) => {
      this.h.set("Cookie", value);
      return this.cookies;
    };

    const setCookie = (value: string) => {
      this.h.set("Set-Cookie", value);
      return this.cookies;
    };

    return { cookie, setCookie };
  }

  get cors() {
    const accessControlAllowOrigin = (value: string) => {
      this.h.set("Access-Control-Allow-Origin", value);
      return this.cors;
    };

    const accessControlAllowCredentials = (value: string) => {
      this.h.set("Access-Control-Allow-Credentials", value);
      return this.cors;
    };

    const accessControlAllowHeaders = (value: string) => {
      this.h.set("Access-Control-Allow-Headers", value);
      return this.cors;
    };

    const accessControlAllowMethods = (value: string) => {
      this.h.set("Access-Control-Allow-Methods", value);
      return this.cors;
    };

    const accessControlExposeHeaders = (value: string) => {
      this.h.set("Access-Control-Expose-Headers", value);
      return this.cors;
    };

    const accessControlMaxAge = (value: string) => {
      this.h.set("Access-Control-Max-Age", value);
      return this.cors;
    };

    const accessControlRequestHeaders = (value: string) => {
      this.h.set("Access-Control-Request-Headers", value);
      return this.cors;
    };

    const accessControlRequestMethod = (value: string) => {
      this.h.set("Access-Control-Request-Method", value);
      return this.cors;
    };

    const origin = (value: string) => {
      this.h.set("Origin", value);
      return this.cors;
    };

    const timingAllowOrigin = (value: string) => {
      this.h.set("Timing-Allow-Origin", value);
      return this.cors;
    };

    return {
      accessControlAllowOrigin,
      accessControlAllowCredentials,
      accessControlAllowHeaders,
      accessControlAllowMethods,
      accessControlExposeHeaders,
      accessControlMaxAge,
      accessControlRequestHeaders,
      accessControlRequestMethod,
      origin,
      timingAllowOrigin,
    };
  }
}
