"use client";

import * as React from "react";
import { JobForm } from "@/components/admin/job-form";
import { useJobQuery } from "@/hooks/use-jobs";
import { useNavStore } from "@/store/use-app-store";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function EditJobView() {
  const { editingJobId, setView } = useNavStore();
  const { data, isLoading, isError } = useJobQuery(editingJobId);

  if (!editingJobId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-sm text-muted-foreground">
          No job selected for editing.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setView("admin-jobs")}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to jobs
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => setView("admin-jobs")}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to jobs
        </Button>
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !data?.job) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-sm text-destructive">Failed to load job for editing.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setView("admin-jobs")}
        >
          Back to jobs
        </Button>
      </div>
    );
  }

  return <JobForm mode="edit" initialJob={data.job} />;
}
