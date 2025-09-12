// app/api/auth/google/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createState, googleAuthURL } from "@/lib/google-oauth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  // Compute redirect URI from current host (works locally & in prod)
  const origin = req.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/google/callback`;

  const state = createState();

  // Store state in a short-lived, httpOnly cookie to prevent CSRF
  const res = NextResponse.redirect(googleAuthURL({ state, redirectUri }));
  res.cookies.set("oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10, // 10 minutes
  });
  return res;
}
