import Image from "next/image";
import React from "react";

type Category = { _id: string; name: string };
type Post = {
  id: string;
  title: string;
  content: string;
  categoryIds?: Category[];
  author?: string;
  date?: string;
  thumbnail?: string;
};


const PostCard = ({post}: {post:Post}) => {
  return (
    <div className="rounded-lg shadow-md bg-neutral-100 hover:shadow-lg transition-shadow duration-300 ">
      <Image
        src="/images/hero.jpg"
        alt="Post image"
        width={600}
        height={300}
        className=" lg:rounded-t-lg w-full object-cover aspect-[2/1]"
        priority
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
            <span className="font-semibold text-sm">Author Name</span>
            <p className="text-xs text-neutral-500">Date</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
