import React, { Suspense } from "react";
import { headers } from "next/headers";
import PostDetailSkeleton from "@/components/post/PostDetailSkeleton";
import PostDetailContent from "@/components/post/PostDetailContent";
import { getAuthContext } from "@/app/api/auth/withAuth";

const Page = async ({ params }: { params: { postId: string } }) => {
  const { postId } = params;

  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") || hdrs.get("host");
  const protocol =
    hdrs.get("x-forwarded-proto") ||
    (process.env.NODE_ENV === "production" ? "https" : "http");

  async function PostContent() {
    let post;
    let currentUser = null;

    try {
      // Build absolute origin from incoming request headers and forward only cookies
      const proto = hdrs.get("x-forwarded-proto") || "http";
      const h = hdrs.get("x-forwarded-host") || hdrs.get("host") || "localhost";
      const origin = `${proto}://${h}`;
      const cookie = hdrs.get("cookie") ?? "";

      const [postRes, userContext] = await Promise.all([
        fetch(`${origin}/api/posts/${postId}`, {
          cache: "no-store",
          headers: cookie ? { cookie } : {},
        }),
        getAuthContext({ headers: hdrs } as any).catch(() => null),
      ]);

      if (!postRes.ok) {
        const txt = await postRes.text();
        throw new Error(`Fetch failed: ${postRes.status} ${postRes.statusText} - ${txt}`);
      }
      post = await postRes.json();
      currentUser = userContext;
    } catch (err: any) {
      console.error("Error fetching post:", err);
      return (
        <div className="max-w-4xl mx-auto px-4 py-8 text-red-600">
          <div>Failed to fetch post</div>
          <div style={{ fontSize: "0.9em", marginTop: 8 }}>
            {err?.message ? err.message : String(err)}
          </div>
        </div>
      );
    }

    if (!post) {
      return <div className="max-w-4xl mx-auto px-4 py-8">Loading...</div>;
    }

    // Check if current user is the owner of the post
    const isOwner = currentUser && post.authorIds?.some(
      (author: any) => author._id === currentUser.userId || author === currentUser.userId
    );

    return (
      <PostDetailContent
        post={post}
        currentUserId={currentUser?.userId}
        isOwner={isOwner}
      />
    );
  }

  return (
    <Suspense fallback={<PostDetailSkeleton />}>
      <PostContent />
    </Suspense>
  );
};

export default Page;
