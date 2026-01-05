import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Calendar, Users, Clock, TrendingUp, Target } from 'lucide-react';
import type { Class, ClassMetrics } from '../types';

interface ClassMetricsViewProps {
  metrics: ClassMetrics;
  classData: Class;
  isLoading?: boolean;
}

export function ClassMetricsView({ metrics, classData, isLoading = false }: ClassMetricsViewProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[110px] w-full" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  const { 
    totalStudents, 
    averageAttendance, 
    attendanceTrend = [], 
    attendanceByDay = [], 
    recentActivity = [],
    topStudents = []
  } = metrics;
  
  const { name: className = 'Clase' } = classData || {};

  // Prepare data for the attendance trend chart
  const chartData = attendanceTrend?.map(item => ({
    date: new Date(item.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
    attendance: item.attendanceRate
  })) || [];

  // Prepare data for the attendance by day chart
  const dayData = [
    { name: 'Lun', value: attendanceByDay?.find(d => d.day === 'MONDAY')?.count || 0 },
    { name: 'Mar', value: attendanceByDay?.find(d => d.day === 'TUESDAY')?.count || 0 },
    { name: 'Mié', value: attendanceByDay?.find(d => d.day === 'WEDNESDAY')?.count || 0 },
    { name: 'Jue', value: attendanceByDay?.find(d => d.day === 'THURSDAY')?.count || 0 },
    { name: 'Vie', value: attendanceByDay?.find(d => d.day === 'FRIDAY')?.count || 0 },
    { name: 'Sáb', value: attendanceByDay?.find(d => d.day === 'SATURDAY')?.count || 0 },
    { name: 'Dom', value: attendanceByDay?.find(d => d.day === 'SUNDAY')?.count || 0 },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              {className}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asistencia Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageAttendance}%</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 días
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesiones Esta Semana</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dayData.reduce((sum, day) => sum + day.value, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Sesiones completadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mejores Asistencias</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topStudents?.[0]?.attendanceRate || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {topStudents?.[0]?.studentName || 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Attendance Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Asistencia</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Asistencia']}
                  labelFormatter={(label) => `Fecha: ${label}`}
                />
                <Bar dataKey="attendance" fill="#8884d8" name="Asistencia" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance by Day */}
        <Card>
          <CardHeader>
            <CardTitle>Asistencia por Día</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [value, 'Asistencias']}
                  labelFormatter={(label) => `Día: ${label}`}
                />
                <Bar dataKey="value" fill="#82ca9d" name="Asistencias" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Students */}
      <Card>
        <CardHeader>
          <CardTitle>Mejores Estudiantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topStudents.slice(0, 5).map((student) => (
              <div key={student.studentId} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="font-medium text-primary">
                      {student.studentName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{student.studentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {student.totalClasses} clases
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="ml-4">
                  {student.attendanceRate}% asistencia
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={`${activity.studentId}-${activity.date}`} className="flex items-start">
                <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  {activity.action === 'attended' ? (
                    <Clock className="h-4 w-4 text-green-500" />
                  ) : activity.action === 'missed' ? (
                    <Clock className="h-4 w-4 text-red-500" />
                  ) : (
                    <Users className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{activity.studentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.action === 'attended' 
                      ? 'Asistió a la clase' 
                      : activity.action === 'missed' 
                        ? 'No asistió a la clase' 
                        : activity.action === 'joined' 
                          ? 'Se unió a la clase' 
                          : 'Dejó la clase'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
