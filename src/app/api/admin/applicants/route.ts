import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/admin/applicants — list all applications (for admin applicants table)
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
        { error: "Only admins can view applicants" },
        { status: 403 }
      );
    }

    const applications = await db.application.findMany({
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
          },
        },
        job: {
          select: { id: true, title: true, company: true, location: true },
        },
      },
    });

    return NextResponse.json({ applications });
  } catch (err) {
    console.error("[admin/applicants GET] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch applicants" },
      { status: 500 }
    );
  }
}
