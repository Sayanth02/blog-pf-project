"use client";
import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import Button from "../reusable/Button";
import { getFeaturedPosts } from "@/services/postServices";
import PostCardSkeleton from "./PostCardSkeleton";
import SectionHeader from "./SectionHeader";


type Category = { _id: string; name: string };
type FeaturedPost = {
  _id: string;
  title: string;
  // authorIds?: Author[];
  publishDate?: string;
  slug: string;
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
    <div className="p-6 md:p-10 lg:p-16 ">
      <div className="w-full ">
        <SectionHeader title="Featured Posts" link="post" />
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
                  summary: p.summary ?? "",
                  content: p.summary ?? "",
                  categoryIds: p.categoryIds,
                  thumbnail: p.thumbnail,
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default FtPost;
