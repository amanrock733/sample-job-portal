"use client";

import * as React from "react";
import {
  User as UserIcon,
  Phone,
  FileText,
  Upload,
  Save,
  Briefcase,
  Shield,
} from "lucide-react";
import { useForm } from "react-hook-form";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore, useNavStore } from "@/store/use-app-store";
import { api } from "@/lib/api-client";
import { cn, initials, parseSkills } from "@/lib/utils";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { UserDTO } from "@/lib/types";

interface ProfileForm {
  name: string;
  phone: string;
  skills: string;
  resumeUrl: string;
}

export function ProfileView() {
  const { user, setUser } = useAuthStore();
  const { setView } = useNavStore();
  const queryClient = useQueryClient();
  const [uploadingResume, setUploadingResume] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      skills: user?.skills ?? "",
      resumeUrl: user?.resumeUrl ?? "",
    },
  });

  // Reset form when user prop changes (e.g. after login)
  React.useEffect(() => {
    reset({
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      skills: user?.skills ?? "",
      resumeUrl: user?.resumeUrl ?? "",
    });
  }, [user, reset]);

  if (!user) {
    return null;
  }

  const skillsValue = watch("skills");
  const parsedSkills = parseSkills(skillsValue);

  const onSubmit = async (values: ProfileForm) => {
    try {
      const res = await api.put<{ user: UserDTO; message: string }>(
        "/api/profile",
        values
      );
      setUser(res.user);
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      toast.success("Profile updated successfully");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update profile");
    }
  };

  const handleResumeUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type & size
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) {
      toast.error("Please upload a PDF or Word document");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5 MB");
      return;
    }

    setUploadingResume(true);
    try {
      // Simulate Cloudinary upload — in production this would hit
      // /api/upload -> Cloudinary and return a hosted URL.
      // For this sandbox, we store a data URL representation in the DB
      // so the user can later download it.
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });

      const res = await api.put<{ user: UserDTO; message: string }>(
        "/api/profile",
        { resumeUrl: dataUrl }
      );
      setUser(res.user);
      reset((prev) => ({ ...prev, resumeUrl: dataUrl }));
      toast.success(`Resume "${file.name}" uploaded`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploadingResume(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Your profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep your profile up to date so employers can find you.
        </p>
      </div>

      {/* Profile header */}
      <Card className="mb-6 p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback
                className={cn(
                  "text-lg",
                  user.role === "ADMIN"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                {initials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <Badge
                  variant={user.role === "ADMIN" ? "default" : "secondary"}
                  className="text-[10px] uppercase tracking-wide"
                >
                  {user.role === "ADMIN" ? (
                    <>
                      <Shield className="mr-1 h-3 w-3" />
                      Admin
                    </>
                  ) : (
                    "Candidate"
                  )}
                </Badge>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {user.email}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Member since{" "}
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Edit form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary" />
              Edit details
            </CardTitle>
            <CardDescription>
              Update your contact information and skills.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  {...register("name", {
                    required: "Name is required",
                    minLength: { value: 2, message: "Name is too short" },
                  })}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="bg-muted/40"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="+91 9876543210"
                    className="pl-9"
                    {...register("phone")}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="skills">Skills</Label>
                <Textarea
                  id="skills"
                  placeholder="Comma-separated, e.g. React, TypeScript, Node.js"
                  rows={3}
                  {...register("skills")}
                />
                {parsedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {parsedSkills.map((s, i) => (
                      <Badge
                        key={`${s}-${i}`}
                        variant="secondary"
                        className="text-xs"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting || !isDirty}>
                <Save className="mr-1.5 h-4 w-4" />
                {isSubmitting ? "Saving…" : "Save changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Resume upload + sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Resume
              </CardTitle>
              <CardDescription>
                Upload your resume (PDF/DOC, max 5MB).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleResumeUpload}
              />
              {user.resumeUrl ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded bg-primary/10 text-primary">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        Resume on file
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded successfully
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingResume}
                    >
                      <Upload className="mr-1.5 h-3.5 w-3.5" />
                      Replace
                    </Button>
                    {user.resumeUrl.startsWith("data:") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <a
                          href={user.resumeUrl}
                          download="my-resume"
                          className="inline-flex items-center justify-center"
                        >
                          Download
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-dashed"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingResume}
                >
                  <Upload className="mr-1.5 h-4 w-4" />
                  {uploadingResume ? "Uploading…" : "Upload resume"}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Quick actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setView("applied-jobs")}
              >
                <FileText className="mr-1.5 h-3.5 w-3.5" />
                View applied jobs
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setView("jobs")}
              >
                <Briefcase className="mr-1.5 h-3.5 w-3.5" />
                Browse more jobs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
