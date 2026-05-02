import { useState } from "react";
import { useKdb } from "./useKdb";
import type { JsonObject, KdbRequestMeta } from "../types/kdb";

interface RequestState<TData> {
  data: TData | null;
  error: string | null;
  execute: <TArgs extends JsonObject = JsonObject>(
    func: string,
    args?: TArgs,
    meta?: KdbRequestMeta
  ) => Promise<TData>;
  isLoading: boolean;
}

export function useKdbRequest<TData = unknown>(): RequestState<TData> {
  const { sendRequest } = useKdb();
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute: RequestState<TData>["execute"] = async (func, args, meta) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendRequest<TData>(func, args, meta);
      setData(response);
      return response;
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : "Unexpected websocket request failure.";
      setError(message);
      throw requestError;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    error,
    execute,
    isLoading
  };
}
