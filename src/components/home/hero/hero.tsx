import Image from "next/image";
import React from "react";
import Button from "../../reusable/Button";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="p-16 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center rounded-md  bg-neutaral-lightest min-h-[500px]">
        <div className="bg-neutral-lighter p-8">
          <h1 className="text-7xl font-light ">
            Welcome to your
            <span className="block mt-2">Ultimate</span>
            <span className="block mt-2">Blogging</span>
            <span className="block mt-2">Platform</span>
          </h1>
          <p className="mt-2">
            Discover a space where creativity meets community. Join us today to
            explore, write, and share your thoughts with the world.
          </p>

          <div className="mt-4 flex gap-4">
           <Link href={'/signup'}> <Button label={"Sign Up"} /></Link>
            <Link href={'/signin'}><Button label={"Sign In"} variant="outlined" /></Link>
          </div>
        </div>

        <div className="relative w-full h-[500px]">
          {" "}
          <Image
            src="/images/hero.jpg"
            alt="hero image"
            fill
            className="object-cover rounded-md lg:rounded-e-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
