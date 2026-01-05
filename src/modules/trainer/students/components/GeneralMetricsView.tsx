import { Users, Calendar, TrendingUp, RefreshCw, UserPlus, UserMinus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useTrainerStats } from '../../calendar/hooks/use-trainer-classes';
import { useClassesByDateRange } from '../../calendar/hooks/use-trainer-classes';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/core/lib/utils';

interface GeneralMetricsViewProps {
  className?: string;
}

export function GeneralMetricsView({ className }: GeneralMetricsViewProps) {
  const { data: stats, isLoading, refetch } = useTrainerStats();
  
 
  const today = new Date();
  const startRange = new Date(today);
  startRange.setDate(today.getDate() - (6 * 7));
  const endRange = new Date(today);
  const { data: rangedClasses } = useClassesByDateRange(startRange, endRange);

 
  const calculateActiveStudents = () => {
    if (!stats) return 0;
    
   
    if ('activeStudents' in stats && typeof (stats as any).activeStudents === 'number') {
      return (stats as any).activeStudents;
    }
    
   
    return stats.totalStudents || 0;
  };

  const calculateInactiveStudents = () => {
    if (!stats) return 0;
    
   
    if ('inactiveStudents' in stats && typeof (stats as any).inactiveStudents === 'number') {
      return (stats as any).inactiveStudents;
    }
    
   
    const activeStudents = calculateActiveStudents();
    const totalStudents = stats.totalStudents || 0;
    return Math.max(0, totalStudents - activeStudents);
  };

  const activeStudents = calculateActiveStudents();
  const inactiveStudents = calculateInactiveStudents();

  // Serie semanal basada en clases reales (PROGRAMADA / EN_PROCESO / COMPLETADA), excluye CANCELADA
  const chartData = (() => {
    const classes = Array.isArray(rangedClasses) ? rangedClasses : [];
    // Construir 7 buckets semanales (6 previas + actual)
    const weeks: { label: string; start: Date; end: Date }[] = [];
    for (let i = 6; i >= 0; i--) {
      const end = new Date(today);
      end.setDate(today.getDate() - (i * 7));
      const start = new Date(end);
      start.setDate(end.getDate() - 6);
      const label = i === 0 ? 'Actual' : `Sem ${7 - i}`;
      const ns = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const ne = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      weeks.push({ label, start: ns, end: ne });
    }
    const buckets = weeks.map(w => ({ week: w.label, active: 0, inactive: 0 }));
    const normalizeStatus = (s?: string) => {
      if (!s) return '';
      const u = s.toUpperCase();
      if (u.includes('CANCEL')) return 'CANCELADA';
      if (u.includes('COMPLET')) return 'COMPLETADA';
      if (u.includes('PROGRES') || u.includes('PROCES')) return 'EN_PROCESO';
      return 'PROGRAMADA';
    };
    classes.forEach((cls: any) => {
      if (!cls.classDate) return;
      const status = normalizeStatus(cls.status);
      if (status === 'CANCELADA') return;
      const d = new Date(cls.classDate);
      const dayOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const count = Number(cls.enrolledCount || cls.currentStudents || 0) || 0;
      for (let idx = 0; idx < weeks.length; idx++) {
        const w = weeks[idx];
        if (dayOnly >= w.start && dayOnly <= w.end) {
          buckets[idx].active += count;
          break;
        }
      }
    });
   
    const lastIdx = buckets.length - 1;
    if (lastIdx >= 0) {
      buckets[lastIdx].active = Math.max(buckets[lastIdx].active, activeStudents);
      buckets[lastIdx].inactive = Math.max(buckets[lastIdx].inactive, inactiveStudents);
    }
   
    const hasData = buckets.some(b => b.active > 0 || b.inactive > 0);
    return hasData ? buckets : [{ week: 'Actual', active: activeStudents, inactive: inactiveStudents }];
  })();

  const totalStudents = stats?.totalStudents || 0;
  const averageAttendance = stats?.averageAttendance || 0;
  const totalClasses = stats?.totalClasses || 0;
  const activeStudentsDisplay = chartData[chartData.length - 1]?.active || 0;
  const inactiveStudentsDisplay = chartData[chartData.length - 1]?.inactive || 0;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Métricas Generales</h2>
          <p className="text-muted-foreground text-sm">
            Resumen de actividad y estadísticas generales
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-[120px]" />
            <Skeleton className="h-[120px]" />
            <Skeleton className="h-[120px]" />
          </>
        ) : (
          <>
            {/* Total Estudiantes */}
            <Card className="border-border bg-card/40 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Users className="h-4 w-4 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStudents}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Estudiantes totales
                </p>
                <div className="mt-3 flex items-center text-xs text-green-500">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +11.5%
                </div>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (totalStudents / 200) * 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Promedio Asistencia */}
            <Card className="border-border bg-card/40 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Promedio Asistencia</CardTitle>
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageAttendance.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Asistencia promedio
                </p>
                <div className="mt-3 flex items-center text-xs text-green-500">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +12.4%
                </div>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, averageAttendance)}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Clases Este Mes */}
            <Card className="border-border bg-card/40 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clases Este Mes</CardTitle>
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Calendar className="h-4 w-4 text-orange-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalClasses}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Clases totales
                </p>
                <div className="mt-3 flex items-center text-xs text-green-500">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +49
                </div>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (totalClasses / 400) * 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Chart Section */}
      <Card className="border-border bg-card/40 rounded-xl border">
        <CardHeader>
          <CardTitle>Tendencia de Estudiantes</CardTitle>
          <div className="flex justify-end mt-4 space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-sm text-muted-foreground">Activos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-sm text-muted-foreground">Inactivos</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorInactive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="active" 
                stroke="#22c55e" 
                fillOpacity={1} 
                fill="url(#colorActive)" 
                name="Estudiantes Activos"
              />
              <Area 
                type="monotone" 
                dataKey="inactive" 
                stroke="#ef4444" 
                fillOpacity={1} 
                fill="url(#colorInactive)" 
                name="Estudiantes Inactivos"
              />
            </AreaChart>
          </ResponsiveContainer>
          
          {/* Summary Stats */}
          <div className="mt-6 flex justify-around border-t pt-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <UserPlus className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-2xl font-bold">{activeStudentsDisplay}</span>
              </div>
              <p className="text-xs text-muted-foreground">Estudiantes Activos</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <UserMinus className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-2xl font-bold">{inactiveStudentsDisplay}</span>
              </div>
              <p className="text-xs text-muted-foreground">Estudiantes Inactivos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

