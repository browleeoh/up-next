import type { MediaItem, MediaType, TmdbMovieDetail, TmdbTvDetail } from "@/types/media";

type MediaDetail = TmdbMovieDetail | TmdbTvDetail;

export function buildMediaMetadata(
  mediaType: MediaType,
  detail: MediaDetail
): Pick<
  MediaItem,
  "title" | "posterPath" | "releaseYear" | "runtime" | "totalEpisodes" | "genres"
> {
  const isMovie = mediaType === "movie";
  const releaseDate = isMovie
    ? (detail as TmdbMovieDetail).release_date
    : (detail as TmdbTvDetail).first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null;

  return {
    title: isMovie
      ? (detail as TmdbMovieDetail).title
      : (detail as TmdbTvDetail).name,
    posterPath: detail.poster_path,
    releaseYear,
    runtime: isMovie
      ? (detail as TmdbMovieDetail).runtime
      : (detail as TmdbTvDetail).episode_run_time?.find(
          (runtime) => runtime > 0
        ) ?? null,
    totalEpisodes: isMovie
      ? null
      : (detail as TmdbTvDetail).number_of_episodes ?? null,
    genres: detail.genres?.map((genre) => genre.id) ?? [],
  };
}
