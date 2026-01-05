import React from "react";
import BlogCarousel from "../components/BlogCarousel";
import UltimasSection from "../components/UltimasSection";
import EmpiezaHoySection from "../components/EmpiezaHoySection";
import InicioRapidoSection from "../components/InicioRapidoSection";
import blogPostsData from "../data/blog-posts.json";
import ultimasPostsData from "../data/ultimas-posts.json";
import type { BlogPost } from "../types/BlogPost";
import type { UltimaPost } from "../types/UltimaPost";

const BlogPage: React.FC = () => {
  const blogPosts: BlogPost[] = blogPostsData as BlogPost[];
  const ultimasPosts: UltimaPost[] = ultimasPostsData as UltimaPost[];

  return (
    <div className="min-h-screen flex flex-col">

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          <span className="text-primary">Blog</span> de FitDesk
        </h1>
      </div>

      {/* Carrusel */}
      <div className="w-full bg-gradient-to-b from-muted/30 to-primary/5 dark:from-muted/10 dark:to-transparent">
        <div className="w-full max-w-5xl mx-auto px-4 py-12">
          <BlogCarousel posts={blogPosts} />
        </div>
      </div>

      <UltimasSection posts={ultimasPosts} />
      <EmpiezaHoySection />
      <InicioRapidoSection />
    </div>
  );
};

export default BlogPage;