"use client";

import * as React from "react";
import {
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminStatsQuery } from "@/hooks/use-jobs";
import { useNavStore } from "@/store/use-app-store";
import {
  APPLICATION_STATUS_COLOR,
  APPLICATION_STATUS_LABEL,
} from "@/lib/types";
import { relativeTime } from "@/lib/utils";

export function AdminDashboardView() {
  const { data, isLoading, isError } = useAdminStatsQuery();
  const { setView, openApplicants, openJobDetails } = useNavStore();

  if (isError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center">
        <p className="text-sm text-destructive">Failed to load dashboard data.</p>
      </div>
    );
  }

  const stats = data?.stats;
  const recentJobs = data?.recentJobs ?? [];
  const recentApplications = data?.recentApplications ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Admin dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage jobs, monitor applications, and find your next great hire.
          </p>
        </div>
        <Button onClick={() => setView("admin-add-job")}>
          <Plus className="mr-1.5 h-4 w-4" />
          Post a job
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Briefcase}
          label="Total jobs"
          value={stats?.totalJobs}
          loading={isLoading}
          color="bg-primary/10 text-primary"
        />
        <StatCard
          icon={TrendingUp}
          label="Open jobs"
          value={stats?.openJobs}
          loading={isLoading}
          color="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          icon={FileText}
          label="Applications"
          value={stats?.totalApplications}
          loading={isLoading}
          color="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />
        <StatCard
          icon={Users}
          label="Candidates"
          value={stats?.totalCandidates}
          loading={isLoading}
          color="bg-sky-500/10 text-sky-600 dark:text-sky-400"
        />
      </div>

      {/* Recent jobs + applications */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent jobs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Briefcase className="h-4 w-4 text-primary" />
                Recent jobs
              </CardTitle>
              <CardDescription>Latest jobs you&apos;ve posted</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("admin-jobs")}
            >
              View all
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentJobs.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No jobs posted yet.
              </p>
            ) : (
              <div className="space-y-2">
                {recentJobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => openJobDetails(job.id)}
                    className="flex w-full items-center justify-between gap-2 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{job.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {job.company} · {job.location}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {job._count?.applications ?? 0} apps
                      </Badge>
                      <Badge
                        variant={job.status === "OPEN" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {job.status === "OPEN" ? "Open" : "Closed"}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-primary" />
                Recent applications
              </CardTitle>
              <CardDescription>Latest candidate activity</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openApplicants()}
            >
              View all
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentApplications.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No applications yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Candidate</TableHead>
                    <TableHead className="text-xs">Role</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs text-right">When</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentApplications.map((app) => (
                    <TableRow
                      key={app.id}
                      className="cursor-pointer"
                      onClick={() => openApplicants(app.job?.id)}
                    >
                      <TableCell className="text-xs font-medium">
                        {app.user?.name ?? "—"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {app.job?.title ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`border text-[10px] ${APPLICATION_STATUS_COLOR[app.status]}`}
                        >
                          {APPLICATION_STATUS_LABEL[app.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {relativeTime(app.appliedAt)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  loading,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: number;
  loading?: boolean;
  color: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3">
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-3xl font-bold tracking-tight">{value ?? 0}</div>
        )}
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </div>
    </Card>
  );
}
