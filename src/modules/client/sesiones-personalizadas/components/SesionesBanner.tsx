import { FileText, TrendingUp, Dumbbell } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const SesionesBanner = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const features = [
    {
      icon: FileText,
      title: "Sustituye los planes de entrenamiento en papel",
      description: "Crea y comparte planes de entrenamiento personalizados con un simple clic: siempre disponibles, fáciles de editar y duplicar."
    },
    {
      icon: TrendingUp,
      title: "Sigue el rendimiento de tus clientes",
      description: "Optimiza el entrenamiento con gráficos y análisis fáciles de entender."
    },
    {
      icon: Dumbbell,
      title: "Más de 6.000 ejercicios disponibles en 3D",
      description: "Incrementa la motivación de tus clientes con rutinas de ejercicio dinámicas y efectivas."
    }
  ];

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      className="pt-16 lg:pt-24 pb-8 lg:pb-16"
    >
      <div className="container mx-auto px-4 flex flex-col-reverse lg:flex-row-reverse justify-center items-center">
        
        {/* Right Section - Images */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex relative w-full lg:w-1/2 flex-col lg:pl-0 pb-0"
        >
          <div className="relative min-h-[420px] sm:min-h-[520px]">
            
            {/* Decorative SVG Background */}
            <div className="absolute -z-10 top-[-10px] lg:top-[-20px] left-[-10px]">
              <svg width="338" height="364" viewBox="0 0 338 364" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M335.69 179.922C337.589 144.392 331.331 109.173 300.874 79.9802c-37.49-35.9332-85.3-84.73039-150.003-77.20383C85.332 10.4001 77.7892 70.9497 45.4599 109.691c-19.133 22.928-39.10824 44.091-42.41643 70.231-3.695453 29.201 2.06966 57.394 23.00333 83.166 31.9737 39.364 57.7513 96.317 124.8242 98.829C217.713 364.42 253.044 309.937 290.561 272.993c28.506-28.071 43.319-59.2 45.129-93.071z" 
                  stroke="url(#paint0_linear_6480_101066)" 
                  strokeWidth="4"
                />
                <defs>
                  <linearGradient id="paint0_linear_6480_101066" x1="169" y1="362" x2="169" y2="2" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ff760d" />
                    <stop offset=".723958" stopColor="#fd4040" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Desktop Image */}
            <div className="absolute z-10 bottom-[40px] left-[62px]">
              <img 
                style={{ maxWidth: 'none' }} 
                className="relative w-[625px] rounded-[16px] sm:w-[800px] !max-w-none shadow-[0_20px_60px_rgba(0,0,0,0.3)] sm:rounded-[24px]" 
                width="800" 
                height="480" 
                loading="eager" 
                src="https://res.cloudinary.com/dgtgmsqo7/image/upload/v1761168328/WhatsApp_Image_2025-10-22_at_4.15.04_PM_2_viw1gn.jpg" 
                alt="Crea tus propios entrenamientos virtuales para clientes y empieza a ahorrar tiempo"
              />
            </div>

            {/* Mobile Image */}
            <div className="absolute z-20 left-0 bottom-0">
              <img 
                style={{ maxWidth: 'none' }} 
                className="relative shadow-[0_20px_60px_rgba(0,0,0,0.3)] rounded-[24px] w-[150px] sm:rounded-[40px] sm:w-[192px]" 
                width="192" 
                height="416" 
                loading="eager" 
                src="https://res.cloudinary.com/dvjfemxbz/image/upload/fl_sanitize,c_scale,f_auto,q_60,w_480/Workout_detail_ES_rqyipu.svg" 
                alt="Crear, asignar y seguir los entrenamientos de los clientes"
              />
            </div>
          </div>
        </motion.div>

        {/* Left Section - Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full lg:w-1/2 flex-col items-center text-center lg:text-left lg:pr-12 pb-10"
        >
          <div className="max-w-[800px] m-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center lg:text-left">
              <span className="block">Conecta con los mejores</span>
              <span className="text-primary">
                coaches de fitness personalizados
              </span>
            </h1>
          </div>
          
          <div className="pb-6 font-bold max-w-[800px] text-lg md:text-xl">
            Descubre una nueva forma de entrenar con sesiones 100% personalizadas. Nuestros coaches certificados diseñarán un plan a tu medida, adaptado a tus objetivos y ritmo. Accede a entrenamientos exclusivos, seguimiento en tiempo real y la motivación que necesitas para alcanzar tus metas de forma efectiva y segura.
          </div>
          
          <div className="flex flex-wrap">
            <div className="w-full first:pb-4 md:mr-4 lg:w-auto">
              <a 
                href="/es/form" 
                className="flex rounded-full justify-center items-center self-center shrink-0 w-full min-w-[200px] bg-primary hover:bg-primary/90 transition-all duration-300 text-white px-8 py-3.5 font-bold text-lg hover:shadow-lg hover:scale-105 transform"
              >
                <span className="pb-[.2rem]">Solicita Una Demo y Precios</span>
                <span className="ml-2">
                  <svg fill="#fff" width="12" height="12" viewBox="0 0 8 12" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.29006 2.12002l3.88 3.88-3.88 3.88C.900059 10.27.900059 10.9 1.29006 11.29 1.68006 11.68 2.31006 11.68 2.70006 11.29l4.59-4.58998c.39-.390000000000001.39-1.02.0-1.41l-4.59-4.59c-.39-.390001-1.02-.390001-1.41.0-.380001.39-.390001 1.03.0 1.42z" fill="#fff" />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Feature Cards Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="container mx-auto px-4 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.5 + (index * 0.1) }}
              className="transition duration-200 border rounded-lg p-8 hover:shadow-lg"
            >
              <div>
                <div className="flex-shrink-0 mb-4">
                  <svg width="0" height="0">
                    <defs>
                      <linearGradient id={`icon-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#f97316' }} />
                        <stop offset="100%" style={{ stopColor: '#ec4899' }} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <feature.icon 
                    className="h-10 w-10" 
                    style={{ stroke: `url(#icon-gradient-${index})` }}
                    strokeWidth={2}
                    fill="none"
                  />
                </div>
                <h4 className="font-bold text-xl pb-2">{feature.title}</h4>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SesionesBanner;