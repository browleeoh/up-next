import { db } from "../database";
import type { EpisodeProgress } from "@/types/media";

export const episodeRepository = {
  async getProgress(
    mediaId: number,
    seasonNumber: number,
    episodeNumber: number
  ): Promise<EpisodeProgress | undefined> {
    return await db.episodeProgress
      .where("[mediaId+seasonNumber+episodeNumber]")
      .equals([mediaId, seasonNumber, episodeNumber])
      .first();
  },

  async getSeasonProgress(
    mediaId: number,
    seasonNumber: number
  ): Promise<EpisodeProgress[]> {
    return await db.episodeProgress
      .where("mediaId")
      .equals(mediaId)
      .filter((ep) => ep.seasonNumber === seasonNumber)
      .toArray();
  },

  async getAllProgress(mediaId: number): Promise<EpisodeProgress[]> {
    return await db.episodeProgress.where("mediaId").equals(mediaId).toArray();
  },

  async setWatched(
    mediaId: number,
    seasonNumber: number,
    episodeNumber: number,
    watched: boolean,
    runtimeMinutes: number | null = null
  ): Promise<void> {
    const existing = await this.getProgress(mediaId, seasonNumber, episodeNumber);

    if (existing) {
      await db.episodeProgress.update(existing.id!, {
        watched,
        watchedDate: watched ? new Date() : null,
        runtimeMinutes: watched
          ? runtimeMinutes ?? existing.runtimeMinutes ?? null
          : null,
      });
    } else {
      await db.episodeProgress.add({
        mediaId,
        seasonNumber,
        episodeNumber,
        watched,
        watchedDate: watched ? new Date() : null,
        runtimeMinutes: watched ? runtimeMinutes : null,
      });
    }
  },

  async setSeasonWatched(
    mediaId: number,
    seasonNumber: number,
    episodes: Array<{ episodeNumber: number; runtimeMinutes: number | null }>,
    watched: boolean
  ): Promise<void> {
    await db.transaction("rw", db.episodeProgress, async () => {
      for (const episode of episodes) {
        await this.setWatched(
          mediaId,
          seasonNumber,
          episode.episodeNumber,
          watched,
          episode.runtimeMinutes
        );
      }
    });
  },

  async countWatched(mediaId: number): Promise<number> {
    return await db.episodeProgress
      .where("mediaId")
      .equals(mediaId)
      .filter((ep) => ep.watched)
      .count();
  },

  async countWatchedInSeason(
    mediaId: number,
    seasonNumber: number
  ): Promise<number> {
    return await db.episodeProgress
      .where("mediaId")
      .equals(mediaId)
      .filter((ep) => ep.seasonNumber === seasonNumber && ep.watched)
      .count();
  },

  async deleteForMedia(mediaId: number): Promise<void> {
    await db.episodeProgress.where("mediaId").equals(mediaId).delete();
  },
};
