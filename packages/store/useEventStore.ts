import { create } from "zustand";

interface EventState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useEventStore = create<EventState>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
