"use client";
import React from "react";

const PostDetailSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="w-full mb-6">
        <div className="w-full h-64 bg-slate-200 rounded-lg" />
      </div>
      <div className="mb-3 flex gap-3">
        <div className="h-4 w-16 bg-slate-200 rounded" />
        <div className="h-4 w-24 bg-slate-200 rounded" />
      </div>
      <div className="h-8 w-2/3 bg-slate-200 rounded mb-3" />
      <div className="h-4 w-40 bg-slate-200 rounded mb-8" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-slate-200 rounded" />
        <div className="h-4 w-11/12 bg-slate-200 rounded" />
        <div className="h-4 w-10/12 bg-slate-200 rounded" />
        <div className="h-4 w-8/12 bg-slate-200 rounded" />
      </div>
    </div>
  );
};

export default PostDetailSkeleton;


