"use client";

import * as React from "react";
import {
  FileText,
  Building2,
  MapPin,
  Clock,
  Briefcase,
  ArrowRight,
  SearchX,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyApplicationsQuery } from "@/hooks/use-jobs";
import { useNavStore } from "@/store/use-app-store";
import {
  APPLICATION_STATUS_COLOR,
  APPLICATION_STATUS_LABEL,
  type ApplicationDTO,
} from "@/lib/types";
import { relativeTime } from "@/lib/utils";

export function AppliedJobsView() {
  const { data, isLoading, isError } = useMyApplicationsQuery();
  const { openJobDetails, setView } = useNavStore();

  const applications = data?.applications ?? [];

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-sm text-destructive">
          Failed to load your applications. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Your applications
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track the status of every job you&apos;ve applied to.
        </p>
      </div>

      {/* Summary */}
      {!isLoading && applications.length > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"] as const).map(
            (status) => {
              const count = applications.filter(
                (a) => a.status === status
              ).length;
              return (
                <Card key={status} className="p-3">
                  <div className="text-xs text-muted-foreground">
                    {APPLICATION_STATUS_LABEL[status]}
                  </div>
                  <div className="mt-1 text-2xl font-bold">{count}</div>
                </Card>
              );
            }
          )}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 border-dashed py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <SearchX className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No applications yet</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            Start applying to jobs and they&apos;ll appear here so you can track
            their status.
          </p>
          <Button onClick={() => setView("jobs")}>
            <Briefcase className="mr-1.5 h-4 w-4" />
            Browse jobs
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <ApplicationRow
              key={app.id}
              app={app}
              onViewDetails={() => app.job && openJobDetails(app.job.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ApplicationRow({
  app,
  onViewDetails,
}: {
  app: ApplicationDTO;
  onViewDetails: () => void;
}) {
  return (
    <Card className="overflow-hidden p-4 transition-all hover:shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary text-base font-bold">
            {app.job?.company?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold leading-tight">
              {app.job?.title ?? "Job no longer available"}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {app.job?.company ?? "—"}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {app.job?.location ?? "—"}
              </span>
              <span className="inline-flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" />
                {app.job?.jobType ?? "—"}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Applied {relativeTime(app.appliedAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-2">
          <Badge
            className={`border ${APPLICATION_STATUS_COLOR[app.status]}`}
          >
            {APPLICATION_STATUS_LABEL[app.status]}
          </Badge>
          {app.job && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onViewDetails}
              className="text-xs"
            >
              View job
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
