import { useLocation, useNavigate } from "@tanstack/react-router";
import { Film, Tv, SortAsc, SortDesc } from "lucide-react";

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
      {/* Type Filter */}
      <div className="flex rounded-lg bg-slate-800 p-1">
        <TypeButton
          active={currentType === "all"}
          onClick={() => handleTypeChange("all")}
        >
          All
        </TypeButton>
        <TypeButton
          active={currentType === "movie"}
          onClick={() => handleTypeChange("movie")}
        >
          <Film className="h-4 w-4" />
          Movies
        </TypeButton>
        <TypeButton
          active={currentType === "tv"}
          onClick={() => handleTypeChange("tv")}
        >
          <Tv className="h-4 w-4" />
          TV
        </TypeButton>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <select
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
        >
          <option value="dateAdded">Date Added</option>
          <option value="title">Title</option>
          <option value="releaseYear">Release Year</option>
          {showRatingSort && <option value="rating">Rating</option>}
          {showRatingSort && <option value="dateCompleted">Date Completed</option>}
        </select>

        <button
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

function TypeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-amber-500 text-slate-900"
          : "text-slate-400 hover:text-slate-100"
      }`}
    >
      {children}
    </button>
  );
}
