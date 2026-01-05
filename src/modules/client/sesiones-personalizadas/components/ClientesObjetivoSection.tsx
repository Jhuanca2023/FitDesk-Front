
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const ClientesObjetivoSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      className="pt-24 lg:pt-32 pb-16 lg:pb-24"
    >
      <div className="container mx-auto px-4 flex flex-col lg:flex-row-reverse justify-center items-center">
        
        {/* Right Section - Images */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex relative w-full lg:w-1/2 flex-col lg:pl-0 pb-6"
        >
          <div className="relative w-[472px] sm:w-[608px] lg:w-full m-auto my-6 lg:my-0 min-h-[352px] sm:min-h-[456px]">
            
            {/* Decorative SVG Background */}
            <div className="absolute -z-10 top-[-20px] left-[-10px]">
              <svg width="338" height="364" viewBox="0 0 338 364" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M335.69 179.922C337.589 144.392 331.331 109.173 300.874 79.9802c-37.49-35.9332-85.3-84.73039-150.003-77.20383C85.332 10.4001 77.7892 70.9497 45.4599 109.691c-19.133 22.928-39.10824 44.091-42.41643 70.231-3.695453 29.201 2.06966 57.394 23.00333 83.166 31.9737 39.364 57.7513 96.317 124.8242 98.829C217.713 364.42 253.044 309.937 290.561 272.993c28.506-28.071 43.319-59.2 45.129-93.071z" 
                  stroke="url(#paint0_linear_6480_101066_3)" 
                  strokeWidth="4"
                />
                <defs>
                  <linearGradient id="paint0_linear_6480_101066_3" x1="169" y1="362" x2="169" y2="2" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ff760d" />
                    <stop offset=".723958" stopColor="#fd4040" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Mobile Image 1 - Left */}
            <div className="z-20 absolute left-0 top-[-20px]">
              <img 
                style={{ maxWidth: 'none' }} 
                className="relative shadow-[0_20px_60px_rgba(0,0,0,0.3)] rounded-[24px] w-[150px] sm:rounded-[40px] sm:w-[192px]" 
                width="192" 
                height="416" 
                loading="lazy" 
                alt="elige tu entrenador" 
                src="https://res.cloudinary.com/dvjfemxbz/image/upload/fl_sanitize,c_scale,f_auto,q_60,w_480/Choose_your_coach_ES_yhgu2b.svg"
              />
            </div>

            {/* Mobile Image 2 - Center */}
            <div className="z-20 absolute left-[166px] sm:left-[206px] top-[40px]">
              <img 
                style={{ maxWidth: 'none' }} 
                className="relative shadow-[0_20px_60px_rgba(0,0,0,0.3)] rounded-[24px] w-[150px] sm:rounded-[40px] sm:w-[192px]" 
                width="192" 
                height="416" 
                loading="lazy" 
                alt="Obtenga las instrucciones de cada ejercicio" 
                src="https://res.cloudinary.com/dvjfemxbz/image/upload/fl_sanitize,c_scale,f_auto,q_60,w_480/Activity_player_bicycle_crunch_ES_odl9yz.svg"
              />
            </div>

            {/* Mobile Image 3 - Right */}
            <div className="z-20 absolute left-[332px] sm:left-[412px] top-[10px]">
              <img 
                style={{ maxWidth: 'none' }} 
                className="relative shadow-[0_20px_60px_rgba(0,0,0,0.3)] rounded-[24px] w-[150px] sm:rounded-[40px] sm:w-[192px]" 
                width="192" 
                height="416" 
                loading="lazy" 
                alt="Entrenamientos online" 
                src="https://res.cloudinary.com/dvjfemxbz/image/upload/fl_sanitize,c_scale,f_auto,q_60,w_480/Activity_player_seated_chest_press_ES_d5fwpu.svg"
              />
            </div>
          </div>
        </motion.div>

        {/* Left Section - Content Box */}
        <motion.a 
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          href="/es/form" 
          className="p-4 sm:p-8 pt-2 lg:p-12 w-full transition duration-200 group lg:hover:bg-[#3e1326] lg:hover:text-white cursor-pointer rounded-3xl lg:w-1/2 flex-col items-center lg:pr-12 lg:mr-4"
        >
          <div className="max-w-[800px] lg:m-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white lg:group-hover:text-white text-left lg:text-center pb-4">
              <span>Los clientes alcanzan</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#ff760d] to-[#fd4040] box-decoration-clone">
                su objetivo
              </span>
              <br />
              <span>con mejores rutinas de entrenamiento</span>
            </h2>
          </div>
          
          <div className="text-gray-800 dark:text-white/90 lg:group-hover:text-white pb-8">
            Analiza el progreso de tus clientes y comparte información detallada sobre sus logros para incrementar su motivación.
          </div>
          
          <div className="pb-6">
            <ul className="list-none space-y-0">
              <li className="flex items-center min-h-[32px] pl-14 mb-4 last:mb-0 text-gray-800 dark:text-white/90 lg:group-hover:text-white relative">
                <span className="absolute left-0 w-8 h-8 flex items-center justify-center text-green-500">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </span>
                Panel de control y gráficos con estadísticas
              </li>
              <li className="flex items-center min-h-[32px] pl-14 mb-4 last:mb-0 text-gray-800 dark:text-white/90 lg:group-hover:text-white relative">
                <span className="absolute left-0 w-8 h-8 flex items-center justify-center text-green-500">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </span>
                Más de 250 métricas disponibles
              </li>
              <li className="flex items-center min-h-[32px] pl-14 mb-4 last:mb-0 text-gray-800 dark:text-white/90 lg:group-hover:text-white relative">
                <span className="absolute left-0 w-8 h-8 flex items-center justify-center text-green-500">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </span>
                Descubre las tendencias de los clientes a simple vista
              </li>
            </ul>
          </div>
          
          <div className="flex flex-wrap">
            <div className="mr-4">
              <div className="flex rounded-full justify-center items-center self-center shrink-0 min-w-[200px] bg-primary transform transition duration-150 ease-in-out hover:-translate-y-1 hover:shadow-lg font-bold text-white px-6 py-[10.4px]">
                <div className="text-lg pb-[.2rem]">Reserva una demo</div>
                <div className="pl-2 pt-[2px]">
                  <svg fill="currentColor" width="12" height="12" viewBox="0 0 8 12" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <path d="M1.29006 2.12002l3.88 3.88-3.88 3.88C.900059 10.27.900059 10.9 1.29006 11.29 1.68006 11.68 2.31006 11.68 2.70006 11.29l4.59-4.58998c.39-.390000000000001.39-1.02.0-1.41l-4.59-4.59c-.39-.390001-1.02-.390001-1.41.0-.380001.39-.390001 1.03.0 1.42z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.a>
      </div>
    </motion.div>
  );
};

export default ClientesObjetivoSection;