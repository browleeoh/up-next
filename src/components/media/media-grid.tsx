import { MediaCard } from "./media-card";
import type { MediaItem } from "@/types/media";
import { Film } from "lucide-react";

interface MediaGridProps {
  items: MediaItem[];
  emptyMessage?: string;
}

export function MediaGrid({
  items,
  emptyMessage = "No items found",
}: MediaGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <Film className="mb-4 h-12 w-12" />
        <p className="text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) => (
        <MediaCard key={item.id} media={item} />
      ))}
    </div>
  );
}
