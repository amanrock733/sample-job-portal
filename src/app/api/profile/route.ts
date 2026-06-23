import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/profile — get current user's full profile
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please log in to continue" },
        { status: 401 }
      );
    }
    return NextResponse.json({ user });
  } catch (err) {
    console.error("[profile GET] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PUT /api/profile — update profile (name, phone, skills, resumeUrl, profileImage)
export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please log in to continue" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, phone, skills, resumeUrl, profileImage } = body;

    const updated = await db.user.update({
      where: { id: user.id },
      data: {
        ...(typeof name === "string" && name.trim() ? { name: name.trim() } : {}),
        ...(typeof phone === "string" ? { phone: phone.trim() || null } : {}),
        ...(typeof skills === "string" ? { skills: skills.trim() || null } : {}),
        ...(typeof resumeUrl === "string"
          ? { resumeUrl: resumeUrl.trim() || null }
          : {}),
        ...(typeof profileImage === "string"
          ? { profileImage: profileImage.trim() || null }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        skills: true,
        resumeUrl: true,
        profileImage: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      user: updated,
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.error("[profile PUT] error:", err);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
