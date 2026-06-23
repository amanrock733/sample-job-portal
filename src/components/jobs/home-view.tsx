"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, Users, Shield, TrendingUp } from "lucide-react";
import { Hero } from "@/components/jobs/hero";
import { JobCard, JobCardSkeleton } from "@/components/jobs/job-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useJobsQuery } from "@/hooks/use-jobs";
import { useNavStore } from "@/store/use-app-store";

export function HomeView() {
  const { setView } = useNavStore();
  const { data, isLoading } = useJobsQuery(1, 6);

  const featured = data?.jobs ?? [];

  return (
    <div>
      <Hero />

      {/* Featured jobs */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Featured opportunities
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Hand-picked roles from companies hiring right now.
            </p>
          </div>
          <Button variant="outline" onClick={() => setView("jobs")}>
            View all jobs
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              How JobPortal works
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
              Three simple steps to land your next role — or hire your next
              great teammate.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                icon: Briefcase,
                title: "1. Discover jobs",
                desc: "Search thousands of open roles with smart filters for location, salary, experience, and job type.",
              },
              {
                icon: Users,
                title: "2. Apply in one click",
                desc: "Create a free account, upload your resume, and apply to any role with a single click.",
              },
              {
                icon: TrendingUp,
                title: "3. Track progress",
                desc: "See all your applications in one dashboard and track their status from pending to accepted.",
              },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <Card key={step.title} className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground sm:p-12">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Hiring for your team?
              </h2>
              <p className="mt-2 text-sm text-primary-foreground/80">
                Post jobs, manage applications, and find your next great hire —
                all from one admin dashboard.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setView("admin-dashboard")}
              >
                <Shield className="mr-1.5 h-4 w-4" />
                Admin dashboard
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                onClick={() => setView("login")}
              >
                Log in
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
