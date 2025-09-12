import connectDB from "@/lib/mongodb";
import post from "@/models/post";
import "@/models/category";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "../auth/withAuth";
import { Policies } from "../auth/roles";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const page = Math.max(parseInt(url.searchParams.get("page") || "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt(url.searchParams.get("limit") || "12", 10), 1),
      50
    );
    const skip = (page - 1) * limit;
    const featuredParam = url.searchParams.get("featured");
    const filter: Record<string, unknown> = {};
    if (featuredParam === "true") {
      filter.isFeatured = true;
    }

    const [items, total] = await Promise.all([
      post
        .find(filter, {
          title: 1,
          slug: 1,
          publishDate: 1,
          thumbnail: 1,
          summary: 1,
          categoryIds: 1,
          isFeatured: 1,
        })
        .sort({ publishDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate("categoryIds", "name")
        .lean(),
      post.countDocuments({}),
    ]);

    return NextResponse.json(
      {
        data: items,
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
      { error: "Failed to fetch posts", details: (error as Error).message },
      { status: 500 }
    );
  }
}

//  post

export async function POST(request: NextRequest) {
  const guard = requireRole(Policies.managePosts);
  const ctxOrRes = await guard(request);
  if (ctxOrRes instanceof Response) return ctxOrRes;
  const ctx = ctxOrRes;
  try {
    await connectDB();
    const body = await request.json();

    let {
      title,
      slug,
      publishDate,
      content,
      authorIds,
      categoryIds,
      tagIds,
      summary,
      thumbnail,
      isFeatured,
    } = body;

    if (!slug) {
      slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-");
    }

    if (!authorIds || authorIds.length === 0) {
      authorIds = [ctx.userId];
    }

    // Simple validation
    if (!title || !content || !categoryIds) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newPost = await post.create({
      title,
      slug,
      authorIds: authorIds.map((id: string) => new Types.ObjectId(id)),
      publishDate: publishDate ? new Date(publishDate) : new Date(),
      content,
      categoryIds: categoryIds.map((id: string) => new Types.ObjectId(id)),
      tagIds: tagIds ? tagIds.map((id: string) => new Types.ObjectId(id)) : [],
      summary,
      thumbnail,
      isFeatured: Boolean(isFeatured),
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// update

export async function PUT(request: NextRequest) {
  const guard = requireRole(Policies.managePosts);
  const ctxOrRes = await guard(request);
  if (ctxOrRes instanceof Response) return ctxOrRes;
  const ctx = ctxOrRes;
  try {
    await connectDB();
    const body = await request.json();
    const { _id, ...updateFields } = body;
    if (!_id) {
      return NextResponse.json({ error: "_id is required" }, { status: 400 });
    }
    const updatedPost = await post.findByIdAndUpdate(_id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update post", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const guard = requireRole(Policies.managePosts);
  const ctxOrRes = await guard(request);
  if (ctxOrRes instanceof Response) return ctxOrRes;
  const ctx = ctxOrRes;
  try {
    await connectDB();
    const url = new URL(request.url);
    const id = url.searchParams.get("_id");

    if (!id) {
      return NextResponse.json(
        { error: "_id query parameter is required" },
        { status: 400 }
      );
    }

    const deletedPost = await post.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete post", details: (error as Error).message },
      { status: 500 }
    );
  }
}
