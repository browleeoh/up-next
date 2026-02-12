import { create } from "zustand";

interface UIState {
  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Filter state
  selectedGenres: number[];
  toggleGenre: (genreId: number) => void;
  clearGenres: () => void;

  // Sort state
  sortBy: "dateAdded" | "title" | "releaseYear" | "rating";
  sortOrder: "asc" | "desc";
  setSortBy: (sortBy: UIState["sortBy"]) => void;
  toggleSortOrder: () => void;

  // Modal state
  isAddModalOpen: boolean;
  setAddModalOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Search
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Filters
  selectedGenres: [],
  toggleGenre: (genreId) =>
    set((state) => ({
      selectedGenres: state.selectedGenres.includes(genreId)
        ? state.selectedGenres.filter((id) => id !== genreId)
        : [...state.selectedGenres, genreId],
    })),
  clearGenres: () => set({ selectedGenres: [] }),

  // Sort
  sortBy: "dateAdded",
  sortOrder: "desc",
  setSortBy: (sortBy) => set({ sortBy }),
  toggleSortOrder: () =>
    set((state) => ({ sortOrder: state.sortOrder === "asc" ? "desc" : "asc" })),

  // Modal
  isAddModalOpen: false,
  setAddModalOpen: (open) => set({ isAddModalOpen: open }),
}));
