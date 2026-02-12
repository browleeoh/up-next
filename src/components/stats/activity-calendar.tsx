import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ActivityCalendarProps {
  activityByMonth: Record<string, number>;
}

export function ActivityCalendar({ activityByMonth }: ActivityCalendarProps) {
  // Get last 12 months of data
  const months: { month: string; count: number; label: string }[] = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleDateString("en-US", { month: "short" });
    months.push({
      month: key,
      count: activityByMonth[key] || 0,
      label,
    });
  }

  const hasData = months.some((m) => m.count > 0);

  if (!hasData) {
    return (
      <div className="flex h-[200px] items-center justify-center text-slate-500">
        No activity data yet
      </div>
    );
  }

  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={months}>
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
            }}
            formatter={(value: number) => [`${value} items`, "Watched"]}
            labelFormatter={(label) => `${label}`}
          />
          <Bar
            dataKey="count"
            fill="#f59e0b"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
