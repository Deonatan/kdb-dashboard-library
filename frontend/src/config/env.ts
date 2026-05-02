const parseBoolean = (value: string | undefined, fallback = false) => {
  if (value === undefined) {
    return fallback;
  }

  return value.toLowerCase() === "true";
};

const parseNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  wsUrl: import.meta.env.VITE_KDB_WS_URL ?? "ws://localhost:5000",
  requestTimeoutMs: parseNumber(import.meta.env.VITE_KDB_REQUEST_TIMEOUT_MS, 8000),
  mockMode: parseBoolean(import.meta.env.VITE_KDB_MOCK_MODE)
};
