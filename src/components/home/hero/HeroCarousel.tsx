"use client";
import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { getFeaturedPosts } from "@/services/postServices";
import FeaturedPostSlide from "./FeaturedPostSlide";
import HeroCarouselSkeleton from "./HeroCarouselSkeleton";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "./hero-carousel.css";

type Category = { _id: string; name: string };
type Author = {
  _id: string;
  username: string;
  profileDetails?: { profileImageUrl?: string };
};

export type FeaturedPost = {
  _id: string;
  title: string;
  slug: string;
  publishDate?: string;
  thumbnail?: string;
  summary?: string;
  categoryIds?: Category[];
  authorIds?: Author[];
};

const HeroCarousel = () => {
  const [posts, setPosts] = useState<FeaturedPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await getFeaturedPosts(50); // Fetch all featured posts
      if (mounted) {
        setPosts(data ?? []);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <HeroCarouselSkeleton />;
  }

  if (!loading && posts.length === 0) {
    return (
      <div className="w-full h-[600px] bg-neutral-100 flex items-center justify-center">
        <p className="text-neutral-500 text-lg">No featured posts available</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 py-8">
      <Swiper
        modules={[Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={true}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        className="h-[500px] md:h-[600px] w-full hero-swiper rounded-3xl overflow-hidden"
      >
        {posts.map((post) => (
          <SwiperSlide key={post._id}>
            <FeaturedPostSlide post={post} />
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom Navigation Controls Below Carousel */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <button 
          onClick={() => swiperRef.current?.slidePrev()}
          className="w-10 h-10 rounded-full bg-neutral-200 hover:bg-neutral-300 flex items-center justify-center transition-colors flex-shrink-0"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        {/* Custom Pagination Dots */}
        <div className="flex gap-2 items-center">
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => swiperRef.current?.slideToLoop(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                activeIndex === index ? 'bg-neutral-800' : 'bg-neutral-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <button 
          onClick={() => swiperRef.current?.slideNext()}
          className="w-10 h-10 rounded-full bg-neutral-200 hover:bg-neutral-300 flex items-center justify-center transition-colors flex-shrink-0"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HeroCarousel;
