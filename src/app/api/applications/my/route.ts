import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/applications/my — list jobs the current candidate has applied to
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please log in to view your applications" },
        { status: 401 }
      );
    }
    if (user.role !== "CANDIDATE") {
      return NextResponse.json(
        { error: "Only candidates have applications" },
        { status: 403 }
      );
    }

    const applications = await db.application.findMany({
      where: { userId: user.id },
      orderBy: { appliedAt: "desc" },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            location: true,
            salary: true,
            jobType: true,
            experience: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json({ applications });
  } catch (err) {
    console.error("[applications/my GET] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
