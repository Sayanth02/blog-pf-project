"use client";
import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import Button from "../reusable/Button";
import { getFeaturedPosts } from "@/services/postServices";
import PostCardSkeleton from "./PostCardSkeleton";

type Category = { _id: string; name: string };
type FeaturedPost = {
  _id: string;
  title: string;
  slug: string;
  publishDate?: string;
  thumbnail?: string;
  summary?: string;
  categoryIds?: Category[];
};

const FtPost = () => {
  const [posts, setPosts] = useState<FeaturedPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await getFeaturedPosts(4);
      if (mounted) {
        setPosts(data ?? []);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="p-16 ">
      <div className="w-full ">
        <div className="text-center mb-8">
          <span className="font-extrabold">Blogs</span>
          <h1 className="text-5xl font-extralight mt-4">
            Explore Our Featured Blogs
          </h1>
          <p className="text-lg mt-6 tracking-wider">
            Dive into latest insights and stories
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {loading && [1, 2, 3, 4].map((k) => <PostCardSkeleton key={k} />)}
          {!loading && posts.length === 0 && (
            <p className="text-center text-neutral-500 w-full">
              No featured posts yet.
            </p>
          )}
          {!loading &&
            posts.map((p) => (
              <PostCard
              variant="vertical"
                key={p._id}
                post={{
                  _id: p._id,
                  title: p.title,
                  content: p.summary ?? "",
                  categoryIds: p.categoryIds,
                  thumbnail: p.thumbnail,
                }}
              />
            ))}
        </div>

        <div className="flex justify-center mt-16">
          <Button variant="outlined" label="View all" />
        </div>
      </div>
    </div>
  );
};

export default FtPost;
