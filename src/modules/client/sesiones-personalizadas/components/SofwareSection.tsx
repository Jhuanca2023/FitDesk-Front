import React from "react";
import { Wallet, Users, MessageSquare, BarChart2, UserCheck, Calendar } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import featuresData from '../data/softwareFeatures.json';


const iconComponents: { [key: string]: React.ComponentType<any> } = {
  Wallet,
  Users,
  MessageSquare,
  BarChart2,
  UserCheck,
  Calendar
};

const SoftwareSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
 
  const features = featuresData.map(feature => ({
    ...feature,
    icon: iconComponents[feature.icon] || null
  }));

  return (
    <motion.section 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      className="pt-section-md lg:pt-section-desktop-md pb-section-md lg:pb-section-desktop-md bg-skin-fill text-skin-base"
    >
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center justify-center pb-12 text-center"
        >
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-skin-heading pb-4 max-w-3xl leading-tight">
            <span>Tu Software de FitDesk </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-pink-500">
              todo en uno
            </span>
          </h3>
        </motion.div>

        <div className="hidden lg:grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.a
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
              href={feature.href}
              className="group relative flex flex-col justify-between transition-all duration-300 border border-skin-border cursor-pointer rounded-2xl p-6 pb-2 bg-skin-card/40 shadow-sm hover:shadow-lg hover:bg-[#3e1326] hover:text-white"
            >
              <div>
                <div className="flex-shrink-0 mb-4">
                  <svg width="0" height="0">
                    <defs>
                      <linearGradient id={`icon-gradient-${feature.title.replace(/\s+/g, '-')}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#f97316' }} />
                        <stop offset="100%" style={{ stopColor: '#ec4899' }} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <feature.icon 
                    className="h-8 w-8" 
                    style={{ stroke: `url(#icon-gradient-${feature.title.replace(/\s+/g, '-')})` }}
                    strokeWidth={2}
                    fill="none"
                  />
                </div>
                <h4 className="font-semibold text-h4 md:text-desktop-h4 pb-1 text-skin-heading group-hover:text-white">
                  {feature.title}
                </h4>
                <p className="text-skin-muted text-body1 group-hover:text-white/90">
                  {feature.description}
                </p>
              </div>
              <div className="flex">
                <div className="flex items-center justify-center font-bold pr-4 py-4 text-sm">
                  <span className="text-primary group-hover:text-white pr-[6px] font-medium">
                    Leer Más
                  </span>
                  <svg
                    className="text-primary group-hover:text-white"
                    width="12"
                    height="12"
                    viewBox="0 0 8 12"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1.29 2.12l3.88 3.88-3.88 3.88a1 1 0 0 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L2.7.71a1 1 0 0 0-1.41 1.41z" />
                  </svg>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default SoftwareSection;