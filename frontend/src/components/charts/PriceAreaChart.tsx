import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { PricePoint } from "../../api/dashboard";
import { formatCompactNumber, formatPrice } from "../../utils/formatters";

interface PriceAreaChartProps {
  data: PricePoint[];
}

export function PriceAreaChart({ data }: PriceAreaChartProps) {
  return (
    <ResponsiveContainer height={300} width="100%">
      <AreaChart data={data} margin={{ bottom: 0, left: -16, right: 12, top: 12 }}>
        <defs>
          <linearGradient id="price-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor="#f8aa2a" stopOpacity={0.45} />
            <stop offset="95%" stopColor="#f8aa2a" stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" vertical={false} />
        <XAxis axisLine={false} dataKey="time" tick={{ fill: "#8da2ab", fontSize: 12 }} tickLine={false} />
        <YAxis
          axisLine={false}
          domain={["dataMin - 1", "dataMax + 1"]}
          tick={{ fill: "#8da2ab", fontSize: 12 }}
          tickFormatter={formatPrice}
          tickLine={false}
          width={72}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(6, 10, 12, 0.98)",
            border: "1px solid rgba(248, 170, 42, 0.4)",
            borderRadius: "14px"
          }}
          formatter={(value: number, key) =>
            key === "volume"
              ? [formatCompactNumber(value), "Volume"]
              : [formatPrice(value), typeof key === "string" ? key.toUpperCase() : String(key)]
          }
          labelStyle={{ color: "#f4efe6" }}
        />
        <Area dataKey="price" fill="url(#price-fill)" stroke="#f8aa2a" strokeWidth={2.4} type="monotone" />
        <Line dataKey="vwap" dot={false} stroke="#22d0b6" strokeDasharray="6 6" strokeWidth={1.75} type="monotone" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
