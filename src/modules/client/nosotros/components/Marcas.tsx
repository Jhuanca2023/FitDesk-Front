
const Marcas = () => {
  const marcas = [
    {
      name: "FitDesk Pro",
      logo: "https://res.cloudinary.com/dvjfemxbz/image/upload/e_trim/c_scale,fl_lossy,f_auto,q_60,w_400/v1668769177/Logo-ES-Studio-Winfit.png"
    },
    {
      name: "FitDesk Coach",
      logo: "https://res.cloudinary.com/dvjfemxbz/image/upload/e_trim/c_scale,fl_lossy,f_auto,q_60,w_400/v1669714521/Logo-ES-Studio-Ufit-Boutique_yotdpj.png"
    },
    {
      name: "FitDesk AI",
      logo: "https://res.cloudinary.com/dvjfemxbz/image/upload/e_trim/c_scale,fl_lossy,f_auto,q_60,w_400/logo-es-pt-fit360.png"
    },
    {
      name: "FitDesk Community",
      logo: "https://res.cloudinary.com/dvjfemxbz/image/upload/e_trim/c_scale,fl_lossy,f_auto,q_60,w_400/logo-es-gym-saludando.png"
    },
    {
      name: "FitDesk Analytics",
      logo: "https://res.cloudinary.com/dvjfemxbz/image/upload/e_trim/c_scale,fl_lossy,f_auto,q_60,w_400/Nutrisalut_icqz9d.png"
    }
  ];

  return (
    <>
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .marca-item {
          opacity: 0;
          animation: fadeInScale 0.6s ease-out forwards;
        }

        .marca-item:hover {
          transform: scale(1.05);
          transition: transform 0.3s ease;
        }
      `}</style>

      <div className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          
          {/* Título de la sección */}
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Nuestras <span style={{ color: 'var(--ring)' }}>Marcas</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubre las diferentes marcas que forman parte de la familia FitDesk
            </p>
          </div>

          {/* Grid de Marcas */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12 items-center justify-items-center">
            {marcas.map((marca, index) => (
              <div
                key={index}
                className="marca-item flex items-center justify-center p-6 bg-transparent rounded-lg hover:shadow-xl transition-shadow duration-300 w-full h-32"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={marca.logo}
                  alt={marca.name}
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default Marcas;