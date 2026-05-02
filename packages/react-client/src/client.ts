import {
  createRequest,
  type JsonObject,
  type KdbResponse,
} from '@kdb-dashboard-library/protocol'

export type ConnectionStatus = 'closed' | 'connecting' | 'error' | 'open'

type PendingRequest = {
  reject: (reason?: unknown) => void
  resolve: (value: KdbResponse<unknown>) => void
}

type ResponseListener = (response: KdbResponse<unknown>) => void
type StatusListener = (status: ConnectionStatus) => void

export interface KdbClientOptions {
  autoReconnect?: boolean
  reconnectDelayMs?: number
  url: string
}

const isSocketOpen = (socket: WebSocket | null) =>
  socket?.readyState === WebSocket.OPEN

export class KdbWebSocketClient {
  private readonly listeners = new Set<ResponseListener>()
  private readonly pending = new Map<string, PendingRequest>()
  private readonly queue: string[] = []
  private readonly statusListeners = new Set<StatusListener>()

  private manualClose = false
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private socket: WebSocket | null = null

  status: ConnectionStatus = 'closed'

  constructor(private readonly options: KdbClientOptions) {}

  connect() {
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.CONNECTING ||
        this.socket.readyState === WebSocket.OPEN)
    ) {
      return
    }

    this.manualClose = false
    this.setStatus('connecting')

    const socket = new WebSocket(this.options.url)
    this.socket = socket

    socket.onopen = () => {
      this.setStatus('open')
      this.flushQueue()
    }

    socket.onclose = () => {
      this.socket = null
      this.rejectPending('Connection closed before a response was received.')

      if (!this.manualClose && this.options.autoReconnect !== false) {
        this.scheduleReconnect()
      }

      this.setStatus('closed')
    }

    socket.onerror = () => {
      this.setStatus('error')
    }

    socket.onmessage = (event) => {
      void this.handleIncoming(event.data)
    }
  }

  disconnect() {
    this.manualClose = true

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    this.socket?.close()
    this.socket = null
    this.setStatus('closed')
  }

  subscribe(listener: ResponseListener) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  onStatusChange(listener: StatusListener) {
    this.statusListeners.add(listener)
    listener(this.status)
    return () => {
      this.statusListeners.delete(listener)
    }
  }

  request<TData = unknown, TParams extends JsonObject = JsonObject>(
    func: string,
    params?: TParams,
    id?: string,
  ) {
    const envelope = createRequest(func, params, id)

    return new Promise<KdbResponse<TData>>((resolve, reject) => {
      this.pending.set(envelope.id, {
        reject,
        resolve: resolve as (value: KdbResponse<unknown>) => void,
      })

      this.send(JSON.stringify(envelope))
    })
  }

  get url() {
    return this.options.url
  }

  private async handleIncoming(payload: Blob | ArrayBuffer | string) {
    const text =
      typeof payload === 'string'
        ? payload
        : payload instanceof Blob
          ? await payload.text()
          : new TextDecoder().decode(payload)

    const response = JSON.parse(text) as KdbResponse<unknown>
    const pending = this.pending.get(response.id)

    if (pending) {
      pending.resolve(response)
      this.pending.delete(response.id)
    }

    for (const listener of this.listeners) {
      listener(response)
    }
  }

  private flushQueue() {
    while (isSocketOpen(this.socket) && this.queue.length > 0) {
      this.socket?.send(this.queue.shift()!)
    }
  }

  private rejectPending(message: string) {
    for (const pending of this.pending.values()) {
      pending.reject(new Error(message))
    }

    this.pending.clear()
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) {
      return
    }

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.connect()
    }, this.options.reconnectDelayMs ?? 1500)
  }

  private send(payload: string) {
    if (isSocketOpen(this.socket)) {
      this.socket?.send(payload)
      return
    }

    this.queue.push(payload)

    if (this.status === 'closed' || this.status === 'error') {
      this.connect()
    }
  }

  private setStatus(status: ConnectionStatus) {
    this.status = status

    for (const listener of this.statusListeners) {
      listener(status)
    }
  }
}
