"use client";
import HeroCarousel from "@/components/home/hero/HeroCarousel";
import FtPost from "@/components/post/FtPost";
import CategoryBar from "@/components/category/CategoryBar";
import Card from "@/components/home/explore/card";
import About from "@/components/about/About";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 lg:gap-20 ">
      <HeroCarousel />
      <FtPost />
      {/* <Card /> */}
      <About/>
      <CategoryBar/>
    </div>
  );
}
