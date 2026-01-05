
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const PlanesPapelSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      className="relative pt-16 lg:pt-24 pb-16 lg:pb-24 bg-gray-100 dark:bg-transparent overflow-hidden"
    >
      {/* Top Wave */}
  <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] text-white dark:text-transparent">
        <svg className="relative block w-full h-[60px] sm:h-[80px]" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 C150,80 350,80 600,50 C850,20 1050,20 1200,50 L1200,0 L0,0 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Bottom Wave */}
  <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180 text-white dark:text-transparent">
        <svg className="relative block w-full h-[60px] sm:h-[80px]" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 C150,80 350,80 600,50 C850,20 1050,20 1200,50 L1200,0 L0,0 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-center items-center relative z-10">
        
        {/* Left Section - Images */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex relative w-full lg:w-1/2 flex-col lg:pr-0 pb-6"
        >
          <div className="relative min-h-[420px] sm:min-h-[520px]">
            
            {/* Decorative SVG Background */}
            <div className="absolute -z-10 top-[-10px] lg:top-[-20px] right-[-10px]">
              <svg width="338" height="364" viewBox="0 0 338 364" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M335.69 179.922C337.589 144.392 331.331 109.173 300.874 79.9802c-37.49-35.9332-85.3-84.73039-150.003-77.20383C85.332 10.4001 77.7892 70.9497 45.4599 109.691c-19.133 22.928-39.10824 44.091-42.41643 70.231-3.695453 29.201 2.06966 57.394 23.00333 83.166 31.9737 39.364 57.7513 96.317 124.8242 98.829C217.713 364.42 253.044 309.937 290.561 272.993c28.506-28.071 43.319-59.2 45.129-93.071z" 
                  stroke="url(#paint0_linear_6480_101066_2)" 
                  strokeWidth="4"
                />
                <defs>
                  <linearGradient id="paint0_linear_6480_101066_2" x1="169" y1="362" x2="169" y2="2" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ff760d" />
                    <stop offset=".723958" stopColor="#fd4040" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Desktop Image */}
            <div className="absolute z-10 bottom-[40px] right-[62px]">
              <img 
                style={{ maxWidth: 'none' }} 
                className="relative w-[625px] rounded-[16px] sm:w-[800px] !max-w-none shadow-[0_20px_60px_rgba(0,0,0,0.3)] sm:rounded-[24px]" 
                width="800" 
                height="480" 
                loading="lazy" 
                alt="No más planes en papel, crea fácilmente planes de entrenamiento virtuales" 
                src="https://res.cloudinary.com/dgtgmsqo7/image/upload/v1761168347/WhatsApp_Image_2025-10-22_at_4.15.04_PM_dr7fbf.jpg"
              />
            </div>

            {/* Mobile Image */}
            <div className="absolute z-20 right-0 bottom-0">
              <img 
                style={{ maxWidth: 'none' }} 
                className="relative shadow-[0_20px_60px_rgba(0,0,0,0.3)] rounded-[24px] w-[150px] sm:rounded-[40px] sm:w-[192px]" 
                width="192" 
                height="416" 
                loading="lazy" 
                alt="Empieza a utilizar la mayor base de datos de ejercicios para crear los mejores entrenamientos" 
                src="https://res.cloudinary.com/dvjfemxbz/image/upload/fl_sanitize,c_scale,f_auto,q_60,w_480/Activity_player_chest_fly_ES_usmxlc.svg"
              />
            </div>
          </div>
        </motion.div>

        {/* Right Section - Content */}
        <motion.a 
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          href="/es/form" 
          className="p-4 sm:p-8 pt-2 lg:p-12 w-full transition duration-200 group lg:hover:bg-[#3e1326] lg:hover:text-white cursor-pointer rounded-2xl lg:w-1/2 flex flex-col items-center lg:pl-12 lg:ml-4 dark:text-white"
        >
          <div className="max-w-[800px] lg:m-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-left lg:text-center pb-4">
              <span className="text-gray-900 lg:group-hover:text-white dark:text-white">Dile adiós </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#ff760d] to-[#fd4040] dark:from-[#ff9a5c] dark:to-[#ff6b6b] box-decoration-clone">
                a los planes de entrenamiento en papel
              </span>
            </h2>
          </div>
          
          <div className="rich-text text-neutral-800 lg:group-hover:text-white pb-8 dark:text-gray-200">Olvídate de utilizar hojas de cálculo o papeles para la creación de planes de entrenamiento y ponte manos a la obra trabajando con un planificador de entrenamientos profesional.</div>
          
          <div className="pb-6 w-full">
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 mt-1 mr-3 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-neutral-800 lg:group-hover:text-white dark:text-gray-200">Crea planes de entrenamiento digitales</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 mt-1 mr-3 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-neutral-800 lg:group-hover:text-white dark:text-gray-200">Trabaja con una base de datos con más de 6.000 ejercicios</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 mt-1 mr-3 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-neutral-800 lg:group-hover:text-white dark:text-gray-200">Ahorra tiempo creando y duplicando plantillas</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-wrap justify-start w-full mt-4">
            <a 
              href="/es/form" 
              className="flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white transition-all duration-200 ease-in-out rounded-full shadow-lg lg:text-lg bg-primary hover:opacity-90 hover:shadow-xl hover:scale-105"
            >
              <span>Habla con un experto</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </motion.a>
      </div>
    </motion.div>
  );
};

export default PlanesPapelSection;