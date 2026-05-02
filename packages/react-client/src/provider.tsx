import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import type { JsonObject, KdbResponse } from '@kdb-dashboard-library/protocol'

import {
  KdbWebSocketClient,
  type ConnectionStatus,
  type KdbClientOptions,
} from './client'

export interface KdbContextValue {
  client: KdbWebSocketClient
  connect: () => void
  disconnect: () => void
  latestResponse: KdbResponse<unknown> | null
  request: <TData = unknown, TParams extends JsonObject = JsonObject>(
    func: string,
    params?: TParams,
    id?: string,
  ) => Promise<KdbResponse<TData>>
  status: ConnectionStatus
  url: string
}

export interface KdbProviderProps extends KdbClientOptions {
  children: ReactNode
}

const KdbContext = createContext<KdbContextValue | null>(null)

export function KdbProvider({
  autoReconnect,
  children,
  reconnectDelayMs,
  url,
}: KdbProviderProps) {
  const clientRef = useRef<KdbWebSocketClient | null>(null)

  if (!clientRef.current) {
    clientRef.current = new KdbWebSocketClient({
      autoReconnect,
      reconnectDelayMs,
      url,
    })
  }

  const client = clientRef.current
  const [status, setStatus] = useState<ConnectionStatus>(client.status)
  const [latestResponse, setLatestResponse] =
    useState<KdbResponse<unknown> | null>(null)

  const handleStatusChange = useEffectEvent((nextStatus: ConnectionStatus) => {
    startTransition(() => {
      setStatus(nextStatus)
    })
  })

  const handleResponse = useEffectEvent((response: KdbResponse<unknown>) => {
    startTransition(() => {
      setLatestResponse(response)
    })
  })

  useEffect(() => {
    const unsubscribeStatus = client.onStatusChange(handleStatusChange)
    const unsubscribeResponse = client.subscribe(handleResponse)

    client.connect()

    return () => {
      unsubscribeStatus()
      unsubscribeResponse()
      client.disconnect()
    }
  }, [client])

  return (
    <KdbContext.Provider
      value={{
        client,
        connect: () => client.connect(),
        disconnect: () => client.disconnect(),
        latestResponse,
        request: client.request.bind(client),
        status,
        url,
      }}
    >
      {children}
    </KdbContext.Provider>
  )
}

export function useKdbConnection() {
  const value = useContext(KdbContext)

  if (!value) {
    throw new Error('useKdbConnection must be used within a KdbProvider.')
  }

  return value
}
