import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, Calendar, User } from "lucide-react";
import { deletePost } from "@/services/postServices";
import { toast } from "sonner";

type Category = { _id: string; name: string }
type Author = { _id: string; username: string; profileDetails?: profileDetails };
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
};

type PostCardProps = {
  post: Post;
  isOwner?: boolean;
  showActions?: boolean;
  onDelete?: (postId: string) => void;
  variant?: 'default' | 'manage';
};

const PostCard = ({
  post,
  isOwner = false,
  showActions = false,
  onDelete,
  variant = 'default',
}: PostCardProps) => {
  const router = useRouter();

  const handleView = () => {
    router.push(`/post/${post._id}`);
  };

  const handleEdit = () => {
    router.push(`/edit/${post._id}`);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
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
  const getContentPreview = (content: string, maxLength: number = 120) => {
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    return textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...' 
      : textContent;
  };
  return (
    <div className="rounded-lg shadow-md bg-neutral-100 hover:shadow-lg transition-shadow duration-300 relative">
      {/* Thumbnail */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={post.thumbnail || "/images/hero.jpg"}
        alt={post.title}
        className=" lg:rounded-t-lg w-full object-cover aspect-[2/1] relative"
      />

      <div className="p-4 space-y-2">
        {post.categoryIds?.map((cat) => (
          <span
            key={cat._id}
            className="font-semibold text-sm text-neutral-600 mr-2"
          >
            {cat.name}
          </span>
        ))}

        <h1 className="font-bold text-lg mt-2">{post.title}</h1>
        <p className="text-neutral-700 text-sm">
          This is a long description paragraph
        </p>
        <div className="flex items-center gap-4 mt-4">
          {post.authorIds?.map((author) => (
            <div key={author._id} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-300 flex-shrink-0">
                <Image
                  src={
                    author.profileDetails?.profileImageUrl ||
                    "/images/avatar.png"
                  }
                  alt={author.username}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">
                  {author.username || "Unknown Author"}
                </span>
                {post.publishDate && (
                  <span className="text-xs text-neutral-500">
                    {new Date(post.publishDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
