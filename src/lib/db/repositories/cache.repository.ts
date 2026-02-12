import { db } from "../database";

const CACHE_DURATION_MS = 1000 * 60 * 60 * 24; // 24 hours

export const cacheRepository = {
  async get<T>(key: string): Promise<T | null> {
    const cached = await db.tmdbCache
      .where("cacheKey")
      .equals(key)
      .first();

    if (!cached) return null;

    if (new Date(cached.expiresAt) < new Date()) {
      await db.tmdbCache.delete(cached.id!);
      return null;
    }

    return cached.data as T;
  },

  async set<T>(key: string, data: T): Promise<void> {
    const existing = await db.tmdbCache
      .where("cacheKey")
      .equals(key)
      .first();

    const expiresAt = new Date(Date.now() + CACHE_DURATION_MS);

    if (existing) {
      await db.tmdbCache.update(existing.id!, { data, expiresAt });
    } else {
      await db.tmdbCache.add({ cacheKey: key, data, expiresAt });
    }
  },

  async clear(): Promise<void> {
    await db.tmdbCache.clear();
  },

  async clearExpired(): Promise<void> {
    const now = new Date();
    await db.tmdbCache.where("expiresAt").below(now).delete();
  },
};
