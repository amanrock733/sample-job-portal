"use client";

import * as React from "react";
import { Eye, EyeOff, Lock, Mail, Briefcase, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthStore, useNavStore } from "@/store/use-app-store";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import type { UserDTO } from "@/lib/types";

interface LoginForm {
  email: string;
  password: string;
}

export function LoginView() {
  const { setUser } = useAuthStore();
  const { setView } = useNavStore();
  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit = async (values: LoginForm) => {
    setServerError(null);
    try {
      const res = await api.post<{ user: UserDTO; message: string }>(
        "/api/auth/login",
        {
          email: values.email,
          password: values.password,
        }
      );
      setUser(res.user);
      toast.success(`Welcome back, ${res.user.name.split(" ")[0]}!`);
      // Redirect based on role
      if (res.user.role === "ADMIN") {
        setView("admin-dashboard");
      } else {
        setView("home");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Login failed";
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-12 sm:py-16">
      <Card className="w-full">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Briefcase className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Log in to track applications and manage your profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <Alert variant="destructive">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="pl-9"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-primary"
                  onClick={() => toast.info("Reset flow coming soon")}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="px-9"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in…" : "Log in"}
              {!isSubmitting && <ArrowRight className="ml-1.5 h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-border bg-muted/30 p-3 text-xs">
            <p className="font-medium text-foreground">Demo accounts</p>
            <p className="mt-1 text-muted-foreground">
              <strong>Admin:</strong> admin@jobportal.com / admin1234
            </p>
            <p className="text-muted-foreground">
              <strong>Candidate:</strong> aarav@example.com / password1234
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => setView("register")}
              className="font-medium text-primary hover:underline"
            >
              Sign up for free
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
