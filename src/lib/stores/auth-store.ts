import { create } from "zustand";
import { CREDENTIALS, USERS, type User } from "@/lib/mock-data";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async (email, password) => {
    set({ isLoading: true });
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));
    const cred = CREDENTIALS[email.toLowerCase()];
    if (!cred || cred.password !== password) {
      set({ isLoading: false });
      return { success: false, error: "Invalid email or password" };
    }
    const user = USERS.find((u) => u.id === cred.userId)!;
    set({ user, isAuthenticated: true, isLoading: false });
    return { success: true };
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));
