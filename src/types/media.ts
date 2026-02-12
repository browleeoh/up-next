export type MediaType = "movie" | "tv";
export type MediaStatus = "watchlist" | "watching" | "watched";

export interface MediaItem {
  id?: number;
  tmdbId: number;
  type: MediaType;
  status: MediaStatus;
  rating: number | null;
  review: string | null;
  dateAdded: Date;
  dateCompleted: Date | null;
  // Denormalized for offline display
  title: string;
  posterPath: string | null;
  releaseYear: number | null;
  runtime: number | null;
  genres: number[];
}

export interface EpisodeProgress {
  id?: number;
  mediaId: number;
  seasonNumber: number;
  episodeNumber: number;
  watched: boolean;
  watchedDate: Date | null;
}

export interface TmdbCache {
  id?: number;
  cacheKey: string;
  data: unknown;
  expiresAt: Date;
}

// TMDB API types
export interface TmdbSearchResult {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  vote_count: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
}

export interface TmdbSearchResponse {
  page: number;
  results: TmdbSearchResult[];
  total_pages: number;
  total_results: number;
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbMovieDetail {
  id: number;
  title: string;
  tagline: string | null;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number | null;
  vote_average: number;
  vote_count: number;
  genres: TmdbGenre[];
  status: string;
  budget: number;
  revenue: number;
}

export interface TmdbTvSeason {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  poster_path: string | null;
  episode_count: number;
  air_date: string | null;
}

export interface TmdbTvDetail {
  id: number;
  name: string;
  tagline: string | null;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date: string;
  episode_run_time: number[];
  vote_average: number;
  vote_count: number;
  genres: TmdbGenre[];
  status: string;
  number_of_seasons: number;
  number_of_episodes: number;
  seasons: TmdbTvSeason[];
}

export interface TmdbEpisode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  air_date: string | null;
  still_path: string | null;
  vote_average: number;
  runtime: number | null;
}

export interface TmdbSeasonDetail {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string | null;
  episodes: TmdbEpisode[];
}

// Genre mapping
export const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  // TV genres
  10759: "Action & Adventure",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
};
