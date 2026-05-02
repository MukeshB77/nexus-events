import { create } from "zustand";

interface AuthState {
  user: { id: string; email: string; name: string } | null;
  isAuthenticated: boolean;
  setUser: (user: { id: string; email: string; name: string } | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
