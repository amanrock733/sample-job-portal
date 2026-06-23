"use client";

import * as React from "react";
import { useNavStore, useAuthStore } from "@/store/use-app-store";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HomeView } from "@/components/jobs/home-view";
import { JobsView } from "@/components/jobs/jobs-view";
import { JobDetailsView } from "@/components/jobs/job-details-view";
import { LoginView } from "@/components/auth/login-view";
import { RegisterView } from "@/components/auth/register-view";
import { ProfileView } from "@/components/profile/profile-view";
import { AppliedJobsView } from "@/components/profile/applied-jobs-view";
import { AdminDashboardView } from "@/components/admin/admin-dashboard-view";
import { AdminJobsView } from "@/components/admin/admin-jobs-view";
import { AdminApplicantsView } from "@/components/admin/admin-applicants-view";
import { JobForm } from "@/components/admin/job-form";
import { EditJobView } from "@/components/admin/edit-job-view";
import { ProtectedRoute } from "@/components/shared/protected-route";

export default function Home() {
  const { view } = useNavStore();
  const { user } = useAuthStore();

  // Keep document title in sync with the current view
  React.useEffect(() => {
    const titles: Record<string, string> = {
      home: "JobPortal — Find your next role",
      jobs: "Browse jobs · JobPortal",
      "job-details": "Job details · JobPortal",
      login: "Log in · JobPortal",
      register: "Sign up · JobPortal",
      profile: "Your profile · JobPortal",
      "applied-jobs": "Applied jobs · JobPortal",
      "admin-dashboard": "Admin dashboard · JobPortal",
      "admin-jobs": "Manage jobs · JobPortal",
      "admin-add-job": "Post a job · JobPortal",
      "admin-edit-job": "Edit job · JobPortal",
      "admin-applicants": "Applicants · JobPortal",
    };
    document.title = titles[view] ?? "JobPortal";
  }, [view]);

  const renderView = () => {
    switch (view) {
      case "home":
        return <HomeView />;
      case "jobs":
        return <JobsView />;
      case "job-details":
        return <JobDetailsView />;
      case "login":
        // If already logged in, redirect to home
        return user ? <HomeView /> : <LoginView />;
      case "register":
        return user ? <HomeView /> : <RegisterView />;
      case "profile":
        return (
          <ProtectedRoute role="CANDIDATE">
            <ProfileView />
          </ProtectedRoute>
        );
      case "applied-jobs":
        return (
          <ProtectedRoute role="CANDIDATE">
            <AppliedJobsView />
          </ProtectedRoute>
        );
      case "admin-dashboard":
        return (
          <ProtectedRoute role="ADMIN">
            <AdminDashboardView />
          </ProtectedRoute>
        );
      case "admin-jobs":
        return (
          <ProtectedRoute role="ADMIN">
            <AdminJobsView />
          </ProtectedRoute>
        );
      case "admin-add-job":
        return (
          <ProtectedRoute role="ADMIN">
            <JobForm mode="create" />
          </ProtectedRoute>
        );
      case "admin-edit-job":
        return (
          <ProtectedRoute role="ADMIN">
            <EditJobView />
          </ProtectedRoute>
        );
      case "admin-applicants":
        return (
          <ProtectedRoute role="ADMIN">
            <AdminApplicantsView />
          </ProtectedRoute>
        );
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">{renderView()}</main>
      <Footer />
    </div>
  );
}
