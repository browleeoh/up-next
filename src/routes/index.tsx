import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/database";
import { MediaCard } from "@/components/media/media-card";
import { Card } from "@/components/ui/card";
import {
  Bookmark,
  Play,
  CheckCircle,
  TrendingUp,
  Search,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const watchlistCount = useLiveQuery(
    () => db.mediaItems.where("status").equals("watchlist").count(),
    [],
    0
  );
  const watchingCount = useLiveQuery(
    () => db.mediaItems.where("status").equals("watching").count(),
    [],
    0
  );
  const watchedCount = useLiveQuery(
    () => db.mediaItems.where("status").equals("watched").count(),
    [],
    0
  );

  const recentlyAdded = useLiveQuery(
    () =>
      db.mediaItems.orderBy("dateAdded").reverse().limit(6).toArray(),
    [],
    []
  );

  const currentlyWatching = useLiveQuery(
    () =>
      db.mediaItems
        .where("status")
        .equals("watching")
        .limit(6)
        .toArray(),
    [],
    []
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          to="/search"
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-amber-400"
        >
          <Search className="h-4 w-4" />
          Add New
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<Bookmark className="h-5 w-5 text-status-watchlist" />}
          label="Watchlist"
          value={watchlistCount}
          href="/watchlist"
        />
        <StatCard
          icon={<Play className="h-5 w-5 text-status-watching" />}
          label="Watching"
          value={watchingCount}
          href="/watching"
        />
        <StatCard
          icon={<CheckCircle className="h-5 w-5 text-status-watched" />}
          label="Watched"
          value={watchedCount}
          href="/watched"
        />
      </div>

      {/* Currently Watching */}
      {currentlyWatching.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Currently Watching</h2>
            <Link
              to="/watching"
              className="text-sm text-slate-400 hover:text-slate-100"
            >
              View All
            </Link>
          </div>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {currentlyWatching.map((item) => (
              <MediaCard key={item.id} media={item} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Added */}
      {recentlyAdded.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recently Added</h2>
          </div>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {recentlyAdded.map((item) => (
              <MediaCard key={item.id} media={item} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {recentlyAdded.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 py-16">
          <TrendingUp className="mb-4 h-12 w-12 text-slate-600" />
          <h2 className="mb-2 text-lg font-medium">No movies or shows yet</h2>
          <p className="mb-4 text-slate-400">
            Start by searching for something to watch
          </p>
          <Link
            to="/search"
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-amber-400"
          >
            <Search className="h-4 w-4" />
            Search Movies & TV Shows
          </Link>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  href: string;
}) {
  return (
    <Link to={href}>
      <Card className="flex items-center gap-4 p-4 transition-colors hover:bg-slate-800/50">
        <div className="rounded-lg bg-slate-800 p-3">{icon}</div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-slate-400">{label}</p>
        </div>
      </Card>
    </Link>
  );
}
