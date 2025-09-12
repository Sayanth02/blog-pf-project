"use client";
import React from "react";

const PostCardSkeleton = () => {
  return (
    <div className="rounded-md p-3 animate-pulse">
      <div className="h-40 w-full bg-slate-200 rounded" />
      <div className="mt-3 h-4 w-3/4 bg-slate-200 rounded" />
      <div className="mt-2 h-4 w-1/2 bg-slate-200 rounded" />
    </div>
  );
};

export default PostCardSkeleton;
