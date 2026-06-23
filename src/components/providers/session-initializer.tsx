"use client";

import * as React from "react";
import { useAuthStore } from "@/store/use-app-store";
import { api } from "@/lib/api-client";
import type { UserDTO } from "@/lib/types";

/**
 * On mount, attempts to rehydrate the auth session from the httpOnly cookie.
 * Sets `bootstrapped: true` when done (success or failure).
 */
export function SessionInitializer({ children }: { children: React.ReactNode }) {
  const { setUser, setBootstrapped, user, bootstrapped } = useAuthStore();

  React.useEffect(() => {
    if (bootstrapped) return; // already done
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<{ user: UserDTO | null }>("/api/auth/me");
        if (!cancelled) setUser(res.user);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setBootstrapped(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [bootstrapped, setUser, setBootstrapped]);

  // If we already have a user from a previous login (persisted), mark bootstrapped
  React.useEffect(() => {
    if (user && !bootstrapped) {
      setBootstrapped(true);
    }
  }, [user, bootstrapped, setBootstrapped]);

  return <>{children}</>;
}
