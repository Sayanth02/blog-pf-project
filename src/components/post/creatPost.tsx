"use client";
import TextEditor from "@/components/post/text-editor";
import { createPost } from "@/services/postServices";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "sonner";

const CreatPost = () => {
  const handlePostSubmit = async (post: {
    title: string;
    thumbnail: string;
    content: string;
  }) => {
    try {
      const res = await createPost(post);
      toast.success(`Post added successfully`, {
        position: "top-center",
      });
      return res;
    } catch (error) {
      console.log("Error creating post:", error);
    }
  };
  return (
    <div>
      <div className="max-w-6xl mx-auto py-8">
        <TextEditor onSubmit={handlePostSubmit} />
      </div>
    </div>
  );
};

export default CreatPost;
