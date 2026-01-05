import { DashboardCard } from '../components/ui/dashboard-card';
import { RevenueChart } from '../components/ui/revenue-chart';
import { UsersTable } from '../components/ui/users-table';
import { QuickActions } from '../components/ui/quick-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Users, Calendar, CheckCircle2, UserPlus, Clock } from 'lucide-react';
import { useTrainerStats, useClassesByDateRange } from '../calendar/hooks/use-trainer-classes';
import { useDashboardClassesToday, useDashboardPrefetching, useDashboardWeeklyProgress, useDashboardStudentMetrics } from './hooks/use-dashboard';

const isCancelled = (status?: string) => {
  const s = (status || '').toUpperCase();
  return s.includes('CANCEL');
};

const handleAddStudent = () => {
    console.log('Agregando nuevo alumno...');
};

const DashboardTrainer = () => {
    const { data: stats } = useTrainerStats();
    const { data: studentMetrics } = useDashboardStudentMetrics();
    const today = new Date();
    const { data: classesToday } = useDashboardClassesToday(today);
    const { prefetch } = useDashboardPrefetching();
    const { data: weekly } = useDashboardWeeklyProgress(today);

    // Prefetch on mount
    prefetch(today).catch(() => {});
    // Rango últimas 24h para actividad reciente
    const start = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const end = new Date();
    const { data: classesLastDay } = useClassesByDateRange(start, end);

    const activeCountToday = Array.isArray(classesToday)
      ? classesToday.reduce((sum, c: any) => sum + (Number(c.currentStudents) || 0), 0)
      : 0;
    const totalStudents = (activeCountToday || studentMetrics?.activeStudents || stats?.totalStudents) || 0;
    const classesTodayCount = Array.isArray(classesToday)
      ? classesToday.filter(c => !isCancelled((c as any).status)).length
      : 0;

    const statCards = [
      {
        title: 'Alumnos Activos',
        value: String(totalStudents),
        change: '',
        changeType: 'positive' as const,
        icon: Users,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
      },
      {
        title: 'Clases Hoy',
        value: String(classesTodayCount),
        change: '',
        changeType: 'positive' as const,
        icon: Calendar,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
      }
    ];

    const normalizeStatus = (s?: string) => {
      if (!s) return '';
      const u = s.toUpperCase();
      if (u.includes('COMPLET')) return 'COMPLETADA';
      if (u.includes('PROGRES') || u.includes('PROCES')) return 'EN_PROCESO';
      if (u.includes('CANCEL')) return 'CANCELADA';
      return 'PROGRAMADA';
    };

    const recentActivity = (() => {
      const items: Array<{ title: string; subtitle: string; icon: 'join' | 'completed'; time: string }>= [];
      const classesArr = Array.isArray(classesLastDay) ? classesLastDay : [];
      // Clase completada
      classesArr
        .filter(c => normalizeStatus((c as any).status) === 'COMPLETADA')
        .slice(0, 5)
        .forEach(c => {
          items.push({
            title: 'Clase completada',
            subtitle: (c as any).name || 'Clase',
            icon: 'completed',
            time: 'Hace horas'
          });
        });
      // Nuevo alumno registrado (heurística: clases de hoy con inscritos > 0)
      const todayList = Array.isArray(classesToday) ? classesToday : [];
      todayList
        .filter(c => (c as any).currentStudents > 0 && !isCancelled((c as any).status))
        .slice(0, 5)
        .forEach(c => {
          items.push({
            title: 'Nuevo alumno registrado',
            subtitle: (c as any).name || 'Se unió a la clase',
            icon: 'join',
            time: 'Hace minutos'
          });
        });
      return items.slice(0, 6);
    })();

    return (
        <div className="flex flex-1 flex-col gap-2 p-2 pt-0 sm:gap-4 sm:p-4">
            <div className="min-h-[calc(100vh-4rem)] flex-1 rounded-lg p-3 sm:rounded-xl sm:p-4 md:p-6">
                <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
                    <div className="px-2 sm:px-0">
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Panel de Entrenador
                        </h1>
                        <p className="text-muted-foreground text-sm sm:text-base">
                            Resumen de tu actividad y estadísticas.
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                        {statCards.map((stat, index) => (
                            <DashboardCard key={stat.title} stat={stat} index={index} />
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
                        {/* Charts Section */}
                        <div className="space-y-4 sm:space-y-6 xl:col-span-2">
                            {/* Resumen real de asistencia semanal */}
                            <div className="flex flex-wrap gap-3 items-center justify-between border rounded-xl p-3">
                              <div>
                                <div className="text-sm text-muted-foreground">Asistencia Promedio</div>
                                <div className="text-2xl font-bold">{Math.round((useDashboardWeeklyProgress(today).data?.average || 0))}%</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Mejora Semanal</div>
                                <div className="text-2xl font-bold">
                                  {(() => {
                                    const avg = useDashboardWeeklyProgress(today).data?.average || 0;
                                    const prev = useDashboardWeeklyProgress(today).data?.previousAverage || 0;
                                    const diff = prev > 0 ? ((avg - prev) / prev) * 100 : 0;
                                    return `${Math.round(diff)}%`;
                                  })()}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Alumnos Activos</div>
                                <div className="text-2xl font-bold">{totalStudents}</div>
                              </div>
                            </div>

                            <RevenueChart
                                title="Progreso de Alumnos"
                                subtitle="Rendimiento general de la semana"
                                data={(weekly?.series || []).map(p => ({ label: p.day, value: p.attendance }))}
                                average={weekly?.average}
                                previousAverage={weekly?.previousAverage}
                                activeStudents={totalStudents}
                            />
                            {/* TODO: Actualizar RevenueChart para aceptar props (data, average, previousAverage). */}
                            <UsersTable
                                title="Mis Alumnos Recientes"
                                onAddUser={handleAddStudent}
                            />
                        </div>

                        {/* Sidebar Section */}
                        <div className="space-y-4 sm:space-y-6">
                            <QuickActions title="Acciones Rápidas" />

                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Actividad Reciente</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                {recentActivity.length === 0 ? (
                                  <div className="text-sm text-muted-foreground">Sin actividad en las últimas 24 horas</div>
                                ) : (
                                  recentActivity.map((a, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-2 rounded-md border">
                                      <div className="mt-0.5">
                                        {a.icon === 'completed' ? (
                                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        ) : (
                                          <UserPlus className="h-4 w-4 text-blue-600" />
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium truncate">{a.title}</div>
                                        <div className="text-xs text-muted-foreground truncate">{a.subtitle}</div>
                                      </div>
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        <span>{a.time}</span>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardTrainer;