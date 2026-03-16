import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { db } from "@/lib/db/database";
import { StatsPage } from "@/routes/stats";

vi.mock("@/components/stats/genre-pie-chart", () => ({
  GenrePieChart: () => <div>Genre chart</div>,
}));

vi.mock("@/components/stats/activity-calendar", () => ({
  ActivityCalendar: () => <div>Activity chart</div>,
}));

describe("StatsPage", () => {
  beforeEach(async () => {
    await db.mediaItems.clear();
    await db.episodeProgress.clear();
    await db.tmdbCache.clear();
  });

  afterEach(async () => {
    await db.mediaItems.clear();
    await db.episodeProgress.clear();
    await db.tmdbCache.clear();
  });

  it("renders watched episode minutes in the statistics summary", async () => {
    const mediaId = (await db.mediaItems.add({
      tmdbId: 500,
      type: "tv",
      status: "watching",
      rating: null,
      review: null,
      dateAdded: new Date(),
      dateCompleted: null,
      title: "Episode Driven Show",
      posterPath: null,
      releaseYear: 2024,
      runtime: 42,
      totalEpisodes: 12,
      genres: [18],
    })) as number;

    await db.episodeProgress.bulkAdd([
      {
        mediaId,
        seasonNumber: 1,
        episodeNumber: 1,
        watched: true,
        watchedDate: new Date(),
        runtimeMinutes: 42,
      },
      {
        mediaId,
        seasonNumber: 1,
        episodeNumber: 2,
        watched: true,
        watchedDate: new Date(),
        runtimeMinutes: 42,
      },
    ]);

    await act(async () => {
      render(<StatsPage />);
    });

    await screen.findByText("Statistics");
    await waitFor(() => {
      expect(screen.getByText("1.4")).toBeInTheDocument();
      expect(screen.getByText("Total hours watched")).toBeInTheDocument();
      expect(screen.getByText("1h 24m watched")).toBeInTheDocument();
    });
    expect(screen.queryByText("No statistics yet")).not.toBeInTheDocument();
  });

  it("renders minutes without a watched-time subtitle for short totals", async () => {
    const mediaId = (await db.mediaItems.add({
      tmdbId: 501,
      type: "tv",
      status: "watching",
      rating: null,
      review: null,
      dateAdded: new Date(),
      dateCompleted: null,
      title: "Short Episode Show",
      posterPath: null,
      releaseYear: 2024,
      runtime: 38,
      totalEpisodes: 12,
      genres: [18],
    })) as number;

    await db.episodeProgress.add({
      mediaId,
      seasonNumber: 1,
      episodeNumber: 1,
      watched: true,
      watchedDate: new Date(),
      runtimeMinutes: 38,
    });

    await act(async () => {
      render(<StatsPage />);
    });

    await screen.findByText("Statistics");
    await waitFor(() => {
      expect(screen.getByText("38")).toBeInTheDocument();
      expect(screen.getByText("Total minutes watched")).toBeInTheDocument();
    });
    expect(screen.queryByText("38m watched")).not.toBeInTheDocument();
  });

  it("renders day-level watched totals with exact day and hour detail", async () => {
    await db.mediaItems.add({
      tmdbId: 600,
      type: "movie",
      status: "watched",
      rating: null,
      review: null,
      dateAdded: new Date(),
      dateCompleted: new Date(),
      title: "Very Long Marathon",
      posterPath: null,
      releaseYear: 2024,
      runtime: 1598,
      totalEpisodes: null,
      genres: [18],
    });

    await act(async () => {
      render(<StatsPage />);
    });

    await screen.findByText("Statistics");
    await waitFor(() => {
      expect(screen.getByText("1.1")).toBeInTheDocument();
      expect(screen.getByText("Total days watched")).toBeInTheDocument();
      expect(screen.getByText("1d 2h watched")).toBeInTheDocument();
    });
  });

  it("keeps the empty state when nothing is watched", async () => {
    await act(async () => {
      render(<StatsPage />);
    });

    await screen.findByText("No statistics yet");
    expect(
      screen.getByText("Start marking movies and shows as watched to see your stats")
    ).toBeInTheDocument();
  });
});
