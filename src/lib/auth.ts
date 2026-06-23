import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret-change-in-production";
const JWT_EXPIRE = "7d";
const COOKIE_NAME = "jp_token";

export type Role = "CANDIDATE" | "ADMIN";

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

// ---- Password helpers ----
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

// ---- JWT helpers ----
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

// ---- Cookie helpers ----
export async function setAuthCookie(payload: JwtPayload) {
  const token = signToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

// ---- Session helpers ----
export async function getCurrentUser() {
  const token = await getToken();
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await db.user.findUnique({
    where: { id: payload.userId },
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

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    return { user: null, error: "Unauthorized" as const, status: 401 as const };
  }
  return { user, error: null, status: 200 as const };
}

export async function requireAdmin() {
  const auth = await requireAuth();
  if (!auth.user) return auth;
  if (auth.user.role !== "ADMIN") {
    return {
      user: null,
      error: "Forbidden — admin only" as const,
      status: 403 as const,
    };
  }
  return auth;
}
