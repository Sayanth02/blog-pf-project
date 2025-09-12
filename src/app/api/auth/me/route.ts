import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "@/app/api/auth/withAuth";

export async function GET(req: NextRequest) {
  const ctx = await getAuthContext(req);
  if (!ctx) return NextResponse.json({ authenticated: false }, { status: 200 });
  return NextResponse.json({ authenticated: true, ...ctx });
}
