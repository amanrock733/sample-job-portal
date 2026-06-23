"use client";

import { Briefcase, Github, Linkedin, Twitter } from "lucide-react";
import { useNavStore } from "@/store/use-app-store";

export function Footer() {
  const { setView } = useNavStore();

  return (
    <footer className="mt-auto border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-bold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Briefcase className="h-4 w-4" />
              </span>
              JobPortal
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              A modern job portal built with Next.js, Prisma, JWT auth, and
              dark mode. Find your next opportunity or hire the right talent.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">For Candidates</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button
                  className="hover:text-foreground transition-colors"
                  onClick={() => setView("jobs")}
                >
                  Browse jobs
                </button>
              </li>
              <li>
                <button
                  className="hover:text-foreground transition-colors"
                  onClick={() => setView("register")}
                >
                  Create account
                </button>
              </li>
              <li>
                <button
                  className="hover:text-foreground transition-colors"
                  onClick={() => setView("applied-jobs")}
                >
                  Applied jobs
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">For Employers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button
                  className="hover:text-foreground transition-colors"
                  onClick={() => setView("admin-dashboard")}
                >
                  Admin dashboard
                </button>
              </li>
              <li>
                <button
                  className="hover:text-foreground transition-colors"
                  onClick={() => setView("admin-add-job")}
                >
                  Post a job
                </button>
              </li>
              <li>
                <button
                  className="hover:text-foreground transition-colors"
                  onClick={() => setView("admin-applicants")}
                >
                  View applicants
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Connect</h3>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} JobPortal. All rights reserved.</p>
          <p>Built with Next.js, Prisma, and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
