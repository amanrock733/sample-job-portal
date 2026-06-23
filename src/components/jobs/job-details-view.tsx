"use client";

import * as React from "react";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Clock,
  DollarSign,
  MapPin,
  Users,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useJobQuery, useMyApplicationsQuery } from "@/hooks/use-jobs";
import { useNavStore, useAuthStore } from "@/store/use-app-store";
import { api } from "@/lib/api-client";
import { parseRequirements, relativeTime } from "@/lib/utils";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export function JobDetailsView() {
  const { selectedJobId, setView } = useNavStore();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useJobQuery(selectedJobId);
  const { data: myApps } = useMyApplicationsQuery(!!user);

  const [applying, setApplying] = React.useState(false);

  const job = data?.job;
  const alreadyApplied =
    !!user && !!myApps?.applications.some((a) => a.jobId === selectedJobId);
  const isClosed = job?.status === "CLOSED";

  React.useEffect(() => {
    if (isError) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load job"
      );
    }
  }, [isError, error]);

  const handleApply = async () => {
    if (!user) {
      toast.info("Please log in to apply");
      setView("login");
      return;
    }
    if (user.role !== "CANDIDATE") {
      toast.error("Only candidate accounts can apply for jobs");
      return;
    }
    if (!selectedJobId) return;

    setApplying(true);
    try {
      await api.post("/api/applications", { jobId: selectedJobId });
      toast.success("Application submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      queryClient.invalidateQueries({ queryKey: ["job", selectedJobId] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => setView("jobs")}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to jobs
        </Button>
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="text-xl font-semibold">Job not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This job may have been removed or is no longer available.
        </p>
        <Button className="mt-4" onClick={() => setView("jobs")}>
          Back to jobs
        </Button>
      </div>
    );
  }

  const requirements = parseRequirements(job.requirements);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={() => setView("jobs")}
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Back to jobs
      </Button>

      <Card className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary text-2xl font-bold">
              {job.company.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {job.title}
              </h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {job.company}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Posted {relativeTime(job.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <Badge
            variant={isClosed ? "secondary" : "default"}
            className="shrink-0"
          >
            {isClosed ? "Closed" : "Open"}
          </Badge>
        </div>

        {/* Meta grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetaTile
            icon={<DollarSign className="h-4 w-4" />}
            label="Salary"
            value={job.salary}
          />
          <MetaTile
            icon={<Briefcase className="h-4 w-4" />}
            label="Job type"
            value={job.jobType}
          />
          <MetaTile
            icon={<Clock className="h-4 w-4" />}
            label="Experience"
            value={`${job.experience} years`}
          />
          <MetaTile
            icon={<Users className="h-4 w-4" />}
            label="Applicants"
            value={String(job._count?.applications ?? 0)}
          />
        </div>

        <Separator className="my-6" />

        {/* Description */}
        <section>
          <h2 className="text-lg font-semibold">Job description</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {job.description}
          </p>
        </section>

        {/* Requirements */}
        {requirements.length > 0 && (
          <section className="mt-6">
            <h2 className="text-lg font-semibold">Requirements</h2>
            <ul className="mt-3 space-y-2">
              {requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span className="text-muted-foreground">{req}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Separator className="my-6" />

        {/* Apply CTA */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            {alreadyApplied ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                You have already applied for this role
              </span>
            ) : isClosed ? (
              <span>This job is no longer accepting applications.</span>
            ) : !user ? (
              <span>Log in or sign up to apply for this role.</span>
            ) : user.role === "ADMIN" ? (
              <span>Admin accounts cannot apply for jobs.</span>
            ) : (
              <span>Ready to take the next step in your career?</span>
            )}
          </div>

          {alreadyApplied ? (
            <Button
              variant="outline"
              onClick={() => setView("applied-jobs")}
              disabled={applying}
            >
              <FileText className="mr-1.5 h-4 w-4" />
              View my applications
            </Button>
          ) : !user ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setView("login")}>
                Log in
              </Button>
              <Button onClick={() => setView("register")}>Sign up to apply</Button>
            </div>
          ) : isClosed || user.role === "ADMIN" ? (
            <Button disabled>Cannot apply</Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={applying}>
                  {applying ? "Submitting…" : "Apply now"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm application</AlertDialogTitle>
                  <AlertDialogDescription>
                    You are about to apply for <strong>{job.title}</strong> at{" "}
                    <strong>{job.company}</strong>. You can only apply once per
                    job. Continue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleApply}
                    disabled={applying}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {applying ? "Submitting…" : "Yes, apply"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </Card>
    </div>
  );
}

function MetaTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
