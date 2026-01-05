import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { UltimaPost } from '../types/UltimaPost';

interface UltimasSectionProps {
  posts: UltimaPost[];
}

const UltimasSection: React.FC<UltimasSectionProps> = ({ posts }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('Últimas');
  const itemsPerPage = 6;


  const categories = [
    'Últimas',
    'Guía de ejercicios',
    'Educación y Consejo',
    'Nutrición',
    'Salud Mental',
    'Consejos para principiantes',
    'Motivación',
    'Beneficios para miembros',
    'Soporte en el gimnasio'
  ];


  const filteredBlogs = activeFilter === 'Últimas' 
    ? posts 
    : posts.filter(post => post.category === activeFilter || post.tags.includes(activeFilter));

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    const blogSection = document.getElementById('blog-entries');
    if (blogSection) {
      const offset = 100;
      window.scrollTo({ top: blogSection.offsetTop - offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-background py-8 w-full">
  <div className="w-full">
   
<div className="mb-8 w-full px-4">
  <div className="relative">
    <div className="hidden md:flex flex-wrap justify-center gap-3">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleFilterChange(category)}
          className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
            activeFilter === category
              ? 'bg-gradient-to-r from-primary to-primary/80 text-white hover:from-primary/90 hover:to-primary/70 shadow-md'
              : 'bg-gradient-to-r from-muted/50 to-muted/30 text-foreground/80 hover:from-muted/60 hover:to-muted/40'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
    <div className="md:hidden overflow-x-auto -mx-2 px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      <div className="flex gap-3 w-max">
        {categories.map((category) => (
          <button
            key={`mobile-${category}`}
            onClick={() => handleFilterChange(category)}
            className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all flex-shrink-0 ${
              activeFilter === category
                ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-md'
                : 'bg-gradient-to-r from-muted/50 to-muted/30 text-foreground/80'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  </div>
</div>

{/* Línea divisora */}
<div className="border-b border-border w-full mb-8" />


        <h1 className="text-5xl font-bold text-center mb-12 text-foreground">{activeFilter}</h1>

 
<div id="blog-entries" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 px-4 max-w-6xl mx-auto">
  {currentBlogs.map((blog) => (
    <div 
      key={blog.id} 
      className="group relative bg-card/40 border border-border/30 rounded-[1.5rem] p-0 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Imagen */}
      <div className="h-[11.625rem] w-full overflow-hidden">
        <img 
          src={blog.image} 
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      
      {/* Contenido */}
      <div className="p-4">
        {/* Tags */}
        <div className="flex gap-2 pb-2">
          {blog.tags.slice(0, 2).map((tag, index) => (
            <span 
              key={index}
              className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300 whitespace-nowrap rounded px-2 py-1 text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Título */}
        <div className="h-12 flex items-center">
          <h3 className="line-clamp-2 text-lg font-semibold leading-6">
            {blog.title}
          </h3>
        </div>
        
        {/* Botón Leer más */}
        <a 
          href={`/es/blog/articles/${blog.slug}`} 
          className="text-primary hover:underline mt-3 inline-flex items-center text-lg font-semibold leading-6"
          data-discover="true"
        >
          Leer más
        </a>
      </div>
    </div>
  ))}
</div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 px-4">
            <button 
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-full border-2 border-muted-foreground/20 hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} className="text-foreground" />
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => goToPage(index + 1)}
                className={`w-10 h-10 rounded-full font-semibold transition-all ${
                  currentPage === index + 1
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border-2 border-muted-foreground/20 hover:bg-muted/50 text-foreground'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button 
              onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full border-2 border-muted-foreground/20 hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} className="text-foreground" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UltimasSection;