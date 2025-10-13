import React from "react";

const HeroCarouselSkeleton = () => {
  return (
    <div className="w-full px-4 md:px-8 lg:px-16 py-8">
      <div className="w-full h-[500px] md:h-[600px] bg-neutral-200 animate-pulse relative rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-300 to-neutral-200" />
        
        <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12 lg:p-16">
          {/* Category Badge Skeleton */}
          <div className="mb-4">
            <div className="inline-block w-32 h-8 bg-neutral-300 rounded-full" />
          </div>

          {/* Title Skeleton */}
          <div className="space-y-3 mb-4 max-w-4xl">
            <div className="h-10 md:h-12 lg:h-14 bg-neutral-300 rounded-md w-full" />
            <div className="h-10 md:h-12 lg:h-14 bg-neutral-300 rounded-md w-3/4" />
          </div>

          {/* Summary Skeleton */}
          <div className="space-y-2 mb-6 max-w-3xl">
            <div className="h-5 bg-neutral-300 rounded-md w-full" />
            <div className="h-5 bg-neutral-300 rounded-md w-2/3" />
          </div>

          {/* Meta Information Skeleton */}
          <div className="flex items-center gap-4">
            <div className="h-4 w-24 bg-neutral-300 rounded-md" />
            <div className="h-4 w-4 bg-neutral-300 rounded-full" />
            <div className="h-4 w-32 bg-neutral-300 rounded-md" />
          </div>
        </div>
      </div>
      
      {/* Navigation Skeleton */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <div className="w-10 h-10 rounded-full bg-neutral-200 animate-pulse" />
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-neutral-200 animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-neutral-200 animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-neutral-200 animate-pulse" />
        </div>
        <div className="w-10 h-10 rounded-full bg-neutral-200 animate-pulse" />
      </div>
    </div>
  );
};

export default HeroCarouselSkeleton;
