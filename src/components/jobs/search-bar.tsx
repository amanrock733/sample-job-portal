"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFiltersStore } from "@/store/use-app-store";

interface SearchBarProps {
  onSearch?: () => void;
  autoFocus?: boolean;
}

export function SearchBar({ onSearch, autoFocus }: SearchBarProps) {
  const { search, setSearch } = useFiltersStore();

  return (
    <div className="relative flex w-full items-center">
      <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search by job title, company, or keyword…"
        value={search}
        autoFocus={autoFocus}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearch?.();
        }}
        className="pl-9 pr-9"
      />
      {search && (
        <button
          aria-label="Clear search"
          onClick={() => {
            setSearch("");
            onSearch?.();
          }}
          className="absolute right-2 flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function SearchButtonRow({ onSearch }: { onSearch: () => void }) {
  return (
    <Button size="sm" onClick={onSearch} className="shrink-0">
      <Search className="mr-1.5 h-4 w-4" />
      Search
    </Button>
  );
}
