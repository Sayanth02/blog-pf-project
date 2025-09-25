"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { deletePost } from "@/services/postServices";
import { toast } from "sonner";

interface PostActionsProps {
  postId: string;
  onDelete?: () => void;
  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
}

const PostActions: React.FC<PostActionsProps> = ({
  postId,
  onDelete,
  showView = true,
  showEdit = true,
  showDelete = true,
}) => {
  const router = useRouter();

  const handleView = () => {
    router.push(`/post/${postId}`);
  };

  const handleEdit = () => {
    router.push(`/edit/${postId}`);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }

    try {
      await deletePost(postId);
      toast.success("Post deleted successfully!");
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="flex gap-2">
      {showView && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleView}
          className="flex items-center gap-1"
        >
          <Eye className="h-3 w-3" />
          View
        </Button>
      )}
      {showEdit && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleEdit}
          className="flex items-center gap-1"
        >
          <Edit className="h-3 w-3" />
          Edit
        </Button>
      )}
      {showDelete && (
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-3 w-3" />
          Delete
        </Button>
      )}
    </div>
  );
};

export default PostActions;
