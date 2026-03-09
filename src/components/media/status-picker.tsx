import { Bookmark, Play, Check, Trash2 } from "lucide-react";
import { RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-3">
      <RadioGroup
        label="Status"
        description="Choose how this title should appear in your library."
        value={currentStatus || "watchlist"}
        onValueChange={(value) => onStatusChange(value as MediaStatus)}
        orientation="horizontal"
        itemClassName="px-4 py-2"
        options={statuses.map(({ status, label, icon: Icon }) => ({
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
        <Button
          type="button"
          onClick={onRemove}
          variant="ghost"
          className="text-red-400 hover:bg-red-900/30 hover:text-red-300"
        >
          <Trash2 className="h-4 w-4" />
          Remove
        </Button>
      )}
    </div>
  );
}
