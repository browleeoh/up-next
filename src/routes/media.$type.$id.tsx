import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLiveQuery } from "dexie-react-hooks";
import { tmdbApi } from "@/lib/services/tmdb/api";
import { db } from "@/lib/db/database";
import { mediaRepository } from "@/lib/db/repositories/media.repository";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusPicker } from "@/components/media/status-picker";
import { StarRating } from "@/components/review/star-rating";
import { ReviewForm } from "@/components/review/review-form";
import { SeasonAccordion } from "@/components/tv/season-accordion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Star,
  Film,
  Tv,
  ExternalLink,
} from "lucide-react";
import type { MediaItem, MediaStatus, TmdbMovieDetail, TmdbTvDetail } from "@/types/media";

export const Route = createFileRoute("/media/$type/$id")({
  component: MediaDetailPage,
});

function MediaDetailPage() {
  const { type, id } = useParams({ from: "/media/$type/$id" });
  const mediaType = type as "movie" | "tv";
  const mediaId = parseInt(id);
  const queryClient = useQueryClient();

  // Fetch from TMDB
  const { data: tmdbData, isLoading: tmdbLoading } = useQuery({
    queryKey: ["media", mediaType, mediaId],
    queryFn: async (): Promise<TmdbMovieDetail | TmdbTvDetail> => {
      if (mediaType === "movie") {
        return tmdbApi.getMovie(mediaId);
      }
      return tmdbApi.getTvShow(mediaId);
    },
  });

  // Get local data if exists
  const localItem = useLiveQuery(
    () =>
      db.mediaItems
        .where("[tmdbId+type]")
        .equals([mediaId, mediaType])
        .first(),
    [mediaId, mediaType]
  );

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      status,
      itemData,
    }: {
      status: MediaStatus;
      itemData?: Partial<MediaItem>;
    }) => {
      if (localItem) {
        await mediaRepository.updateStatus(localItem.id!, status);
      } else if (tmdbData && itemData) {
        await mediaRepository.add({
          ...itemData,
          status,
        } as Omit<MediaItem, "id">);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media", mediaType, mediaId] });
    },
  });

  const updateRatingMutation = useMutation({
    mutationFn: async (rating: number) => {
      if (localItem) {
        await db.mediaItems.update(localItem.id!, { rating });
      }
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: async (review: string) => {
      if (localItem) {
        await db.mediaItems.update(localItem.id!, { review });
      }
    },
  });

  if (tmdbLoading) {
    return <MediaDetailSkeleton />;
  }

  if (!tmdbData) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">Media not found</p>
        <Link to="/" className="text-amber-500 hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  const isMovie = "title" in tmdbData;
  const title = isMovie ? tmdbData.title : tmdbData.name;
  const releaseDate = isMovie ? tmdbData.release_date : tmdbData.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const runtime = isMovie ? tmdbData.runtime : tmdbData.episode_run_time?.[0] || null;

  const handleStatusChange = (status: MediaStatus) => {
    updateStatusMutation.mutate({
      status,
      itemData: {
        tmdbId: mediaId,
        type: mediaType,
        title,
        posterPath: tmdbData.poster_path,
        releaseYear,
        runtime,
        genres: tmdbData.genres?.map((g) => g.id) || [],
        dateAdded: new Date(),
        dateCompleted: status === "watched" ? new Date() : null,
        rating: null,
        review: null,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      {/* Hero Section */}
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Poster */}
        <div className="shrink-0">
          {tmdbData.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`}
              alt={title}
              className="w-full max-w-[300px] rounded-xl shadow-lg mx-auto md:mx-0"
            />
          ) : (
            <div className="flex aspect-[2/3] w-full max-w-[300px] items-center justify-center rounded-xl bg-slate-800 mx-auto md:mx-0">
              {mediaType === "movie" ? (
                <Film className="h-16 w-16 text-slate-600" />
              ) : (
                <Tv className="h-16 w-16 text-slate-600" />
              )}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
              {mediaType === "movie" ? (
                <Film className="h-4 w-4" />
              ) : (
                <Tv className="h-4 w-4" />
              )}
              {mediaType === "movie" ? "Movie" : "TV Show"}
            </div>
            <h1 className="text-3xl font-bold">{title}</h1>
            {tmdbData.tagline && (
              <p className="text-slate-400 italic mt-1">{tmdbData.tagline}</p>
            )}
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            {releaseYear && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {releaseYear}
              </span>
            )}
            {runtime && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {runtime} min
              </span>
            )}
            {tmdbData.vote_average > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500" />
                {tmdbData.vote_average.toFixed(1)}
              </span>
            )}
          </div>

          {/* Genres */}
          {tmdbData.genres && tmdbData.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tmdbData.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {/* Status Picker */}
          <div className="pt-2">
            <StatusPicker
              currentStatus={localItem?.status || null}
              onStatusChange={handleStatusChange}
            />
          </div>

          {/* Overview */}
          {tmdbData.overview && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Overview</h2>
              <p className="text-slate-300 leading-relaxed">
                {tmdbData.overview}
              </p>
            </div>
          )}

          {/* TMDB Link */}
          <a
            href={`https://www.themoviedb.org/${mediaType}/${mediaId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-100"
          >
            View on TMDB
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* TV Show Seasons */}
      {mediaType === "tv" && !isMovie && "seasons" in tmdbData && tmdbData.seasons && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Seasons & Episodes</h2>
          <SeasonAccordion
            tvId={mediaId}
            seasons={tmdbData.seasons}
            mediaId={localItem?.id}
          />
        </Card>
      )}

      {/* Rating & Review (only if in library) */}
      {localItem && (
        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Your Rating</h2>
            <StarRating
              value={localItem.rating || 0}
              onChange={(rating) => updateRatingMutation.mutate(rating)}
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Your Review</h2>
            <ReviewForm
              value={localItem.review || ""}
              onSave={(review) => updateReviewMutation.mutate(review)}
            />
          </div>
        </Card>
      )}
    </div>
  );
}

function MediaDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-20" />
      <div className="flex flex-col gap-6 md:flex-row">
        <Skeleton className="aspect-[2/3] w-full max-w-[300px] rounded-xl" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );
}
