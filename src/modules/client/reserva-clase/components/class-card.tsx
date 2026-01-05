import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Clock, MapPin, Users, Calendar } from 'lucide-react';
import { cn } from '@/core/lib/utils';

interface ClassCardProps {
    id: string;
    nombre: string;
    instructor: string;
    horario: string;
    fecha: string;
    capacidad: number;
    inscritos: number;
    ubicacion: string;
    estado: 'disponible' | 'lleno' | 'cancelado' | 'en_progreso';
    startTime?: string;
    endTime?: string;
    onReservar: (classId: string) => void;
}

export const ClassCard = ({
    id,
    nombre,
    instructor,
    horario,
    fecha,
    capacidad,
    inscritos,
    ubicacion,
    estado,
    onReservar
}: ClassCardProps) => {
    const isClassInProgress = () => {
        if (estado === 'en_progreso') return true;
        
        try {
            if (!horario) return false;
            
            const [startTimeStr, endTimeStr] = horario.split(' - ');
            if (!startTimeStr || !endTimeStr) return false;
            
            const now = new Date();
            const [startHour, startMinute] = startTimeStr.split(':').map(Number);
            const [endHour, endMinute] = endTimeStr.split(':').map(Number);
            
            const classDate = new Date(fecha);
            const startDateTime = new Date(classDate);
            startDateTime.setHours(startHour, startMinute, 0, 0);
            
            const endDateTime = new Date(classDate);
            endDateTime.setHours(endHour, endMinute, 0, 0);
            
            return now >= startDateTime && now <= endDateTime;
        } catch (error) {
            console.error('Error verificando estado de la clase:', error);
            return false;
        }
    };

    const getEstadoBadge = () => {
        const inProgress = isClassInProgress();
        
        if (inProgress) {
            return <Badge className="bg-blue-500 hover:bg-blue-600">En Progreso</Badge>;
        }
        
        switch (estado) {
            case 'disponible':
                return <Badge className="bg-green-500 hover:bg-green-600">Disponible</Badge>;
            case 'lleno':
                return <Badge variant="destructive">Lleno</Badge>;
            case 'cancelado':
                return <Badge variant="secondary">Cancelado</Badge>;
            default:
                return null;
        }
    };

    const getButtonText = () => {
        if (isClassInProgress()) {
            return 'Clase en curso';
        }
        
        switch (estado) {
            case 'disponible':
                return 'Reservar';
            case 'lleno':
                return 'Lista de espera';
            case 'cancelado':
                return 'Cancelado';
            default:
                return 'Reservar';
        }
    };

    return (
        <Card className={cn(
            "transition-all duration-300 hover:shadow-md",
            estado === 'cancelado' && "opacity-60"
        )}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg font-semibold">{nombre}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                            {instructor}
                        </CardDescription>
                    </div>
                    {getEstadoBadge()}
                </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{horario}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{fecha}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{inscritos}/{capacidad}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{ubicacion}</span>
                    </div>
                </div>
                
                <Button 
                    onClick={() => onReservar(id)}
                    disabled={estado === 'cancelado' || isClassInProgress()}
                    variant={estado === 'disponible' && !isClassInProgress() ? 'default' : 'outline'}
                    className="w-full"
                >
                    {getButtonText()}
                </Button>
            </CardContent>
        </Card>
    );
};
