import { Card } from "@/components/ui/card";
import { Clock, Film, Coffee, Moon } from "lucide-react";

interface WatchTimeCardProps {
  totalMinutes: number;
}

export function WatchTimeCard({ totalMinutes }: WatchTimeCardProps) {
  const hours = Math.floor(totalMinutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  // Fun comparisons
  const comparisons = [
    {
      icon: Film,
      text: `${Math.floor(totalMinutes / 120)} feature films`,
      show: totalMinutes >= 120,
    },
    {
      icon: Coffee,
      text: `${Math.floor(totalMinutes / 5)} coffee breaks`,
      show: totalMinutes >= 5,
    },
    {
      icon: Moon,
      text: `${(totalMinutes / 480).toFixed(1)} work days`,
      show: totalMinutes >= 480,
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-amber-500" />
        Total Watch Time
      </h2>

      <div className="grid gap-4 sm:grid-cols-4">
        <TimeBlock value={weeks} label="Weeks" />
        <TimeBlock value={days % 7} label="Days" />
        <TimeBlock value={hours % 24} label="Hours" />
        <TimeBlock value={totalMinutes % 60} label="Minutes" />
      </div>

      {totalMinutes > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-700">
          <p className="text-sm text-slate-400 mb-3">That's equivalent to:</p>
          <div className="flex flex-wrap gap-4">
            {comparisons
              .filter((c) => c.show)
              .map((comparison, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <comparison.icon className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-300">{comparison.text}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </Card>
  );
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center rounded-lg bg-slate-800/50 p-4">
      <p className="text-3xl font-bold text-amber-500">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}
