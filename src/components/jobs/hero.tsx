"use client";

import { ArrowRight, Search, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/jobs/search-bar";
import { useNavStore, useFiltersStore } from "@/store/use-app-store";

export function Hero() {
  const { setView } = useNavStore();
  const { setSearch } = useFiltersStore();

  const handleSearch = () => {
    setView("jobs");
  };

  const popularSearches = [
    "Frontend",
    "Backend",
    "Remote",
    "Full Stack",
    "DevOps",
  ];

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-20 -right-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="text-center">
          <Badge
            variant="secondary"
            className="mb-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
          >
            <Sparkles className="h-3 w-3 text-primary" />
            Over 1,000+ active opportunities
          </Badge>

          <h1 className="mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Find your next{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
              career move
            </span>{" "}
            today
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            Browse thousands of jobs from top companies. Apply in one click,
            track your applications, and land the role you deserve.
          </p>

          <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <SearchBar onSearch={handleSearch} />
            <Button size="lg" onClick={handleSearch} className="shrink-0">
              <Search className="mr-1.5 h-4 w-4" />
              Search Jobs
            </Button>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              Popular:
            </span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearch(term);
                  setView("jobs");
                }}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs transition-colors hover:border-primary hover:text-primary"
              >
                {term}
              </button>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView("register")}
            >
              Create free account
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("admin-dashboard")}
            >
              Are you hiring? →
            </Button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Active jobs", value: "1,200+" },
            { label: "Companies", value: "350+" },
            { label: "Hires made", value: "8,400+" },
            { label: "Success rate", value: "92%" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-card/60 p-4 text-center"
            >
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
