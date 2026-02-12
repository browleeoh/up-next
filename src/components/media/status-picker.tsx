import { Bookmark, Play, Check, Trash2 } from "lucide-react";
import type { MediaStatus } from "@/types/media";

interface StatusPickerProps {
  currentStatus: MediaStatus | null;
  onStatusChange: (status: MediaStatus) => void;
  onRemove?: () => void;
}

export function StatusPicker({
  currentStatus,
  onStatusChange,
  onRemove,
}: StatusPickerProps) {
  const statuses: { status: MediaStatus; label: string; icon: typeof Bookmark; color: string }[] = [
    {
      status: "watchlist",
      label: "Watchlist",
      icon: Bookmark,
      color: "bg-status-watchlist hover:bg-status-watchlist/80",
    },
    {
      status: "watching",
      label: "Watching",
      icon: Play,
      color: "bg-status-watching hover:bg-status-watching/80",
    },
    {
      status: "watched",
      label: "Watched",
      icon: Check,
      color: "bg-status-watched hover:bg-status-watched/80",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {statuses.map(({ status, label, icon: Icon, color }) => {
        const isActive = currentStatus === status;
        return (
          <button
            key={status}
            onClick={() => onStatusChange(status)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              isActive
                ? `${color} text-white`
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        );
      })}

      {currentStatus && onRemove && (
        <button
          onClick={onRemove}
          className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-900/30"
        >
          <Trash2 className="h-4 w-4" />
          Remove
        </button>
      )}
    </div>
  );
}
