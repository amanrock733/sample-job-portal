import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/applications/job/:jobId — admin views applicants for a job
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please log in to continue" },
        { status: 401 }
      );
    }
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can view applicants" },
        { status: 403 }
      );
    }

    const job = await db.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const applications = await db.application.findMany({
      where: { jobId },
      orderBy: { appliedAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            skills: true,
            resumeUrl: true,
            profileImage: true,
          },
        },
      },
    });

    return NextResponse.json({ job, applications });
  } catch (err) {
    console.error("[applications/job/:jobId GET] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch applicants" },
      { status: 500 }
    );
  }
}
