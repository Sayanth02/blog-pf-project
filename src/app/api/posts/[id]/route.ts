import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post, { IPost } from "@/models/post";
import "@/models/category"; // ensure Category model is registered for populate
import User from "@/models/user";
import { Types } from "mongoose";
import { getAuthContext } from "../../auth/withAuth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Determine user's bookmarks if authenticated
    const ctx = await getAuthContext({ headers: request.headers } as any).catch(() => null);
    let bookmarkedSet = new Set<string>();
    if (ctx) {
      const user = await User.findById(ctx.userId)
        .select("bookmarkedPostIds")
        .lean<{ bookmarkedPostIds?: Types.ObjectId[] }>();
      if (user?.bookmarkedPostIds) {
        bookmarkedSet = new Set(
          (user.bookmarkedPostIds as unknown as Types.ObjectId[]).map((id) =>
            id.toString()
          )
        );
      }
    }

    const post = await Post.findById(params.id, {
      title: 1,
      slug: 1,
      publishDate: 1,
      thumbnail: 1,
      summary: 1,
      content: 1,
      categoryIds: 1,
      tagIds: 1,
      authorIds: 1,
      relatedPostIds: 1,
      createdAt: 1,
      updatedAt: 1,
    })
      .populate("categoryIds", "name")
      .lean<{ _id: Types.ObjectId } & Omit<IPost, '_id'>>();

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // attach bookmark status
    const postWithBookmark = {
      ...post,
      isBookmarked: bookmarkedSet.has(post._id.toString()),
    };

    return NextResponse.json(postWithBookmark, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch post", details: (error as Error).message },
      { status: 500 }
    );
  }
}
