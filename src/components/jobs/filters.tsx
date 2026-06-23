"use client";

import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { EXPERIENCE_OPTIONS, JOB_TYPE_OPTIONS } from "@/lib/types";
import { useFiltersStore } from "@/store/use-app-store";

export function Filters() {
  const {
    location,
    experience,
    jobType,
    setLocation,
    setExperience,
    setJobType,
    resetFilters,
  } = useFiltersStore();

  const hasFilters = location || experience || jobType;

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Filter className="h-4 w-4 text-primary" />
          Filters
        </h3>
        {hasFilters && (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs"
            onClick={resetFilters}
          >
            <RotateCcw className="mr-1 h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="filter-location" className="text-xs text-muted-foreground">
            Location
          </Label>
          <Input
            id="filter-location"
            placeholder="e.g. Bengaluru, Remote"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Experience</Label>
          <Select
            value={experience || "ALL"}
            onValueChange={(v) => setExperience(v === "ALL" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Any experience</SelectItem>
              {EXPERIENCE_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt} years
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Job type</Label>
          <Select
            value={jobType || "ALL"}
            onValueChange={(v) => setJobType(v === "ALL" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Any type</SelectItem>
              {JOB_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
