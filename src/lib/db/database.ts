import Dexie, { type EntityTable } from "dexie";
import type { MediaItem, EpisodeProgress, TmdbCache } from "./schema";

class WorkingTitleDatabase extends Dexie {
  mediaItems!: EntityTable<MediaItem, "id">;
  episodeProgress!: EntityTable<EpisodeProgress, "id">;
  tmdbCache!: EntityTable<TmdbCache, "id">;

  constructor() {
    super("WorkingTitleDB");

    this.version(1).stores({
      mediaItems:
        "++id, tmdbId, type, status, [status+dateAdded], [tmdbId+type], dateAdded, dateCompleted",
      episodeProgress:
        "++id, mediaId, [mediaId+seasonNumber+episodeNumber], seasonNumber",
      tmdbCache: "++id, cacheKey, expiresAt",
    });
  }
}

export const db = new WorkingTitleDatabase();
