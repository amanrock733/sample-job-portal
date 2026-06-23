"use client";

import * as React from "react";
import {
  Users,
  Search,
  Mail,
  Phone,
  FileText,
  Download,
  ArrowLeft,
  Briefcase,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useAdminApplicantsQuery } from "@/hooks/use-jobs";
import { useNavStore } from "@/store/use-app-store";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  APPLICATION_STATUS_COLOR,
  APPLICATION_STATUS_LABEL,
  APPLICATION_STATUS_OPTIONS,
  type ApplicationDTO,
} from "@/lib/types";
import { initials, parseSkills, relativeTime } from "@/lib/utils";

export function AdminApplicantsView() {
  const { data, isLoading, isError } = useAdminApplicantsQuery();
  const { applicantsFilterJobId, setView } = useNavStore();
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [jobFilter, setJobFilter] = React.useState<string>(
    applicantsFilterJobId ?? "ALL"
  );

  // Sync from nav store on mount
  React.useEffect(() => {
    if (applicantsFilterJobId) {
      setJobFilter(applicantsFilterJobId);
    }
  }, [applicantsFilterJobId]);

  const applications = data?.applications ?? [];

  // Build unique list of jobs for filter dropdown
  const jobOptions = React.useMemo(() => {
    const map = new Map<string, { id: string; title: string; company: string }>();
    applications.forEach((a) => {
      if (a.job && !map.has(a.job.id)) {
        map.set(a.job.id, {
          id: a.job.id,
          title: a.job.title,
          company: a.job.company,
        });
      }
    });
    return Array.from(map.values());
  }, [applications]);

  const filtered = React.useMemo(() => {
    let result = applications;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.user?.name?.toLowerCase().includes(q) ||
          a.user?.email?.toLowerCase().includes(q) ||
          a.job?.title?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "ALL") {
      result = result.filter((a) => a.status === statusFilter);
    }
    if (jobFilter !== "ALL") {
      result = result.filter((a) => a.job?.id === jobFilter);
    }
    return result;
  }, [applications, search, statusFilter, jobFilter]);

  const handleStatusChange = async (
    applicationId: string,
    newStatus: ApplicationDTO["status"]
  ) => {
    try {
      await api.patch(`/api/applications/${applicationId}`, {
        status: newStatus,
      });
      toast.success(`Status updated to ${APPLICATION_STATUS_LABEL[newStatus]}`);
      queryClient.invalidateQueries({ queryKey: ["admin-applicants"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update status");
    }
  };

  if (isError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center">
        <p className="text-sm text-destructive">
          Failed to load applicants.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Applicants
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View all applications and update their status.
          </p>
        </div>
        <Button variant="outline" onClick={() => setView("admin-jobs")}>
          <Briefcase className="mr-1.5 h-4 w-4" />
          Manage jobs
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4 text-primary" />
            All applications
          </CardTitle>
          <CardDescription>
            {applications.length} total application
            {applications.length === 1 ? "" : "s"}
            {filtered.length !== applications.length && (
              <span className="ml-1">· {filtered.length} matching filters</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or role…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={jobFilter}
              onValueChange={(v) => setJobFilter(v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All jobs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All jobs</SelectItem>
                {jobOptions.map((j) => (
                  <SelectItem key={j.id} value={j.id}>
                    {j.title} — {j.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                {APPLICATION_STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {APPLICATION_STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No applications found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Candidate</TableHead>
                    <TableHead className="min-w-[180px]">Applied for</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Resume</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((app) => {
                    const skills = parseSkills(app.user?.skills).slice(0, 3);
                    const extraSkills = Math.max(
                      0,
                      parseSkills(app.user?.skills).length - 3
                    );
                    return (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-muted text-xs">
                                {initials(app.user?.name ?? "?")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {app.user?.name}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {app.user?.email}
                              </p>
                              {app.user?.phone && (
                                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Phone className="h-3 w-3" />
                                  {app.user.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">{app.job?.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {app.job?.company} · {app.job?.location}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {skills.map((s, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-[10px]"
                              >
                                {s}
                              </Badge>
                            ))}
                            {extraSkills > 0 && (
                              <Badge
                                variant="outline"
                                className="text-[10px]"
                              >
                                +{extraSkills}
                              </Badge>
                            )}
                            {skills.length === 0 && (
                              <span className="text-xs text-muted-foreground">
                                —
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {app.user?.resumeUrl ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="h-8 gap-1.5 px-2 text-xs"
                            >
                              <a
                                href={app.user.resumeUrl}
                                download={`${app.user?.name ?? "resume"}-resume`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Download className="h-3 w-3" />
                                Resume
                              </a>
                            </Button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <FileText className="h-3 w-3" />
                              Not provided
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {relativeTime(app.appliedAt)}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={app.status}
                            onValueChange={(v) =>
                              handleStatusChange(
                                app.id,
                                v as ApplicationDTO["status"]
                              )
                            }
                          >
                            <SelectTrigger className="h-8 w-[130px] text-xs">
                              <SelectValue>
                                <Badge
                                  className={`border text-[10px] ${APPLICATION_STATUS_COLOR[app.status]}`}
                                >
                                  {APPLICATION_STATUS_LABEL[app.status]}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {APPLICATION_STATUS_OPTIONS.map((s) => (
                                <SelectItem key={s} value={s} className="text-xs">
                                  {APPLICATION_STATUS_LABEL[s]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
