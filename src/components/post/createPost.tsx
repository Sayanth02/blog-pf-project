"use client";
import TextEditor from "@/components/post/text-editor";
import { createPost } from "@/services/postServices";
import React from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <div className="bg-background">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <Card className="border-muted/40">
          <CardHeader>
            <CardTitle>Create post</CardTitle>
            <CardDescription>
              Compose a new article and publish it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TextEditor onSubmit={handlePostSubmit} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatPost;
