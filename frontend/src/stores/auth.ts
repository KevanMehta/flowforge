"use client";
import { create } from "zustand";

type AuthState = {
  token: string | null;
  role: string;
  setAuth: (token: string, role: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("flowforge_token") : null,
  role: typeof window !== "undefined" ? localStorage.getItem("flowforge_role") || "viewer" : "viewer",
  setAuth: (token, role) => {
    localStorage.setItem("flowforge_token", token);
    localStorage.setItem("flowforge_role", role);
    set({ token, role });
  },
  logout: () => {
    localStorage.removeItem("flowforge_token");
    localStorage.removeItem("flowforge_role");
    set({ token: null, role: "viewer" });
  }
}));
