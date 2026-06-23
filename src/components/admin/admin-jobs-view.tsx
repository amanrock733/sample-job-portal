"use client";

import * as React from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Users,
  Search,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAdminJobsQuery } from "@/hooks/use-jobs";
import { useNavStore } from "@/store/use-app-store";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { JobDTO } from "@/lib/types";
import { relativeTime } from "@/lib/utils";

export function AdminJobsView() {
  const { data, isLoading, isError } = useAdminJobsQuery();
  const { setView, openEditJob, openApplicants, openJobDetails } = useNavStore();
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState("");

  const jobs = data?.jobs ?? [];

  const filtered = React.useMemo(() => {
    if (!search) return jobs;
    const q = search.toLowerCase();
    return jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q)
    );
  }, [jobs, search]);

  const handleDelete = async (job: JobDTO) => {
    try {
      await api.delete(`/api/jobs/${job.id}`);
      toast.success(`"${job.title}" deleted`);
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete job");
    }
  };

  const handleToggleStatus = async (job: JobDTO) => {
    const newStatus = job.status === "OPEN" ? "CLOSED" : "OPEN";
    try {
      await api.put(`/api/jobs/${job.id}`, { status: newStatus });
      toast.success(
        `Job is now ${newStatus === "OPEN" ? "open" : "closed"}`
      );
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update job");
    }
  };

  if (isError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center">
        <p className="text-sm text-destructive">Failed to load jobs.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Manage jobs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit, delete, or change the status of job listings.
          </p>
        </div>
        <Button onClick={() => setView("admin-add-job")}>
          <Plus className="mr-1.5 h-4 w-4" />
          Post a job
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Briefcase className="h-4 w-4 text-primary" />
            All jobs
          </CardTitle>
          <CardDescription>
            {jobs.length} job{jobs.length === 1 ? "" : "s"} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title, company, or location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {search
                ? "No jobs match your search."
                : "No jobs posted yet. Click \"Post a job\" to create your first listing."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Title</TableHead>
                    <TableHead className="min-w-[120px]">Company</TableHead>
                    <TableHead className="min-w-[120px]">Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-center">Apps</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">
                        <button
                          onClick={() => openJobDetails(job.id)}
                          className="text-left hover:text-primary hover:underline"
                        >
                          {job.title}
                        </button>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {job.company}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {job.location}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {job.jobType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {job._count?.applications ?? 0}
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleToggleStatus(job)}
                          className="inline-flex items-center"
                          title="Toggle status"
                        >
                          <Badge
                            variant={
                              job.status === "OPEN" ? "default" : "secondary"
                            }
                            className="cursor-pointer text-xs"
                          >
                            {job.status === "OPEN" ? "Open" : "Closed"}
                          </Badge>
                        </button>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {relativeTime(job.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openJobDetails(job.id)}
                            >
                              <Eye className="mr-2 h-3.5 w-3.5" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openApplicants(job.id)}
                            >
                              <Users className="mr-2 h-3.5 w-3.5" />
                              Applicants
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openEditJob(job.id)}
                            >
                              <Pencil className="mr-2 h-3.5 w-3.5" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete this job?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete{" "}
                                    <strong>{job.title}</strong> at{" "}
                                    <strong>{job.company}</strong> and all{" "}
                                    {job._count?.applications ?? 0} associated
                                    applications. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(job)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete job
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
