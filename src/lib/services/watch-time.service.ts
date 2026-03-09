import { db } from "@/lib/db/database";
import type {
  EpisodeProgress,
  MediaItem,
  TmdbSeasonDetail,
  TmdbTvDetail,
} from "@/types/media";

export interface WatchTimeSummary {
  totalMinutes: number;
  movieMinutes: number;
  episodeMinutes: number;
  completedShowEstimateMinutes: number;
}

interface WatchTimeCalculationInput {
  mediaItems: MediaItem[];
  episodeProgress: EpisodeProgress[];
  cachedTvDetails: Map<number, TmdbTvDetail>;
  cachedSeasonDetails: Map<string, TmdbSeasonDetail>;
}

interface WatchTimeRepairs {
  mediaUpdates: Array<{ id: number; runtime?: number | null; totalEpisodes?: number | null }>;
  episodeUpdates: Array<{ id: number; runtimeMinutes: number | null }>;
}

export async function getWatchTimeSummary(): Promise<WatchTimeSummary> {
  const [mediaItems, episodeProgress, cacheEntries] = await Promise.all([
    db.mediaItems.toArray(),
    db.episodeProgress.toArray(),
    db.tmdbCache.toArray(),
  ]);

  const now = new Date();
  const cachedTvDetails = new Map<number, TmdbTvDetail>();
  const cachedSeasonDetails = new Map<string, TmdbSeasonDetail>();

  for (const entry of cacheEntries) {
    if (new Date(entry.expiresAt) < now) {
      continue;
    }

    if (entry.cacheKey.startsWith("tv:") && !entry.cacheKey.includes(":season:")) {
      const tmdbId = Number(entry.cacheKey.slice(3));
      if (Number.isFinite(tmdbId)) {
        cachedTvDetails.set(tmdbId, entry.data as TmdbTvDetail);
      }
    }

    if (entry.cacheKey.includes(":season:")) {
      cachedSeasonDetails.set(entry.cacheKey, entry.data as TmdbSeasonDetail);
    }
  }

  const { summary, repairs } = calculateWatchTimeSummary({
    mediaItems,
    episodeProgress,
    cachedTvDetails,
    cachedSeasonDetails,
  });

  await applyWatchTimeRepairs(repairs);

  return summary;
}

export function calculateWatchTimeSummary({
  mediaItems,
  episodeProgress,
  cachedTvDetails,
  cachedSeasonDetails,
}: WatchTimeCalculationInput): {
  summary: WatchTimeSummary;
  repairs: WatchTimeRepairs;
} {
  const watchedEpisodesByMediaId = new Map<number, EpisodeProgress[]>();

  for (const progress of episodeProgress) {
    if (!progress.watched) {
      continue;
    }

    const entries = watchedEpisodesByMediaId.get(progress.mediaId) ?? [];
    entries.push(progress);
    watchedEpisodesByMediaId.set(progress.mediaId, entries);
  }

  let movieMinutes = 0;
  let episodeMinutes = 0;
  let completedShowEstimateMinutes = 0;
  const repairs: WatchTimeRepairs = {
    mediaUpdates: [],
    episodeUpdates: [],
  };

  for (const item of mediaItems) {
    if (item.type === "movie") {
      if (item.status === "watched") {
        movieMinutes += item.runtime ?? 0;
      }
      continue;
    }

    const watchedEpisodes = watchedEpisodesByMediaId.get(item.id ?? -1) ?? [];

    if (watchedEpisodes.length > 0) {
      for (const episode of watchedEpisodes) {
        const runtimeMinutes = resolveEpisodeRuntimeMinutes(
          item,
          episode,
          cachedTvDetails,
          cachedSeasonDetails
        );

        episodeMinutes += runtimeMinutes ?? 0;

        if (episode.id && episode.runtimeMinutes == null && runtimeMinutes != null) {
          repairs.episodeUpdates.push({
            id: episode.id,
            runtimeMinutes,
          });
        }
      }

      continue;
    }

    if (item.status !== "watched") {
      continue;
    }

    const cachedTvDetail = cachedTvDetails.get(item.tmdbId);
    const runtime =
      item.runtime ??
      cachedTvDetail?.episode_run_time?.find((value) => value > 0) ??
      null;
    const totalEpisodes = item.totalEpisodes ?? cachedTvDetail?.number_of_episodes ?? null;

    if (item.id && (item.runtime == null || item.totalEpisodes == null)) {
      const update: { id: number; runtime?: number | null; totalEpisodes?: number | null } = {
        id: item.id,
      };

      if (item.runtime == null && runtime != null) {
        update.runtime = runtime;
      }

      if (item.totalEpisodes == null && totalEpisodes != null) {
        update.totalEpisodes = totalEpisodes;
      }

      if ("runtime" in update || "totalEpisodes" in update) {
        repairs.mediaUpdates.push(update);
      }
    }

    if (runtime != null && totalEpisodes != null) {
      completedShowEstimateMinutes += runtime * totalEpisodes;
    }
  }

  return {
    summary: {
      totalMinutes:
        movieMinutes + episodeMinutes + completedShowEstimateMinutes,
      movieMinutes,
      episodeMinutes,
      completedShowEstimateMinutes,
    },
    repairs,
  };
}

function resolveEpisodeRuntimeMinutes(
  item: MediaItem,
  episode: EpisodeProgress,
  cachedTvDetails: Map<number, TmdbTvDetail>,
  cachedSeasonDetails: Map<string, TmdbSeasonDetail>
): number | null {
  if (episode.runtimeMinutes != null) {
    return episode.runtimeMinutes;
  }

  const seasonCacheKey = `tv:${item.tmdbId}:season:${episode.seasonNumber}`;
  const cachedSeason = cachedSeasonDetails.get(seasonCacheKey);
  const seasonEpisode = cachedSeason?.episodes.find(
    (candidate) => candidate.episode_number === episode.episodeNumber
  );

  if (seasonEpisode?.runtime != null) {
    return seasonEpisode.runtime;
  }

  if (item.runtime != null) {
    return item.runtime;
  }

  return (
    cachedTvDetails.get(item.tmdbId)?.episode_run_time?.find(
      (runtime) => runtime > 0
    ) ?? null
  );
}

async function applyWatchTimeRepairs(repairs: WatchTimeRepairs): Promise<void> {
  if (repairs.mediaUpdates.length === 0 && repairs.episodeUpdates.length === 0) {
    return;
  }

  await db.transaction("rw", [db.mediaItems, db.episodeProgress], async () => {
    for (const update of repairs.mediaUpdates) {
      const { id, ...changes } = update;
      if (Object.keys(changes).length > 0) {
        await db.mediaItems.update(id, changes);
      }
    }

    for (const update of repairs.episodeUpdates) {
      await db.episodeProgress.update(update.id, {
        runtimeMinutes: update.runtimeMinutes,
      });
    }
  });
}
