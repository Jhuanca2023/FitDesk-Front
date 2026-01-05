
import trainer222Image from '@/assets/trainer222.png';
import celularImage from '@/assets/celular.png';
import { useState, useEffect, useRef } from 'react';

const NuestraHistoria = () => {
  const [activeImage, setActiveImage] = useState('trainer');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isImageTransitioning, setIsImageTransitioning] = useState(false);
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

  const handleImageChange = () => {
    setIsImageTransitioning(true);
    setTimeout(() => {
      setActiveImage(activeImage === 'trainer' ? 'celular' : 'trainer');
      setShowAnswer(!showAnswer);
      setTimeout(() => {
        setIsImageTransitioning(false);
      }, 50);
    }, 250);
  };

  return (
    <>
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

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

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

        .image-transition {
          transition: opacity 0.5s ease-in-out;
        }

        .image-fade-out {
          opacity: 0;
        }

        .image-fade-in {
          opacity: 1;
        }

        .fade-in-up:nth-child(1) { animation-delay: 0.1s; }
        .fade-in-up:nth-child(2) { animation-delay: 0.2s; }
        .fade-in-up:nth-child(3) { animation-delay: 0.3s; }
        .fade-in-up:nth-child(4) { animation-delay: 0.4s; }

                 .diagonal-img-main {
           background-color: #8b454f38;
           position: relative;
           overflow: hidden;
         }

        .diagonal-img-toright {
          position: relative;
        }

        .diagonal-img-toright::before {
          display: none;
        }

        .diagonal-img-toright img {
          position: relative;
          z-index: 2;
          clip-path: polygon(20% 0, 100% 0, 100% 100%, 0% 100%);
        }

        .historia-italic {
          position: relative;
          display: inline-block;
        }

                 .historia-italic::after {
           content: '';
           position: absolute;
           left: calc(100% + 20px);
           top: 50%;
           transform: translateY(-50%);
           width: 140px;
           height: 2px;
           background: var(--primary);
         }

        @media (max-width: 1024px) {
          .diagonal-img-toright {
            margin-top: 0;
          }
          
          .diagonal-img-toright::before {
            display: none;
          }

          .diagonal-img-toright img {
            clip-path: none;
          }

          .historia-italic::after {
            display: none;
          }
        }
      `}</style>

      <div ref={sectionRef} className="diagonal-img-main py-16 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 lg:gap-2 items-start">
            
            {/* Columna Izquierda - Texto */}
            <div className={`text-white lg:pl-40 mt-16 lg:mt-24 fade-in-left ${isVisible ? 'animate' : ''}`}>
              <h3 className="text-left mb-1">
                <span className="block text-3xl lg:text-5xl font-extrabold tracking-tight leading-none mb-1">
                  NUESTRA
                </span>
                <span className="historia-italic block text-3xl lg:text-5xl font-light italic tracking-tight leading-none">
                  historia
                </span>
              </h3>

              <div className="space-y-0.5 text-white max-w-lg">
                <p className={`text-sm lg:text-base leading-tight fade-in-up ${isVisible ? 'animate' : ''}`} style={{ transitionDelay: '0.1s' }}>
                  <strong>Fundada en 2025, FitDesk es una plataforma innovadora que conecta entrenadores personales con clientes a través de tecnología de vanguardia.</strong>
                </p>

                <p className={`text-sm lg:text-base leading-tight fade-in-up ${isVisible ? 'animate' : ''}`} style={{ transitionDelay: '0.2s' }}>
                  Nuestra misión es democratizar el acceso a entrenamiento personalizado de calidad, eliminando las barreras geográficas y de tiempo tradicionales.
                </p>

                <p className={`text-sm lg:text-base leading-tight fade-in-up ${isVisible ? 'animate' : ''}`} style={{ transitionDelay: '0.3s' }}>
                  <strong>FitDesk ofrece entrenamientos virtuales en tiempo real, seguimiento de progreso inteligente,</strong> rutinas personalizadas basadas en IA y una comunidad global de fitness que se adapta a tu estilo de vida y objetivos.
                </p>

                <p className={`text-sm lg:text-base leading-tight fade-in-up ${isVisible ? 'animate' : ''}`} style={{ transitionDelay: '0.4s' }}>
                  Con tecnología de punta y un enfoque centrado en el usuario, estamos revolucionando la forma en que las personas se conectan con el fitness, creando experiencias únicas y resultados medibles.
                </p>
              </div>

              {/* Sección de Preguntas */}
              <div className={`mt-8 fade-in-up ${isVisible ? 'animate' : ''}`} style={{ transitionDelay: '0.5s' }}>
                <div className="tab-container max-w-[800px] m-auto">
                  <div className="faq-item whitespace-normal group border-b-2 border-dashed last:border-0">
                    <div className="tab-title flex justify-between font-bold text-xl md:text-2xl items-center py-6 cursor-pointer" onClick={handleImageChange}>
                      <h3 className="pr-4 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-pink-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        ¿Cuál es la visión de FitDesk para el futuro del fitness?
                      </h3>
                      <div className="flex flex-shrink-0 h-12 w-12 rounded-full border-2 border-slate-100 justify-center items-center font-bold">
                        <span className="mb-2 text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-pink-500">{showAnswer ? '−' : '+'}</span>
                      </div>
                    </div>
                    
                    {/* Respuesta */}
                    <div className={`tab-content transition-all duration-200 ease-in-out overflow-hidden ${showAnswer ? 'h-auto opacity-100 pb-8' : 'h-0 opacity-0 pointer-events-none'}`}>
                      <div className="rich-text dark:text-white">
                        <p className="text-white text-sm lg:text-base leading-relaxed">
                          FitDesk nació de la visión de democratizar el acceso al fitness de calidad. Nuestro fundador, tras años de experiencia en el sector, identificó las barreras que impedían a las personas acceder a entrenamiento personalizado. La plataforma se desarrolló con la misión de conectar entrenadores expertos con clientes de todo el mundo, eliminando limitaciones geográficas y de tiempo. Nuestra historia se construye día a día con cada sesión exitosa y cada meta alcanzada por nuestros usuarios.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha - Imagen */}
            <div className={`flex items-center justify-center min-h-[400px] fade-in-right ${isVisible ? 'animate' : ''} mt-8 lg:mt-12`} style={{ transitionDelay: '0.3s' }}>
              <img 
                src={activeImage === 'trainer' ? trainer222Image : celularImage} 
                alt={activeImage === 'trainer' ? "FitDesk Trainer" : "FitDesk App"} 
                className={`w-full max-w-md h-auto object-contain image-transition ${isImageTransitioning ? 'image-fade-out' : 'image-fade-in'}`}
                style={{ display: 'block' }}
              />
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default NuestraHistoria;