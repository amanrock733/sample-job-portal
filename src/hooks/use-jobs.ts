"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { JobDTO } from "@/lib/types";
import { useFiltersStore } from "@/store/use-app-store";

interface JobsResponse {
  jobs: (JobDTO & { _count?: { applications: number } })[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useJobsQuery(page: number, limit = 6, status = "OPEN") {
  const { search, location, experience, jobType } = useFiltersStore();

  // Build query string
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (location) params.set("location", location);
  if (experience) params.set("experience", experience);
  if (jobType) params.set("jobType", jobType);
  if (status) params.set("status", status);
  params.set("page", String(page));
  params.set("limit", String(limit));

  const qs = params.toString();
  const path = `/api/jobs${qs ? `?${qs}` : ""}`;

  return useQuery<JobsResponse>({
    queryKey: ["jobs", { search, location, experience, jobType, status, page, limit }],
    queryFn: () => api.get<JobsResponse>(path),
    placeholderData: (prev) => prev, // keep previous data while loading next page
  });
}

export function useJobQuery(jobId: string | null) {
  return useQuery<{ job: JobDTO & { _count?: { applications: number } } }>({
    queryKey: ["job", jobId],
    queryFn: () => api.get(`/api/jobs/${jobId}`),
    enabled: !!jobId,
  });
}

export function useMyApplicationsQuery(enabled = true) {
  return useQuery<{ applications: Array<import("@/lib/types").ApplicationDTO> }>({
    queryKey: ["my-applications"],
    queryFn: () => api.get("/api/applications/my"),
    enabled,
  });
}

export function useAdminStatsQuery(enabled = true) {
  return useQuery<{
    stats: {
      totalJobs: number;
      openJobs: number;
      totalApplications: number;
      totalCandidates: number;
    };
    recentJobs: (JobDTO & { _count?: { applications: number } })[];
    recentApplications: Array<import("@/lib/types").ApplicationDTO>;
  }>({
    queryKey: ["admin-stats"],
    queryFn: () => api.get("/api/admin/stats"),
    enabled,
  });
}

export function useAdminApplicantsQuery(enabled = true) {
  return useQuery<{
    applications: Array<import("@/lib/types").ApplicationDTO>;
  }>({
    queryKey: ["admin-applicants"],
    queryFn: () => api.get("/api/admin/applicants"),
    enabled,
  });
}

export function useAdminJobsQuery() {
  return useQuery<JobsResponse>({
    queryKey: ["admin-jobs"],
    queryFn: () => api.get<JobsResponse>("/api/jobs?status=ALL&limit=50"),
  });
}

export function useJobApplicantsQuery(jobId: string | null) {
  return useQuery<{
    job: JobDTO;
    applications: Array<import("@/lib/types").ApplicationDTO>;
  }>({
    queryKey: ["job-applicants", jobId],
    queryFn: () => api.get(`/api/applications/job/${jobId}`),
    enabled: !!jobId,
  });
}
