import { useLocation, useNavigate } from "@tanstack/react-router";
import { Film, Tv, SortAsc, SortDesc } from "lucide-react";
import { Select } from "@/components/ui/select";
import { SegmentedControl } from "@/components/ui/segmented-control";

interface MediaListFiltersProps {
  showRatingSort?: boolean;
}

export function MediaListFilters({ showRatingSort = false }: MediaListFiltersProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const rawSearch = location.search as Record<string, unknown>;

  const currentType = (rawSearch.type as string) || "all";
  const currentSort = (rawSearch.sort as string) || "dateAdded";
  const currentOrder = (rawSearch.order as string) || "desc";

  const updateSearch = (updates: Record<string, string | undefined>) => {
    const merged: Record<string, string> = {};
    for (const [key, value] of Object.entries({ ...rawSearch, ...updates })) {
      if (value !== undefined && value !== null) {
        merged[key] = String(value);
      }
    }
    navigate({
      to: location.pathname,
      search: merged,
    } as unknown as Parameters<typeof navigate>[0]);
  };

  const handleTypeChange = (type: string) => {
    updateSearch({ type: type === "all" ? undefined : type });
  };

  const handleSortChange = (sort: string) => {
    updateSearch({ sort });
  };

  const handleOrderToggle = () => {
    updateSearch({ order: currentOrder === "desc" ? "asc" : "desc" });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SegmentedControl
        value={currentType}
        onValueChange={handleTypeChange}
        ariaLabel="Filter media by type"
        items={[
          { value: "all", label: "All" },
          {
            value: "movie",
            label: (
              <>
                <Film className="h-4 w-4" />
                Movies
              </>
            ),
          },
          {
            value: "tv",
            label: (
              <>
                <Tv className="h-4 w-4" />
                TV
              </>
            ),
          },
        ]}
      />

      <div className="flex items-center gap-2">
        <Select
          value={currentSort}
          onValueChange={handleSortChange}
          ariaLabel="Sort media list"
          options={[
            { value: "dateAdded", label: "Date Added" },
            { value: "title", label: "Title" },
            { value: "releaseYear", label: "Release Year" },
            ...(showRatingSort
              ? [
                  { value: "rating", label: "Rating" },
                  { value: "dateCompleted", label: "Date Completed" },
                ]
              : []),
          ]}
        />

        <button
          type="button"
          onClick={handleOrderToggle}
          className="rounded-lg bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-slate-100"
          title={currentOrder === "desc" ? "Descending" : "Ascending"}
        >
          {currentOrder === "desc" ? (
            <SortDesc className="h-5 w-5" />
          ) : (
            <SortAsc className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
