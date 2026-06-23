import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, setAuthCookie, type JwtPayload } from "@/lib/auth";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RegisterBody;
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const confirmPassword = body.confirmPassword;

    // ---- Validation ----
    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "A valid email is required" },
        { status: 400 }
      );
    }
    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }
    if (confirmPassword !== undefined && confirmPassword !== password) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // ---- Duplicate email check ----
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // ---- Create ----
    const hashed = await hashPassword(password);
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: "CANDIDATE",
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

    // ---- Set cookie ----
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as JwtPayload["role"],
    };
    await setAuthCookie(payload);

    return NextResponse.json({ user, message: "Account created successfully" });
  } catch (err) {
    console.error("[register] error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
