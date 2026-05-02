import type {
  JsonObject,
  KdbConnectionStatus,
  KdbEvent,
  KdbInboundMessage,
  KdbRequest,
  KdbRequestMeta,
  KdbResponse
} from "../../types/kdb";

interface KdbSocketClientOptions {
  url: string;
  requestTimeoutMs: number;
  reconnectIntervalMs?: number;
  maxReconnectAttempts?: number;
}

interface PendingRequest {
  reject: (reason?: unknown) => void;
  resolve: (value: KdbResponse<unknown>) => void;
  timeoutId: number;
}

type StatusListener = (status: KdbConnectionStatus) => void;
type MessageListener = (message: KdbInboundMessage<unknown>) => void;
type EventListener = (message: KdbEvent<unknown>) => void;

const safeJsonParse = (payload: string) => {
  try {
    return JSON.parse(payload) as KdbInboundMessage<unknown>;
  } catch {
    return null;
  }
};

export class KdbSocketClient {
  private readonly options: Required<KdbSocketClientOptions>;
  private socket: WebSocket | null = null;
  private status: KdbConnectionStatus = "idle";
  private manualClose = false;
  private reconnectAttempts = 0;
  private reconnectTimer: number | null = null;
  private pendingRequests = new Map<string, PendingRequest>();
  private readonly statusListeners = new Set<StatusListener>();
  private readonly messageListeners = new Set<MessageListener>();
  private readonly eventListeners = new Set<EventListener>();

  constructor(options: KdbSocketClientOptions) {
    this.options = {
      reconnectIntervalMs: 2500,
      maxReconnectAttempts: 10,
      ...options
    };
  }

  connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.manualClose = false;
    this.updateStatus(this.status === "open" ? "reconnecting" : "connecting");
    this.socket = new WebSocket(this.options.url);
    this.socket.addEventListener("open", this.handleOpen);
    this.socket.addEventListener("close", this.handleClose);
    this.socket.addEventListener("error", this.handleError);
    this.socket.addEventListener("message", this.handleMessage);
  }

  disconnect() {
    this.manualClose = true;

    if (this.reconnectTimer !== null) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.rejectPendingRequests("WebSocket connection was closed.");
    this.socket?.close(1000, "Manual close");
    this.socket = null;
    this.updateStatus("closed");
  }

  getStatus() {
    return this.status;
  }

  onStatusChange(listener: StatusListener) {
    this.statusListeners.add(listener);
    listener(this.status);

    return () => {
      this.statusListeners.delete(listener);
    };
  }

  onMessage(listener: MessageListener) {
    this.messageListeners.add(listener);

    return () => {
      this.messageListeners.delete(listener);
    };
  }

  onEvent(listener: EventListener) {
    this.eventListeners.add(listener);

    return () => {
      this.eventListeners.delete(listener);
    };
  }

  async sendRequest<TData, TArgs extends JsonObject = JsonObject>(
    func: string,
    args?: TArgs,
    meta?: KdbRequestMeta
  ) {
    const payload: KdbRequest<TArgs> = {
      type: "request",
      requestId: crypto.randomUUID(),
      func,
      args,
      meta
    };

    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error(`WebSocket is not connected to ${this.options.url}.`);
    }

    return new Promise<KdbResponse<TData>>((resolve, reject) => {
      const timeoutId = window.setTimeout(() => {
        this.pendingRequests.delete(payload.requestId);
        reject(new Error(`Timed out waiting for kdb response for "${func}".`));
      }, this.options.requestTimeoutMs);

      this.pendingRequests.set(payload.requestId, {
        resolve: resolve as PendingRequest["resolve"],
        reject,
        timeoutId
      });

      this.socket?.send(JSON.stringify(payload));
    });
  }

  private readonly handleOpen = () => {
    this.reconnectAttempts = 0;
    this.updateStatus("open");
  };

  private readonly handleClose = () => {
    this.socket = null;

    if (this.manualClose) {
      this.updateStatus("closed");
      return;
    }

    this.rejectPendingRequests("WebSocket connection dropped before a response was received.");

    if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
      this.updateStatus("error");
      return;
    }

    this.reconnectAttempts += 1;
    this.updateStatus("reconnecting");
    this.reconnectTimer = window.setTimeout(() => {
      this.connect();
    }, this.options.reconnectIntervalMs);
  };

  private readonly handleError = () => {
    if (this.status !== "reconnecting") {
      this.updateStatus("error");
    }
  };

  private readonly handleMessage = (event: MessageEvent<string>) => {
    const payload = safeJsonParse(event.data);

    if (!payload) {
      return;
    }

    this.messageListeners.forEach((listener) => listener(payload));

    if (payload.type === "event") {
      this.eventListeners.forEach((listener) => listener(payload));
      return;
    }

    const pendingRequest = this.pendingRequests.get(payload.requestId);

    if (!pendingRequest) {
      return;
    }

    window.clearTimeout(pendingRequest.timeoutId);
    this.pendingRequests.delete(payload.requestId);
    pendingRequest.resolve(payload);
  };

  private updateStatus(status: KdbConnectionStatus) {
    this.status = status;
    this.statusListeners.forEach((listener) => listener(status));
  }

  private rejectPendingRequests(message: string) {
    this.pendingRequests.forEach((pendingRequest) => {
      window.clearTimeout(pendingRequest.timeoutId);
      pendingRequest.reject(new Error(message));
    });
    this.pendingRequests.clear();
  }
}
