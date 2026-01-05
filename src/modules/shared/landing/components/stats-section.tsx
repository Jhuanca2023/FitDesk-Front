import { motion } from 'motion/react';
const stats = [
    {
        value: "96%",
        label: "Satisfacción del Cliente",
        description: "Nuestros Miembros Aman Sus Resultados y Experiencia",
    },
    {
        value: "+5",
        label: "Años de Experiencia",
        description: "Confía en Nuestro Comprobado Historial de Transformaciones",
    },
    {
        value: "+800",
        label: "Miembros Activos",
        description: "Únete a Nuestra Próspera Comunidad Fitness",
    },
    {
        value: "24/7",
        label: "Soporte Disponible",
        description: "Asistencia Experta Cuando La Necesites",
    },
]
export const StatsSection = () => {
    return (
        <section className="py-16 bg-background border-t border-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-800">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.1,
                            }}
                            viewport={{ once: true }}
                            className="text-center py-6 md:py-0 md:px-6"
                        >
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">{stat.label}</h3>
                            <p className="text-sm text-muted-foreground text-pretty">{stat.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
