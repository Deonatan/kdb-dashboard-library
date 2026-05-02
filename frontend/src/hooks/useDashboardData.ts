import { startTransition, useEffect, useRef, useState } from "react";
import { dashboardApi, type DashboardPayload } from "../api/dashboard";
import { env } from "../config/env";
import { buildMockDashboard } from "../mock/sampleData";
import { useKdb } from "./useKdb";

type DataSource = "live" | "mock";

const DEFAULT_SYMBOL = "AAPL";

export function useDashboardData(initialSymbol = DEFAULT_SYMBOL) {
  const { sendRequest, status } = useKdb();
  const hasHydrated = useRef(false);
  const [symbol, setSymbol] = useState(initialSymbol);
  const [data, setData] = useState<DashboardPayload>(() => buildMockDashboard(initialSymbol));
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [source, setSource] = useState<DataSource>("mock");

  const loadDashboard = async (nextSymbol = symbol) => {
    setSymbol(nextSymbol);
    setIsLoading(true);
    setError(null);

    if (env.mockMode) {
      startTransition(() => {
        setData(buildMockDashboard(nextSymbol));
        setSource("mock");
      });
      setIsLoading(false);
      return;
    }

    try {
      const payload = await dashboardApi.load(sendRequest, { symbol: nextSymbol });
      startTransition(() => {
        setData(payload);
        setSource("live");
      });
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Unable to load dashboard from kdb.";
      setError(message);
      startTransition(() => {
        setData(buildMockDashboard(nextSymbol));
        setSource("mock");
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (env.mockMode || status !== "open" || hasHydrated.current) {
      return;
    }

    hasHydrated.current = true;
    void loadDashboard(initialSymbol);
  }, [initialSymbol, status]);

  return {
    data,
    error,
    isLoading,
    loadDashboard,
    source,
    symbol
  };
}
