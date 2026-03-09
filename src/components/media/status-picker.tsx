import { Bookmark, Play, Check, Trash2 } from "lucide-react";
import { SegmentedControl } from "@/components/ui/segmented-control";
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
  const statuses: { status: MediaStatus; label: string; icon: typeof Bookmark }[] = [
    {
      status: "watchlist",
      label: "Watchlist",
      icon: Bookmark,
    },
    {
      status: "watching",
      label: "Watching",
      icon: Play,
    },
    {
      status: "watched",
      label: "Watched",
      icon: Check,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SegmentedControl
        value={currentStatus || "watchlist"}
        onValueChange={(value) => onStatusChange(value as MediaStatus)}
        ariaLabel="Update media status"
        itemClassName="px-4 py-2"
        items={statuses.map(({ status, label, icon: Icon }) => ({
          value: status,
          label: (
            <>
              <Icon className="h-4 w-4" />
              {label}
            </>
          ),
        }))}
      />

      {currentStatus && onRemove && (
        <button
          type="button"
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
