import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLiveQuery } from "dexie-react-hooks";
import { tmdbApi } from "@/lib/services/tmdb/api";
import { db } from "@/lib/db/database";
import { EpisodeList } from "./episode-list";
import { EpisodeProgress } from "./episode-progress";
import { Loader2 } from "lucide-react";
import type { TmdbTvSeason } from "@/types/media";
import { Accordion } from "@/components/ui/accordion";

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
  const [openSeasons, setOpenSeasons] = useState<string[]>([]);

  // Filter out "Specials" season (season 0) unless it's the only one
  const displaySeasons = seasons.filter(
    (s) => s.season_number > 0 || seasons.length === 1
  );

  return (
    <Accordion
      value={openSeasons}
      onValueChange={setOpenSeasons}
      items={displaySeasons.map((season) => ({
        value: String(season.season_number),
        header: (
          <SeasonHeader
            season={season}
            mediaId={mediaId}
          />
        ),
        panel: (
          <SeasonPanel
            tvId={tvId}
            season={season}
            mediaId={mediaId}
            isOpen={openSeasons.includes(String(season.season_number))}
          />
        ),
      }))}
    />
  );
}

interface SeasonHeaderProps {
  season: TmdbTvSeason;
  mediaId: number | undefined;
}

function SeasonHeader({ season, mediaId }: SeasonHeaderProps) {
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
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <h3 className="font-medium">{season.name}</h3>
        <p className="text-sm text-slate-400">
          {totalEpisodes} episode{totalEpisodes !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-400">
          {watchedCount}/{totalEpisodes}
        </span>
        <div className="w-24">
          <EpisodeProgress watchedCount={watchedCount} totalCount={totalEpisodes} />
        </div>
      </div>
    </div>
  );
}

interface SeasonPanelProps {
  tvId: number;
  season: TmdbTvSeason;
  mediaId: number | undefined;
  isOpen: boolean;
}

function SeasonPanel({ tvId, season, mediaId, isOpen }: SeasonPanelProps) {
  const { data: seasonDetail, isLoading } = useQuery({
    queryKey: ["tv", tvId, "season", season.season_number],
    queryFn: () => tmdbApi.getTvSeason(tvId, season.season_number),
    enabled: isOpen,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
      </div>
    );
  }

  if (!seasonDetail?.episodes) {
    return <p className="py-4 text-center text-slate-500">No episodes found</p>;
  }

  return (
    <EpisodeList
      episodes={seasonDetail.episodes}
      mediaId={mediaId}
      seasonNumber={season.season_number}
    />
  );
}
