"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ---- Types ----
export type View =
  | "home"
  | "jobs"
  | "job-details"
  | "login"
  | "register"
  | "profile"
  | "applied-jobs"
  | "admin-dashboard"
  | "admin-add-job"
  | "admin-edit-job"
  | "admin-applicants"
  | "admin-jobs";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "CANDIDATE" | "ADMIN";
  phone?: string | null;
  skills?: string | null;
  resumeUrl?: string | null;
  profileImage?: string | null;
  createdAt?: string;
}

interface AuthState {
  user: AuthUser | null;
  bootstrapped: boolean; // true once the initial /api/auth/me check has completed
  setUser: (user: AuthUser | null) => void;
  setBootstrapped: (b: boolean) => void;
  logout: () => void;
}

interface NavState {
  view: View;
  selectedJobId: string | null;
  // For admin "edit job" we need to pass the job being edited
  editingJobId: string | null;
  // For admin "view applicants" we may pass the jobId filter
  applicantsFilterJobId: string | null;
  setView: (view: View) => void;
  openJobDetails: (jobId: string) => void;
  openEditJob: (jobId: string) => void;
  openApplicants: (jobId?: string | null) => void;
  goHome: () => void;
}

interface FiltersState {
  search: string;
  location: string;
  experience: string;
  jobType: string;
  setSearch: (s: string) => void;
  setLocation: (s: string) => void;
  setExperience: (s: string) => void;
  setJobType: (s: string) => void;
  resetFilters: () => void;
}

// ---- Auth store ----
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      bootstrapped: false,
      setUser: (user) => set({ user }),
      setBootstrapped: (bootstrapped) => set({ bootstrapped }),
      logout: () => set({ user: null }),
    }),
    {
      name: "jp-auth",
      storage: createJSONStorage(() => localStorage),
      // Don't persist bootstrapped flag — should always start false on reload
      partialize: (state) => ({ user: state.user }),
    }
  )
);

// ---- Nav store (not persisted, route is session-scoped) ----
export const useNavStore = create<NavState>((set) => ({
  view: "home",
  selectedJobId: null,
  editingJobId: null,
  applicantsFilterJobId: null,
  setView: (view) => {
    set({ view });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
  openJobDetails: (jobId) =>
    set({ view: "job-details", selectedJobId: jobId }),
  openEditJob: (jobId) =>
    set({ view: "admin-edit-job", editingJobId: jobId }),
  openApplicants: (jobId) =>
    set({
      view: "admin-applicants",
      applicantsFilterJobId: jobId ?? null,
    }),
  goHome: () => set({ view: "home", selectedJobId: null }),
}));

// ---- Filters store ----
export const useFiltersStore = create<FiltersState>((set) => ({
  search: "",
  location: "",
  experience: "",
  jobType: "",
  setSearch: (search) => set({ search }),
  setLocation: (location) => set({ location }),
  setExperience: (experience) => set({ experience }),
  setJobType: (jobType) => set({ jobType }),
  resetFilters: () =>
    set({ search: "", location: "", experience: "", jobType: "" }),
}));
