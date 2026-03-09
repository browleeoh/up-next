import {
  createFileRoute,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Film, Search as SearchIcon, Tv, X } from "lucide-react";
import { SearchInput } from "@/components/media/search-input";
import { MediaCard } from "@/components/media/media-card";
import { Skeleton } from "@/components/ui/skeleton";
import { tmdbApi } from "@/lib/services/tmdb/api";
import {
  GENRE_MAP,
  type TmdbPersonSearchResult,
  type TmdbSearchResult,
} from "@/types/media";

type SearchType = "movie" | "tv" | "multi";

type SearchParams = {
  q?: string;
  type?: SearchType;
  year?: number;
  genre?: number;
  personId?: number;
  personName?: string;
};

type SearchResults = {
  movieResults: TmdbSearchResult[];
  tvResults: TmdbSearchResult[];
  people: TmdbPersonSearchResult[];
};

const MIN_QUERY_LENGTH = 2;
const MAX_YEAR = new Date().getFullYear() + 1;

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: parseStringParam(search.q),
    type: parseTypeParam(search.type),
    year: parseNumberParam(search.year),
    genre: parseNumberParam(search.genre),
    personId: parseNumberParam(search.personId),
    personName: parseStringParam(search.personName),
  }),
  component: SearchPage,
});

function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const search = location.search as SearchParams;
  const q = search.q?.trim();
  const type = search.type || "multi";
  const year = search.year;
  const genre = search.genre;
  const personId = search.personId;
  const personName = search.personName;
  const hasTextQuery = Boolean(q && q.length >= MIN_QUERY_LENGTH);
  const hasAnySearch =
    hasTextQuery || Boolean(year) || Boolean(genre) || Boolean(personId);

  const [searchValue, setSearchValue] = useState(search.q || "");
  const [yearValue, setYearValue] = useState(
    search.year ? String(search.year) : ""
  );

  useEffect(() => {
    setSearchValue(search.q || "");
  }, [search.q]);

  useEffect(() => {
    setYearValue(search.year ? String(search.year) : "");
  }, [search.year]);

  const { data, isLoading } = useQuery({
    queryKey: ["search", type, q, year, genre, personId, personName],
    queryFn: () =>
      runSearch({
        q,
        type,
        year,
        genre,
        personId,
        personName,
      }),
    enabled: hasAnySearch,
    staleTime: 1000 * 60 * 5,
  });

  const updateSearch = (updates: Partial<SearchParams>) => {
    navigate({
      to: "/search",
      search: {
        ...search,
        ...updates,
      },
    });
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    updateSearch({ q: value || undefined });
  };

  const handleTypeChange = (newType: SearchType) => {
    updateSearch({ type: newType });
  };

  const handleYearChange = (value: string) => {
    const nextValue = value.replace(/\D/g, "").slice(0, 4);
    setYearValue(nextValue);

    if (!nextValue) {
      updateSearch({ year: undefined });
      return;
    }

    if (nextValue.length === 4) {
      const nextYear = Number(nextValue);
      if (nextYear >= 1874 && nextYear <= MAX_YEAR) {
        updateSearch({ year: nextYear });
      }
    }
  };

  const handleYearBlur = () => {
    if (!yearValue) return;

    if (yearValue.length !== 4) {
      setYearValue(year ? String(year) : "");
      return;
    }

    const nextYear = Number(yearValue);
    if (nextYear < 1874 || nextYear > MAX_YEAR) {
      setYearValue(year ? String(year) : "");
    }
  };

  const handleGenreChange = (value: string) => {
    updateSearch({ genre: value ? Number(value) : undefined });
  };

  const handlePersonSelect = (person: TmdbPersonSearchResult) => {
    updateSearch({
      personId: person.id,
      personName: person.name,
    });
  };

  const clearFilter = (key: "year" | "genre" | "person") => {
    if (key === "year") {
      setYearValue("");
      updateSearch({ year: undefined });
      return;
    }

    if (key === "genre") {
      updateSearch({ genre: undefined });
      return;
    }

    updateSearch({
      personId: undefined,
      personName: undefined,
    });
  };

  const clearAllFilters = () => {
    setYearValue("");
    updateSearch({
      year: undefined,
      genre: undefined,
      personId: undefined,
      personName: undefined,
    });
  };

  const movieResults = data?.movieResults || [];
  const tvResults = data?.tvResults || [];
  const personSuggestions = personId ? [] : data?.people || [];
  const hasFilters = Boolean(year || genre || personId);
  const totalResults = movieResults.length + tvResults.length;
  const activeChips = [
    year ? { key: "year" as const, label: `Year: ${year}` } : null,
    genre
      ? { key: "genre" as const, label: `Genre: ${GENRE_MAP[genre]}` }
      : null,
    personId && personName
      ? { key: "person" as const, label: `Person: ${personName}` }
      : null,
  ].filter(
    (chip): chip is { key: "year" | "genre" | "person"; label: string } =>
      Boolean(chip)
  );

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div>
          <h1 className="mb-4 text-2xl font-bold">Search</h1>
          <SearchInput
            value={searchValue}
            onChange={handleSearch}
            placeholder="Search titles, actors, directors, or creators..."
            ariaLabel="Search titles, actors, directors, or creators"
            autoFocus
          />
        </div>

        <p className="text-sm text-slate-400">
          Start with a title, then narrow by year or genre. If a person matches,
          switch to their credits in one tap.
        </p>

        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <span>Year</span>
            <input
              type="text"
              inputMode="numeric"
              value={yearValue}
              onChange={(e) => handleYearChange(e.target.value)}
              onBlur={handleYearBlur}
              placeholder="Any"
              aria-label="Filter by year"
              className="w-24 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <span>Genre</span>
            <select
              value={genre || ""}
              onChange={(e) => handleGenreChange(e.target.value)}
              aria-label="Filter by genre"
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="">Any</option>
              {getGenreOptions().map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          {hasFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
            >
              Clear filters
            </button>
          )}
        </div>

        {activeChips.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => clearFilter(chip.key)}
                className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-200 transition-colors hover:bg-slate-700"
              >
                <span>{chip.label}</span>
                <X className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        )}

        {personSuggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-slate-400">Search by person</p>
            <div className="flex flex-wrap gap-2">
              {personSuggestions.slice(0, 4).map((person) => (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => handlePersonSelect(person)}
                  className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-200 transition-colors hover:border-amber-500 hover:text-slate-100"
                >
                  {person.name}
                  {person.known_for_department
                    ? ` · ${person.known_for_department}`
                    : ""}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

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

      {isLoading && hasAnySearch && <ResultsSkeleton />}

      {!isLoading &&
        hasAnySearch &&
        totalResults > 0 &&
        (type === "multi" ? (
          <div className="space-y-8">
            <ResultSection title="Movies" results={movieResults} />
            <ResultSection title="TV Shows" results={tvResults} />
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {(type === "movie" ? movieResults : tvResults).map((result) => (
              <MediaCard
                key={`${result.media_type}-${result.id}`}
                tmdbResult={result}
              />
            ))}
          </div>
        ))}

      {!isLoading && hasAnySearch && totalResults === 0 && (
        <EmptyState
          query={q}
          activeChips={activeChips}
          type={type}
          onClearFilter={clearFilter}
          onSwitchToAll={() => handleTypeChange("multi")}
        />
      )}

      {!hasAnySearch && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <SearchIcon className="mb-4 h-12 w-12" />
          <p className="text-lg">Search for movies and TV shows</p>
          <p className="text-sm text-center">
            Find something to add to your watchlist or search by a person’s
            credits.
          </p>
        </div>
      )}
    </div>
  );
}

function ResultSection({
  title,
  results,
}: {
  title: string;
  results: TmdbSearchResult[];
}) {
  if (results.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {results.map((result) => (
          <MediaCard
            key={`${result.media_type}-${result.id}`}
            tmdbResult={result}
          />
        ))}
      </div>
    </section>
  );
}

function ResultsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  query,
  activeChips,
  type,
  onClearFilter,
  onSwitchToAll,
}: {
  query?: string;
  activeChips: { key: "year" | "genre" | "person"; label: string }[];
  type: SearchType;
  onClearFilter: (key: "year" | "genre" | "person") => void;
  onSwitchToAll: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
      <SearchIcon className="mb-4 h-12 w-12" />
      <p className="text-lg text-center">
        No results found{query ? ` for "${query}"` : ""}.
      </p>
      <p className="mt-1 text-sm text-center">
        Clear a filter or broaden the search to see more matches.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {activeChips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={() => onClearFilter(chip.key)}
            className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-700"
          >
            Clear {chip.label.toLowerCase()}
          </button>
        ))}
        {type !== "multi" && (
          <button
            type="button"
            onClick={onSwitchToAll}
            className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-700"
          >
            Switch to All
          </button>
        )}
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
      type="button"
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

async function runSearch(params: SearchParams): Promise<SearchResults> {
  const type = params.type || "multi";
  const query = params.q?.trim() || "";
  const year = params.year;
  const genre = params.genre;
  const personId = params.personId;
  const personName = params.personName;
  const hasTextQuery = query.length >= MIN_QUERY_LENGTH;

  const peoplePromise =
    !personId && hasTextQuery
      ? tmdbApi.searchPerson(query)
      : Promise.resolve(null);

  if (personId) {
    const credits = await tmdbApi.getPersonCombinedCredits(personId);
    const titleFilter = deriveTitleFilter(query, personName);
    const results = filterResults(
      dedupeCredits([...credits.cast, ...credits.crew]),
      {
        query: titleFilter,
        year,
        genre,
      }
    );

    return splitResultsByType(results, type);
  }

  if (hasTextQuery) {
    const [searchResponse, peopleResponse] = await Promise.all([
      getScopedSearchResults(type, query),
      peoplePromise,
    ]);

    const filteredResults = filterResults(searchResponse.results, {
      year,
      genre,
    });

    return {
      ...splitResultsByType(filteredResults, type),
      people: peopleResponse?.results || [],
    };
  }

  if (year || genre) {
    const [discoverResponse, peopleResponse] = await Promise.all([
      getDiscoverResults(type, { year, genre }),
      peoplePromise,
    ]);

    return {
      ...splitResultsByType(discoverResponse.results, type),
      people: peopleResponse?.results || [],
    };
  }

  return {
    movieResults: [],
    tvResults: [],
    people: [],
  };
}

async function getScopedSearchResults(type: SearchType, query: string) {
  if (type === "movie") {
    return tmdbApi.searchMovies(query);
  }

  if (type === "tv") {
    return tmdbApi.searchTv(query);
  }

  return tmdbApi.searchMulti(query);
}

async function getDiscoverResults(
  type: SearchType,
  filters: { year?: number; genre?: number }
) {
  if (type === "movie") {
    return tmdbApi.discoverMovies(filters);
  }

  if (type === "tv") {
    return tmdbApi.discoverTv(filters);
  }

  const [movies, tv] = await Promise.all([
    tmdbApi.discoverMovies(filters),
    tmdbApi.discoverTv(filters),
  ]);

  return {
    page: 1,
    results: [...movies.results, ...tv.results],
    total_pages: Math.max(movies.total_pages, tv.total_pages),
    total_results: movies.total_results + tv.total_results,
  };
}

function splitResultsByType(results: TmdbSearchResult[], type: SearchType) {
  if (type === "movie") {
    return {
      movieResults: results.filter((result) => result.media_type === "movie"),
      tvResults: [],
      people: [],
    };
  }

  if (type === "tv") {
    return {
      movieResults: [],
      tvResults: results.filter((result) => result.media_type === "tv"),
      people: [],
    };
  }

  return {
    movieResults: results.filter((result) => result.media_type === "movie"),
    tvResults: results.filter((result) => result.media_type === "tv"),
    people: [],
  };
}

function filterResults(
  results: TmdbSearchResult[],
  filters: {
    query?: string;
    year?: number;
    genre?: number;
  }
) {
  return results.filter((result) => {
    if (filters.query) {
      const title = (result.title || result.name || "").toLowerCase();
      if (!title.includes(filters.query.toLowerCase())) {
        return false;
      }
    }

    if (filters.year && getResultYear(result) !== filters.year) {
      return false;
    }

    if (filters.genre && !result.genre_ids.includes(filters.genre)) {
      return false;
    }

    return true;
  });
}

function dedupeCredits(results: TmdbSearchResult[]) {
  const unique = new Map<string, TmdbSearchResult>();

  for (const result of results) {
    if (result.media_type !== "movie" && result.media_type !== "tv") {
      continue;
    }

    const key = `${result.media_type}-${result.id}`;
    const existing = unique.get(key);

    if (!existing || result.vote_count > existing.vote_count) {
      unique.set(key, result);
    }
  }

  return Array.from(unique.values()).sort((a, b) => {
    if (b.vote_count !== a.vote_count) {
      return b.vote_count - a.vote_count;
    }

    return b.vote_average - a.vote_average;
  });
}

function deriveTitleFilter(query?: string, personName?: string) {
  const normalizedQuery = query?.trim() || "";
  const normalizedPerson = personName?.trim() || "";

  if (!normalizedQuery || !normalizedPerson) {
    return normalizedQuery;
  }

  const queryLower = normalizedQuery.toLowerCase();
  const personLower = normalizedPerson.toLowerCase();

  if (queryLower === personLower) {
    return "";
  }

  if (queryLower.startsWith(personLower)) {
    return normalizedQuery.slice(normalizedPerson.length).trim();
  }

  if (queryLower.endsWith(personLower)) {
    return normalizedQuery
      .slice(0, normalizedQuery.length - normalizedPerson.length)
      .trim();
  }

  return normalizedQuery;
}

function getResultYear(result: TmdbSearchResult) {
  const date = result.release_date || result.first_air_date;

  if (!date) {
    return null;
  }

  const year = new Date(date).getFullYear();
  return Number.isNaN(year) ? null : year;
}

function getGenreOptions() {
  return Object.entries(GENRE_MAP).sort(([, labelA], [, labelB]) =>
    labelA.localeCompare(labelB)
  );
}

function parseNumberParam(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function parseStringParam(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function parseTypeParam(value: unknown): SearchType {
  return value === "movie" || value === "tv" || value === "multi"
    ? value
    : "multi";
}
