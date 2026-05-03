import { startTransition, useEffect, useEffectEvent, useState } from 'react'

import type {
  JsonObject,
  JsonValue,
  KdbResponse,
} from '@kdb-dashboard-library/protocol'

import { useKdbConnection } from './provider'

interface LiveQueryState<TData> {
  data: TData | null
  error: string | null
  isLoading: boolean
  lastUpdated: string | null
}

interface UseKdbLiveQueryOptions<TData> {
  enabled?: boolean
  fallbackData?: TData
  immediate?: boolean
}

interface UseKdbStreamOptions<TData> extends UseKdbLiveQueryOptions<TData> {
  unsubscribeFunc?: string
}

export function useKdbRequest() {
  const { request, status } = useKdbConnection()
  return { request, status }
}

export function useKdbLiveQuery<
  TData = JsonValue,
  TParams extends JsonObject = JsonObject,
>(
  func: string,
  params?: TParams,
  options: UseKdbLiveQueryOptions<TData> = {},
) {
  const { request, status } = useKdbConnection()
  const [state, setState] = useState<LiveQueryState<TData>>({
    data: options.fallbackData ?? null,
    error: null,
    isLoading: options.immediate !== false,
    lastUpdated: null,
  })

  const refresh = useEffectEvent(async (nextParams = params) => {
    setState((current) => ({
      ...current,
      error: null,
      isLoading: true,
    }))

    try {
      const response = await request<TData, TParams>(func, nextParams)

      startTransition(() => {
        if (response.ok) {
          setState({
            data: response.data,
            error: null,
            isLoading: false,
            lastUpdated: response.ts,
          })
          return
        }

        setState((current: LiveQueryState<TData>) => ({
          ...current,
          error: response.error.message,
          isLoading: false,
          lastUpdated: response.ts,
        }))
      })
    } catch (error) {
      startTransition(() => {
        setState((current: LiveQueryState<TData>) => ({
          ...current,
          error: error instanceof Error ? error.message : 'Unknown error',
          isLoading: false,
        }))
      })
    }
  })

  useEffect(() => {
    if (options.enabled === false || options.immediate === false) {
      return
    }

    if (status !== 'open') {
      return
    }

    void refresh(params)
    // Effect Events already capture the latest request logic.
    // Adding `refresh` here would cause the query to retrigger on every render.
  }, [func, options.enabled, options.immediate, params, status])

  return {
    ...state,
    refresh: () => refresh(params),
  }
}

export function useKdbStream<
  TData = JsonValue,
  TParams extends JsonObject = JsonObject,
>(
  func: string,
  params?: TParams,
  options: UseKdbStreamOptions<TData> = {},
) {
  const { client, status } = useKdbConnection()
  const [state, setState] = useState<LiveQueryState<TData>>({
    data: options.fallbackData ?? null,
    error: null,
    isLoading: options.immediate !== false,
    lastUpdated: null,
  })

  const applyResponse = useEffectEvent((response: KdbResponse<TData>) => {
    if (response.func !== func) {
      return
    }

    startTransition(() => {
      if (response.ok) {
        setState({
          data: response.data,
          error: null,
          isLoading: false,
          lastUpdated: response.ts,
        })
        return
      }

      setState((current: LiveQueryState<TData>) => ({
        ...current,
        error: response.error.message,
        isLoading: false,
        lastUpdated: response.ts,
      }))
    })
  })

  const subscribe = useEffectEvent(async () => {
    setState((current) => ({
      ...current,
      error: null,
      isLoading: true,
    }))

    try {
      await client.request<TData, TParams>(func, params)
    } catch (error) {
      startTransition(() => {
        setState((current: LiveQueryState<TData>) => ({
          ...current,
          error: error instanceof Error ? error.message : 'Unknown error',
          isLoading: false,
        }))
      })
    }
  })

  const unsubscribe = useEffectEvent(() => {
    if (!options.unsubscribeFunc) {
      return
    }

    void client.request(options.unsubscribeFunc)
  })

  useEffect(() => {
    return client.subscribe((response) => {
      applyResponse(response as KdbResponse<TData>)
    })
  }, [client])

  useEffect(() => {
    if (options.enabled === false || options.immediate === false) {
      return
    }

    if (status !== 'open') {
      return
    }

    void subscribe()

    return () => {
      if (status === 'open') {
        unsubscribe()
      }
    }
  }, [
    func,
    options.enabled,
    options.immediate,
    options.unsubscribeFunc,
    params,
    status,
  ])

  return {
    ...state,
    refresh: () => subscribe(),
  }
}
