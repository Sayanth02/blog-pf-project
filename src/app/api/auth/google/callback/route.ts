// app/api/auth/google/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { exchangeCodeForTokens, fetchGoogleUser } from "@/lib/google-oauth";
import { signSession } from "@/lib/jwt";
import { buildAuthCookie, signAccessToken } from "../../jwt";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const storedState = req.cookies.get("oauth_state")?.value;

    if (!code || !state || !storedState || state !== storedState) {
      return NextResponse.redirect(
        new URL(`/login?error=invalid_state`, req.url)
      );
    }

    // Clear state cookie
    const origin = url.origin;
    const redirectUri = `${origin}/api/auth/google/callback`;
    const resHeaders = new Headers();

    const blankStateCookie = `oauth_state=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`;
    resHeaders.append("Set-Cookie", blankStateCookie);

    // Exchange code -> tokens
    const tokens = await exchangeCodeForTokens(code, redirectUri);

    // Get profile
    const gUser = await fetchGoogleUser(tokens.access_token);
    if (!gUser.email || !gUser.email_verified) {
      return new NextResponse(null, {
        status: 302,
        headers: {
          ...Object.fromEntries(resHeaders),
          Location: `/login?error=email_not_verified`,
        },
      });
    }

    // Upsert local user
    await dbConnect();

    // Try to find by googleId first, fallback to email
    let user = await User.findOne({
      $or: [{ googleId: gUser.sub }, { email: gUser.email }],
    });

    if (!user) {
      // We need passwordHash because your schema requires it;
      // set a random hash the user never uses (they’ll log in via Google).
      const randomPassword =
        gUser.sub + "." + Math.random().toString(36).slice(2);
      const passwordHash = await bcrypt.hash(randomPassword, 10);

      user = await User.create({
        username: gUser.name || gUser.email.split("@")[0],
        email: gUser.email,
        passwordHash,
        role: "User",
        googleId: gUser.sub,
        profileDetails: { profileImageUrl: gUser.picture },
      });
    } else {
      // Link googleId if missing, update avatar
      const updates: any = {};
      if (!user.googleId) updates.googleId = gUser.sub;
      if (
        gUser.picture &&
        user.profileDetails?.profileImageUrl !== gUser.picture
      ) {
        updates["profileDetails.profileImageUrl"] = gUser.picture;
      }
      if (Object.keys(updates).length) {
        await User.updateOne({ _id: user._id }, { $set: updates });
        user = await User.findById(user._id);
      }
    }

    // Create an app session JWT
    const token = await signAccessToken({
      sub: user._id.toString(),
      role: user.role,
      username: user.username,
      email: user.email,
      provider: "google",
    });

    // Set session cookie
 
    const sessionCookie = buildAuthCookie(token);
    resHeaders.append("Set-Cookie", sessionCookie);

    // Redirect wherever you want after login
    return new NextResponse(null, {
      status: 302,
      headers: {
        ...Object.fromEntries(resHeaders),
        Location: "/",
      },
    });
  } catch (e: any) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(e.message)}`, req.url)
    );
  }
}
