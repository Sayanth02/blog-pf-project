import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UserModel from "@/models/user";
import { getAuthContext } from "@/app/api/auth/withAuth";
import { z } from "zod";

const updateSchema = z.object({
  username: z.string().min(3).max(24).optional(),
  profileDetails: z
    .object({
      bio: z.string().max(500).optional(),
      profileImageUrl: z.string().url().optional(),
    })
    .partial()
    .optional(),
});

export async function GET(req: NextRequest) {
  const ctx = await getAuthContext(req);
  if (!ctx)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const user = await UserModel.findById(ctx.userId)
      .select("username email role profileDetails")
      .lean();
    if (!user)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const ctx = await getAuthContext(req);
  if (!ctx)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const update: any = {};
    if (parsed.data.username !== undefined)
      update.username = parsed.data.username;
    if (parsed.data.profileDetails)
      update.profileDetails = parsed.data.profileDetails;

    const updated = await UserModel.findByIdAndUpdate(ctx.userId, update, {
      new: true,
      runValidators: true,
      projection: "username email role profileDetails",
    }).lean();

    if (!updated)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user", details: (error as Error).message },
      { status: 500 }
    );
  }
}
