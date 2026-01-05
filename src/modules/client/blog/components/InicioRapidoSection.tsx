import React from 'react';
import { Search, Gift, MapPin } from 'lucide-react';

const InicioRapidoSection: React.FC = () => {
  const quickLinks = [
    {
      icon: <Search className="h-8 w-8 text-primary lg:h-12 lg:w-12" />,
      title: 'Encuentra el club más cercano',
      link: '#'
    },
    {
      icon: <Gift className="h-8 w-8 text-primary lg:h-12 lg:w-12" />,
      title: 'Explora Beneficios Exclusivos',
      link: '#'
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary lg:h-12 lg:w-12" />,
      title: 'Visita virtual',
      link: '#'
    }
  ];

  return (
    <section className="px-6 py-16 lg:px-36 lg:py-20">
      <div className="m-auto max-w-[71.5rem]">
        <h2 className="text-foreground mb-6 text-center text-[2rem]/10 font-bold -tracking-[.015em] lg:mb-8 lg:text-5xl/[3.5rem]">
          Empieza hoy
        </h2>
        
        <div className="flex h-auto w-full flex-wrap items-center justify-center gap-4">
          {quickLinks.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="bg-background hover:shadow-lg flex flex-shrink flex-grow flex-col items-center justify-center self-stretch rounded-3xl p-4 shadow-[0_16px_32px_0px_rgba(4,16,35,0.08)] transition-all duration-200 hover:-translate-y-1 md:flex-1 lg:px-4 lg:py-6 basis-full"
            >
              <div className="text-primary flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 lg:h-16 lg:w-16">
                {item.icon}
              </div>
              <div className="mt-2 flex w-full items-center justify-center text-center text-base font-semibold text-foreground lg:mt-4 lg:text-lg">
                {item.title}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InicioRapidoSection;
