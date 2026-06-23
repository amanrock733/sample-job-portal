// Shared API response types

export interface UserDTO {
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

export interface JobDTO {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  experience: string;
  jobType: string;
  description: string;
  requirements: string;
  status: "OPEN" | "CLOSED";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  author?: { id: string; name: string; email: string };
  _count?: { applications: number };
}

export interface ApplicationDTO {
  id: string;
  userId: string;
  jobId: string;
  status: "PENDING" | "REVIEWED" | "ACCEPTED" | "REJECTED";
  appliedAt: string;
  job?: Pick<
    JobDTO,
    "id" | "title" | "company" | "location" | "salary" | "jobType" | "experience" | "status"
  >;
  user?: Pick<UserDTO, "id" | "name" | "email" | "phone" | "skills" | "resumeUrl" | "profileImage">;
}

export const EXPERIENCE_OPTIONS = ["0-2", "2-4", "4-6", "6+"] as const;
export const JOB_TYPE_OPTIONS = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Remote",
] as const;
export const APPLICATION_STATUS_OPTIONS = [
  "PENDING",
  "REVIEWED",
  "ACCEPTED",
  "REJECTED",
] as const;

export const APPLICATION_STATUS_LABEL: Record<
  ApplicationDTO["status"],
  string
> = {
  PENDING: "Pending",
  REVIEWED: "Reviewed",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

export const APPLICATION_STATUS_COLOR: Record<
  ApplicationDTO["status"],
  string
> = {
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300 border-amber-200 dark:border-amber-500/30",
  REVIEWED: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300 border-sky-200 dark:border-sky-500/30",
  ACCEPTED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300 border-red-200 dark:border-red-500/30",
};
