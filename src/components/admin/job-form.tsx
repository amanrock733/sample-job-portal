"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Save,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavStore } from "@/store/use-app-store";
import { api } from "@/lib/api-client";
import { EXPERIENCE_OPTIONS, JOB_TYPE_OPTIONS, type JobDTO } from "@/lib/types";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface JobFormValues {
  title: string;
  company: string;
  location: string;
  salary: string;
  experience: string;
  jobType: string;
  description: string;
  requirements: string;
  status: "OPEN" | "CLOSED";
}

interface JobFormProps {
  mode: "create" | "edit";
  initialJob?: JobDTO;
}

export function JobForm({ mode, initialJob }: JobFormProps) {
  const { setView, editingJobId } = useNavStore();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<JobFormValues>({
    defaultValues: initialJob
      ? {
          title: initialJob.title,
          company: initialJob.company,
          location: initialJob.location,
          salary: initialJob.salary,
          experience: initialJob.experience,
          jobType: initialJob.jobType,
          description: initialJob.description,
          requirements: initialJob.requirements,
          status: initialJob.status as "OPEN" | "CLOSED",
        }
      : {
          title: "",
          company: "",
          location: "",
          salary: "",
          experience: "0-2",
          jobType: "Full-time",
          description: "",
          requirements: "",
          status: "OPEN",
        },
  });

  const experience = watch("experience");
  const jobType = watch("jobType");
  const status = watch("status");

  const onSubmit = async (values: JobFormValues) => {
    setServerError(null);
    try {
      if (mode === "create") {
        const res = await api.post<{ job: JobDTO; message: string }>(
          "/api/jobs",
          values
        );
        toast.success("Job posted successfully");
        queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
        queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        setView("admin-jobs");
      } else {
        if (!editingJobId) {
          toast.error("Missing job ID for edit");
          return;
        }
        const res = await api.put<{ job: JobDTO; message: string }>(
          `/api/jobs/${editingJobId}`,
          values
        );
        toast.success("Job updated successfully");
        queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
        queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        queryClient.invalidateQueries({ queryKey: ["job", editingJobId] });
        setView("admin-jobs");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to save job";
      setServerError(msg);
      toast.error(msg);
    }
  };

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

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {mode === "create" ? "Post a new job" : "Edit job"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "create"
            ? "Fill in the details below to publish a new job listing."
            : "Update the details of this job listing."}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Job details
          </CardTitle>
          <CardDescription>
            All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="title">
                Job title <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="title"
                  placeholder="e.g. Senior Frontend Engineer"
                  className="pl-9"
                  {...register("title", {
                    required: "Job title is required",
                    minLength: { value: 3, message: "Title is too short" },
                  })}
                />
              </div>
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="company">
                  Company <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="company"
                    placeholder="e.g. Acme Inc"
                    className="pl-9"
                    {...register("company", {
                      required: "Company is required",
                    })}
                  />
                </div>
                {errors.company && (
                  <p className="text-xs text-destructive">
                    {errors.company.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="location">
                  Location <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="e.g. Bengaluru, India"
                    className="pl-9"
                    {...register("location", {
                      required: "Location is required",
                    })}
                  />
                </div>
                {errors.location && (
                  <p className="text-xs text-destructive">
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="salary">Salary</Label>
                <div className="relative">
                  <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="salary"
                    placeholder="₹20 - 30 LPA"
                    className="pl-9"
                    {...register("salary")}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Experience</Label>
                <Select
                  value={experience}
                  onValueChange={(v) => setValue("experience", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt} years
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Job type</Label>
                <Select
                  value={jobType}
                  onValueChange={(v) => setValue("jobType", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the role, responsibilities, and what makes this opportunity exciting…"
                rows={6}
                {...register("description", {
                  required: "Description is required",
                  minLength: { value: 20, message: "Description is too short" },
                })}
              />
              {errors.description && (
                <p className="text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="Comma or newline separated, e.g. React, TypeScript, 4+ years experience"
                rows={4}
                {...register("requirements")}
              />
              <p className="text-xs text-muted-foreground">
                Separate each requirement with a comma or new line.
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <Label htmlFor="status-toggle" className="text-sm font-medium">
                    Job status
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {status === "OPEN"
                      ? "Accepting applications"
                      : "Closed — no new applications"}
                  </p>
                </div>
              </div>
              <Switch
                id="status-toggle"
                checked={status === "OPEN"}
                onCheckedChange={(checked) =>
                  setValue("status", checked ? "OPEN" : "CLOSED")
                }
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setView("admin-jobs")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-1.5 h-4 w-4" />
                {isSubmitting
                  ? "Saving…"
                  : mode === "create"
                  ? "Publish job"
                  : "Save changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
