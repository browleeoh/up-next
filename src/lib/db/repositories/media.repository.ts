import { db } from "../database";
import type { MediaItem, MediaStatus, MediaType } from "@/types/media";

export const mediaRepository = {
  async add(item: Omit<MediaItem, "id">): Promise<number> {
    const id = await db.mediaItems.add(item as MediaItem);
    return id as number;
  },

  async update(id: number, data: Partial<MediaItem>): Promise<void> {
    await db.mediaItems.update(id, data);
  },

  async delete(id: number): Promise<void> {
    await db.mediaItems.delete(id);
    // Also delete associated episode progress
    await db.episodeProgress.where("mediaId").equals(id).delete();
  },

  async getById(id: number): Promise<MediaItem | undefined> {
    return await db.mediaItems.get(id);
  },

  async getByTmdbId(
    tmdbId: number,
    type: MediaType
  ): Promise<MediaItem | undefined> {
    return await db.mediaItems
      .where("[tmdbId+type]")
      .equals([tmdbId, type])
      .first();
  },

  async getByStatus(status: MediaStatus): Promise<MediaItem[]> {
    return await db.mediaItems.where("status").equals(status).toArray();
  },

  async updateStatus(id: number, status: MediaStatus): Promise<void> {
    const updates: Partial<MediaItem> = { status };
    if (status === "watched") {
      updates.dateCompleted = new Date();
    } else {
      updates.dateCompleted = null;
    }
    await db.mediaItems.update(id, updates);
  },

  async updateRating(id: number, rating: number | null): Promise<void> {
    await db.mediaItems.update(id, { rating });
  },

  async updateReview(id: number, review: string | null): Promise<void> {
    await db.mediaItems.update(id, { review });
  },

  async exists(tmdbId: number, type: MediaType): Promise<boolean> {
    const count = await db.mediaItems
      .where("[tmdbId+type]")
      .equals([tmdbId, type])
      .count();
    return count > 0;
  },

  async getAll(): Promise<MediaItem[]> {
    return await db.mediaItems.toArray();
  },

  async getRecentlyAdded(limit: number = 10): Promise<MediaItem[]> {
    return await db.mediaItems
      .orderBy("dateAdded")
      .reverse()
      .limit(limit)
      .toArray();
  },
};
