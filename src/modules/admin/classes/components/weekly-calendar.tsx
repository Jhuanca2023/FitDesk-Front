import { format, startOfWeek, addWeeks, subWeeks, isToday, isSameDay, addDays } from 'date-fns';
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, User, Users, DoorOpen, Clock as ClockIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/core/lib/utils';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location: string;
  capacity: number;
  trainer: string;
  active: boolean;
}

interface WeeklyCalendarProps {
  events: CalendarEvent[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onNewEvent?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  className?: string;
}

export function WeeklyCalendar({
  events = [],
  onDateClick,
  onEventClick,
  onNewEvent,
  onRefresh,
  isRefreshing = false,
  className,
}: WeeklyCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  console.log('WeeklyCalendar received events:', events);


  const weekDays = useMemo(() => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  }, [currentWeek]);

 
  const prevWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const nextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentWeek(today);
    setSelectedDate(today);
  };


  const getDayEvents = (day: Date) => {
    const dayEvents = events.filter(event => isSameDay(event.start, day));
    console.log(`Events for ${format(day, 'yyyy-MM-dd')}:`, dayEvents);
    return dayEvents;
  };

  const formatTime = (date: Date) => format(date, 'HH:mm');

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    onDateClick?.(day);
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">
            {format(currentWeek, 'MMMM yyyy')}
          </h2>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hoy
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refrescar calendario"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" size="icon" onClick={prevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button onClick={onNewEvent} className="ml-2">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Clase
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
                    className={`text-xs p-2 rounded border text-left space-y-2 cursor-pointer transition-colors ${
                      event.active === false 
                        ? 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-700 dark:hover:bg-yellow-900/50' 
                        : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                  >
                    <div className="font-medium text-sm">{event.title}</div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      <span className="text-xs">{event.trainer}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{event.capacity} personas</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DoorOpen className="h-3.5 w-3.5" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-primary font-medium">
                      <ClockIcon className="h-3.5 w-3.5" />
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

export default WeeklyCalendar;
