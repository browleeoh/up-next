import { createFileRoute, useLocation } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/database";
import { MediaGrid } from "@/components/media/media-grid";
import { MediaListFilters } from "@/components/media/media-list-filters";
import { Play } from "lucide-react";

type WatchingSearch = {
  genre?: number;
  sort?: "dateAdded" | "title" | "releaseYear";
  order?: "asc" | "desc";
  type?: "all" | "movie" | "tv";
};

export const Route = createFileRoute("/watching")({
  validateSearch: (search: Record<string, unknown>): WatchingSearch => ({
    genre: search.genre as number | undefined,
    sort: (search.sort as WatchingSearch["sort"]) || "dateAdded",
    order: (search.order as WatchingSearch["order"]) || "desc",
    type: (search.type as WatchingSearch["type"]) || "all",
  }),
  component: WatchingPage,
});

function WatchingPage() {
  const location = useLocation();
  const search = location.search as WatchingSearch;
  const { genre, sort = "dateAdded", order = "desc", type = "all" } = search;

  const items = useLiveQuery(async () => {
    const collection = db.mediaItems.where("status").equals("watching");
    let results = await collection.toArray();

    // Filter by type
    if (type && type !== "all") {
      results = results.filter((item) => item.type === type);
    }

    // Filter by genre
    if (genre) {
      results = results.filter((item) => item.genres.includes(genre));
    }

    // Sort
    results.sort((a, b) => {
      let comparison = 0;
      switch (sort) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "releaseYear":
          comparison = (a.releaseYear || 0) - (b.releaseYear || 0);
          break;
        case "dateAdded":
        default:
          comparison =
            new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
          break;
      }
      return order === "desc" ? -comparison : comparison;
    });

    return results;
  }, [genre, sort, order, type], []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-status-watching/20 p-2">
          <Play className="h-6 w-6 text-status-watching" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Currently Watching</h1>
          <p className="text-sm text-slate-400">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      <MediaListFilters />
      <MediaGrid items={items} emptyMessage="Nothing in progress" />
    </div>
  );
}
