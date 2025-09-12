"use client";
import React, { useEffect, useState } from "react";
import Axios from "axios";
import PostCard from "@/components/post/PostCard";
import PostCardSkeleton from "@/components/post/PostCardSkeleton";
import Link from "next/link";

const TestPost = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(12);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetPost = async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await Axios.get(`/api/posts?page=${pageNum}&limit=${limit}`);
      setPosts(res.data?.data ?? []);
      setTotalPages(res.data?.pagination?.totalPages ?? 1);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetPost(page);
  }, [page]);

  return (
    <div className="p-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: limit }).map((_, idx) => (
              <PostCardSkeleton key={idx} />
            ))
          : posts.map((post: any) => (
              <Link key={post._id} href={`/post/${post._id}`}>
                <PostCard post={post} />
              </Link>
            ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          className="px-3 py-2 rounded border disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={loading || page <= 1}
        >
          Prev
        </button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-3 py-2 rounded border disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={loading || page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TestPost;
