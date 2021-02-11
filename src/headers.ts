// The header groups were constructed using the reference from
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers (2021-02-06)
export class HeaderController {
  protected h: Headers;

  constructor(init?: Headers) {
    this.h = init || new Headers();
  }

  get headers() {
    return this.h;
  }
}
