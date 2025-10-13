"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ManagePostCard from "@/components/post/ManagePostCard";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";

type Category = { _id: string; name: string };
type Author = {
  _id: string;
  username: string;
  profileDetails?: { profileImageUrl?: string };
};

type PostItem = {
  _id: string;
  title: string;
  summary?: string;
  content?: string;
  categoryIds?: Category[];
  authorIds?: Author[];
  publishDate?: string;
  thumbnail?: string;
};

export default function ManagePostsClient({ initialData }: { initialData: PostItem[] }) {
  const [posts, setPosts] = useState<PostItem[]>(initialData);
  const router = useRouter();

  const handlePostDelete = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  const handleCreatePost = () => {
    router.push("/post/create-post");
  };

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
          <FileText className="w-10 h-10 text-neutral-400" />
        </div>
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">No posts yet</h3>
        <p className="text-neutral-600 mb-6 text-center max-w-md">
          You haven't created any posts yet. Start writing and share your thoughts with the world!
        </p>
        <Button onClick={handleCreatePost} className="flex items-center gap-2 h-11 px-6">
          <Plus className="h-5 w-5" />
          Create Your First Post
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <ManagePostCard key={post._id} post={post} onDelete={handlePostDelete} />
      ))}
    </div>
  );
}
