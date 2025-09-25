import React, { Suspense } from "react";
import { headers } from "next/headers";
import EditPostSkeleton from "@/components/post/EditPostSkeleton";
import EditPostContent from "@/components/post/EditPostContent";

const EditPostPage = async ({ params }: { params: { postId: string } }) => {
  const { postId } = params;

  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") || hdrs.get("host");
  const protocol =
    hdrs.get("x-forwarded-proto") ||
    (process.env.NODE_ENV === "production" ? "https" : "http");

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<EditPostSkeleton />}>
        <EditPostContent 
          postId={postId} 
          baseUrl={`${protocol}://${host}`}
        />
      </Suspense>
    </div>
  );
};

export default EditPostPage;
