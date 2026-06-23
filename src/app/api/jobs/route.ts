import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/jobs — public listing with search/filter/pagination
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search")?.trim() || "";
    const location = url.searchParams.get("location")?.trim() || "";
    const experience = url.searchParams.get("experience")?.trim() || "";
    const jobType = url.searchParams.get("jobType")?.trim() || "";
    const status = url.searchParams.get("status")?.trim() || "OPEN";
    const page = Math.max(1, Number(url.searchParams.get("page") || 1));
    const limit = Math.min(
      50,
      Math.max(1, Number(url.searchParams.get("limit") || 6))
    );

    // Build where clause
    const where: Record<string, unknown> = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { company: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (location) {
      where.location = { contains: location };
    }
    if (experience) {
      where.experience = experience;
    }
    if (jobType) {
      where.jobType = jobType;
    }

    const [total, jobs] = await Promise.all([
      db.job.count({ where }),
      db.job.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
          _count: { select: { applications: true } },
        },
      }),
    ]);

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[jobs GET] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

// POST /api/jobs — admin creates a job
export async function POST(req: NextRequest) {
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
        { error: "Only admins can create jobs" },
        { status: 403 }
      );
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

    if (!title?.trim() || !company?.trim() || !location?.trim()) {
      return NextResponse.json(
        { error: "Title, company, and location are required" },
        { status: 400 }
      );
    }
    if (!description?.trim()) {
      return NextResponse.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    const job = await db.job.create({
      data: {
        title: title.trim(),
        company: company.trim(),
        location: location.trim(),
        salary: salary?.trim() || "Not disclosed",
        experience: experience?.trim() || "0-2",
        jobType: jobType?.trim() || "Full-time",
        description: description.trim(),
        requirements: requirements?.trim() || "",
        status: status === "CLOSED" ? "CLOSED" : "OPEN",
        createdBy: user.id,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ job, message: "Job created successfully" });
  } catch (err) {
    console.error("[jobs POST] error:", err);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
