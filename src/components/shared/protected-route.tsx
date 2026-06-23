"use client";

import * as React from "react";
import { useAuthStore, useNavStore, type View } from "@/store/use-app-store";
import { Skeleton } from "@/components/ui/skeleton";
import { Lock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Required role. Defaults to "CANDIDATE". */
  role?: "CANDIDATE" | "ADMIN";
  fallbackView?: View;
}

/**
 * Wraps protected views. Waits for the SessionInitializer to bootstrap,
 * then gates on auth state.
 */
export function ProtectedRoute({
  children,
  role = "CANDIDATE",
  fallbackView = "login",
}: ProtectedRouteProps) {
  const { user, bootstrapped } = useAuthStore();
  const { setView } = useNavStore();

  if (!bootstrapped) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Lock className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-semibold">Please log in to continue</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You need to be logged in to view this page.
        </p>
        <Button className="mt-4" onClick={() => setView(fallbackView)}>
          Go to login
        </Button>
      </div>
    );
  }

  if (role === "ADMIN" && user.role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-semibold">Admin access required</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You don&apos;t have permission to view this page. Only admin accounts
          can access the dashboard.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setView("home")}
        >
          Back to home
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
