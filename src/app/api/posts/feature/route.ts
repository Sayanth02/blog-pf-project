import connectDB from "@/lib/mongodb";
import Post from "@/models/post";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "../../auth/withAuth";
import { Policies } from "../../auth/roles";

// Admin: set/unset a post as featured
// POST /api/posts/feature
// Body: { postId: string, featured: boolean }
export async function POST(request: NextRequest) {
  const guard = requireRole(Policies.managePosts);
  const ctxOrRes = await guard(request);
  if (ctxOrRes instanceof Response) return ctxOrRes;

  try {
    await connectDB();

    const body = await request.json();
    const postId: string | undefined = body?.postId;
    const featured: unknown = body?.featured;

    if (!postId) {
      return NextResponse.json(
        { error: "postId is required" },
        { status: 400 }
      );
    }

    if (typeof featured !== "boolean") {
      return NextResponse.json(
        { error: "featured (boolean) is required" },
        { status: 400 }
      );
    }

    // validate ObjectId
    let postObjId: Types.ObjectId;
    try {
      postObjId = new Types.ObjectId(postId);
    } catch {
      return NextResponse.json({ error: "Invalid postId" }, { status: 400 });
    }

    const updated = await Post.findByIdAndUpdate(
      postObjId,
      { isFeatured: featured },
      { new: true, runValidators: true }
    ).select("_id isFeatured title slug");

    if (!updated) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: featured ? "Post marked as featured" : "Post unmarked as featured",
        post: {
          _id: updated._id,
          isFeatured: updated.isFeatured,
          title: (updated as any).title,
          slug: (updated as any).slug,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update featured flag", details: (error as Error).message },
      { status: 500 }
    );
  }
}
