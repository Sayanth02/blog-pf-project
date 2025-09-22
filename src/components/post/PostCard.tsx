import Image from "next/image";
import React from "react";
import BookmarkButton from "./BookMarkButton";

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

const PostCard = ({ post, showBookmarkButton = true }: { post: Post; showBookmarkButton?: boolean }) => {
  return (
    <div className="rounded-lg shadow-md bg-neutral-100 hover:shadow-lg transition-shadow duration-300 relative">
      {/* Thumbnail */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={post.thumbnail || "/images/hero.jpg"}
        alt={post.title}
        className=" lg:rounded-t-lg w-full object-cover aspect-[2/1]"
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
      {showBookmarkButton && (
        <BookmarkButton postId={post._id} initialBookmarked={post.isBookmarked} />
      )}
    </div>
  );
};

export default PostCard;
