import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/database";
import { getWatchTimeSummary } from "@/lib/services/watch-time.service";
import { Card } from "@/components/ui/card";
import { GenrePieChart } from "@/components/stats/genre-pie-chart";
import { WatchTimeCard } from "@/components/stats/watch-time-card";
import { ActivityCalendar } from "@/components/stats/activity-calendar";
import {
  BarChart3,
  Film,
  Tv,
  Clock,
  Star,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/stats")({
  component: StatsPage,
});

export function StatsPage() {
  const stats = useLiveQuery(async () => {
    const allItems = await db.mediaItems.toArray();
    const watched = allItems.filter((i) => i.status === "watched");
    const watching = allItems.filter((i) => i.status === "watching");
    const watchlist = allItems.filter((i) => i.status === "watchlist");

    const movies = watched.filter((i) => i.type === "movie");
    const tvShows = watched.filter((i) => i.type === "tv");
    const watchTime = await getWatchTimeSummary();

    const ratedItems = watched.filter((i) => i.rating !== null);
    const averageRating =
      ratedItems.length > 0
        ? ratedItems.reduce((sum, i) => sum + (i.rating || 0), 0) /
          ratedItems.length
        : 0;

    // Genre counts
    const genreCounts: Record<number, number> = {};
    watched.forEach((item) => {
      item.genres.forEach((genreId) => {
        genreCounts[genreId] = (genreCounts[genreId] || 0) + 1;
      });
    });

    // Activity by month
    const activityByMonth: Record<string, number> = {};
    watched.forEach((item) => {
      if (item.dateCompleted) {
        const date = new Date(item.dateCompleted);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        activityByMonth[key] = (activityByMonth[key] || 0) + 1;
      }
    });

    return {
      total: allItems.length,
      watched: watched.length,
      watching: watching.length,
      watchlist: watchlist.length,
      movies: movies.length,
      tvShows: tvShows.length,
      totalWatchTime: watchTime.totalMinutes,
      averageRating,
      genreCounts,
      activityByMonth,
    };
  }, [], null);

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const formatWatchTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    if (days > 0) {
      return {
        value: (minutes / (60 * 24)).toFixed(1),
        unit: "days watched",
        detail: `${days}d ${remainingHours}h watched`,
      };
    }

    if (hours > 0) {
      return {
        value: (minutes / 60).toFixed(1),
        unit: "hours watched",
        detail: `${hours}h ${remainingMinutes}m watched`,
      };
    }

    return { value: minutes, unit: "minutes watched", detail: "" };
  };

  const watchTime = formatWatchTime(stats.totalWatchTime);
  const hasStatsData = stats.watched > 0 || stats.totalWatchTime > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-amber-500/20 p-2">
          <BarChart3 className="h-6 w-6 text-amber-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Statistics</h1>
          <p className="text-sm text-slate-400">
            Your watching habits at a glance
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Film className="h-5 w-5 text-amber-500" />}
          label="Movies Watched"
          value={stats.movies}
        />
        <StatCard
          icon={<Tv className="h-5 w-5 text-violet-400" />}
          label="TV Shows Watched"
          value={stats.tvShows}
        />
        <StatCard
          icon={<Clock className="h-5 w-5 text-emerald-400" />}
          label={`Total ${watchTime.unit}`}
          value={watchTime.value}
          subtitle={watchTime.detail}
        />
        <StatCard
          icon={<Star className="h-5 w-5 text-amber-500" />}
          label="Average Rating"
          value={stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "-"}
          subtitle="out of 10"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Genres Watched</h2>
          <GenrePieChart genreCounts={stats.genreCounts} />
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Activity Over Time</h2>
          <ActivityCalendar activityByMonth={stats.activityByMonth} />
        </Card>
      </div>

      {/* Watch Time Details */}
      <WatchTimeCard totalMinutes={stats.totalWatchTime} />

      {/* Empty State */}
      {!hasStatsData && (
        <Card className="p-8 text-center">
          <TrendingUp className="mx-auto h-12 w-12 text-slate-600 mb-4" />
          <h3 className="text-lg font-medium mb-2">No statistics yet</h3>
          <p className="text-slate-400">
            Start marking movies and shows as watched to see your stats
          </p>
        </Card>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtitle,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  subtitle?: string;
}) {
  return (
    <Card className="flex items-center gap-4 p-4">
      <div className="rounded-lg bg-slate-800 p-3">{icon}</div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-slate-400">{label}</p>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
    </Card>
  );
}
