import { useState, useEffect, useRef } from 'react';
import hombreAtleticoImage from '@/assets/hombre-atletico.png';
import chicaEstirandoImage from '@/assets/chica-estirando-calle.png';

const ClaseSection = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);
  
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
  
      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }
  
      return () => {
        if (sectionRef.current) {
          observer.unobserve(sectionRef.current);
        }
      };
    }, []);
  
    return (
      <>
        <style>{`
          .fade-in-up {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease-out;
          }
  
          .fade-in-up.animate {
            opacity: 1;
            transform: translateY(0);
          }
  
          .fade-in-left {
            opacity: 0;
            transform: translateX(-30px);
            transition: all 0.8s ease-out;
          }
  
          .fade-in-left.animate {
            opacity: 1;
            transform: translateX(0);
          }
  
          .fade-in-right {
            opacity: 0;
            transform: translateX(30px);
            transition: all 0.8s ease-out;
          }
  
          .fade-in-right.animate {
            opacity: 1;
            transform: translateX(0);
          }
  
          .button-hover {
            transition: all 0.3s ease;
          }
  
          .button-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
          }
        `}</style>
  
        <section ref={sectionRef} className="py-20 lg:py-32 bg-background">
          <div className="container mx-auto px-4">
            
             {/* Título Superior */}
             <div className={`text-center mb-12 fade-in-up ${isVisible ? 'animate' : ''}`}>
               <h2 className="from-foreground to-foreground/30 bg-gradient-to-b bg-clip-text text-3xl font-bold text-transparent sm:text-4xl mb-6 tracking-widest">
                 EL MEJOR DESTINO DE <span className="text-primary">FITNESS DE PERÚ</span>
               </h2>
               <p className="text-base lg:text-xl text-muted-foreground tracking-wide">
                 ÚNETE HOY CON UNA INSCRIPCIÓN DE $0 + UNA MEMBRESÍA DE $55 AL MES
               </p>
             </div>
  
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center mt-16">
              
              {/* Imagen Izquierda */}
              <div className={`fade-in-left ${isVisible ? 'animate' : ''}`} style={{ transitionDelay: '0.2s' }}>
                <div className="relative">
                   <img 
                     src={hombreAtleticoImage} 
                     alt="Hombre atlético" 
                     className="w-full h-auto object-cover"
                   />
                </div>
              </div>
  
              {/* Contenido Central - Botón */}
              <div className={`text-center fade-in-up ${isVisible ? 'animate' : ''}`} style={{ transitionDelay: '0.4s' }}>
                <button className="button-hover bg-primary text-primary-foreground px-10 py-5 rounded-md font-bold text-lg uppercase tracking-widest shadow-xl hover:bg-primary/90 inline-flex items-center gap-3">
                  RECLAMA TU MEMBRESÍA
                  <span className="text-2xl">→</span>
                </button>
  
                <p className="text-sm text-muted-foreground mt-8 font-medium tracking-wider">
                  OFERTA POR TIEMPO LIMITADO
                </p>
              </div>
  
              {/* Imagen Derecha */}
              <div className={`fade-in-right ${isVisible ? 'animate' : ''}`} style={{ transitionDelay: '0.6s' }}>
                <div className="relative">
                   <img 
                     src={chicaEstirandoImage} 
                     alt="Mujer estirando" 
                     className="w-full h-auto object-cover"
                   />
                </div>
              </div>
  
            </div>
          </div>
        </section>
      </>
    );
  };
  
  export default ClaseSection;