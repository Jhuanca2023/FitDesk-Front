import { fitdeskApi } from "@/core/api/fitdeskApi";


export interface ClassResponse {
    id: string;
    className: string;
    locationName: string;
    trainerName: string;
    classDate: string;
    duration: number;
    maxCapacity: number;
    schedule: string;
    active: boolean;
    description: string;
    status?: string;
}

export interface BackendPaginatedClassResponse {
    content: ClassResponse[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
}

export interface PaginatedClassResponse {
    content: ClaseReserva[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
}

export interface ClassReservationRequest {
    classId: string;
}

export interface ClassReservationResponse {
    reservationId: string;
    classId: string;
    className: string;
    trainerName: string;
    schedule: string;
    locationName: string;
    capacity: string;
    action: string;
    alreadyReserved: boolean;
    completed: boolean;
}

export interface ClaseReserva {
    id: string;
    nombre: string;
    instructor: string;
    horario: string;
    fecha: string;
    capacidad: number;
    inscritos: number;
    ubicacion: string;
    estado: 'disponible' | 'lleno' | 'cancelado' | 'en_progreso';
    descripcion?: string;
    precio?: number;
}



export class ClassesService {

    
    private static isClassInProgress(classDate: string, schedule: string): boolean {
        try {
            const [startTime, endTime] = schedule.split(' - ');
            const [startHour, startMinute] = startTime.split(':').map(Number);
            const [endHour, endMinute] = endTime.split(':').map(Number);
            
            const classDateTime = new Date(classDate);
            const startDateTime = new Date(classDateTime);
            startDateTime.setHours(startHour, startMinute, 0, 0);
            
            const endDateTime = new Date(classDateTime);
            endDateTime.setHours(endHour, endMinute, 0, 0);
            
            const now = new Date();
            
            return now >= startDateTime && now <= endDateTime;
        } catch (error) {
            return false;
        }
    }

    private static mapClassResponseToClaseReserva(classResponse: ClassResponse, reservationsCount: number = 0): ClaseReserva {
        const inscritos = reservationsCount;
        const capacidad = classResponse.maxCapacity;
        
        if (!classResponse.active) {
            return {
                id: classResponse.id,
                nombre: classResponse.className,
                instructor: classResponse.trainerName,
                horario: classResponse.schedule,
                fecha: classResponse.classDate,
                capacidad: capacidad,
                inscritos: inscritos,
                ubicacion: classResponse.locationName,
                estado: 'cancelado',
                descripcion: classResponse.description
            };
        }
        
        const isInProgress = classResponse.status === 'IN_PROGRESS' || 
                           classResponse.status === 'ACTIVE' ||
                           this.isClassInProgress(classResponse.classDate, classResponse.schedule);
        
        let estado: 'disponible' | 'lleno' | 'cancelado' | 'en_progreso' = 'disponible';
        
        if (isInProgress) {
            estado = 'en_progreso';
        } else if (inscritos >= capacidad) {
            estado = 'lleno';
        }
        
        return {
            id: classResponse.id,
            nombre: classResponse.className,
            instructor: classResponse.trainerName,
            horario: classResponse.schedule,
            fecha: classResponse.classDate,
            capacidad: capacidad,
            inscritos: inscritos,
            ubicacion: classResponse.locationName,
            estado,
            descripcion: classResponse.description
        };
    }

    static async getClasesPorFecha(): Promise<ClaseReserva[]> {
        try {
            const response = await fitdeskApi.get<BackendPaginatedClassResponse>(
                `/classes/classes/paginated?page=0&size=1000`
            );
            
            console.log('🔍 getClasesPorFecha - Total clases del backend:', response.data.content.length);
            
            return response.data.content
                .filter(clase => {
                    console.log('👀 Clase:', clase.className, 'Status:', clase.status, 'Active:', clase.active);
                    
                 
                    if (!clase.active) {
                        console.log('❌ Clase filtrada (inactiva):', clase.className);
                        return false;
                    }
                    
                    
                    const status = clase.status?.toUpperCase() || '';
                    console.log('📌 Status uppercase:', status);
                    
                    if (status === 'COMPLETADA' || status === 'COMPLETED' || 
                        status === 'IN_PROGRESS' || status === 'EN_PROGRESO' || 
                        status === 'EN_PROCESO' || status === 'EN CURSO' ||
                        status === 'FINALIZADA' || status === 'FINALIZED') {
                        console.log('❌ Clase filtrada (completada/en progreso):', clase.className, 'Status:', status);
                        return false;
                    }
                    
                    console.log('✅ Clase permitida:', clase.className, 'Status:', status);
                    return true;
                })
                .map(classResponse => this.mapClassResponseToClaseReserva(classResponse));
        } catch (error: any) {
            throw new Error(error.response?.data?.errorMessage || error.message || "Error al obtener las clases");
        }
    }

    static async getClasesPaginated(page: number = 0, size: number = 10, search?: string, dateFilter?: string): Promise<PaginatedClassResponse> {
        try {
            const hasFilters = (search && search.trim()) || (dateFilter);
            
            let params: URLSearchParams;
            
            if (!hasFilters) {
                params = new URLSearchParams();
                params.append('page', page.toString());
                params.append('size', size.toString());
                
                const backendResponse = await fitdeskApi.get<BackendPaginatedClassResponse>(
                    `/classes/classes/paginated?${params.toString()}`
                );
                
                const mappedContent = backendResponse.data.content
                    .filter(clase => {
                        console.log('Clase:', clase.className, 'Status:', clase.status, 'Active:', clase.active);
                      
                        if (!clase.active) return false;
                        
                        
                        const status = clase.status?.toUpperCase() || '';
                        console.log('Status uppercase:', status);
                        
                        if (status === 'COMPLETADA' || status === 'COMPLETED' || 
                            status === 'IN_PROGRESS' || status === 'EN_PROGRESO' || 
                            status === 'EN_PROCESO' || status === 'EN CURSO' ||
                            status === 'FINALIZADA' || status === 'FINALIZED') {
                            console.log('Clase filtrada:', clase.className, 'Status:', status);
                            return false;
                        }
                        
                        console.log('Clase permitida:', clase.className, 'Status:', status);
                        return true;
                    })
                    .map(classResponse => this.mapClassResponseToClaseReserva(classResponse));
                
                return {
                    content: mappedContent,
                    number: backendResponse.data.number,
                    size: backendResponse.data.size,
                    totalElements: backendResponse.data.totalElements,
                    totalPages: backendResponse.data.totalPages,
                    first: backendResponse.data.first,
                    last: backendResponse.data.last
                };
            }
            
            params = new URLSearchParams();
            params.append('page', '0');
            params.append('size', '1000');
            
            if (search && search.trim()) {
                params.append('search', search);
            }
            
            const fetchResponse = await fitdeskApi.get<BackendPaginatedClassResponse>(
                `/classes/classes/paginated?${params.toString()}`
            );
            
            let mappedContent = fetchResponse.data.content
                .filter((clase: ClassResponse) => clase.active)
                .map((classResponse: ClassResponse) => this.mapClassResponseToClaseReserva(classResponse));
            
            if (search && search.trim()) {
                const searchLower = search.toLowerCase().trim();
                mappedContent = mappedContent.filter((clase: ClaseReserva) => 
                    clase.nombre.toLowerCase().includes(searchLower) ||
                    clase.instructor.toLowerCase().includes(searchLower) ||
                    clase.ubicacion.toLowerCase().includes(searchLower) ||
                    (clase.descripcion && clase.descripcion.toLowerCase().includes(searchLower))
                );
            }
            
            if (dateFilter && !(search && search.trim())) {
                const filterDate = new Date(dateFilter + 'T00:00:00');
                
                mappedContent = mappedContent.filter((clase: ClaseReserva) => {
                    let classDate: Date;
                    
                    try {
                        const fechaStr = clase.fecha;
                        let dateString: string;
                        
                        if (fechaStr.includes('T')) {
                            dateString = fechaStr.split('T')[0] + 'T00:00:00';
                        } 
                        else if (fechaStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
                            const [day, month, year] = fechaStr.split('-');
                            dateString = `${year}-${month}-${day}T00:00:00`;
                        }
                        else if (fechaStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
                            dateString = fechaStr + 'T00:00:00';
                        }
                        else {
                            dateString = fechaStr + 'T00:00:00';
                        }
                        
                        classDate = new Date(dateString);
                        
                        const matches = 
                            filterDate.getFullYear() === classDate.getFullYear() &&
                            filterDate.getMonth() === classDate.getMonth() &&
                            filterDate.getDate() === classDate.getDate();
                        
                        return matches;
                    } catch (error) {
                        return false;
                    }
                });
            }
            
            const totalElements = mappedContent.length;
            const totalPages = Math.ceil(totalElements / size);
            const startIndex = page * size;
            const endIndex = startIndex + size;
            const paginatedContent = mappedContent.slice(startIndex, endIndex);
            
            return {
                content: paginatedContent,
                number: page,
                size: size,
                totalElements: totalElements,
                totalPages: totalPages,
                first: page === 0,
                last: page >= totalPages - 1
            };
        } catch (error: any) {
            throw new Error(error.response?.data?.errorMessage || error.message || "Error al obtener las clases");
        }
    }


    static async reservarClase(classId: string): Promise<ClassReservationResponse> {
        try {
            const request: ClassReservationRequest = { classId };

            const response = await fitdeskApi.post<ClassReservationResponse>(`/classes/reservations`, request);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.errorMessage || error.message || "Error al reservar la clase");
        }
    }

    static async cancelarReserva(reservationId: string): Promise<void> {
        try {
            await fitdeskApi.delete(`/classes/reservations/${reservationId}`);
        } catch (error: any) {
            throw new Error(error.response?.data?.errorMessage || error.message || "Error al cancelar la reserva");
        }
    }

    static async confirmarAsistencia(reservationId: string): Promise<void> {
        try {
            await fitdeskApi.put(`/classes/reservations/${reservationId}/confirm`);
        } catch (error: any) {
            throw new Error(error.response?.data?.errorMessage || error.message || "Error al confirmar asistencia");
        }
    }

    static async completarReserva(reservationId: string): Promise<void> {
        try {
            await fitdeskApi.put(`/classes/reservations/${reservationId}/complete`);
        } catch (error: any) {
            throw new Error(error.response?.data?.errorMessage || error.message || "Error al completar la reserva");
        }
    }

    static async getMisReservas(completed?: boolean): Promise<ClassReservationResponse[]> {
        try {
            const params = completed !== undefined ? `?completed=${completed}` : '';
            const response = await fitdeskApi.get<ClassReservationResponse[]>(`/classes/reservations/my${params}`);
            return response.data || [];
        } catch (error: any) {
            if (error.response?.status === 204) {
                return [];
            }
            throw new Error(error.response?.data?.errorMessage || error.message || "Error al obtener las reservas");
        }
    }

    static async buscarClases(): Promise<ClaseReserva[]> {
        try {
            const response = await fitdeskApi.get<BackendPaginatedClassResponse>(
                `/classes/classes/paginated?page=0&size=1000`
            );
            
            return response.data.content
                .filter(clase => {
                 
                    if (!clase.active) return false;
                    
                    
                    const status = clase.status?.toUpperCase();
                    if (status === 'COMPLETADA' || status === 'COMPLETED' || 
                        status === 'IN_PROGRESS' || status === 'EN_PROGRESO' || 
                        status === 'EN_PROCESO' || status === 'EN CURSO' ||
                        status === 'FINALIZADA' || status === 'FINALIZED') {
                        return false;
                    }
                    
                    return true;
                })
                .map(classResponse => this.mapClassResponseToClaseReserva(classResponse));
        } catch (error: any) {
            throw new Error(error.response?.data?.errorMessage || error.message || "Error al buscar clases");
        }
    }
}
