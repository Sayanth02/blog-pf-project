"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import BookmarkButton from "./BookMarkButton";
import { deletePost } from "@/services/postServices";
import { toast } from "sonner";

interface Post {
  _id: string;
  title: string;
  content: string;
  thumbnail?: string;
  categoryIds?: Array<{ _id: string; name: string }>;
  publishDate?: string;
  authorIds?: Array<{ _id: string; username: string }>;
  isBookmarked?: boolean;
}

interface PostDetailContentProps {
  post: Post;
  currentUserId?: string;
  isOwner?: boolean;
}

const PostDetailContent: React.FC<PostDetailContentProps> = ({ 
  post, 
  currentUserId, 
  isOwner = false 
}) => {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  // const handleEdit = () => {
  //   router.push(`/edit/${post._id}`);
  // };

  // const handleDelete = async () => {
  //   if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
  //     return;
  //   }

  //   try {
  //     setDeleting(true);
  //     await deletePost(post._id);
  //     toast.success("Post deleted successfully!");
  //     router.push("/"); 
  //   } catch (error) {
  //     console.error("Error deleting post:", error);
  //     toast.error("Failed to delete post");
  //   } finally {
  //     setDeleting(false);
  //   }
  // };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Action buttons for post owner */}
      {/* {isOwner && (
        <div className="flex justify-end gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Post
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      )} */}

      {/* Bookmark button */}
      {/* <div className="flex justify-end mb-4">
        <BookmarkButton
          postId={post._id}
          initialBookmarked={post.isBookmarked}
          variant="inline"
        />
      </div> */}

      {/* Post thumbnail */}
      {post.thumbnail && (
        <div className="w-full mb-6">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
      )}

      {/* Categories */}
      <div className="mb-3">
        {post.categoryIds?.map((cat) => (
          <span
            key={cat._id}
            className="inline-block text-sm text-neutral-600 mr-3"
          >
            {cat.name}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      
      {/* Publish date */}
      <p className="text-sm text-neutral-500 mb-8">
        {post.publishDate
          ? new Date(post.publishDate).toLocaleDateString()
          : ""}
      </p>

      {/* Content */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
};

export default PostDetailContent;
