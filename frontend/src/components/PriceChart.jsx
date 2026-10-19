import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceDot,
} from "recharts";

export default function PriceChart({ data, odometer }) {
  const closest = data.reduce((best, p) =>
    Math.abs(p.odometer - odometer) < Math.abs(best.odometer - odometer)
      ? p
      : best,
  );

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
      >
        <XAxis
          dataKey="odometer"
          type="number"
          domain={[0, 200000]}
          ticks={[0, 50000, 100000, 150000, 200000]}
          tickFormatter={(v) => `${v / 1000}k mi`}
          stroke="var(--muted)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
          stroke="var(--muted)"
          fontSize={12}
          width={44}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          formatter={(v) => [`$${v.toLocaleString("en-US")}`, "Value"]}
          labelFormatter={(v) => `${v.toLocaleString("en-US")} miles`}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="var(--accent)"
          strokeWidth={3}
          dot={false}
        />
        <ReferenceDot
          x={closest.odometer}
          y={closest.price}
          r={7}
          fill="var(--accent)"
          stroke="var(--card)"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
