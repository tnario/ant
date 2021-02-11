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

// HTTP Status Codes Reference
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
export namespace InformationStatusCode {
  export const Continue = 100,
    SwitchingProtocol = 101,
    Processing = 102,
    EarlyHints = 103;
}

export namespace SuccessfulStatusCode {
  export const OK = 200,
    Created = 201,
    Accepted = 202,
    NonAuthoritative = 203,
    NoContent = 204,
    ResetContent = 205,
    PartialContent = 206,
    MultiStatus = 207,
    AlreadyReported = 208,
    IMUsed = 226;
}

export namespace RedirectStatusCode {
  export const MultipleChoice = 300,
    MovedPermanently = 301,
    Found = 302,
    SeeOther = 303,
    NotModified = 304,
    TemporaryRedirect = 307,
    PermanentRedirect = 308;
}

export namespace ClientErrorStatusCode {
  export const BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    MethodNotAllowed = 405,
    NotAcceptable = 406,
    ProxyAuthentificationRequired = 407,
    RequestTimeout = 408,
    Conflict = 409,
    Gone = 410,
    LengthRequired = 411,
    PreconditionFailed = 412,
    PayloadTooLarge = 413,
    URITooLong = 414,
    UnsupportedMediaType = 415,
    RangeNotSatisfiable = 416,
    ExpectationFailed = 417,
    MisdirectedRequest = 421,
    UpgradeRequired = 426,
    PreconditionRequired = 428,
    TooManyRequests = 429,
    RequestHeaderFieldsTooLarge = 431,
    UnavailableForLegalReasons = 451;
}

export namespace ServerErrorStatusCode {
  export const InternalServerError = 500,
    NotImplemented = 501,
    BadGateway = 502,
    ServiceUnavailable = 503,
    GatewayTimeout = 504,
    HTTPVersionNotSupported = 505,
    VariantAlsoNegotiates = 506,
    InsufficientStorage = 507,
    LoopDetected = 508,
    NotExtended = 510,
    NetworkAuthentificationRequired = 511;
}
