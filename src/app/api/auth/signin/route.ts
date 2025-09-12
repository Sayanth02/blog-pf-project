import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import { buildAuthCookie, signAccessToken } from "@/app/api/auth/jwt";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { emailOrUsername, password } = await req.json();
    if (!emailOrUsername || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername },
      ],
    });

    if (!user)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );

    const token = await signAccessToken(
      { sub: String(user._id), role: user.role, username: user.username },
      "1d"
    );

    const res = NextResponse.json({
      id: user._id,
      username: user.username,
      role: user.role,
    });
    res.headers.set("Set-Cookie", buildAuthCookie(token));
    return res;
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server error", details: e?.message },
      { status: 500 }
    );
  }
}
