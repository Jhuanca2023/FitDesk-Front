import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { BlogPost } from "../types/BlogPost";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const truncatedDescription = post.description.length > 200 ? `${post.description.substring(0, 200)}...` : post.description;

  return (
    <div className="px-2 outline-none h-full">
      <div className="mx-auto flex flex-col overflow-hidden rounded-2xl bg-card text-card-foreground shadow-lg h-[24rem] md:flex-row">
        <div className="w-full flex-shrink-0 md:w-[40%] h-48 md:h-full">
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1 p-6 flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="mb-2 flex flex-wrap gap-2">
          
              {Array.isArray(post.categories) ? (
                post.categories.map((category, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
                  >
                    {category}
                  </span>
                ))
              ) : (
             
                <span className="inline-flex items-center bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">
                  {post.category || post.categories || 'Fitness'}
                </span>
              )}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3 line-clamp-2 leading-snug">
              {post.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-4">
              {truncatedDescription}
            </p>
          </div>

          <div className="mt-auto pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {post.date} • {post.readTime}
              </span>
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto text-primary hover:no-underline font-medium flex items-center text-sm hover:text-primary/80 transition-colors"
              >
                Leer más
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
