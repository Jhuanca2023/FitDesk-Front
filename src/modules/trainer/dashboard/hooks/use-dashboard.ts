import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fitdeskApi } from '@/core/api/fitdeskApi';

interface TrainerClassLite {
  id: string;
  name: string;
  status?: string;
  classDate?: string;
  startTime?: string;
  location?: string;
  currentStudents?: number;
}

const formatBackendDate = (date: Date) => {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
};

export const useDashboardClassesToday = (date: Date) => {
  const todayStr = formatBackendDate(date);
  return useQuery({
    queryKey: ['dashboard', 'classes', 'today', todayStr],
    queryFn: async (): Promise<TrainerClassLite[]> => {
      const { data } = await fitdeskApi.get<any[]>(`/classes/stadistic/my-classes/stats`);
      if (!Array.isArray(data)) return [];
      const normalizeStatus = (s?: string) => {
        if (!s) return '';
        const u = s.toUpperCase();
        if (u.includes('CANCEL')) return 'CANCELADA';
        if (u.includes('COMPLET')) return 'COMPLETADA';
        if (u.includes('PROGRES') || u.includes('PROCES')) return 'EN_PROCESO';
        return 'PROGRAMADA';
      };
      return data
        .filter(cls => cls.classDate === todayStr)
        .filter(cls => normalizeStatus(cls.status) !== 'CANCELADA')
        .map(cls => ({
          id: cls.id,
          name: cls.className,
          status: cls.status,
          classDate: cls.classDate,
          startTime: cls.startTime,
          location: cls.locationName,
          currentStudents: cls.currentStudents,
        }));
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

export const useDashboardPrefetching = () => {
  const queryClient = useQueryClient();

  const prefetch = async (currentDate: Date = new Date()) => {
    // Prefetch stats
    await queryClient.prefetchQuery({
      queryKey: ['trainer-classes', 'stats'],
      queryFn: async () => {
        const { data } = await fitdeskApi.get(`/classes/stadistic/my-classes/stats`);
        return data;
      },
      staleTime: 5 * 60 * 1000,
    });

    // Prefetch classes today and tomorrow using backend date format (dd-MM-yyyy)
    const dates = [0, 1].map(offset => {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + offset);
      return d;
    });
    await Promise.all(dates.map(d => queryClient.prefetchQuery({
      queryKey: ['dashboard', 'classes', 'today', formatBackendDate(d)],
      queryFn: async () => {
        const { data } = await fitdeskApi.get(`/classes/stadistic/my-classes/stats`);
        return data;
      },
      staleTime: 60 * 1000,
    })));

    // Prefetch last 24h classes range for recent activity
    const start = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    const end = new Date(currentDate);
    await queryClient.prefetchQuery({
      queryKey: ['trainer-classes', 'by-range', start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)],
      queryFn: async () => {
        const { data } = await fitdeskApi.get(`/classes/stadistic/my-classes/stats`);
        return data;
      },
      staleTime: 60 * 1000,
    });
  };

  return { prefetch };
};

type WeeklyPoint = { day: string; attendance: number };

export const useDashboardWeeklyProgress = (currentDate: Date) => {
  const end = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  const start = new Date(end);
  start.setDate(end.getDate() - 6);

  return useQuery({
    queryKey: ['dashboard', 'weekly-progress', start.toISOString().slice(0,10), end.toISOString().slice(0,10)],
    queryFn: async (): Promise<{ series: WeeklyPoint[]; average: number; previousAverage: number }> => {
      const { data } = await fitdeskApi.get<any[]>(`/classes/stadistic/my-classes/stats`);
      if (!Array.isArray(data)) return { series: [], average: 0, previousAverage: 0 };

      const parseBackendDate = (s: string) => {
        const [d, m, y] = s.split('-').map(Number);
        return new Date(y, (m || 1) - 1, d || 1);
      };

      const inRange = (d: Date, s: Date, e: Date) => {
        const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const ss = new Date(s.getFullYear(), s.getMonth(), s.getDate());
        const ee = new Date(e.getFullYear(), e.getMonth(), e.getDate());
        return dd >= ss && dd <= ee;
      };

      // Build current week map
      const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const dayBuckets: Record<string, number[]> = { Dom: [], Lun: [], Mar: [], Mié: [], Jue: [], Vie: [], Sáb: [] };

      data.forEach(cls => {
        if (!cls.classDate) return;
        const d = parseBackendDate(cls.classDate);
        if (inRange(d, start, end)) {
          const dayLabel = days[d.getDay()];
          const att = Number(cls.averageAttendance || 0);
          dayBuckets[dayLabel].push(isFinite(att) ? att : 0);
        }
      });

      const seriesOrder = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
      const series: WeeklyPoint[] = seriesOrder.map(day => {
        const arr = dayBuckets[day] || [];
        const avg = arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0;
        return { day, attendance: Math.round(avg) };
      });

      const allVals = Object.values(dayBuckets).flat();
      const average = allVals.length ? allVals.reduce((a,b)=>a+b,0)/allVals.length : 0;

      // Previous week average
      const prevEnd = new Date(start);
      const prevStart = new Date(prevEnd);
      prevStart.setDate(prevEnd.getDate() - 6);
      const prevVals: number[] = [];
      data.forEach(cls => {
        if (!cls.classDate) return;
        const d = parseBackendDate(cls.classDate);
        if (inRange(d, prevStart, prevEnd)) {
          const att = Number(cls.averageAttendance || 0);
          prevVals.push(isFinite(att) ? att : 0);
        }
      });
      const previousAverage = prevVals.length ? prevVals.reduce((a,b)=>a+b,0)/prevVals.length : 0;

      return { series, average, previousAverage };
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Métricas de estudiantes para dashboard (fuente: módulo students)
export interface StudentMetricsDTO {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  averageAttendanceRate: number;
}

export const useDashboardStudentMetrics = () => {
  return useQuery({
    queryKey: ['dashboard', 'student-metrics'],
    queryFn: async (): Promise<StudentMetricsDTO> => {
      const { data } = await fitdeskApi.get<StudentMetricsDTO>(`/api/trainer/students/metrics`);
      return {
        totalStudents: Number((data as any)?.totalStudents || 0),
        activeStudents: Number((data as any)?.activeStudents || 0),
        inactiveStudents: Number((data as any)?.inactiveStudents || 0),
        averageAttendanceRate: Number((data as any)?.averageAttendanceRate || 0),
      };
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};


