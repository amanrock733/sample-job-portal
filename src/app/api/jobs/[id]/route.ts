import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/jobs/:id — public job details
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const job = await db.job.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        _count: { select: { applications: true } },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (err) {
    console.error("[jobs/:id GET] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}

// PUT /api/jobs/:id — admin updates a job
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please log in to continue" },
        { status: 401 }
      );
    }
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can edit jobs" },
        { status: 403 }
      );
    }

    const existing = await db.job.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      title,
      company,
      location,
      salary,
      experience,
      jobType,
      description,
      requirements,
      status,
    } = body;

    const updated = await db.job.update({
      where: { id },
      data: {
        title: title?.trim() ?? existing.title,
        company: company?.trim() ?? existing.company,
        location: location?.trim() ?? existing.location,
        salary: salary?.trim() ?? existing.salary,
        experience: experience?.trim() ?? existing.experience,
        jobType: jobType?.trim() ?? existing.jobType,
        description: description?.trim() ?? existing.description,
        requirements:
          requirements?.trim() !== undefined
            ? requirements.trim()
            : existing.requirements,
        status: status === "CLOSED" ? "CLOSED" : "OPEN",
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ job: updated, message: "Job updated successfully" });
  } catch (err) {
    console.error("[jobs/:id PUT] error:", err);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs/:id — admin deletes a job (cascade deletes applications via Prisma)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please log in to continue" },
        { status: 401 }
      );
    }
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can delete jobs" },
        { status: 403 }
      );
    }

    const existing = await db.job.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Applications cascade-delete per Prisma schema (onDelete: Cascade)
    await db.job.delete({ where: { id } });

    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("[jobs/:id DELETE] error:", err);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
