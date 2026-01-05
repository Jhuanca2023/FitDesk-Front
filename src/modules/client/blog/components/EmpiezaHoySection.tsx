import React from 'react';
import { ArrowRight } from 'lucide-react';

const EmpiezaHoySection: React.FC = () => {
  const articles = [
    {
      tags: ['Beneficios para miembros', 'Soporte en el gimnasio'],
      title: 'Gimnasio que no pasa el tiempo: Las ventajas de los gimnasios con horario flexible',
      excerpt: 'Encontrar tiempo para la actividad física en el acelerado mundo de hoy puede ser un desafío. Lo entendemos por completo. Hacer malabares con el trabajo, el cuidado de los niños y las obligaciones sociales a menudo deja poco espacio para el ejercicio regular.',
      link: '#'
    },
    {
      tags: ['Guía de ejercicios'],
      title: 'Ejercicios de fútbol: Una guía de gimnasia para mejorar su juego en la escuela secundaria',
      excerpt: '¡El rugido de la multitud, la emoción en el campo, la búsqueda de anotar un GOOOOOOOAL! Si eres un jugador de fútbol de la escuela secundaria, sabes que los partidos emocionantes pueden ser.',
      link: '#'
    },
    {
      tags: ['Educación y Consejo', 'Guía de ejercicios'],
      title: 'Adoptar el entrenamiento físico funcional: Desbloquear 12 ejercicios funcionales de acondicionamiento físico para desarrollar fuerza',
      excerpt: 'El entrenamiento físico funcional ha ganado popularidad debido a su énfasis en los patrones de movimiento de la vida real y los beneficios físicos generales.',
      link: '#'
    }
  ];

  return (
    <section className="w-full bg-gradient-to-b from-muted/30 to-primary/5 px-6 pb-8 pt-16 dark:from-muted/10 dark:to-transparent md:py-16 lg:px-36 lg:py-20">
      <div className="m-auto max-w-[71.5rem]">
        <h2 className="text-common-black mb-12 text-center text-[2rem]/10 font-bold -tracking-[.015em] lg:mb-16 lg:text-5xl/[3.5rem]">
          Artículos Populares
        </h2>
        
        <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
          {articles.map((article, index) => (
            <div 
              key={index}
              className="bg-common-white flex h-[15rem] w-full max-w-[23.5625rem] flex-col justify-between rounded-[1.5rem] p-6 shadow-[0px_8px_24px_rgba(4,16,35,0.08)] lg:w-[32%]"
            >
              <div>
                <div className="flex gap-2 pb-2">
                  {article.tags.map((tag, i) => (
                    <span key={i} className="bg-primary/10 text-primary line-clamp-1 rounded px-2 py-1 text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="line-clamp-2 text-lg font-semibold leading-6 text-foreground">
                  {article.title}
                </h3>
                <p className="text-muted-foreground mt-2 line-clamp-2 max-h-[3em] text-base">
                  {article.excerpt}
                </p>
              </div>
              <a 
                href={article.link} 
                className="text-primary hover:text-primary/80 mt-4 flex items-center text-base font-medium transition-colors"
              >
                Leer más
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmpiezaHoySection;
