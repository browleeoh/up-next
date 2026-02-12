import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLiveQuery } from "dexie-react-hooks";
import { tmdbApi } from "@/lib/services/tmdb/api";
import { db } from "@/lib/db/database";
import { EpisodeList } from "./episode-list";
import { EpisodeProgress } from "./episode-progress";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import type { TmdbTvSeason } from "@/types/media";

interface SeasonAccordionProps {
  tvId: number;
  seasons: TmdbTvSeason[];
  mediaId: number | undefined;
}

export function SeasonAccordion({
  tvId,
  seasons,
  mediaId,
}: SeasonAccordionProps) {
  const [openSeasons, setOpenSeasons] = useState<Set<number>>(new Set());

  // Filter out "Specials" season (season 0) unless it's the only one
  const displaySeasons = seasons.filter(
    (s) => s.season_number > 0 || seasons.length === 1
  );

  const toggleSeason = (seasonNumber: number) => {
    setOpenSeasons((prev) => {
      const next = new Set(prev);
      if (next.has(seasonNumber)) {
        next.delete(seasonNumber);
      } else {
        next.add(seasonNumber);
      }
      return next;
    });
  };

  return (
    <div className="space-y-2">
      {displaySeasons.map((season) => (
        <SeasonItem
          key={season.id}
          tvId={tvId}
          season={season}
          mediaId={mediaId}
          isOpen={openSeasons.has(season.season_number)}
          onToggle={() => toggleSeason(season.season_number)}
        />
      ))}
    </div>
  );
}

interface SeasonItemProps {
  tvId: number;
  season: TmdbTvSeason;
  mediaId: number | undefined;
  isOpen: boolean;
  onToggle: () => void;
}

function SeasonItem({
  tvId,
  season,
  mediaId,
  isOpen,
  onToggle,
}: SeasonItemProps) {
  const { data: seasonDetail, isLoading } = useQuery({
    queryKey: ["tv", tvId, "season", season.season_number],
    queryFn: () => tmdbApi.getTvSeason(tvId, season.season_number),
    enabled: isOpen,
  });

  // Get episode progress
  const watchedCount = useLiveQuery(
    async () => {
      if (!mediaId) return 0;
      const progress = await db.episodeProgress
        .where("mediaId")
        .equals(mediaId)
        .filter(
          (ep) => ep.seasonNumber === season.season_number && ep.watched
        )
        .count();
      return progress;
    },
    [mediaId, season.season_number],
    0
  );

  const totalEpisodes = season.episode_count;

  return (
    <div className="rounded-lg border border-slate-700 overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 p-4 text-left hover:bg-slate-800/50 transition-colors"
      >
        {isOpen ? (
          <ChevronDown className="h-5 w-5 text-slate-500" />
        ) : (
          <ChevronRight className="h-5 w-5 text-slate-500" />
        )}

        <div className="flex-1">
          <h3 className="font-medium">{season.name}</h3>
          <p className="text-sm text-slate-400">
            {totalEpisodes} episode{totalEpisodes !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">
            {watchedCount}/{totalEpisodes}
          </span>
          <div className="w-24">
            <EpisodeProgress
              watchedCount={watchedCount}
              totalCount={totalEpisodes}
            />
          </div>
        </div>
      </button>

      {/* Episodes */}
      {isOpen && (
        <div className="border-t border-slate-700 bg-slate-800/30 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
            </div>
          ) : seasonDetail?.episodes ? (
            <EpisodeList
              episodes={seasonDetail.episodes}
              mediaId={mediaId}
              seasonNumber={season.season_number}
            />
          ) : (
            <p className="text-center text-slate-500 py-4">
              No episodes found
            </p>
          )}
        </div>
      )}
    </div>
  );
}
