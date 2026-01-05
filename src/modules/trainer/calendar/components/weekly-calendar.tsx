import { useState, useMemo } from 'react';
import { format, startOfWeek, isToday, isSameDay, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, RefreshCw, MapPin, Users } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/core/lib/utils';
import type { CalendarEvent } from '../types';

interface WeeklyCalendarProps {
  events: CalendarEvent[];
  currentDate: Date;
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onNextWeek?: () => void;
  onPreviousWeek?: () => void;
  onToday?: () => void;
  className?: string;
}

export function WeeklyCalendar({
  events = [],
  currentDate,
  onEventClick,
  onDateClick,
  onRefresh,
  isRefreshing = false,
  onNextWeek,
  onPreviousWeek,
  onToday,
  className,
}: WeeklyCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }).map((_, i) => addDays(start, i));
    return days;
  }, [currentDate, events]);

  const handlePrevWeek = () => {
    if (onPreviousWeek) {
      onPreviousWeek();
    }
  };

  const handleNextWeek = () => {
    if (onNextWeek) {
      onNextWeek();
    }
  };

  const handleToday = () => {
    if (onToday) {
      onToday();
    }
  };

  const getDayEvents = (day: Date) => {
    const dayEvents = events.filter(event => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const eventDayStr = format(event.start, 'yyyy-MM-dd');
      return dayStr === eventDayStr;
    });
    return dayEvents;
  };

  const formatTime = (date: Date) => format(date, 'HH:mm');

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    onDateClick?.(day);
  };

  const handleEventClick = (event: CalendarEvent) => {
    onEventClick?.(event);
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6 mt-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          {onToday && (
            <Button variant="outline" size="sm" onClick={handleToday}>
              Hoy
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refrescar calendario"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          )}
          <Button variant="outline" size="icon" onClick={handlePrevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-px bg-border rounded-t-md overflow-hidden">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, i) => (
          <div key={i} className="bg-muted/50 p-2 text-center text-sm font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-border flex-1">
        {weekDays.map((day, i) => {
          const dayEvents = getDayEvents(day);
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentDay = isToday(day);
          
          return (
            <div 
              key={i} 
              className={cn(
                'bg-background p-2 min-h-32 flex flex-col',
                i > 4 && 'bg-muted/5', 
                isSelected && 'ring-2 ring-primary/50'
              )}
              onClick={() => handleDateClick(day)}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={cn(
                  'flex items-center justify-center rounded-full h-6 w-6 text-sm',
                  isCurrentDay && 'bg-primary text-primary-foreground',
                  isSelected && !isCurrentDay && 'font-semibold'
                )}>
                  {format(day, 'd')}
                </span>
                {isToday(day) && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2 mt-1">
                {dayEvents.map((event) => (
                  <div 
                    key={event.id}
                    className={cn(
                      'text-xs p-3 rounded-lg text-left space-y-2 cursor-pointer transition-all duration-200 hover:shadow-md',
                      event.status === 'scheduled' && 'bg-blue-500/10 border-2 border-blue-500/30',
                      event.status === 'in_progress' && 'bg-yellow-500/10 border-2 border-yellow-500/30',
                      event.status === 'completed' && 'bg-green-500/10 border-2 border-green-500/30',
                      event.status === 'cancelled' && 'bg-red-500/10 border-2 border-red-500/30'
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event);
                    }}
                  >
                    <div className="font-medium text-sm mb-1">
                      {event.title}
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{event.enrolledCount}/{event.capacity} inscritos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                    <div className={cn("flex items-center gap-1 text-xs font-medium mt-1",
                      event.status === 'scheduled' && 'text-blue-600',
                      event.status === 'in_progress' && 'text-yellow-600',
                      event.status === 'completed' && 'text-green-600'
                    )}>
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatTime(event.start)} - {formatTime(event.end)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
