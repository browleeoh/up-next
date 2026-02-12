import { createFileRoute, useLocation } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/database";
import { MediaGrid } from "@/components/media/media-grid";
import { MediaListFilters } from "@/components/media/media-list-filters";
import { CheckCircle } from "lucide-react";

type WatchedSearch = {
  genre?: number;
  sort?: "dateAdded" | "title" | "releaseYear" | "rating" | "dateCompleted";
  order?: "asc" | "desc";
  type?: "all" | "movie" | "tv";
};

export const Route = createFileRoute("/watched")({
  validateSearch: (search: Record<string, unknown>): WatchedSearch => ({
    genre: search.genre as number | undefined,
    sort: (search.sort as WatchedSearch["sort"]) || "dateCompleted",
    order: (search.order as WatchedSearch["order"]) || "desc",
    type: (search.type as WatchedSearch["type"]) || "all",
  }),
  component: WatchedPage,
});

function WatchedPage() {
  const location = useLocation();
  const search = location.search as WatchedSearch;
  const { genre, sort = "dateCompleted", order = "desc", type = "all" } = search;

  const items = useLiveQuery(async () => {
    const collection = db.mediaItems.where("status").equals("watched");
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
        case "rating":
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
        case "dateCompleted":
          comparison =
            new Date(a.dateCompleted || 0).getTime() -
            new Date(b.dateCompleted || 0).getTime();
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
        <div className="rounded-lg bg-status-watched/20 p-2">
          <CheckCircle className="h-6 w-6 text-status-watched" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Watched</h1>
          <p className="text-sm text-slate-400">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      <MediaListFilters showRatingSort />
      <MediaGrid items={items} emptyMessage="Nothing watched yet" />
    </div>
  );
}
