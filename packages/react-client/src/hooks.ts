import { startTransition, useEffect, useEffectEvent, useState } from 'react'

import type { JsonObject, JsonValue } from '@kdb-dashboard-library/protocol'

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
  }, [func, options.enabled, options.immediate, params, refresh, status])

  return {
    ...state,
    refresh: () => refresh(params),
  }
}
