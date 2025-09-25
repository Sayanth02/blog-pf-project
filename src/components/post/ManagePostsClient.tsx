"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PostCard from "@/components/post/PostCard";
import PostActions from "@/components/post/PostActions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type Category = { _id: string; name: string };

type PostItem = {
  _id: string;
  title: string;
  summary?: string;
  content?: string;
  categoryIds?: Category[];
  authorIds?: any[];
  publishDate?: string;
  thumbnail?: string;
  isBookmarked?: boolean;
};

export default function ManagePostsClient({ initialData }: { initialData: PostItem[] }) {
  const [posts, setPosts] = useState<PostItem[]>(initialData);
  const [busyId, setBusyId] = useState<string | null>(null);
  const router = useRouter();

  const handlePostDelete = (postId: string) => {
    if (busyId) return;
    setBusyId(postId);
    // Remove the post from the list after successful deletion
    setPosts((prev) => prev.filter((p) => p._id !== postId));
    setBusyId(null);
  };

  const handleCreatePost = () => {
    router.push("/post/create-post");
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-neutral-600 mb-4">You haven't written any posts yet.</div>
        <Button onClick={handleCreatePost} className="flex items-center gap-2 mx-auto">
          <Plus className="h-4 w-4" />
          Create Your First Post
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleCreatePost} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Post
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post._id} className={busyId === post._id ? "opacity-60 pointer-events-none" : ""}>
            <div className="space-y-3">
              <PostCard
                post={{
                  _id: post._id,
                  title: post.title,
                  content: post.summary || post.content || "",
                  categoryIds: post.categoryIds,
                  authorIds: post.authorIds,
                  publishDate: post.publishDate,
                  thumbnail: post.thumbnail,
                  isBookmarked: post.isBookmarked,
                }}
                showBookmarkButton={false}
                isOwner={false}
              />
              <PostActions
                postId={post._id}
                onDelete={() => handlePostDelete(post._id)}
                showView={true}
                showEdit={true}
                showDelete={true}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
