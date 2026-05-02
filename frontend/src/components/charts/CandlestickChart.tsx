import type { CandlePoint } from "../../api/dashboard";
import { formatPrice } from "../../utils/formatters";

interface CandlestickChartProps {
  data: CandlePoint[];
  height?: number;
}

const PADDING_X = 24;
const PADDING_Y = 20;
const SVG_WIDTH = 820;

export function CandlestickChart({ data, height = 320 }: CandlestickChartProps) {
  const high = Math.max(...data.map((entry) => entry.high));
  const low = Math.min(...data.map((entry) => entry.low));
  const range = Math.max(high - low, 1);
  const innerWidth = SVG_WIDTH - PADDING_X * 2;
  const innerHeight = height - PADDING_Y * 2;
  const candleWidth = innerWidth / data.length;

  const toY = (value: number) => PADDING_Y + ((high - value) / range) * innerHeight;

  return (
    <div className="candlestick-chart">
      <svg aria-label="Candlestick chart" role="img" viewBox={`0 0 ${SVG_WIDTH} ${height}`}>
        <rect fill="rgba(255,255,255,0.02)" height={height} rx="20" width={SVG_WIDTH} />
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const value = high - range * ratio;
          const y = toY(value);

          return (
            <g key={ratio}>
              <line stroke="rgba(255,255,255,0.08)" strokeDasharray="4 6" x1={PADDING_X} x2={SVG_WIDTH - PADDING_X} y1={y} y2={y} />
              <text fill="#8da2ab" fontSize="11" textAnchor="end" x={PADDING_X - 8} y={y + 4}>
                {formatPrice(value)}
              </text>
            </g>
          );
        })}

        {data.map((entry, index) => {
          const centerX = PADDING_X + candleWidth * index + candleWidth / 2;
          const bodyWidth = Math.max(candleWidth * 0.45, 8);
          const isUp = entry.close >= entry.open;
          const bodyTop = toY(Math.max(entry.open, entry.close));
          const bodyBottom = toY(Math.min(entry.open, entry.close));

          return (
            <g key={`${entry.time}-${index}`}>
              <line
                stroke={isUp ? "#22d0b6" : "#ff6b6b"}
                strokeWidth="2"
                x1={centerX}
                x2={centerX}
                y1={toY(entry.high)}
                y2={toY(entry.low)}
              />
              <rect
                fill={isUp ? "rgba(34,208,182,0.28)" : "rgba(255,107,107,0.26)"}
                height={Math.max(bodyBottom - bodyTop, 2)}
                rx="3"
                stroke={isUp ? "#22d0b6" : "#ff6b6b"}
                width={bodyWidth}
                x={centerX - bodyWidth / 2}
                y={bodyTop}
              />
              {index % 4 === 0 ? (
                <text fill="#8da2ab" fontSize="11" textAnchor="middle" x={centerX} y={height - 6}>
                  {entry.time}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
