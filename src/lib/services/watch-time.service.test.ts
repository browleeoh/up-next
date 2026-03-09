import { describe, expect, it } from "vitest";
import { calculateWatchTimeSummary } from "@/lib/services/watch-time.service";
import type {
  EpisodeProgress,
  MediaItem,
  TmdbSeasonDetail,
  TmdbTvDetail,
} from "@/types/media";

function createTvDetail(
  overrides: Partial<TmdbTvDetail> = {}
): TmdbTvDetail {
  return {
    id: 100,
    name: "Test Show",
    tagline: null,
    overview: "",
    poster_path: null,
    backdrop_path: null,
    first_air_date: "2020-01-01",
    last_air_date: "2020-01-01",
    episode_run_time: [42],
    vote_average: 0,
    vote_count: 0,
    genres: [],
    status: "Ended",
    number_of_seasons: 1,
    number_of_episodes: 10,
    seasons: [],
    ...overrides,
  };
}

function createSeasonDetail(
  overrides: Partial<TmdbSeasonDetail> = {}
): TmdbSeasonDetail {
  return {
    id: 200,
    season_number: 1,
    name: "Season 1",
    overview: "",
    poster_path: null,
    air_date: "2020-01-01",
    episodes: [],
    ...overrides,
  };
}

describe("calculateWatchTimeSummary", () => {
  it("counts watched movies, watched episodes, and completed TV estimates without double counting", () => {
    const mediaItems: MediaItem[] = [
      {
        id: 1,
        tmdbId: 10,
        type: "movie",
        status: "watched",
        rating: null,
        review: null,
        dateAdded: new Date(),
        dateCompleted: new Date(),
        title: "Movie",
        posterPath: null,
        releaseYear: 2024,
        runtime: 120,
        totalEpisodes: null,
        genres: [],
      },
      {
        id: 2,
        tmdbId: 20,
        type: "tv",
        status: "watching",
        rating: null,
        review: null,
        dateAdded: new Date(),
        dateCompleted: null,
        title: "Episode Show",
        posterPath: null,
        releaseYear: 2024,
        runtime: 45,
        totalEpisodes: 8,
        genres: [],
      },
      {
        id: 3,
        tmdbId: 30,
        type: "tv",
        status: "watched",
        rating: null,
        review: null,
        dateAdded: new Date(),
        dateCompleted: new Date(),
        title: "Completed Show",
        posterPath: null,
        releaseYear: 2023,
        runtime: 50,
        totalEpisodes: 10,
        genres: [],
      },
      {
        id: 4,
        tmdbId: 40,
        type: "tv",
        status: "watched",
        rating: null,
        review: null,
        dateAdded: new Date(),
        dateCompleted: new Date(),
        title: "Legacy Episode Show",
        posterPath: null,
        releaseYear: 2022,
        runtime: null,
        totalEpisodes: null,
        genres: [],
      },
    ];

    const episodeProgress: EpisodeProgress[] = [
      {
        id: 100,
        mediaId: 2,
        seasonNumber: 1,
        episodeNumber: 1,
        watched: true,
        watchedDate: new Date(),
        runtimeMinutes: 42,
      },
      {
        id: 101,
        mediaId: 2,
        seasonNumber: 1,
        episodeNumber: 2,
        watched: true,
        watchedDate: new Date(),
        runtimeMinutes: 42,
      },
      {
        id: 102,
        mediaId: 3,
        seasonNumber: 1,
        episodeNumber: 1,
        watched: true,
        watchedDate: new Date(),
        runtimeMinutes: 50,
      },
      {
        id: 103,
        mediaId: 4,
        seasonNumber: 1,
        episodeNumber: 3,
        watched: true,
        watchedDate: new Date(),
        runtimeMinutes: null,
      },
    ];

    const cachedTvDetails = new Map<number, TmdbTvDetail>([
      [40, createTvDetail({ id: 40 })],
    ]);
    const cachedSeasonDetails = new Map<string, TmdbSeasonDetail>([
      [
        "tv:40:season:1",
        createSeasonDetail({
          episodes: [
            {
              id: 301,
              name: "Episode 3",
              overview: "",
              episode_number: 3,
              season_number: 1,
              air_date: "2020-01-01",
              still_path: null,
              vote_average: 0,
              runtime: 44,
            },
          ],
        }),
      ],
    ]);

    const { summary, repairs } = calculateWatchTimeSummary({
      mediaItems,
      episodeProgress,
      cachedTvDetails,
      cachedSeasonDetails,
    });

    expect(summary.movieMinutes).toBe(120);
    expect(summary.episodeMinutes).toBe(178);
    expect(summary.completedShowEstimateMinutes).toBe(0);
    expect(summary.totalMinutes).toBe(298);
    expect(repairs.episodeUpdates).toEqual([{ id: 103, runtimeMinutes: 44 }]);
  });

  it("uses cached TV detail to estimate completed shows and repair missing metadata", () => {
    const mediaItems: MediaItem[] = [
      {
        id: 5,
        tmdbId: 50,
        type: "tv",
        status: "watched",
        rating: null,
        review: null,
        dateAdded: new Date(),
        dateCompleted: new Date(),
        title: "Cached Show",
        posterPath: null,
        releaseYear: 2021,
        runtime: null,
        totalEpisodes: null,
        genres: [],
      },
    ];

    const { summary, repairs } = calculateWatchTimeSummary({
      mediaItems,
      episodeProgress: [],
      cachedTvDetails: new Map([[50, createTvDetail({ id: 50, number_of_episodes: 6, episode_run_time: [30] })]]),
      cachedSeasonDetails: new Map(),
    });

    expect(summary.totalMinutes).toBe(180);
    expect(repairs.mediaUpdates).toEqual([
      { id: 5, runtime: 30, totalEpisodes: 6 },
    ]);
  });
});
