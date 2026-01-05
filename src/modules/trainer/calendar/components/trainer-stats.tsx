import { Calendar, Users, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/core/lib/utils';

interface TrainerStatsProps {
  stats?: {
    totalClasses: number;
    completedClasses: number;
    scheduledClasses: number;
    totalStudents: number;
    averageAttendance: number;
    upcomingClasses: number;
  };
  isLoading?: boolean;
  className?: string;
}

export function TrainerStats({ stats, isLoading, className }: TrainerStatsProps) {
  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12 mb-2" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const completionRate = (stats.totalClasses && stats.completedClasses) 
    ? (stats.completedClasses / stats.totalClasses) * 100 
    : 0;

  const statCards = [
    {
      title: 'Clases Programadas',
      value: stats.scheduledClasses || 0,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Sin completar'
    },
    {
      title: 'Clases Completadas',
      value: stats.completedClasses || 0,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: `${completionRate.toFixed(1)}% completadas`,
      badge: completionRate >= 80 ? 'Excelente' : completionRate >= 60 ? 'Bueno' : 'Mejorar'
    },
    {
      title: 'Total Estudiantes',
      value: stats.totalStudents || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Estudiantes únicos'
    },
    {
      title: 'Asistencia Promedio',
      value: `${(stats.averageAttendance || 0).toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Promedio de asistencia',
      badge: (stats.averageAttendance || 0) >= 80 ? 'Excelente' : (stats.averageAttendance || 0) >= 60 ? 'Bueno' : 'Mejorar'
    },
    {
      title: 'Próximas Clases',
      value: stats.upcomingClasses || 0,
      icon: Calendar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      description: 'Esta semana'
    }
  ];

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4", className)}>
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <Card key={index} className="border-border bg-card/40 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative cursor-pointer">
            <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardHeader className="pb-2 relative">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span>{stat.title}</span>
                <div className={cn("p-2 rounded-lg", stat.bgColor.replace('bg-', 'bg-').replace('-100', '-500/20'))}>
                  <Icon className={cn("h-4 w-4", stat.color.replace('text-', 'text-').replace('-600', '-400'))} />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-2">
                <div className="text-2xl font-bold">{stat.value}</div>
                
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                  
                  {stat.badge && (
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-xs",
                        stat.badge === 'Excelente' && "bg-green-100 text-green-800",
                        stat.badge === 'Bueno' && "bg-yellow-100 text-yellow-800",
                        stat.badge === 'Mejorar' && "bg-red-100 text-red-800"
                      )}
                    >
                      {stat.badge}
                    </Badge>
                  )}
                </div>
                
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
