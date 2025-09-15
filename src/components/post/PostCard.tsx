import Image from "next/image";
import React from "react";

type Category = { _id: string; name: string }
type Author = { _id: string; username: string };
type Post = {
  id: string;
  title: string;
  content: string;
  categoryIds?: Category[];
  authorIds?: Author[];
  publishDate?: string;
  thumbnail?: string;
};

const PostCard = ({ post }: { post: Post }) => {
  return (
    <div className="rounded-lg shadow-md bg-neutral-100 hover:shadow-lg transition-shadow duration-300 ">
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
        <div className="flex items-center gap-3 mt-4">
          <div className="w-10 h-10 rounded-full bg-neutral-300 overflow-hidden flex items-center justify-center">
            {/* Optionally add author image here */}
          </div>
          <div>
            {post.authorIds?.map((auth) => (
              <span className="font-semibold text-sm">
                {auth?.username || "Unknown Author"}
              </span>
            ))}
            <p className="text-xs text-neutral-500">
              {post.publishDate
                ? new Date(post.publishDate).toLocaleDateString()
                : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
