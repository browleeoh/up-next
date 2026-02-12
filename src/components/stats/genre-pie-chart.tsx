import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { GENRE_MAP } from "@/types/media";

interface GenrePieChartProps {
  genreCounts: Record<number, number>;
}

const COLORS = [
  "#f59e0b", // amber-500
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#06b6d4", // cyan-500
  "#f97316", // orange-500
  "#84cc16", // lime-500
  "#6366f1", // indigo-500
  "#14b8a6", // teal-500
];

export function GenrePieChart({ genreCounts }: GenrePieChartProps) {
  const data = Object.entries(genreCounts)
    .map(([genreId, count]) => ({
      name: GENRE_MAP[parseInt(genreId)] || `Genre ${genreId}`,
      value: count,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Top 10 genres

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-slate-500">
        No genre data yet
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
            }}
            formatter={(value: number) => [`${value} items`, "Count"]}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {data.slice(0, 6).map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-1.5 text-xs">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-slate-400">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
