import React, { useRef } from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BlogCard from "./BlogCard";
import type { BlogPost } from "../types/BlogPost";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const dotStyle = `
  .slick-dots {
    position: relative !important;
    bottom: 0 !important;
    margin: 20px 0 0 0 !important;
    padding: 0 !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    gap: 8px !important;
    list-style: none !important;
    z-index: 10 !important;
  }
  .slick-dots li {
    margin: 0 4px !important;
    padding: 0 !important;
    width: 8px !important;
    height: 8px !important;
  }
  .slick-dots li button {
    width: 8px !important;
    height: 8px !important;
    padding: 0 !important;
    border: none !important;
    border-radius: 4px !important;
    background: var(--primary) !important;
    opacity: 0.3 !important;
    transition: all 0.3s ease !important;
    text-indent: -9999px;
  }
  .slick-dots li button:before {
    display: none !important;
  }
  .slick-dots li.slick-active button {
    width: 24px !important;
    background: hsl(var(--primary)) !important;
    opacity: 1 !important;
  }
`;

if (typeof document !== "undefined") {
  const existingStyle = document.getElementById("slick-dots-style");
  if (existingStyle) existingStyle.remove();
  const style = document.createElement("style");
  style.id = "slick-dots-style";
  style.textContent = dotStyle;
  document.head.appendChild(style);
}

interface BlogCarouselProps {
  posts: BlogPost[];
}

const BlogCarousel: React.FC<BlogCarouselProps> = ({ posts }) => {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    centerMode: true,
    centerPadding: "0%",
    dotsClass: "slick-dots",
    customPaging: () => <button />,
  };

  return (
    <div className="relative">
  
      <button
        onClick={() => sliderRef.current?.slickPrev()}
        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-8 md:-ml-12 z-10 bg-background/90 hover:bg-background p-2 rounded-full shadow-lg border border-border"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-foreground" />
      </button>

  
      <Slider ref={sliderRef} {...settings} className="px-2">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </Slider>

      <button
        onClick={() => sliderRef.current?.slickNext()}
        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-8 md:-mr-12 z-10 bg-background/90 hover:bg-background p-2 rounded-full shadow-lg border border-border"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-foreground" />
      </button>
    </div>
  );
};

export default BlogCarousel;
