import { cn } from '@/core/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Users,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { useAttendanceCalendar, type CalendarDay } from '../hooks/use-attendance-calendar';
import { useAttendanceStore } from '../store/attendance-store';

interface AttendanceCalendarProps {
  onDayClick?: (date: Date) => void;
  onSessionClick?: (sessionId: string) => void;
}

export function AttendanceCalendar({ onDayClick, onSessionClick }: AttendanceCalendarProps) {
  const {
    calendarWeeks,
    currentMonthInfo,
    goToNextMonth,
    goToPrevMonth,
    goToToday,
    selectedDate
  } = useAttendanceCalendar();

  const { setSelectedDate } = useAttendanceStore();

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    onDayClick?.(day.date);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendario de Asistencia
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
            >
              Hoy
            </Button>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrevMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-[140px] text-center font-medium">
                {currentMonthInfo.monthName}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNextMonth}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Estadísticas del mes */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{currentMonthInfo.totalSessions}</div>
            <div className="text-sm text-muted-foreground">Total Sesiones</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{currentMonthInfo.completedSessions}</div>
            <div className="text-sm text-muted-foreground">Completadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{currentMonthInfo.daysWithSessions}</div>
            <div className="text-sm text-muted-foreground">Días Activos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {currentMonthInfo.completionRate.toFixed(0)}%
            </div>
            <div className="text-sm text-muted-foreground">Completadas</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Encabezados de días */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendario */}
        <div className="space-y-1">
          {calendarWeeks.map((week) => (
            <div key={week.weekNumber} className="grid grid-cols-7 gap-1">
              {week.days.map((day) => (
                <CalendarDayCell
                  key={day.date.toISOString()}
                  day={day}
                  isSelected={format(day.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')}
                  onClick={() => handleDayClick(day)}
                  onSessionClick={onSessionClick}
                />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface CalendarDayCellProps {
  day: CalendarDay;
  isSelected: boolean;
  onClick: () => void;
  onSessionClick?: (sessionId: string) => void;
}

function CalendarDayCell({ day, isSelected, onClick, onSessionClick }: CalendarDayCellProps) {
  const hasActiveSessions = day.totalSessions > 0;
  const attendanceColor = day.attendanceRate >= 80 ? 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800' :
                         day.attendanceRate >= 60 ? 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800' :
                         day.attendanceRate > 0 ? 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800' : '';

  return (
    <div
      className={cn(
        "min-h-[80px] p-1 border rounded-lg cursor-pointer transition-all hover:bg-accent/50",
        {
          "bg-muted text-muted-foreground": !day.isCurrentMonth,
          "bg-primary text-primary-foreground": isSelected,
          "border-primary": isSelected,
          "bg-accent": day.isToday && !isSelected,
          [attendanceColor]: hasActiveSessions && !isSelected && day.isCurrentMonth
        }
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-1">
        <span className={cn(
          "text-sm font-medium",
          {
            "text-muted-foreground": !day.isCurrentMonth,
            "text-primary-foreground": isSelected,
            "font-bold": day.isToday
          }
        )}>
          {format(day.date, 'd')}
        </span>
        {day.isToday && !isSelected && (
          <div className="w-2 h-2 bg-primary rounded-full" />
        )}
      </div>

      {hasActiveSessions && (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span className="text-xs">{day.totalSessions}</span>
          </div>
          
          {day.completedSessions > 0 && (
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
              <span className="text-xs">{day.completedSessions}</span>
            </div>
          )}

          {day.attendanceRate > 0 && (
            <div className="text-xs font-medium">
              {day.attendanceRate.toFixed(0)}%
            </div>
          )}

          {/* Mostrar primeras sesiones como badges pequeños */}
          <div className="space-y-0.5">
            {day.sessions.slice(0, 2).map((session) => (
              <div
                key={session.id}
                className="text-xs truncate cursor-pointer hover:bg-black/10 rounded px-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onSessionClick?.(session.id);
                }}
              >
                {format(new Date(session.startTime), 'HH:mm')} {session.className}
              </div>
            ))}
            {day.sessions.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{day.sessions.length - 2} más
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
