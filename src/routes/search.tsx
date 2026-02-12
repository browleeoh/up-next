import { createFileRoute, useLocation, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { tmdbApi } from "@/lib/services/tmdb/api";
import { SearchInput } from "@/components/media/search-input";
import { MediaCard } from "@/components/media/media-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Film, Tv, Search as SearchIcon } from "lucide-react";

type SearchParams = {
  q?: string;
  type?: "movie" | "tv" | "multi";
};

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: (search.q as string) || undefined,
    type: (search.type as SearchParams["type"]) || "multi",
  }),
  component: SearchPage,
});

function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const search = location.search as SearchParams;
  const q = search.q;
  const type = search.type || "multi";

  const [searchValue, setSearchValue] = useState(q || "");

  useEffect(() => {
    setSearchValue(q || "");
  }, [q]);

  const { data, isLoading } = useQuery({
    queryKey: ["search", type, q],
    queryFn: () => tmdbApi.searchMulti(q || ""),
    enabled: !!q && q.length >= 2,
    staleTime: 1000 * 60 * 5,
  });

  const handleSearch = (value: string) => {
    setSearchValue(value);
    navigate({
      to: "/search",
      search: { ...search, q: value || undefined },
    });
  };

  const handleTypeChange = (newType: SearchParams["type"]) => {
    navigate({
      to: "/search",
      search: { ...search, type: newType },
    });
  };

  const results = data?.results || [];
  const filteredResults =
    type === "multi"
      ? results
      : results.filter((r) => r.media_type === type);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-4 text-2xl font-bold">Search</h1>
        <SearchInput
          value={searchValue}
          onChange={handleSearch}
          placeholder="Search movies and TV shows..."
          autoFocus
        />
      </div>

      {/* Type Filter */}
      <div className="flex gap-2">
        <TypeButton
          active={type === "multi"}
          onClick={() => handleTypeChange("multi")}
        >
          All
        </TypeButton>
        <TypeButton
          active={type === "movie"}
          onClick={() => handleTypeChange("movie")}
        >
          <Film className="h-4 w-4" />
          Movies
        </TypeButton>
        <TypeButton
          active={type === "tv"}
          onClick={() => handleTypeChange("tv")}
        >
          <Tv className="h-4 w-4" />
          TV Shows
        </TypeButton>
      </div>

      {/* Loading State */}
      {isLoading && q && (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {!isLoading && q && filteredResults.length > 0 && (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredResults.map((result) => (
            <MediaCard
              key={`${result.media_type}-${result.id}`}
              tmdbResult={result}
            />
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && q && filteredResults.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <SearchIcon className="mb-4 h-12 w-12" />
          <p className="text-lg">No results found for "{q}"</p>
          <p className="text-sm">Try a different search term</p>
        </div>
      )}

      {/* Initial State */}
      {!q && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <SearchIcon className="mb-4 h-12 w-12" />
          <p className="text-lg">Search for movies and TV shows</p>
          <p className="text-sm">
            Find something to add to your watchlist
          </p>
        </div>
      )}
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
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-amber-500 text-slate-900"
          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
      }`}
    >
      {children}
    </button>
  );
}
