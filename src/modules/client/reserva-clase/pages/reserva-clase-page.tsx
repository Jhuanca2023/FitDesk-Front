import { Search, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { Calendar } from '@/shared/components/ui/calendar';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FeaturedClassCard } from '../components/featured-class-card';
import { ClassesTable } from '../components/classes-table';
import clasesDestacadasData from '../data/clases-destacadas.json';
import { useReservarClase, useClasesPaginated } from '../hooks/useClasses';
import { toast } from 'sonner';

export default function ReservaClasePage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;

 
    const dateFilterString = format(selectedDate, 'yyyy-MM-dd');
    
    const clasesQuery = useClasesPaginated(
        currentPage, 
        pageSize, 
        searchQuery, 
        dateFilterString
    );
    
    const clasesPaginated = clasesQuery.data;
    const loadingClases = clasesQuery.isLoading;
    const isError = clasesQuery.isError;
    const error = clasesQuery.error;
    const reservarClaseMutation = useReservarClase();

    const { clasesDestacadas: clasesDestacadasFicticias, estadisticas } = clasesDestacadasData;




    const handleReservar = async (classId: string) => {
        try {
            await reservarClaseMutation.mutateAsync(classId);
            toast.success('¡Clase reservada exitosamente! Ve a tu dashboard para confirmar tu asistencia.');
            setTimeout(() => {
                window.location.href = '/client/classes';
            }, 2000);
        } catch (error: any) {
            console.error('Error al reservar clase:', error);
            toast.error(error.message || 'Error al reservar la clase');
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(0);
    };


    useEffect(() => {
        setCurrentPage(0);
    }, [selectedDate]);

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-background min-h-screen flex items-center">
                {/* Background Effects */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="container mx-auto px-4 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-8"
                        >
                            <div className="space-y-6">
                                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    Reserva tu Clase Ideal Ahora y Comienza
                                </h1>
                                
                                <p className="text-xl text-muted-foreground max-w-lg">
                                    Encuentra la clase perfecta para ti y reserva tu lugar. 
                                    Entrenamientos dirigidos por instructores certificados con 
                                    horarios flexibles que se adaptan a tu rutina diaria.
                                </p>
                            </div>

                            {/* Search Bar */}
                            <div className="relative max-w-lg mt-20">
                                <form className="border border-border/50 bg-card/30 backdrop-blur-sm focus-within:border-primary hover:border-primary group flex h-14 gap-6 overflow-hidden rounded-full pl-6 lg:h-[4.5rem] shadow-lg transition-all duration-150">
                                    <input
                                        id="search"
                                        type="search"
                                        autoComplete="off"
                                        placeholder="Buscar clases..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                        className="text-foreground peer min-w-0 grow appearance-none truncate bg-transparent text-base/6 outline-none placeholder:text-muted-foreground md:text-lg/6"
                                    />
                                    <button 
                                        type="submit" 
                                        aria-label="Encontrar Clase"
                                        className="bg-primary m-2 flex min-w-10 shrink-0 items-center gap-2 rounded-full p-2 text-primary-foreground lg:pl-6 lg:pr-8 lg:transition-all lg:duration-150 lg:peer-focus:gap-0 lg:peer-focus:px-4 hover:bg-primary/90"
                                    >
                                        <Search className="w-6 h-6 inline-block" />
                                        <span className="hidden max-w-36 whitespace-nowrap text-lg/6 font-semibold lg:block lg:opacity-100 lg:duration-150 lg:group-has-[input:focus]:max-w-0 lg:group-has-[input:focus]:opacity-0">
                                            Encontrar Clase
                                        </span>
                                    </button>
                                </form>
                            </div>


                        </motion.div>

                        {/* Right Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative">
                                <img 
                                    src="https://res.cloudinary.com/dmjiw4338/image/upload/v1760223464/mujer-fitdesk-bg_rpabcm.png"
                                    alt="Mujer entrenando"
                                    className="w-full h-auto max-w-lg mx-auto"
                                />
                                {/* Floating Stats */}
                                <div className="absolute top-20 right-0 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white">
                                    <div className="flex items-center gap-2">
                                        <Plus className="w-4 h-4 text-rose-500" />
                                        <span className="font-bold">{estadisticas.recetasPositivas}</span>
                                    </div>
                                    <div className="text-xs text-gray-300">Recetas Positivas</div>
                                </div>
                                
                                <div className="absolute bottom-32 left-16 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white">
                                    <div className="flex items-center gap-2">
                                        <Plus className="w-4 h-4 text-rose-500" />
                                        <span className="font-bold">{estadisticas.videosEjercicios}</span>
                                    </div>
                                    <div className="text-xs text-gray-300">Videos de Ejercicios</div>
                                </div>
                                
                                <div className="absolute top-4 right-64 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white">
                                    <div className="flex items-center gap-2">
                                        <Plus className="w-4 h-4 text-rose-500" />
                                        <span className="font-bold">{estadisticas.instructores}</span>
                                    </div>
                                    <div className="text-xs text-gray-300">Instructores</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Main Content - Calendar and Classes */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="container mx-auto px-4 py-16"
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calendar Section */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="lg:col-span-1"
                    >
                        <div className="sticky top-24 space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-6">Horario de Clases</h2>
                                <p className="text-muted-foreground mb-4">
                                    Filtra por fecha del mes y haz clic para encontrar la clase perfecta para ti.
                                </p>
                                
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => date && setSelectedDate(date)}
                                    locale={es}
                                    className="w-full"
                                />
                            </div>

                        </div>
                    </motion.div>

                    {/* Classes List */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="lg:col-span-2"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Próximas clases</h2>
                            <p className="text-muted-foreground">
                                {format(selectedDate, 'EEEE, dd MMMM yyyy', { locale: es })}
                            </p>
                        </div>

                        {loadingClases ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <motion.div 
                                        key={i} 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.1 * i }}
                                        className="h-16 bg-muted animate-pulse rounded-lg" 
                                    />
                                ))}
                            </div>
                        ) : isError ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="p-12 text-center"
                            >
                                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8">
                                    <h3 className="text-lg font-semibold text-destructive mb-2">
                                        Error al cargar las clases
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        {error?.message || 'No se pudo conectar con el servidor. Por favor, verifica tu conexión.'}
                                    </p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                    >
                                        Recargar página
                                    </button>
                                </div>
                            </motion.div>
                        ) : clasesPaginated ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                            >
                                <ClassesTable
                                    data={clasesPaginated}
                                    onReservar={handleReservar}
                                    onPageChange={handlePageChange}
                                    currentPage={currentPage}
                                />
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="p-12 text-center"
                            >
                                <div className="text-muted-foreground text-lg">No hay clases disponibles.</div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </motion.div>

            {/* Divider */}
            <div className="border-t border-border"></div>

            {/* Featured Classes - Solo diseño visual */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="py-16"
            >
                <div className="container mx-auto px-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4">Clases destacadas</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Descubre nuestras clases más populares y únete a miles de personas 
                            que ya están transformando sus vidas.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {clasesDestacadasFicticias.map((clase, index) => (
                            <motion.div
                                key={clase.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.9 + (index * 0.1) }}
                            >
                                <FeaturedClassCard
                                    nombre={clase.nombre}
                                    instructor={clase.instructor}
                                    rating={clase.rating}
                                    imagen={clase.imagen}
                                    descripcion={clase.descripcion}
                                    etiquetas={(clase as any).etiquetas}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
