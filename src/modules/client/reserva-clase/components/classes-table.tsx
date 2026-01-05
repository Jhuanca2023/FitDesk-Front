import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ClaseReserva } from '../services/classes.service';

interface PaginatedData {
    content: ClaseReserva[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
}

interface ClassesTableProps {
    data: PaginatedData;
    onReservar: (classId: string) => void;
    onPageChange: (page: number) => void;
    currentPage: number;
}

export const ClassesTable = ({ data, onReservar, onPageChange, currentPage }: ClassesTableProps) => {
    const { content: clases, totalPages, totalElements, size } = data;

    const getActionText = (estado: string) => {
        switch (estado) {
            case 'disponible':
                return 'Reservar';
            case 'lleno':
                return 'Lista de espera';
            case 'cancelado':
                return 'Cancelado';
            case 'en_progreso':
                return 'En curso';
            default:
                return 'Reservar';
        }
    };

    const getActionColor = (estado: string) => {
        switch (estado) {
            case 'disponible':
                return 'text-primary hover:text-primary/80 cursor-pointer';
            case 'lleno':
                return 'text-primary hover:text-primary/80 cursor-pointer';
            case 'cancelado':
                return 'text-muted-foreground cursor-not-allowed';
            case 'en_progreso':
                return 'text-muted-foreground cursor-not-allowed';
            default:
                return 'text-primary hover:text-primary/80 cursor-pointer';
        }
    };

    const handlePageChange = (page: number) => {
        onPageChange(page);
    };

    return (
        <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-muted/20 border-b border-border/30">
                <div className="grid grid-cols-5 gap-6 px-6 py-4">
                    <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Clase</div>
                    <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Instructor</div>
                    <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Horario</div>
                    <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Ubicación</div>
                    <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Acción</div>
                </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-border/20">
                {clases.map((clase, index) => (
                    <div 
                        key={clase.id} 
                        className={`grid grid-cols-5 gap-6 px-6 py-4 hover:bg-muted/20 transition-colors duration-150 ${
                            index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
                        }`}
                    >
                        {/* Clase */}
                        <div className="flex flex-col">
                            <div className="font-semibold text-foreground text-base">{clase.nombre}</div>
                            <div className="text-sm text-muted-foreground mt-1">{clase.fecha}</div>
                        </div>

                        {/* Instructor */}
                        <div className="flex items-center">
                            <span className="text-foreground font-medium">{clase.instructor}</span>
                        </div>

                        {/* Horario */}
                        <div className="flex items-center">
                            <span className="text-foreground font-medium">{clase.horario}</span>
                        </div>

                        {/* Ubicación */}
                        <div className="flex flex-col">
                            <div className="text-foreground font-medium">{clase.ubicacion}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                                {clase.inscritos}/{clase.capacidad} inscritos
                            </div>
                        </div>

                        {/* Acción */}
                        <div className="flex items-center">
                            <span
                                onClick={() => clase.estado !== 'cancelado' && clase.estado !== 'en_progreso' && onReservar(clase.id)}
                                className={`text-sm font-semibold transition-colors duration-150 ${
                                    getActionColor(clase.estado)
                                }`}
                            >
                                {getActionText(clase.estado)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="bg-muted/20 border-t border-border/30 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-foreground">
                            Mostrando {currentPage * size + 1} a {Math.min((currentPage + 1) * size, totalElements)} de {totalElements} clases
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0}
                                className="p-2 rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        currentPage === page
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-background border border-border text-foreground hover:bg-muted'
                                    }`}
                                >
                                    {page + 1}
                                </button>
                            ))}
                            
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages - 1}
                                className="p-2 rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {clases.length === 0 && (
                <div className="p-12 text-center">
                    <div className="text-muted-foreground text-lg">No hay clases disponibles.</div>
                </div>
            )}
        </div>
    );
};
