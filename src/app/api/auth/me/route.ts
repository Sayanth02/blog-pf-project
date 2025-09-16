import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "@/app/api/auth/withAuth";
import dbConnect from "@/lib/mongodb";
import User from '@/models/user'

export async function GET(req: NextRequest) {
  const ctx = await getAuthContext(req);
  if (!ctx) return NextResponse.json({ authenticated: false }, { status: 200 });
  await dbConnect();
  const user = await User.findById(ctx.userId).select(
    "username profileDetails.profileImageUrl"
  );
  console.log(user.profileImageUrl);
  
  return NextResponse.json({
    authenticated: true,
    ...ctx,
    profileImageUrl: user.profileDetails?.profileImageUrl || null,
  });
}
