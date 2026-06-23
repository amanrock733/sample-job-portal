import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: string | Date | null | undefined,
  opts: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", opts).format(d);
}

export function relativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);

  if (sec < 60) return "just now";
  if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`;
  if (day < 7) return `${day}d ago`;
  return formatDate(d);
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function parseSkills(skills?: string | null): string[] {
  if (!skills) return [];
  return skills
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseRequirements(req?: string | null): string[] {
  if (!req) return [];
  return req
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}
