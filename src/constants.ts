export namespace HTTP_METHOD {
  export const GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
    PUT = "PUT",
    HEAD = "HEAD",
    CONNECT = "CONNECT",
    OPTIONS = "OPTIONS",
    PATCH = "PATCH",
    TRACE = "TRACE";
}

export namespace ContentTypes {
  export const textPlain = "text/plain",
    applicationOctetStream = "application/octet-stream",
    textCss = "text/css",
    textCvs = "text/csv",
    applicationGzip = "application/gzip",
    textHtml = "text/html",
    textJavascript = "text/javascript",
    applicationJson = "application/json",
    applicationXhtml = "application/xhtml+xml",
    applicationXml = "application/xml",
    textXml = "text/xml";
}

export const ANT_VERSION = "Ant/0.3.0";

export namespace AuthentificationHeaders {
  export const wwwAuthenticate = "WWW-Authenticate",
    authorization = "Authorization",
    proxyAuthenticate = "Proxy-Authenticate",
    proxyAuthorization = "Proxy-Authorization";
}

export namespace CachingHeaders {
  export const age = "Age",
    cacheControl = "Cache-Control",
    clearSiteData = "ClearSiteData",
    expires = "Expires",
    pragma = "Pragma",
    warning = "Warning";
}

export namespace ConditionalsHeaders {
  export const lastModified = "Last-Modified",
    etag = "ETag",
    ifMatch = "If-Match",
    ifNoneMatch = "If-None-Match",
    ifModifiedSince = "If-Modified-Since",
    ifUnmodifiedSince = "If-Unmodified-Since",
    vary = "Vary";
}

export namespace ConnectionManagmentHeaders {
  export const connection = "Connection",
    keepAlive = "Keep-Alive";
}

export namespace ContentNegotiationHeaders {
  export const accept = "Accept",
    acceptCharset = "Accept-Charset",
    acceptEncoding = "Accept-Encoding",
    acceptLanguage = "Accept-Language";
}

export namespace ControlsHeaders {
  export const expect = "Expect";
}

export namespace CookiesHeaders {
  export const cookie = "Cookie",
    setCookie = "Set-Cookie";
}

export namespace CORSHeaders {
  export const accessControlAllowOrigin = "Access-Control-Allow-Origin",
    accessControlAllowCredentials = "Access-Control-Allow-Credentials",
    accessControlAllowHeaders = "Access-Control-Allow-Headers",
    accessControlAllowMethods = "Access-Control-Allow-Methods",
    accessControlExposeHeaders = "Access-Control-Expose-Headers",
    accessControlMaxAge = "Access-Control-Max-Age",
    accessControlRequestHeaders = "Access-Control-Request-Headers",
    accessControlRequestMethod = "Access-Control-Request-Method",
    origin = "Origin",
    timingAllowOrigin = "Timing-Allow-Origin";
}

export namespace DoNotTrackHeaders {
  export const dnt = "DNT",
    tk = "Tk";
}

export namespace DownloadsHeaders {
  export const contentDisposition = "Content-Disposition";
}

export namespace BodyInformationHeaders {
  export const contentLength = "Content-Length",
    contentType = "Content-Type",
    contentEncoding = "Content-Encoding",
    contentLanguage = "Content-Language",
    contentLocation = "Content-Location";
}
