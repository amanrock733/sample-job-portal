import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/admin/stats — dashboard stat cards
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please log in to continue" },
        { status: 401 }
      );
    }
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can view dashboard stats" },
        { status: 403 }
      );
    }

    const [totalJobs, openJobs, totalApplications, totalCandidates, recentJobs] =
      await Promise.all([
        db.job.count(),
        db.job.count({ where: { status: "OPEN" } }),
        db.application.count(),
        db.user.count({ where: { role: "CANDIDATE" } }),
        db.job.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            _count: { select: { applications: true } },
          },
        }),
      ]);

    // Recent applications with job + user info
    const recentApplications = await db.application.findMany({
      take: 8,
      orderBy: { appliedAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        job: {
          select: { id: true, title: true, company: true },
        },
      },
    });

    return NextResponse.json({
      stats: {
        totalJobs,
        openJobs,
        totalApplications,
        totalCandidates,
      },
      recentJobs,
      recentApplications,
    });
  } catch (err) {
    console.error("[admin/stats GET] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
