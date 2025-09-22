import connectDB from "@/lib/mongodb";
import Post from "@/models/post";
import User from "@/models/user";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "../../auth/withAuth";

// GET /api/posts/mine
// Returns posts authored by the logged-in user with pagination
export async function GET(request: NextRequest) {
  try {
    const ctx = await getAuthContext(request);
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const url = new URL(request.url);
    const page = Math.max(parseInt(url.searchParams.get("page") || "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt(url.searchParams.get("limit") || "12", 10), 1),
      50
    );
    const skip = (page - 1) * limit;

    const userId = new Types.ObjectId(ctx.userId);

    // Build bookmarked set for the user
    let bookmarkedSet = new Set<string>();
    const user = await User.findById(ctx.userId).select("bookmarkedPostIds").lean<{ bookmarkedPostIds?: Types.ObjectId[] }>();
    if (user?.bookmarkedPostIds) {
      bookmarkedSet = new Set((user.bookmarkedPostIds as Types.ObjectId[]).map((id) => id.toString()));
    }

    const filter = { authorIds: userId } as const;

    const [items, total] = await Promise.all([
      Post.find(filter, {
        title: 1,
        slug: 1,
        publishDate: 1,
        thumbnail: 1,
        summary: 1,
        authorIds: 1,
        categoryIds: 1,
        isFeatured: 1,
      })
        .sort({ publishDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate("categoryIds", "name")
        .populate("authorIds", "username profileDetails.profileImageUrl ")
        .lean(),
      Post.countDocuments(filter),
    ]);

    const dataWithBookmark = items.map((it: any) => ({
      ...it,
      isBookmarked: bookmarkedSet.has(it._id.toString()),
    }));

    return NextResponse.json(
      {
        data: dataWithBookmark,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch your posts", details: (error as Error).message },
      { status: 500 }
    );
  }
}
