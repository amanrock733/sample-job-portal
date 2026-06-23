import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, setAuthCookie, type JwtPayload } from "@/lib/auth";

interface LoginBody {
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LoginBody;
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as JwtPayload["role"],
    };
    await setAuthCookie(payload);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        skills: user.skills,
        resumeUrl: user.resumeUrl,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
      message: "Logged in successfully",
    });
  } catch (err) {
    console.error("[login] error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
