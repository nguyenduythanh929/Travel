declare module "sockjs-client" {
  class SockJS {
    constructor(url: string, _reserved?: null, options?: {
      server?: string;
      transports?: string | string[];
      sessionId?: number | (() => string);
    });

    readyState: number;
    protocol: string;
    url: string;
    extensions: string;

    onopen: ((e: Event) => void) | null;
    onclose: ((e: CloseEvent) => void) | null;
    onmessage: ((e: MessageEvent) => void) | null;
    onerror: ((e: Event) => void) | null;

    send(data: string): void;
    close(code?: number, reason?: string): void;

    static CONNECTING: number;
    static OPEN: number;
    static CLOSING: number;
    static CLOSED: number;
  }

  export = SockJS;
  export default SockJS;
}
