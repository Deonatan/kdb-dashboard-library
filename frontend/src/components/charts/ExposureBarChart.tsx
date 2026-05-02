import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ExposurePoint } from "../../api/dashboard";
import { formatCompactNumber, formatSignedPrice } from "../../utils/formatters";

interface ExposureBarChartProps {
  data: ExposurePoint[];
}

export function ExposureBarChart({ data }: ExposureBarChartProps) {
  return (
    <ResponsiveContainer height={300} width="100%">
      <BarChart data={data} layout="vertical" margin={{ bottom: 8, left: 8, right: 12, top: 8 }}>
        <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.07)" />
        <XAxis axisLine={false} tick={{ fill: "#8da2ab", fontSize: 12 }} tickFormatter={formatCompactNumber} tickLine={false} type="number" />
        <YAxis axisLine={false} dataKey="book" tick={{ fill: "#d8e1e6", fontSize: 12 }} tickLine={false} type="category" width={72} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(6, 10, 12, 0.98)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "14px"
          }}
          formatter={(value: number, key, item) =>
            key === "delta"
              ? [formatSignedPrice(item.payload.delta), "Delta"]
              : [formatCompactNumber(value), "Gross exposure"]
          }
          labelStyle={{ color: "#f4efe6" }}
        />
        <Bar dataKey="value" radius={[0, 8, 8, 0]}>
          {data.map((entry) => (
            <Cell fill={entry.delta >= 0 ? "#22d0b6" : "#ff6b6b"} key={entry.book} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
