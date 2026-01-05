import { useMemo } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameDay, 
  isToday,
  isSameMonth
} from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, MapPin, Users, MoreHorizontal } from 'lucide-react';
import { cn } from '@/core/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import type { CalendarEvent } from '../types';
import { CLASS_STATUS_COLORS, CLASS_STATUS_LABELS } from '../types';

interface MonthlyCalendarProps {
  events: CalendarEvent[];
  currentDate: Date;
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  className?: string;
}

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export function MonthlyCalendar({
  events,
  currentDate,
  onEventClick,
  onDateClick,
  className
}: MonthlyCalendarProps) {
  
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = [];
    let day = calendarStart;

    while (day <= calendarEnd) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  }, [currentDate]);

  
  const eventsByDay = useMemo(() => {
    const grouped: Record<string, CalendarEvent[]> = {};
    
    calendarDays.forEach(day => {
      const dayKey = format(day, 'yyyy-MM-dd');
      grouped[dayKey] = events.filter(event => 
        isSameDay(event.start, day)
      ).sort((a, b) => a.start.getTime() - b.start.getTime());
    });
    
    return grouped;
  }, [events, calendarDays]);

  const handleDateClick = (date: Date) => {
    onDateClick?.(date);
  };

  const handleEventClick = (event: CalendarEvent) => {
    onEventClick?.(event);
  };

  
  const EventItem = ({ event }: { event: CalendarEvent }) => (
    <div
      className={cn(
        "text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity truncate",
        "border-l-2",
        event.status === 'scheduled' && "border-l-blue-500 bg-blue-500/20 text-white",
        event.status === 'in_progress' && "border-l-green-500 bg-green-500/20 text-white",
        event.status === 'completed' && "border-l-gray-500 bg-gray-500/20 text-white",
        event.status === 'cancelled' && "border-l-red-500 bg-red-500/20 text-white"
      )}
      onClick={() => handleEventClick(event)}
      title={`${event.title} - ${format(event.start, 'HH:mm')} - ${event.location}`}
    >
      <div className="flex items-center space-x-1">
        <Clock className="h-3 w-3 flex-shrink-0" />
        <span className="truncate">
          {format(event.start, 'HH:mm')} {event.title}
        </span>
      </div>
    </div>
  );

  
  const MoreEventsPopover = ({ events, date }: { events: CalendarEvent[]; date: Date }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <MoreHorizontal className="h-3 w-3 mr-1" />
          +{events.length - 2} más
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-2">
          <h4 className="font-medium">
            {format(date, 'EEEE d \'de\' MMMM', { locale: es })}
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {events.map((event) => (
              <Card
                key={event.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => handleEventClick(event)}
              >
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-sm">{event.title}</h5>
                      <Badge 
                        variant="secondary" 
                        className={cn("text-xs", CLASS_STATUS_COLORS[event.status])}
                      >
                        {CLASS_STATUS_LABELS[event.status]}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                    </div>
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {event.location}
                    </div>
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Users className="h-3 w-3 mr-1" />
                      {event.enrolledCount}/{event.capacity} alumnos
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header con días de la semana */}
      <div className="grid grid-cols-7 border-b bg-muted/30">
        {WEEKDAYS.map((day) => (
          <div key={day} className="p-3 text-center border-r last:border-r-0">
            <span className="text-sm font-medium text-muted-foreground">{day}</span>
          </div>
        ))}
      </div>

      {/* Cuerpo del calendario */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr">
        {calendarDays.map((day) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const dayEvents = eventsByDay[dayKey] || [];
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);
          
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "border-r border-b last:border-r-0 p-2 min-h-[120px] cursor-pointer hover:bg-accent/20 transition-colors",
                !isCurrentMonth && "bg-muted/20 text-muted-foreground",
                isCurrentDay && "bg-primary/5"
              )}
              onClick={() => handleDateClick(day)}
            >
              {/* Número del día */}
              <div className="flex justify-between items-start mb-2">
                <span className={cn(
                  "text-sm font-medium",
                  isCurrentDay && "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs"
                )}>
                  {format(day, 'd')}
                </span>
                
                {/* Indicador de cantidad de eventos */}
                {dayEvents.length > 0 && (
                  <Badge variant="secondary" className="text-xs h-5">
                    {dayEvents.length}
                  </Badge>
                )}
              </div>

              {/* Lista de eventos */}
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <EventItem key={event.id} event={event} />
                ))}
                
                {/* Mostrar "más eventos" si hay más de 2 */}
                {dayEvents.length > 2 && (
                  <MoreEventsPopover events={dayEvents} date={day} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
