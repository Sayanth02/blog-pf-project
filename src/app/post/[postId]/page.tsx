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
      // Fetch post and user context in parallel
      const [postRes, userContext] = await Promise.all([
        fetch(`${protocol}://${host}/api/posts/${postId}`, {
          cache: "no-store",
          headers: hdrs,
        }),
        getAuthContext({ headers: hdrs } as any).catch(() => null)
      ]);

      console.log("Fetch status:", postRes.status);
      if (!postRes.ok) {
        throw new Error(`Failed with status ${postRes.status}`);
      }
      post = await postRes.json();
      currentUser = userContext;
    } catch (err) {
      console.error("Error fetching post:", err);
      return (
        <div className="max-w-4xl mx-auto px-4 py-8">Failed to fetch post</div>
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
