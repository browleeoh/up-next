import { Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/database";
import { mediaRepository } from "@/lib/db/repositories/media.repository";
import { buildMediaMetadata } from "@/lib/services/media-metadata";
import { tmdbApi } from "@/lib/services/tmdb/api";
import { Film, Tv, Star, Check, Bookmark, Play } from "lucide-react";
import type {
  MediaItem,
  MediaStatus,
  TmdbMovieDetail,
  TmdbSearchResult,
  TmdbTvDetail,
} from "@/types/media";

interface MediaCardProps {
  media?: MediaItem;
  tmdbResult?: TmdbSearchResult;
}

export function MediaCard({ media, tmdbResult }: MediaCardProps) {
  const queryClient = useQueryClient();

  // Determine display data
  const tmdbId = media?.tmdbId || tmdbResult?.id || 0;
  const type = media?.type || tmdbResult?.media_type || "movie";
  const title = media?.title || tmdbResult?.title || tmdbResult?.name || "";
  const posterPath = media?.posterPath || tmdbResult?.poster_path;
  const releaseYear =
    media?.releaseYear ||
    (tmdbResult?.release_date || tmdbResult?.first_air_date
      ? new Date(
          tmdbResult?.release_date || tmdbResult?.first_air_date || ""
        ).getFullYear()
      : null);
  const rating = tmdbResult?.vote_average;

  // Check if already in library
  const existingItem = useLiveQuery(
    () =>
      tmdbResult
        ? db.mediaItems
            .where("[tmdbId+type]")
            .equals([tmdbId, type as "movie" | "tv"])
            .first()
        : undefined,
    [tmdbId, type]
  );

  const addMutation = useMutation({
    mutationFn: async (status: MediaStatus) => {
      if (!tmdbResult) return;

      const detail: TmdbMovieDetail | TmdbTvDetail =
        tmdbResult.media_type === "movie"
          ? await tmdbApi.getMovie(tmdbResult.id)
          : await tmdbApi.getTvShow(tmdbResult.id);
      const metadata = buildMediaMetadata(
        tmdbResult.media_type as "movie" | "tv",
        detail
      );

      await mediaRepository.add({
        tmdbId: tmdbResult.id,
        type: tmdbResult.media_type as "movie" | "tv",
        status,
        ...metadata,
        dateAdded: new Date(),
        dateCompleted: status === "watched" ? new Date() : null,
        rating: null,
        review: null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search"] });
    },
  });

  const imageUrl = tmdbApi.getImageUrl(posterPath ?? null, "w342");
  const displayedStatus = media?.status || existingItem?.status;

  return (
    <div className="group relative">
      <Link
        to="/media/$type/$id"
        params={{ type: type as "movie" | "tv", id: String(tmdbId) }}
        className="block"
      >
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-slate-800">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              {type === "movie" ? (
                <Film className="h-12 w-12 text-slate-600" />
              ) : (
                <Tv className="h-12 w-12 text-slate-600" />
              )}
            </div>
          )}

          {/* Status Badge */}
          {displayedStatus && (
            <div className="absolute left-2 top-2">
              <StatusBadge status={displayedStatus} />
            </div>
          )}

          {/* Rating Badge */}
          {rating !== undefined && rating > 0 && (
            <div className="absolute right-2 top-2 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium">
              <Star className="h-3 w-3 text-amber-500" />
              {rating.toFixed(1)}
            </div>
          )}

          {/* Quick Add Buttons (only for search results not in library) */}
          {tmdbResult && !existingItem && (
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addMutation.mutate("watchlist");
                }}
                className="rounded-full bg-status-watchlist p-2 text-white transition-transform hover:scale-110"
                title="Add to Watchlist"
              >
                <Bookmark className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addMutation.mutate("watching");
                }}
                className="rounded-full bg-status-watching p-2 text-white transition-transform hover:scale-110"
                title="Add to Watching"
              >
                <Play className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addMutation.mutate("watched");
                }}
                className="rounded-full bg-status-watched p-2 text-white transition-transform hover:scale-110"
                title="Mark as Watched"
              >
                <Check className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="mt-2">
          <h3 className="line-clamp-2 text-sm font-medium leading-tight">
            {title}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            {type === "movie" ? (
              <Film className="h-3 w-3" />
            ) : (
              <Tv className="h-3 w-3" />
            )}
            {releaseYear && <span>{releaseYear}</span>}
          </div>
        </div>
      </Link>
    </div>
  );
}

function StatusBadge({ status }: { status: MediaStatus }) {
  const config = {
    watchlist: {
      icon: Bookmark,
      color: "bg-status-watchlist",
    },
    watching: {
      icon: Play,
      color: "bg-status-watching",
    },
    watched: {
      icon: Check,
      color: "bg-status-watched",
    },
  };

  const { icon: Icon, color } = config[status];

  return (
    <div className={`rounded-full p-1.5 ${color}`}>
      <Icon className="h-3 w-3 text-white" />
    </div>
  );
}
