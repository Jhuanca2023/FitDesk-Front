import { motion } from 'motion/react';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import imageTrainer from '@/assets/trainer.webp'
import { Image } from '@/shared/components/ui/image';

const stats = [
    { value: "1300", label: "Reseñas Positivas", position: "top-right" },
    { value: "80", label: "Entrenadores", position: "left" },
    { value: "1000", label: "Videos de Ejercicios", position: "bottom-left" },
    { value: "1500", label: "Instructores", position: "bottom-right" },
]

export const HeroSection = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
            <div className="absolute inset-0">
                <div className="absolute top-20 right-20 w-80 h-80 bg-primary/30 rounded-full blur-3xl opacity-60" />
                <div className="absolute bottom-20 right-40 w-60 h-60 bg-primary/40 rounded-full blur-2xl opacity-80" />
                <div className="absolute top-1/2 right-10 w-40 h-40 bg-primary/50 rounded-full blur-xl opacity-70" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-left"
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-bold text-balance mb-6"
                        >
Alcanza Tus <br />
                            <span className="text-primary">METAS DE FITNESS</span>
                            <br />
                            Con FitDesk
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-base text-muted-foreground mb-8 max-w-lg text-pretty leading-relaxed"
                        >
"Únete a la comunidad de FitDesk y transforma tu viaje de fitness. Nuestros entrenadores expertos y programas
                            personalizados están diseñados para ayudarte a alcanzar tus metas y superar tus expectativas. ¿Listo para
                            hacer un cambio?"
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex gap-4"
                        >
                            <Button
                                size="lg"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-base font-medium rounded-full"
                            >
Comienza ahora
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 text-base font-medium bg-transparent rounded-full"
                            >
Explorar Programas
                            </Button>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="relative flex justify-center"
                    >
                        <div className="relative w-80 h-96 md:w-96 md:h-[500px]">
                            <Image
                                src={imageTrainer}
                                alt="Entrenador de Fitness Profesional"
                                className="w-full h-full object-cover object-center"
                                style={{
                                    clipPath: "polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)",
                                    filter: "contrast(1.1) brightness(1.05)",
                                }}
                            />

                            {stats.map((stat, index) => {
                                let positionClasses = ""
                                const cardClasses = "bg-black/80 backdrop-blur-sm border-orange-700 text-white"

                                switch (stat.position) {
                                    case "top-right":
                                        positionClasses = "absolute -top-2 -right-8"
                                        break
                                    case "left":
                                        positionClasses = "absolute top-1/3 -left-12"
                                        break
                                    case "bottom-left":
                                        positionClasses = "absolute -bottom-8 -left-8"
                                        break
                                    case "bottom-right":
                                        positionClasses = "absolute -bottom-2 -right-12"
                                        break
                                }

                                return (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                            duration: 0.6,
                                            delay: 0.8 + index * 0.2,
                                            type: "spring",
                                            stiffness: 100,
                                        }}
                                        className={positionClasses}
                                    >
                                        <Card className={`${cardClasses} p-3 min-w-[140px] rounded-lg`}>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-white">+ {stat.value}</div>
                                                <div className="text-xs text-gray-300">{stat.label}</div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}