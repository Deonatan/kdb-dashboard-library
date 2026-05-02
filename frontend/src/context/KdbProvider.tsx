import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { env } from "../config/env";
import { KdbSocketClient } from "../lib/websocket/KdbSocketClient";
import type { JsonObject, KdbConnectionStatus, KdbEvent, KdbRequestMeta } from "../types/kdb";

interface KdbContextValue {
  lastError: string | null;
  lastEvent: KdbEvent<unknown> | null;
  reconnect: () => void;
  sendRequest: <TData, TArgs extends JsonObject = JsonObject>(
    func: string,
    args?: TArgs,
    meta?: KdbRequestMeta
  ) => Promise<TData>;
  status: KdbConnectionStatus;
  wsUrl: string;
}

const KdbContext = createContext<KdbContextValue | null>(null);

export function KdbProvider({ children }: { children: ReactNode }) {
  const clientRef = useRef<KdbSocketClient | null>(null);
  const [status, setStatus] = useState<KdbConnectionStatus>("idle");
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastEvent, setLastEvent] = useState<KdbEvent<unknown> | null>(null);

  useEffect(() => {
    const client = new KdbSocketClient({
      url: env.wsUrl,
      requestTimeoutMs: env.requestTimeoutMs
    });

    clientRef.current = client;

    const unsubscribeStatus = client.onStatusChange((nextStatus) => {
      setStatus(nextStatus);

      if (nextStatus === "open") {
        setLastError(null);
        return;
      }

      if (nextStatus === "reconnecting") {
        setLastError(`Unable to connect to ${env.wsUrl}. Retrying websocket.`);
        return;
      }

      if (nextStatus === "error") {
        setLastError(`Unable to connect to ${env.wsUrl}.`);
      }
    });
    const unsubscribeMessage = client.onMessage((message) => {
      if (message.type === "response" && !message.ok) {
        setLastError(message.error?.message ?? "kdb returned an unknown error.");
      }
    });
    const unsubscribeEvent = client.onEvent((message) => {
      setLastEvent(message);
    });

    client.connect();

    return () => {
      unsubscribeStatus();
      unsubscribeMessage();
      unsubscribeEvent();
      client.disconnect();
      clientRef.current = null;
    };
  }, []);

  const sendRequest = async <TData, TArgs extends JsonObject = JsonObject>(
    func: string,
    args?: TArgs,
    meta?: KdbRequestMeta
  ): Promise<TData> => {
    if (!clientRef.current) {
      throw new Error("kdb websocket client has not been initialized.");
    }

    setLastError(null);

    const response = await clientRef.current.sendRequest(func, args, meta);

    if (!response.ok) {
      const message = response.error?.message ?? `kdb function "${func}" failed.`;
      setLastError(message);
      throw new Error(message);
    }

    return response.data as TData;
  };

  const reconnect = () => {
    clientRef.current?.connect();
  };

  return (
    <KdbContext.Provider
      value={{
        lastError,
        lastEvent,
        reconnect,
        sendRequest,
        status,
        wsUrl: env.wsUrl
      }}
    >
      {children}
    </KdbContext.Provider>
  );
}

export function useKdbContext() {
  const context = useContext(KdbContext);

  if (!context) {
    throw new Error("useKdbContext must be used within a KdbProvider.");
  }

  return context;
}
