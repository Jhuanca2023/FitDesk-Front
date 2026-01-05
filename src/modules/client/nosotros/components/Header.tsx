import { Counter } from './Counter';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export const Header = () => {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);
  const statsRef = useRef(null);

  const statsData = [
    { value: 10000, label: "Negocios", suffix: "" },
    { value: 50000, label: "Entrenadores", suffix: "" },
    { value: 30, label: "Consumidores", suffix: "M" },
    { value: 80, label: "Países", suffix: "" }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Decorative Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-60 h-60 bg-primary/30 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-primary/30 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/30 rounded-full blur-3xl opacity-40"></div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        @keyframes numberGlow {
          0%, 100% {
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
          }
          50% {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4);
          }
        }

        .number-glow {
          animation: numberGlow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Hero Section */}
      <div ref={heroRef} className="pt-16 lg:pt-24 pb-16 lg:pb-24">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <div className="lg:flex justify-center items-center flex-col">
            <motion.div 
              className="max-w-[800px] lg:m-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-foreground text-center pb-4 leading-tight">
                <span>Haciendo del mundo </span>
                <span className="text-primary">un lugar más sano y feliz</span>
                <span> a través de la tecnología innovadora</span>
              </h1>
            </motion.div>
            <motion.div 
              className="pb-6 font-semibold max-w-[800px] text-lg md:text-xl text-center text-muted-foreground"
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              FitDesk es una empresa líder en el sector de la salud y el fitness digital, con soluciones punteras de coaching, gestión y compromiso para poner en forma tu negocio de fitness.
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div 
        ref={statsRef}
        className="pt-4 lg:pt-6 pb-16 lg:pb-24"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="container mx-auto px-4 py-2 lg:py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <motion.div 
              key={index} 
              className="text-center"
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.8 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.6 + (index * 0.15),
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <motion.div 
                className="text-3xl md:text-4xl font-extrabold text-foreground pb-2 number-glow"
                initial={{ scale: 0.3, opacity: 0 }}
                animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0.3, opacity: 0 }}
                transition={{ 
                  duration: 1.2, 
                  delay: 0.8 + (index * 0.15),
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ 
                  scale: 1.1,
                  transition: { duration: 0.3 }
                }}
              >
                <Counter end={stat.value} suffix={stat.suffix} />
              </motion.div>
              <motion.div 
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 1.0 + (index * 0.15)
                }}
              >
                {stat.label}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default Header;