import type { MediaItem, EpisodeProgress, TmdbCache } from "@/types/media";

export type { MediaItem, EpisodeProgress, TmdbCache };

export interface DatabaseSchema {
  mediaItems: MediaItem;
  episodeProgress: EpisodeProgress;
  tmdbCache: TmdbCache;
}
