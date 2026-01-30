import { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Candle } from "@/hooks/useHistoricalData";

interface PriceChartProps {
  data: Candle[];
  height?: number;
  showAxis?: boolean;
  color?: string;
}

export function PriceChart({ data, height = 200, showAxis = true, color }: PriceChartProps) {
  const chartData = useMemo(() => {
    return data.map((candle) => ({
      date: new Date(candle.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      price: candle.close,
      timestamp: candle.timestamp,
    }));
  }, [data]);

  const isPositive = useMemo(() => {
    if (data.length < 2) return true;
    return data[data.length - 1].close >= data[0].close;
  }, [data]);

  const chartColor = color || (isPositive ? "hsl(var(--chart-positive))" : "hsl(var(--chart-negative))");
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
            <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        {showAxis && (
          <>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              dy={10}
            />
            <YAxis
              domain={["auto", "auto"]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              tickFormatter={(value) => {
                if (value >= 1000) {
                  return `${(value / 1000).toFixed(1)}k`;
                }
                return value.toFixed(2);
              }}
              width={50}
            />
          </>
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            padding: "8px 12px",
          }}
          labelStyle={{ color: "hsl(var(--foreground))" }}
          formatter={(value: number) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, "Price"]}
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke={chartColor}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
