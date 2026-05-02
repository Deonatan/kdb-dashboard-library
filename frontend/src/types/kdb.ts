export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export type JsonObject = {
  [key: string]: JsonValue;
};

export type KdbConnectionStatus =
  | "idle"
  | "connecting"
  | "open"
  | "reconnecting"
  | "closed"
  | "error";

export interface KdbRequest<TArgs extends JsonObject = JsonObject> {
  type: "request";
  requestId: string;
  func: string;
  args?: TArgs;
  meta?: JsonObject;
}

export interface KdbErrorPayload {
  code?: string;
  message: string;
  details?: JsonValue;
}

export interface KdbResponse<TData = JsonValue> {
  type: "response";
  requestId: string;
  ok: boolean;
  data?: TData;
  error?: KdbErrorPayload;
  timestamp?: string;
}

export interface KdbEvent<TData = JsonValue> {
  type: "event";
  topic: string;
  data: TData;
  timestamp?: string;
}

export type KdbInboundMessage<TData = JsonValue> = KdbResponse<TData> | KdbEvent<TData>;

export type KdbRequestMeta = JsonObject;
