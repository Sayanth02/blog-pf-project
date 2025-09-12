import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie } from "@/app/api/auth/jwt";

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", clearAuthCookie());
  return res;
}
