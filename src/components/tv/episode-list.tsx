import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/database";
import { episodeRepository } from "@/lib/db/repositories/episode.repository";
import { Square, CheckSquare } from "lucide-react";
import type { TmdbEpisode } from "@/types/media";

interface EpisodeListProps {
  episodes: TmdbEpisode[];
  mediaId: number | undefined;
  seasonNumber: number;
}

export function EpisodeList({
  episodes,
  mediaId,
  seasonNumber,
}: EpisodeListProps) {
  const mediaItem = useLiveQuery(
    async () => {
      if (!mediaId) return undefined;
      return db.mediaItems.get(mediaId);
    },
    [mediaId]
  );

  const progress = useLiveQuery(
    async () => {
      if (!mediaId) return new Map<number, boolean>();
      const records = await db.episodeProgress
        .where("mediaId")
        .equals(mediaId)
        .filter((ep) => ep.seasonNumber === seasonNumber)
        .toArray();
      return new Map(records.map((r) => [r.episodeNumber, r.watched]));
    },
    [mediaId, seasonNumber],
    new Map<number, boolean>()
  );

  const allWatched =
    episodes.length > 0 &&
    episodes.every((ep) => progress.get(ep.episode_number));

  const handleToggleEpisode = async (episodeNumber: number) => {
    if (!mediaId) return;
    const currentWatched = progress.get(episodeNumber) || false;
    const episode = episodes.find((entry) => entry.episode_number === episodeNumber);
    await episodeRepository.setWatched(
      mediaId,
      seasonNumber,
      episodeNumber,
      !currentWatched,
      episode?.runtime ?? mediaItem?.runtime ?? null
    );
  };

  const handleToggleAll = async () => {
    if (!mediaId) return;
    const newWatched = !allWatched;
    await episodeRepository.setSeasonWatched(
      mediaId,
      seasonNumber,
      episodes.map((episode) => ({
        episodeNumber: episode.episode_number,
        runtimeMinutes: episode.runtime ?? mediaItem?.runtime ?? null,
      })),
      newWatched
    );
  };

  if (!mediaId) {
    return (
      <p className="text-center text-slate-500 py-4">
        Add this show to your list to track episodes
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {/* Mark all button */}
      <button
        onClick={handleToggleAll}
        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-slate-100 transition-colors mb-2"
      >
        {allWatched ? (
          <CheckSquare className="h-4 w-4 text-status-watched" />
        ) : (
          <Square className="h-4 w-4" />
        )}
        {allWatched ? "Unmark all" : "Mark all as watched"}
      </button>

      {/* Episode list */}
      {episodes.map((episode) => {
        const isWatched = progress.get(episode.episode_number) || false;

        return (
          <button
            key={episode.id}
            onClick={() => handleToggleEpisode(episode.episode_number)}
            className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors ${
              isWatched
                ? "bg-status-watched/10 hover:bg-status-watched/20"
                : "hover:bg-slate-700/50"
            }`}
          >
            <div className="pt-0.5">
              {isWatched ? (
                <CheckSquare className="h-5 w-5 text-status-watched" />
              ) : (
                <Square className="h-5 w-5 text-slate-500" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-slate-400">
                  E{episode.episode_number}
                </span>
                <h4
                  className={`font-medium truncate ${
                    isWatched ? "text-slate-400" : "text-slate-100"
                  }`}
                >
                  {episode.name}
                </h4>
              </div>

              {episode.overview && (
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                  {episode.overview}
                </p>
              )}

              <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                {episode.air_date && (
                  <span>
                    {new Date(episode.air_date).toLocaleDateString()}
                  </span>
                )}
                {episode.runtime && <span>{episode.runtime} min</span>}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
