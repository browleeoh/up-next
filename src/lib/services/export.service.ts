import { db } from "@/lib/db/database";
import type { MediaItem, EpisodeProgress } from "@/types/media";

interface ExportData {
  version: number;
  exportedAt: string;
  mediaItems: MediaItem[];
  episodeProgress: EpisodeProgress[];
}

export const exportService = {
  async exportAll(): Promise<ExportData> {
    const mediaItems = await db.mediaItems.toArray();
    const episodeProgress = await db.episodeProgress.toArray();

    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      mediaItems,
      episodeProgress,
    };
  },

  async importAll(data: ExportData): Promise<void> {
    if (!data.version || !data.mediaItems) {
      throw new Error("Invalid backup file format");
    }

    await db.transaction("rw", [db.mediaItems, db.episodeProgress], async () => {
      // Clear existing data
      await db.mediaItems.clear();
      await db.episodeProgress.clear();

      // Import media items (without IDs to let Dexie generate new ones)
      const mediaIdMap = new Map<number, number>();

      for (const item of data.mediaItems) {
        const oldId = item.id;
        const { id, ...itemWithoutId } = item;

        // Convert date strings back to Date objects
        const mediaItem = {
          ...itemWithoutId,
          dateAdded: new Date(item.dateAdded),
          dateCompleted: item.dateCompleted ? new Date(item.dateCompleted) : null,
        };

        const newId = await db.mediaItems.add(mediaItem) as number;
        if (oldId !== undefined) {
          mediaIdMap.set(oldId, newId);
        }
      }

      // Import episode progress with updated media IDs
      if (data.episodeProgress) {
        for (const ep of data.episodeProgress) {
          const { id, ...epWithoutId } = ep;
          const newMediaId = mediaIdMap.get(ep.mediaId);

          if (newMediaId !== undefined) {
            await db.episodeProgress.add({
              ...epWithoutId,
              mediaId: newMediaId,
              watchedDate: ep.watchedDate ? new Date(ep.watchedDate) : null,
            });
          }
        }
      }
    });
  },
};
