export namespace HttpMethod {
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

export namespace HttpHeaders {
  export const WWWAuthenticate = "WWW-Authenticate",
    Authorization = "Authorization",
    ProxyAuthenticate = "Proxy-Authenticate",
    ProxyAuthorization = "Proxy-Authorization";

  export const Age = "Age",
    CacheControl = "Cache-Control",
    ClearSiteData = "ClearSiteData",
    Expires = "Expires",
    Pragma = "Pragma",
    Warning = "Warning";

  export const LastModified = "Last-Modified",
    ETag = "ETag",
    IfMatch = "If-Match",
    IfNoneMatch = "If-None-Match",
    IfModifiedSince = "If-Modified-Since",
    IfUnmodifiedSince = "If-Unmodified-Since",
    Vary = "Vary";

  export const Connection = "Connection",
    KeepAlive = "Keep-Alive";

  export const Accept = "Accept",
    AcceptCharset = "Accept-Charset",
    AcceptEncoding = "Accept-Encoding",
    AcceptLanguage = "Accept-Language";

  export const expect = "Expect";

  export const Cookie = "Cookie",
    SetCookie = "Set-Cookie";

  export const ContentLength = "Content-Length",
    ContentType = "Content-Type",
    ContentEncoding = "Content-Encoding",
    ContentLanguage = "Content-Language",
    ContentLocation = "Content-Location";

  export const ContentDisposition = "Content-Disposition";

  export const DNT = "DNT",
    Tk = "Tk";

  export const AccessControlAllowOrigin = "Access-Control-Allow-Origin",
    AccessControlAllowCredentials = "Access-Control-Allow-Credentials",
    AccessControlAllowHeaders = "Access-Control-Allow-Headers",
    AccessControlAllowMethods = "Access-Control-Allow-Methods",
    AccessControlExposeHeaders = "Access-Control-Expose-Headers",
    AccessControlMaxAge = "Access-Control-Max-Age",
    AccessControlRequestHeaders = "Access-Control-Request-Headers",
    AccessControlRequestMethod = "Access-Control-Request-Method",
    Origin = "Origin",
    TimingAllowOrigin = "Timing-Allow-Origin";
}

// HTTP Status Codes Reference
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

export namespace HttpStatus {
  export const Continue = 100,
    SwitchingProtocol = 101,
    Processing = 102,
    EarlyHints = 103;

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

  export const MultipleChoice = 300,
    MovedPermanently = 301,
    Found = 302,
    SeeOther = 303,
    NotModified = 304,
    TemporaryRedirect = 307,
    PermanentRedirect = 308;

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
