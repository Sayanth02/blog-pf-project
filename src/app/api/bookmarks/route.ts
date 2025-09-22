import connectDB from "@/lib/mongodb";
import User from "@/models/user";
import Post from "@/models/post";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "../auth/withAuth";


// post bookmarks
export async function POST(request: NextRequest) {
   const ctx = await getAuthContext(request);
   if (!ctx) {
     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }
   const { userId } = ctx;
  //  console.log("userId from token:", userId);

  try {
    await connectDB();
    const body = await request.json();
    const postId = body?.postId;
    if (!postId) {
      return NextResponse.json(
        { error: "postId is required" },
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

    // Verify post exists
    const existingPost = await Post.findById(postObjId).select("_id");
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Load user bookmarks
    const user = await User.findById(userId).select("bookmarkedPostIds");
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const exists = (user.bookmarkedPostIds || []).some((b: Types.ObjectId) =>
      b.equals(postObjId)
    );

    if (exists) {
      // remove bookmark
      user.bookmarkedPostIds = user.bookmarkedPostIds.filter(
        (b: Types.ObjectId) => !b.equals(postObjId)
      );
      await user.save();

      // optional: decrement post.bookmarkCount (safeguard not to go below 0)
      await Post.findByIdAndUpdate(postObjId, { $inc: { bookmarkCount: -1 } });

      return NextResponse.json({ bookmarked: false }, { status: 200 });
    } else {
      // add bookmark
      user.bookmarkedPostIds = user.bookmarkedPostIds || [];
      user.bookmarkedPostIds.push(postObjId);
      await user.save();

      // optional: increment post.bookmarkCount
      await Post.findByIdAndUpdate(postObjId, { $inc: { bookmarkCount: 1 } });

      return NextResponse.json({ bookmarked: true }, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to toggle bookmark", details: (err as Error).message },
      { status: 500 }
    );
  }
}

// get user's bookmarked posts

export async function GET(request: NextRequest) {
  const ctx = await getAuthContext(request);
  if (!ctx) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { userId } = ctx;
  try {
    await connectDB();

    // get user bookmarks
    const user = await User.findById(userId).select("bookmarkedPostIds");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // populate posts
    const posts = await Post.find({ _id: { $in: user.bookmarkedPostIds } })
      .select("title thumbnail categoryIds authorIds publishDate") // select only needed fields
      .populate("categoryIds", "name")
      .populate("authorIds", "username");

    // optionally transform _id to id for frontend
    const result = posts.map((p) => ({
      id: p._id.toString(),
      _id: p._id.toString(),
      title: p.title,
      thumbnail: p.thumbnail,
      categoryIds: p.categoryIds,
      authorIds: p.authorIds,
      publishDate: p.publishDate,
      isBookmarked: true,
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to get bookmarks", details: (err as Error).message },
      { status: 500 }
    );
  }
}