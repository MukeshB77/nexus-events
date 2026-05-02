import { create } from 'zustand'

interface AppState {
  sidebarOpen: boolean
  toggleSidebar: () => void
  activeFilter: 'all' | 'upcoming' | 'past'
  setActiveFilter: (filter: 'all' | 'upcoming' | 'past') => void
}

export const useStore = create<AppState>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  activeFilter: 'upcoming',
  setActiveFilter: (filter) => set({ activeFilter: filter }),
}))
