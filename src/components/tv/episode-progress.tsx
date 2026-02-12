interface EpisodeProgressProps {
  watchedCount: number;
  totalCount: number;
}

export function EpisodeProgress({
  watchedCount,
  totalCount,
}: EpisodeProgressProps) {
  const percent = totalCount > 0 ? (watchedCount / totalCount) * 100 : 0;

  return (
    <div className="h-2 w-full rounded-full bg-slate-700 overflow-hidden">
      <div
        className="h-full bg-status-watched transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
