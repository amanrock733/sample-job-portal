import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// POST /api/applications — apply to a job (candidate only, no duplicates)
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please log in to apply for jobs" },
        { status: 401 }
      );
    }
    if (user.role !== "CANDIDATE") {
      return NextResponse.json(
        { error: "Only candidates can apply for jobs" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { jobId } = body;
    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    const job = await db.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    if (job.status === "CLOSED") {
      return NextResponse.json(
        { error: "This job is no longer accepting applications" },
        { status: 400 }
      );
    }

    // Duplicate check (also enforced by @@unique([userId, jobId]))
    const existing = await db.application.findUnique({
      where: { userId_jobId: { userId: user.id, jobId } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You have already applied for this job" },
        { status: 409 }
      );
    }

    const application = await db.application.create({
      data: {
        userId: user.id,
        jobId,
        status: "PENDING",
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            location: true,
            jobType: true,
          },
        },
      },
    });

    return NextResponse.json({
      application,
      message: "Application submitted successfully",
    });
  } catch (err) {
    console.error("[applications POST] error:", err);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
