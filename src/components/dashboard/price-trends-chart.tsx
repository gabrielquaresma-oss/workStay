"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TrendData {
  hotel: string;
  data: { week: string; price: number }[];
}

interface PriceTrendsChartProps {
  trends: TrendData[];
}

const COLORS = ["#2872FA", "#009EFB", "#16A34A", "#CA8A04", "#DC2626"];

export function PriceTrendsChart({ trends }: PriceTrendsChartProps) {
  if (trends.length === 0) return null;

  // Transform data for recharts: merge all hotel data by week
  const weeks = trends[0].data.map((d) => d.week);
  const chartData = weeks.map((week, i) => {
    const point: Record<string, string | number> = { week };
    trends.forEach((t) => {
      point[t.hotel] = t.data[i]?.price ?? 0;
    });
    return point;
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" tick={{ fontSize: 12 }} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => `R$${v}`}
        />
        <Tooltip
          formatter={(value) => [`R$ ${value}`, ""]}
          labelStyle={{ fontWeight: "bold" }}
        />
        <Legend />
        {trends.map((t, i) => (
          <Line
            key={t.hotel}
            type="monotone"
            dataKey={t.hotel}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
