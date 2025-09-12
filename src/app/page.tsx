"use client";
import Hero from "@/components/home/hero/hero";
import PostCard from "@/components/post/PostCard";
import FtPost from "@/components/post/FtPost";
import Card from "@/components/home/explore/card";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 lg:gap-20 ">
      <Hero />
      <FtPost />
      <Card />
    </div>
  );
}
