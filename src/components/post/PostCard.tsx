import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, Calendar, User, MessageSquare } from "lucide-react";
import { deletePost } from "@/services/postServices";
import { toast } from "sonner";

type Category = { _id: string; name: string };
type Author = {
  _id: string;
  username: string;
  profileDetails?: profileDetails;
};
type profileDetails = { profileImageUrl?: string };
type Post = {
  _id: string;
  title: string;
  content: string;
  categoryIds?: Category[];
  authorIds?: Author[];
  publishDate?: string;
  thumbnail?: string;
  isBookmarked?: boolean;
  profileDetails?: profileDetails;
  commentCount?: number;
};

type PostCardProps = {
  post: Post;
  isOwner?: boolean;
  showActions?: boolean;
  onDelete?: (postId: string) => void;
  variant?: "default" | "vertical" | "manage";
};

const PostCard = ({
  post,
  isOwner = false,
  showActions = false,
  onDelete,
  variant = "default",
}: PostCardProps) => {
  const router = useRouter();

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

    try {
      await deletePost(post._id);
      toast.success("Post deleted successfully!");
      if (onDelete) {
        onDelete(post._id);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  // Extract content preview from HTML content
  // const getContentPreview = (content: string, maxLength: number = 120) => {
  //   const textContent = content.replace(/<[^>]*>/g, "").trim();
  //   return textContent.length > maxLength
  //     ? textContent.substring(0, maxLength) + "..."
  //     : textContent;
  // };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - postDate.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return postDate.toLocaleDateString();
    }
  };

  // Manage variant - for admin panel with action buttons
  if (variant === "manage") {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="flex gap-4 p-5">
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-xl overflow-hidden bg-neutral-100">
              <Image
                src={post.thumbnail || "/images/hero.jpg"}
                alt={post.title}
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Category */}
            {post.categoryIds && post.categoryIds.length > 0 && (
              <div className="mb-2">
                <span className="inline-block px-3 py-1 text-xs font-medium text-neutral-600 bg-neutral-100 rounded-full">
                  {post.categoryIds[0].name}
                </span>
              </div>
            )}

            {/* Title */}
            <h2 className="text-xl font-bold text-neutral-900 mb-2 line-clamp-2">
              {post.title}
            </h2>

            {/* Description */}
            <p className="text-sm text-neutral-500 mb-3 line-clamp-2">
              {/* {getContentPreview(post.content)} */}
            </p>

            {/* Meta Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {post.authorIds?.map((author) => (
                  <div key={author._id} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-neutral-300 flex-shrink-0">
                      <Image
                        src={
                          author.profileDetails?.profileImageUrl ||
                          "/images/avatar.png"
                        }
                        alt={author.username}
                        width={24}
                        height={24}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="text-sm font-medium text-neutral-900">
                      {author.username || "Unknown"}
                    </span>
                  </div>
                ))}
                {post.publishDate && (
                  <>
                    <span className="text-neutral-300">/</span>
                    <span className="text-sm text-neutral-500">
                      {formatTimeAgo(post.publishDate)}
                    </span>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              {showActions && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleView}
                    className="h-8 px-3"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  {isOwner && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEdit}
                        className="h-8 px-3"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        className="h-8 px-3"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vertical variant
  if (variant === "vertical") {
    return (
      <div
        className="bg-white rounded-3xl border border-neutral-200 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer max-w-sm mx-auto"
        onClick={handleView}
      >
        <div className="p-6 flex flex-col gap-4">
          {/* Category */}
          {post.categoryIds && post.categoryIds.length > 0 && (
            <div className="mb-3">
              <span className="inline-block px-4 py-1.5 text-xs font-medium text-neutral-600 bg-neutral-50 rounded-full border border-neutral-200">
                {post.categoryIds[0].name}
              </span>
            </div>
          )}

          {/* Title */}
          <h2 className="text-2xl font-bold text-neutral-900 mb-4 leading-snug line-clamp-2">
            {post.title}
          </h2>

          {/* Thumbnail - centered and contained */}
          <div className="mb-4 flex justify-center">
            <div className="w-full rounded-2xl overflow-hidden bg-neutral-100">
              <Image
                src={post.thumbnail || "/images/hero.jpg"}
                alt={post.title}
                width={320}
                height={320}
                className="object-cover w-full aspect-square"
              />
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {post.authorIds?.map((author) => (
                <React.Fragment key={author._id}>
                  <span className="text-sm text-neutral-500">
                    {post.publishDate && formatTimeAgo(post.publishDate)}
                  </span>
                  <span className="text-neutral-300">/</span>
                  <span className="text-sm font-medium text-neutral-900">
                    by {author.username || "Unknown"}
                  </span>
                </React.Fragment>
              ))}
            </div>
            {post.commentCount !== undefined && (
              <div className="flex items-center gap-1.5 text-neutral-500">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-medium">{post.commentCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default horizontal variant
  return (
    <div
      className="bg-white rounded-2xl border border-neutral-200 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={handleView}
    >
      <div className="flex gap-6 p-6">
        {/* Thumbnail - left side, contained */}
        <div className="flex-shrink-0">
          <div className="w-64 h-64 rounded-2xl overflow-hidden bg-neutral-100">
            <Image
              src={post.thumbnail || "/images/hero.jpg"}
              alt={post.title}
              width={192}
              height={192}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Content - right side */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {/* Category */}
            {post.categoryIds && post.categoryIds.length > 0 && (
              <div className="mb-3">
                <span className="inline-block px-4 py-1.5 text-xs font-medium text-neutral-600 bg-neutral-50 rounded-full border border-neutral-200">
                  {post.categoryIds[0].name}
                </span>
              </div>
            )}

            {/* Title */}
            <h2 className="text-2xl font-bold text-neutral-900 mb-3 leading-snug">
              {post.title}
            </h2>

            {/* Description */}
            <p className="text-base text-neutral-500 leading-relaxed mb-4">
              {/* {getContentPreview(post.content, 150)} */}
            </p>
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {post.authorIds?.map((author) => (
                <React.Fragment key={author._id}>
                  <span className="text-sm text-neutral-500">
                    {post.publishDate && formatTimeAgo(post.publishDate)}
                  </span>
                  <span className="text-neutral-300">/</span>
                  <span className="text-sm font-medium text-neutral-900">
                    by {author.username || "Unknown"}
                  </span>
                </React.Fragment>
              ))}
            </div>
            {post.commentCount !== undefined && (
              <div className="flex items-center gap-1.5 text-neutral-500">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-medium">{post.commentCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
