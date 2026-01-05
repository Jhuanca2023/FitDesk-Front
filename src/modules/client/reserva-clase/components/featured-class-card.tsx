import { Star } from 'lucide-react';
import { motion } from 'motion/react';

interface FeaturedClassCardProps {
    nombre: string;
    instructor: string;
    rating: number;
    imagen: string;
    descripcion: string;
    etiquetas?: string;
}

export const FeaturedClassCard = ({
    nombre,
    instructor,
    rating,
    imagen,
    descripcion,
    etiquetas
}: FeaturedClassCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="group relative cursor-pointer"
        >
            <div className="bg-card/40 border border-border/30 rounded-xl p-6 transition-all duration-300 hover:shadow-lg backdrop-blur-sm">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                <div className="relative">
                    {/* Header with image and rating */}
                    <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                        <img 
                            src={imagen} 
                            alt={nombre}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-white text-xs font-medium">{rating}</span>
                        </div>
                        <div className="absolute top-4 left-4">
                            <div className="bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
                                Destacado
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <h3 className="text-foreground mb-1 text-xl font-bold">
                            {nombre}
                        </h3>
                        <p className="text-muted-foreground text-sm font-medium mb-2">
                            Con {instructor}
                        </p>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                            {descripcion}
                        </p>
                        {etiquetas && (
                            <div className="flex flex-wrap gap-1">
                                {etiquetas.split(' ').map((etiqueta, index) => (
                                    <span 
                                        key={index}
                                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium"
                                    >
                                        {etiqueta}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
