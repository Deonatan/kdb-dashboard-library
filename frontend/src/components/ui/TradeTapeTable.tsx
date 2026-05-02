import type { TradeTapeItem } from "../../api/dashboard";
import { formatInteger, formatPrice } from "../../utils/formatters";

interface TradeTapeTableProps {
  rows: TradeTapeItem[];
}

export function TradeTapeTable({ rows }: TradeTapeTableProps) {
  return (
    <div className="trade-tape">
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Venue</th>
            <th>Side</th>
            <th>Price</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.time}</td>
              <td>{row.venue}</td>
              <td className={row.side === "Buy" ? "trade-tape__buy" : "trade-tape__sell"}>{row.side}</td>
              <td>{formatPrice(row.price)}</td>
              <td>{formatInteger(row.size)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
