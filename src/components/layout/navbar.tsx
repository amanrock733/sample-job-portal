"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Briefcase,
  LogOut,
  User as UserIcon,
  Shield,
  Sun,
  Moon,
  Menu,
  X,
  FileText,
  LayoutDashboard,
  Plus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuLabel as DMLabel,
} from "@/components/ui/dropdown-menu";
import { useAuthStore, useNavStore, type View } from "@/store/use-app-store";
import { api } from "@/lib/api-client";
import { initials } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  view: View;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", view: "home", icon: Briefcase },
  { label: "Browse Jobs", view: "jobs", icon: Briefcase },
];

const CANDIDATE_ITEMS: NavItem[] = [
  { label: "Applied Jobs", view: "applied-jobs", icon: FileText },
  { label: "Profile", view: "profile", icon: UserIcon },
];

const ADMIN_ITEMS: NavItem[] = [
  { label: "Dashboard", view: "admin-dashboard", icon: LayoutDashboard },
  { label: "Jobs", view: "admin-jobs", icon: Briefcase },
  { label: "Add Job", view: "admin-add-job", icon: Plus },
  { label: "Applicants", view: "admin-applicants", icon: Users },
];

export function Navbar() {
  const { user, logout } = useAuthStore();
  const { view, setView } = useNavStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      /* ignore */
    }
    logout();
    setView("home");
    toast.success("Logged out");
  };

  const navItems = [
    ...NAV_ITEMS,
    ...(user?.role === "CANDIDATE" ? CANDIDATE_ITEMS : []),
    ...(user?.role === "ADMIN" ? ADMIN_ITEMS : []),
  ];

  const handleNav = (v: View) => {
    setView(v);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => handleNav("home")}
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
          aria-label="JobPortal home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Briefcase className="h-5 w-5" />
          </span>
          <span className="hidden sm:inline">JobPortal</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = view === item.view;
            return (
              <button
                key={item.view}
                onClick={() => handleNav(item.view)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-muted">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback
                      className={cn(
                        user.role === "ADMIN"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      )}
                    >
                      {initials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm font-medium">
                    {user.name.split(" ")[0]}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DMLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <span
                      className={cn(
                        "mt-1 inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        user.role === "ADMIN"
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {user.role === "ADMIN" ? (
                        <>
                          <Shield className="mr-1 h-3 w-3" /> Admin
                        </>
                      ) : (
                        "Candidate"
                      )}
                    </span>
                  </div>
                </DMLabel>
                <DropdownMenuSeparator />
                {user.role === "CANDIDATE" && (
                  <>
                    <DropdownMenuItem onClick={() => handleNav("profile")}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNav("applied-jobs")}>
                      <FileText className="mr-2 h-4 w-4" />
                      Applied Jobs
                    </DropdownMenuItem>
                  </>
                )}
                {user.role === "ADMIN" && (
                  <>
                    <DropdownMenuItem onClick={() => handleNav("admin-dashboard")}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNav("admin-jobs")}>
                      <Briefcase className="mr-2 h-4 w-4" />
                      Manage Jobs
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNav("admin-applicants")}>
                      <Users className="mr-2 h-4 w-4" />
                      Applicants
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNav("login")}
              >
                Log in
              </Button>
              <Button size="sm" onClick={() => handleNav("register")}>
                Sign up
              </Button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = view === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNav(item.view)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
            {!user && (
              <div className="mt-2 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleNav("login")}
                >
                  Log in
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => handleNav("register")}
                >
                  Sign up
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
