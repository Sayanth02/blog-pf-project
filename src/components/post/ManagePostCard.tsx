"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, Calendar, Tag } from "lucide-react";
import { deletePost } from "@/services/postServices";
import { toast } from "sonner";

type Category = { _id: string; name: string };
type Author = {
  _id: string;
  username: string;
  profileDetails?: { profileImageUrl?: string };
};

type Post = {
  _id: string;
  title: string;
  summary?: string;
  content?: string;
  categoryIds?: Category[];
  authorIds?: Author[];
  publishDate?: string;
  thumbnail?: string;
};

interface ManagePostCardProps {
  post: Post;
  onDelete?: (postId: string) => void;
}

const ManagePostCard: React.FC<ManagePostCardProps> = ({ post, onDelete }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleView = () => {
    router.push(`/post/${post._id}`);
  };

  const handleEdit = () => {
    router.push(`/edit/${post._id}`);
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deletePost(post._id);
      toast.success("Post deleted successfully!");
      if (onDelete) {
        onDelete(post._id);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
      setIsDeleting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getContentPreview = (content: string, maxLength: number = 150) => {
    const textContent = content.replace(/<[^>]*>/g, "").trim();
    return textContent.length > maxLength
      ? textContent.substring(0, maxLength) + "..."
      : textContent;
  };

  return (
    <div
      className={`bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all duration-200 overflow-hidden ${
        isDeleting ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="flex gap-5 p-5">
        {/* Thumbnail */}
        <div className="flex-shrink-0">
          <div className="w-40 h-40 rounded-lg overflow-hidden bg-neutral-100 relative group">
            <Image
              src={post.thumbnail || "/images/hero.jpg"}
              alt={post.title}
              width={160}
              height={160}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Top section - Category and Date */}
          <div className="flex items-center gap-3 mb-3">
            {post.categoryIds && post.categoryIds.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-neutral-500" />
                <span className="text-xs font-medium text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-md">
                  {post.categoryIds[0].name}
                </span>
              </div>
            )}
            {post.publishDate && (
              <div className="flex items-center gap-1.5 text-neutral-500">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-xs">{formatDate(post.publishDate)}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-neutral-900 mb-2 line-clamp-2 leading-tight">
            {post.title}
          </h3>

          {/* Summary */}
          {(post.summary || post.content) && (
            <p className="text-sm text-neutral-600 mb-4 line-clamp-2 leading-relaxed">
              {post.summary || getContentPreview(post.content || "")}
            </p>
          )}

          {/* Bottom section - Author and Actions */}
          <div className="mt-auto flex items-center justify-between">
            {/* Author */}
            <div className="flex items-center gap-2">
              {post.authorIds && post.authorIds.length > 0 && (
                <>
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
                    <Image
                      src={
                        post.authorIds[0].profileDetails?.profileImageUrl ||
                        "/images/avatar.png"
                      }
                      alt={post.authorIds[0].username}
                      width={28}
                      height={28}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <span className="text-sm font-medium text-neutral-700">
                    {post.authorIds[0].username}
                  </span>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleView}
                className="h-9 px-3 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50"
              >
                <Eye className="w-4 h-4 mr-1.5" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="h-9 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 hover:border-blue-300"
              >
                <Edit className="w-4 h-4 mr-1.5" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-9 px-3"
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePostCard;
