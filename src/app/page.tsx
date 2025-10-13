"use client";
import HeroCarousel from "@/components/home/hero/HeroCarousel";
import FtPost from "@/components/post/FtPost";
import Card from "@/components/home/explore/card";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 lg:gap-20 ">
      <HeroCarousel />
      <FtPost />
      <Card />
    </div>
  );
}
