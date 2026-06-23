"use client";

import { Briefcase, MapPin, DollarSign, Clock, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { JobDTO } from "@/lib/types";
import { useNavStore } from "@/store/use-app-store";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: JobDTO;
}

export function JobCard({ job }: JobCardProps) {
  const { openJobDetails } = useNavStore();
  const closed = job.status === "CLOSED";

  return (
    <Card
      className={cn(
        "group relative flex flex-col gap-3 overflow-hidden p-5 transition-all hover:shadow-md hover:border-primary/40",
        closed && "opacity-75"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary text-base font-bold">
          {job.company.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {job.title}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground truncate">
            {job.company}
          </p>
        </div>
        {closed && (
          <Badge variant="secondary" className="shrink-0">
            Closed
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-primary/70" />
          <span className="truncate">{job.location}</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Briefcase className="h-3.5 w-3.5 text-primary/70" />
          {job.jobType}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-primary/70" />
          {job.experience} yrs
        </span>
        <span className="inline-flex items-center gap-1.5">
          <DollarSign className="h-3.5 w-3.5 text-primary/70" />
          <span className="truncate">{job.salary}</span>
        </span>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2">
        {job.description}
      </p>

      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          {job._count?.applications ?? 0} applicants
        </span>
        <Button
          size="sm"
          variant={closed ? "secondary" : "default"}
          onClick={() => openJobDetails(job.id)}
          disabled={closed}
        >
          {closed ? "Closed" : "View Details"}
        </Button>
      </div>
    </Card>
  );
}

export function JobCardSkeleton() {
  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 shrink-0 rounded-xl bg-muted animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
          <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-3 rounded bg-muted animate-pulse" />
        ))}
      </div>
      <div className="space-y-1.5">
        <div className="h-3 w-full rounded bg-muted animate-pulse" />
        <div className="h-3 w-5/6 rounded bg-muted animate-pulse" />
      </div>
      <div className="mt-auto flex justify-between pt-2">
        <div className="h-3 w-20 rounded bg-muted animate-pulse" />
        <div className="h-8 w-24 rounded bg-muted animate-pulse" />
      </div>
    </Card>
  );
}
