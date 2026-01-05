import { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import faqs from '../data/faqs.json';

export default function FQASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      className="pt-16 lg:pt-24 pb-16 lg:pb-24"
    >
      <div className="container mx-auto py-8 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="m-auto max-w-[800px] pb-2"
        >
          <div className="max-w-[800px] lg:m-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center lg:text-center pb-4">
              <span>Preguntas frecuentes</span>
            </h2>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="tab-container max-w-[800px] m-auto">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
                className="faq-item whitespace-normal group border-b-2 border-dashed last:border-0"
              >
                <div 
                  onClick={() => toggleFaq(index)}
                  className="tab-title flex justify-between font-bold text-xl md:text-2xl items-center py-6 cursor-pointer"
                >
                <h3 className="pr-4 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-pink-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {faq.question}
                </h3>
                  <div className="flex flex-shrink-0 h-12 w-12 rounded-full border-2 border-slate-100 justify-center items-center font-bold">
                    <span className="mb-2 text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-pink-500">
                      {activeIndex === index ? '−' : '+'}
                    </span>
                  </div>
                </div>
                
                <div 
                  className={`tab-content transition-all duration-200 ease-in-out overflow-hidden ${
                    activeIndex === index 
                      ? 'h-auto opacity-100 pb-8' 
                      : 'h-0 opacity-0 pointer-events-none'
                  }`}
                >
                  {faq.answer && (
                    <div className="rich-text dark:text-white">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}