// src/app/bookmarks/page.tsx
"use client";

import { useEffect, useState } from "react";
import PostCard from "@/components/post/PostCard";
import { getBookmarkedPosts } from "@/services/bookmarkService";
import PostCardSkeleton from "@/components/post/PostCardSkeleton";
import Link from "next/link";

type Post = {
  _id: string;
  id: string;
  title: string;
  content: string;
  thumbnail?: string;
  categoryIds: { _id: string; name: string }[];
  authorIds: { _id: string; username: string }[];
  publishDate?: string;
  isBookmarked: boolean;
};

export default function BookmarksPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
     async function fetchBookmarks() {
       setLoading(true);
       const data = await getBookmarkedPosts();
       setPosts(data || []);
       setLoading(false);
     }
     fetchBookmarks();
   }, []);

  if (loading) return <p>Loading bookmarks…</p>;

  return (
    <div className="p-16">
      <h1 className="text-2xl font-bold mb-6">My Bookmarked Posts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <PostCardSkeleton key={idx} />
            ))
          : posts.length > 0
          ? posts.map((post: any) => (
              <Link key={post.id} href={`/post/${post.id}`}>
                <PostCard post={post} />
              </Link>
            ))
          : !loading && (
              <p className="text-neutral-600 col-span-full">
                You haven’t bookmarked any posts yet.
              </p>
            )}
      </div>
    </div>
  );
}
