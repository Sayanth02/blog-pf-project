import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/models/post";
import "@/models/category"; // ensure Category model is registered for populate

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

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
      .lean();

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch post", details: (error as Error).message },
      { status: 500 }
    );
  }
}
