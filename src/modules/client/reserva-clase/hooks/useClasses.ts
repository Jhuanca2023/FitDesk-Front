import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { ClassesService } from "../services/classes.service";
import type { ClaseReserva } from "../services/classes.service";

interface PaginatedResponse {
    content: ClaseReserva[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
}

export const useClasesPorFecha = () => {
    return useQuery({
        queryKey: ["classes"],
        queryFn: ClassesService.getClasesPorFecha,
        staleTime: 5 * 60 * 1000,
    });
};


export const useBuscarClases = () => {
    return useQuery({
        queryKey: ["classes", "search"],
        queryFn: ClassesService.buscarClases,
        staleTime: 2 * 60 * 1000, 
    });
};

export const useClasesPaginated = (page: number = 0, size: number = 10, search?: string, dateFilter?: string) => {
    const queryClient = useQueryClient();
    
    const queryResult = useQuery<PaginatedResponse, Error>({
        queryKey: ["classes", "paginated", page, size, search, dateFilter],
        queryFn: () => ClassesService.getClasesPaginated(page, size, search, dateFilter) as Promise<PaginatedResponse>,
        staleTime: 2 * 60 * 1000,
        refetchInterval: (query) => {
            const queryData = query.state.data;
            if (!queryData?.content) return false;
            
            
            const hasClassInProgress = queryData.content.some((classItem: ClaseReserva) => {
                const horario = classItem.horario || '';
                const [startTimeStr, endTimeStr] = horario.split(' - ');
                if (!startTimeStr || !endTimeStr) return false;
                
                try {
                    const now = new Date();
                    const [startHour, startMinute] = startTimeStr.split(':').map(Number);
                    const [endHour, endMinute] = endTimeStr.split(':').map(Number);
                    
                    const classDate = new Date(classItem.fecha);
                    const startDateTime = new Date(classDate);
                    startDateTime.setHours(startHour, startMinute, 0, 0);
                    
                    const endDateTime = new Date(classDate);
                    endDateTime.setHours(endHour, endMinute, 0, 0);
                    
                    return now >= startDateTime && now <= endDateTime;
                } catch (error) {
                    console.error('Error checking class time:', error);
                    return false;
                }
            });
            
           
            return hasClassInProgress ? 10000 : false;
        },
    });

  
    useEffect(() => {
        if (!queryResult.data) return;
        
        const nextPage = page + 1;
        if (nextPage < queryResult.data.totalPages) {
            queryClient.prefetchQuery({
                queryKey: ["classes", "paginated", nextPage, size, search, dateFilter],
                queryFn: () => ClassesService.getClasesPaginated(nextPage, size, search, dateFilter) as Promise<PaginatedResponse>,
                staleTime: 2 * 60 * 1000,
            });
        }
        
    
        if (page > 0) {
            queryClient.prefetchQuery({
                queryKey: ["classes", "paginated", page - 1, size, search, dateFilter],
                queryFn: () => ClassesService.getClasesPaginated(page - 1, size, search, dateFilter) as Promise<PaginatedResponse>,
                staleTime: 2 * 60 * 1000,
            });
        }
    }, [queryResult.data, page, size, search, dateFilter, queryClient]);
    
    return queryResult;
};

export const useReservarClase = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (classId: string) => ClassesService.reservarClase(classId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classes"] });
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
        },
    });
};

export const useCancelarReserva = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reservationId: string) => ClassesService.cancelarReserva(reservationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
            queryClient.invalidateQueries({ queryKey: ["classes"] });
        },
    });
};

export const useMisReservas = (completed?: boolean) => {
    return useQuery({
        queryKey: ["reservations", "my", completed],
        queryFn: () => ClassesService.getMisReservas(completed),
        staleTime: 2 * 60 * 1000,
    });
};

export const useConfirmarAsistencia = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reservationId: string) => ClassesService.confirmarAsistencia(reservationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
        },
    });
};

export const useCompletarReserva = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reservationId: string) => ClassesService.completarReserva(reservationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        },
    });
};