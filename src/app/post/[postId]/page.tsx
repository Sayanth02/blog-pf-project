import React, { Suspense } from "react";
import { headers } from "next/headers";
import PostDetailSkeleton from "@/components/post/PostDetailSkeleton";

const Page = async ({ params }: { params: { postId: string } }) => {
  const { postId } = params;

  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") || hdrs.get("host");
  const protocol =
    hdrs.get("x-forwarded-proto") ||
    (process.env.NODE_ENV === "production" ? "https" : "http");

  async function PostContent() {
    let post;
    try {
      const res = await fetch(`${protocol}://${host}/api/posts/${postId}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`);
      }
      post = await res.json();
    } catch (err) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-8">Failed to fetch post</div>
      );
    }

    if (!post) {
      return <div className="max-w-4xl mx-auto px-4 py-8">Loading...</div>;
    }

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        {post.thumbnail && (
          <div className="w-full mb-6">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        )}

        <div className="mb-3">
          {post.categoryIds?.map((cat: { _id: string; name: string }) => (
            <span
              key={cat._id}
              className="inline-block text-sm text-neutral-600 mr-3"
            >
              {cat.name}
            </span>
          ))}
        </div>

        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-sm text-neutral-500 mb-8">
          {post.publishDate
            ? new Date(post.publishDate).toLocaleDateString()
            : ""}
        </p>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    );
  }

  return (
    <Suspense fallback={<PostDetailSkeleton />}>
      <PostContent />
    </Suspense>
  );
};

export default Page;
