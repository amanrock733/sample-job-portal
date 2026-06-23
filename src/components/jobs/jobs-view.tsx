"use client";

import * as React from "react";
import { useJobsQuery } from "@/hooks/use-jobs";
import { JobCard, JobCardSkeleton } from "@/components/jobs/job-card";
import { Filters } from "@/components/jobs/filters";
import { SearchBar } from "@/components/jobs/search-bar";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Briefcase, SearchX } from "lucide-react";
import { useFiltersStore } from "@/store/use-app-store";
import { toast } from "sonner";

export function JobsView() {
  const [page, setPage] = React.useState(1);
  const { search } = useFiltersStore();
  const { data, isLoading, isError, error, isFetching } = useJobsQuery(page, 6);

  // Reset to page 1 when filters change
  const { location, experience, jobType } = useFiltersStore();
  React.useEffect(() => {
    setPage(1);
  }, [search, location, experience, jobType]);

  React.useEffect(() => {
    if (isError) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load jobs"
      );
    }
  }, [isError, error]);

  const jobs = data?.jobs ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const isEmpty = !isLoading && jobs.length === 0;

  // Build pagination items
  const renderPaginationItems = () => {
    const items = [];
    const currentPage = page;
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={i === currentPage}
              onClick={() => setPage(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink isActive={1 === currentPage} onClick={() => setPage(1)}>
            1
          </PaginationLink>
        </PaginationItem>
      );

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <span className="px-3 text-muted-foreground">…</span>
          </PaginationItem>
        );
      }

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink isActive={i === currentPage} onClick={() => setPage(i)}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (end < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <span className="px-3 text-muted-foreground">…</span>
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={totalPages === currentPage}
            onClick={() => setPage(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Browse open roles
        </h1>
        <p className="text-sm text-muted-foreground">
          {pagination ? (
            <>
              Showing{" "}
              <span className="font-medium text-foreground">
                {(pagination.page - 1) * pagination.limit + (jobs.length ? 1 : 0)}
                -{(pagination.page - 1) * pagination.limit + jobs.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {pagination.total}
              </span>{" "}
              jobs
            </>
          ) : (
            "Loading jobs…"
          )}
        </p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <SearchBar />
      </div>

      <div className="mb-6">
        <Filters />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <SearchX className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No jobs found</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            Try adjusting your search terms or removing some filters to see more
            results.
          </p>
          <Button variant="outline" size="sm" onClick={() => setPage(1)}>
            <Briefcase className="mr-1.5 h-4 w-4" />
            Browse all jobs
          </Button>
        </div>
      ) : (
        <>
          <div
            className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-opacity ${
              isFetching ? "opacity-60" : ""
            }`}
          >
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      aria-disabled={page === 1}
                      className={page === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      aria-disabled={page === totalPages}
                      className={
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
