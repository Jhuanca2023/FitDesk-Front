import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react';
import { useQuickStats, useAttendanceSummary } from '../hooks/use-attendance';
import { useCalendarStats } from '../hooks/use-attendance-calendar';

interface AttendanceStatsCardsProps {
  dateRange?: { start: Date; end: Date };
  classId?: string;
}

export function AttendanceStatsCards({ dateRange, classId }: AttendanceStatsCardsProps) {
  const { data: quickStats, isLoading: quickStatsLoading } = useQuickStats();
  const { data: summary, isLoading: summaryLoading } = useAttendanceSummary({ dateRange, classId });
  const calendarStats = useCalendarStats();

  if (quickStatsLoading || summaryLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-muted rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card/40 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative cursor-pointer">
          <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Sesiones Hoy</CardTitle>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{quickStats?.todaySessions || 0}</div>
            <p className="text-xs text-muted-foreground">
              {(calendarStats.todayStats?.inProgressSessions || 0) > 0 && (
                <Badge variant="secondary" className="mt-1">
                  {calendarStats.todayStats?.inProgressSessions} en progreso
                </Badge>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative cursor-pointer">
          <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Asistencia Hoy</CardTitle>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-green-600">
              {(calendarStats.todayStats?.attendanceRate || 0).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {calendarStats.todayStats?.totalPresent || 0} de {calendarStats.todayStats?.totalMembers || 0} miembros
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative cursor-pointer">
          <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Promedio Semanal</CardTitle>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-blue-600">
              {quickStats?.weeklyAverage.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Asistencia promedio esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative cursor-pointer">
          <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Total Mensual</CardTitle>
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Target className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-purple-600">
              {quickStats?.monthlyTotal || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Sesiones completadas este mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resumen detallado */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border bg-card/40 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative cursor-pointer">
            <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
                Resumen de Asistencia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Presentes</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{summary.presentCount}</div>
                    <div className="text-xs text-muted-foreground">
                      {summary.totalMembers > 0 ? ((summary.presentCount / summary.totalMembers) * 100).toFixed(0) : 0}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Ausentes</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{summary.absentCount}</div>
                    <div className="text-xs text-muted-foreground">
                      {summary.totalMembers > 0 ? ((summary.absentCount / summary.totalMembers) * 100).toFixed(0) : 0}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Tarde</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{summary.lateCount}</div>
                    <div className="text-xs text-muted-foreground">
                      {summary.totalMembers > 0 ? ((summary.lateCount / summary.totalMembers) * 100).toFixed(0) : 0}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Justificados</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{summary.excusedCount}</div>
                    <div className="text-xs text-muted-foreground">
                      {summary.totalMembers > 0 ? ((summary.excusedCount / summary.totalMembers) * 100).toFixed(0) : 0}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Tasa de Asistencia</span>
                  <span className="text-sm font-bold">{summary.attendanceRate.toFixed(1)}%</span>
                </div>
                <Progress value={summary.attendanceRate} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/40 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative cursor-pointer">
            <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-400" />
                </div>
                Estadísticas Generales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{summary.totalSessions}</div>
                  <div className="text-sm text-muted-foreground">Total Sesiones</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{summary.totalMembers}</div>
                  <div className="text-sm text-muted-foreground">Total Miembros</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Promedio de Asistencia</span>
                  <span className="font-medium">{summary.averageAttendance.toFixed(1)}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Sesiones Completadas</span>
                  <Badge variant="outline">
                    {calendarStats.monthStats?.completedSessions || 0} / {calendarStats.monthStats?.totalSessions || 0}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Días Activos</span>
                  <span className="font-medium">{(calendarStats.monthStats?.totalSessions || 0) > 0 ? 'Activo' : 'Inactivo'}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {calendarStats.monthName || 'Mes actual'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Período actual de análisis
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
