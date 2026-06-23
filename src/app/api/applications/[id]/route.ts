import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// PATCH /api/applications/:id — admin updates application status
export async function PATCH(
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
        { error: "Only admins can update application status" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { status } = body;
    const validStatuses = ["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const existing = await db.application.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const updated = await db.application.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { id: true, name: true, email: true } },
        job: { select: { id: true, title: true, company: true } },
      },
    });

    return NextResponse.json({
      application: updated,
      message: "Application status updated",
    });
  } catch (err) {
    console.error("[applications/:id PATCH] error:", err);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}
