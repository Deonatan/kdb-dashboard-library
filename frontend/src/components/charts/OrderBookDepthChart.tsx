import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { OrderBookPoint } from "../../api/dashboard";
import { formatInteger, formatPrice } from "../../utils/formatters";

interface OrderBookDepthChartProps {
  data: OrderBookPoint[];
}

const toDepthSeries = (levels: OrderBookPoint[]) => {
  let runningBid = 0;
  let runningAsk = 0;

  return levels.map((level) => {
    runningBid += level.bid;
    runningAsk += level.ask;

    return {
      askDepth: runningAsk,
      bidDepth: runningBid,
      price: level.price
    };
  });
};

export function OrderBookDepthChart({ data }: OrderBookDepthChartProps) {
  const series = toDepthSeries(data);

  return (
    <ResponsiveContainer height={300} width="100%">
      <AreaChart data={series} margin={{ bottom: 0, left: -24, right: 8, top: 12 }}>
        <defs>
          <linearGradient id="bid-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor="#22d0b6" stopOpacity={0.42} />
            <stop offset="95%" stopColor="#22d0b6" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="ask-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.34} />
            <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" vertical={false} />
        <XAxis axisLine={false} dataKey="price" tick={{ fill: "#8da2ab", fontSize: 12 }} tickFormatter={formatPrice} tickLine={false} />
        <YAxis axisLine={false} tick={{ fill: "#8da2ab", fontSize: 12 }} tickFormatter={formatInteger} tickLine={false} width={56} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(6, 10, 12, 0.98)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "14px"
          }}
          formatter={(value: number, key) => [formatInteger(value), key === "bidDepth" ? "Bid depth" : "Ask depth"]}
          labelFormatter={(value) => `Price ${formatPrice(Number(value))}`}
        />
        <Area dataKey="bidDepth" fill="url(#bid-fill)" stroke="#22d0b6" strokeWidth={2} type="monotone" />
        <Area dataKey="askDepth" fill="url(#ask-fill)" stroke="#ff6b6b" strokeWidth={2} type="monotone" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
