"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getSinglePost, updatePost } from "@/services/postServices";
import { getAllCategories } from "@/services/categoryServices";
import PostEditForm from "@/components/post/PostEditForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Post {
  _id: string;
  title: string;
  content: string;
  thumbnail?: string;
  summary?: string;
  categoryIds: Array<{ _id: string; name: string }>;
  tagIds?: string[];
  publishDate?: string;
  isFeatured: boolean;
  slug: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

interface EditPostContentProps {
  postId: string;
  baseUrl: string;
}

const EditPostContent: React.FC<EditPostContentProps> = ({ postId, baseUrl }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch post and categories in parallel
        const [postData, categoriesData] = await Promise.all([
          getSinglePost(postId),
          getAllCategories()
        ]);

        if (!postData) {
          setError("Post not found");
          return;
        }

        setPost(postData);
        setCategories(categoriesData?.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load post data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  const handlePostUpdate = async (formData: {
    title: string;
    content: string;
    thumbnail?: string;
    summary?: string;
    categoryIds: string[];
    tagIds?: string[];
  }) => {
    if (!post) return;

    try {
      setSaving(true);
      
      const updatedPost = await updatePost(post._id, formData);
      
      toast.success("Post updated successfully!", {
        position: "top-center",
      });

      // Redirect to the updated post
      router.push(`/post/${post._id}`);
      
      return updatedPost;
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post", {
        position: "top-center",
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <Card className="border-muted/40">
          <CardContent className="p-8">
            <div className="text-center">Loading post data...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <Card className="border-muted/40">
          <CardContent className="p-8">
            <div className="text-center text-red-500">
              {error || "Post not found"}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <Card className="border-muted/40">
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
          <CardDescription>
            Make changes to your article and update it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PostEditForm
            initialData={{
              title: post.title,
              content: post.content,
              thumbnail: post.thumbnail || "",
              summary: post.summary || "",
              categoryIds: post.categoryIds.map(cat => cat._id),
              tagIds: post.tagIds || [],
            }}
            categories={categories}
            onSubmit={handlePostUpdate}
            onCancel={handleCancel}
            isLoading={saving}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPostContent;
