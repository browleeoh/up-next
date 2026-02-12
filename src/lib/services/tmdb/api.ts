import { tmdbClient } from "./client";
import { cacheRepository } from "@/lib/db/repositories/cache.repository";
import type {
  TmdbSearchResponse,
  TmdbMovieDetail,
  TmdbTvDetail,
  TmdbSeasonDetail,
} from "@/types/media";

export const tmdbApi = {
  async searchMulti(query: string, page: number = 1): Promise<TmdbSearchResponse> {
    if (!query.trim()) {
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }

    const cacheKey = `search:multi:${query}:${page}`;
    const cached = await cacheRepository.get<TmdbSearchResponse>(cacheKey);
    if (cached) return cached;

    const data = await tmdbClient.request<TmdbSearchResponse>("/search/multi", {
      query,
      page,
      include_adult: "false",
    });

    // Filter out person results and add media_type to movie/tv
    data.results = data.results.filter(
      (r) => r.media_type === "movie" || r.media_type === "tv"
    );

    await cacheRepository.set(cacheKey, data);
    return data;
  },

  async searchMovies(query: string, page: number = 1): Promise<TmdbSearchResponse> {
    if (!query.trim()) {
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }

    const cacheKey = `search:movie:${query}:${page}`;
    const cached = await cacheRepository.get<TmdbSearchResponse>(cacheKey);
    if (cached) return cached;

    const data = await tmdbClient.request<TmdbSearchResponse>("/search/movie", {
      query,
      page,
      include_adult: "false",
    });

    // Add media_type
    data.results = data.results.map((r) => ({ ...r, media_type: "movie" as const }));

    await cacheRepository.set(cacheKey, data);
    return data;
  },

  async searchTv(query: string, page: number = 1): Promise<TmdbSearchResponse> {
    if (!query.trim()) {
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }

    const cacheKey = `search:tv:${query}:${page}`;
    const cached = await cacheRepository.get<TmdbSearchResponse>(cacheKey);
    if (cached) return cached;

    const data = await tmdbClient.request<TmdbSearchResponse>("/search/tv", {
      query,
      page,
      include_adult: "false",
    });

    // Add media_type
    data.results = data.results.map((r) => ({ ...r, media_type: "tv" as const }));

    await cacheRepository.set(cacheKey, data);
    return data;
  },

  async getMovie(id: number): Promise<TmdbMovieDetail> {
    const cacheKey = `movie:${id}`;
    const cached = await cacheRepository.get<TmdbMovieDetail>(cacheKey);
    if (cached) return cached;

    const data = await tmdbClient.request<TmdbMovieDetail>(`/movie/${id}`);
    await cacheRepository.set(cacheKey, data);
    return data;
  },

  async getTvShow(id: number): Promise<TmdbTvDetail> {
    const cacheKey = `tv:${id}`;
    const cached = await cacheRepository.get<TmdbTvDetail>(cacheKey);
    if (cached) return cached;

    const data = await tmdbClient.request<TmdbTvDetail>(`/tv/${id}`);
    await cacheRepository.set(cacheKey, data);
    return data;
  },

  async getTvSeason(tvId: number, seasonNumber: number): Promise<TmdbSeasonDetail> {
    const cacheKey = `tv:${tvId}:season:${seasonNumber}`;
    const cached = await cacheRepository.get<TmdbSeasonDetail>(cacheKey);
    if (cached) return cached;

    const data = await tmdbClient.request<TmdbSeasonDetail>(
      `/tv/${tvId}/season/${seasonNumber}`
    );
    await cacheRepository.set(cacheKey, data);
    return data;
  },

  async getRecommendations(
    type: "movie" | "tv",
    id: number,
    page: number = 1
  ): Promise<TmdbSearchResponse> {
    const cacheKey = `recommendations:${type}:${id}:${page}`;
    const cached = await cacheRepository.get<TmdbSearchResponse>(cacheKey);
    if (cached) return cached;

    const data = await tmdbClient.request<TmdbSearchResponse>(
      `/${type}/${id}/recommendations`,
      { page }
    );

    // Add media_type
    data.results = data.results.map((r) => ({ ...r, media_type: type }));

    await cacheRepository.set(cacheKey, data);
    return data;
  },

  async getTrending(
    mediaType: "movie" | "tv" | "all" = "all",
    timeWindow: "day" | "week" = "week"
  ): Promise<TmdbSearchResponse> {
    const cacheKey = `trending:${mediaType}:${timeWindow}`;
    const cached = await cacheRepository.get<TmdbSearchResponse>(cacheKey);
    if (cached) return cached;

    const data = await tmdbClient.request<TmdbSearchResponse>(
      `/trending/${mediaType}/${timeWindow}`
    );
    await cacheRepository.set(cacheKey, data);
    return data;
  },

  getImageUrl(path: string | null, size: "w185" | "w342" | "w500" | "original" = "w342"): string | null {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },
};
