import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface ClassTimerProps {
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  actualStartTime?: Date;
  classId?: string;
}

export function ClassTimer({ startTime, endTime, status, actualStartTime, classId }: ClassTimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const storageKey = classId ? `class_timer_state_${classId}` : null;
  
  const scheduledDuration = endTime.getTime() - startTime.getTime();
  
  const isOvertime = elapsedTime > scheduledDuration;
  const overtime = isOvertime ? elapsedTime - scheduledDuration : 0;

  useEffect(() => {
    if (status === 'in_progress' && storageKey) {
      const savedState = localStorage.getItem(storageKey);
      
      if (savedState) {
        try {
          const { startTime: savedStartTime, isRunning: savedIsRunning } = JSON.parse(savedState);
          const realStartTime = new Date(savedStartTime);
          const now = Date.now();
          const elapsed = Math.max(0, now - realStartTime.getTime());
          setElapsedTime(elapsed);
          setIsRunning(savedIsRunning !== undefined ? savedIsRunning : true);
        } catch {
          const realStartTime = actualStartTime || startTime;
          const now = Date.now();
          const elapsed = Math.max(0, now - realStartTime.getTime());
          setElapsedTime(elapsed);
          setIsRunning(true);
          localStorage.setItem(storageKey, JSON.stringify({ 
            startTime: realStartTime.getTime(),
            isRunning: true 
          }));
        }
      } else {
        const realStartTime = actualStartTime || startTime;
        localStorage.setItem(storageKey, JSON.stringify({ 
          startTime: realStartTime.getTime(),
          isRunning: true 
        }));
        setElapsedTime(0);
        setIsRunning(true);
      }
    }
  }, [status, storageKey, actualStartTime, startTime]);

  useEffect(() => {
    if (status === 'in_progress' && isRunning && storageKey) {
      intervalRef.current = setInterval(() => {
        const savedState = localStorage.getItem(storageKey);
        if (savedState) {
          try {
            const { startTime: savedStartTime } = JSON.parse(savedState);
            const realStartTime = new Date(savedStartTime);
            const now = Date.now();
            const elapsed = Math.max(0, now - realStartTime.getTime());
            setElapsedTime(elapsed);
          } catch {}
        }
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, isRunning, storageKey]);


  const handleStartPause = () => {
    setIsRunning(!isRunning);
    if (storageKey) {
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        const state = JSON.parse(savedState);
        state.isRunning = !isRunning;
        localStorage.setItem(storageKey, JSON.stringify(state));
      }
    }
  };

  const handleReset = () => {
    if (storageKey) {
      localStorage.removeItem(storageKey);
      const realStartTime = actualStartTime || startTime;
      localStorage.setItem(storageKey, JSON.stringify({ 
        startTime: realStartTime.getTime(),
        isRunning: true 
      }));
      setElapsedTime(0);
      setIsRunning(true);
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
      milliseconds: String(ms).padStart(2, '0')
    };
  };

  if (status !== 'in_progress') {
    return null;
  }

  const timeFormatted = formatTime(elapsedTime);
  const scheduledTimeFormatted = formatTime(scheduledDuration);
  const overtimeFormatted = formatTime(overtime);

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Cronómetro de Clase
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tiempo programado */}
        <div className="p-3 rounded-lg bg-muted/30">
          <div className="text-xs text-muted-foreground mb-1">Tiempo Programado</div>
          <div className="text-lg font-semibold">
            {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Duración: {scheduledTimeFormatted.hours}:{scheduledTimeFormatted.minutes}:{scheduledTimeFormatted.seconds}
          </div>
        </div>

        {/* Tiempo transcurrido */}
        <div className={`p-6 rounded-lg text-center transition-colors ${
          isOvertime ? 'bg-red-500/10 border-2 border-red-500/30' : 'bg-primary/5 border-2 border-primary/20'
        }`}>
          <div className="text-xs text-muted-foreground mb-2">
            {isOvertime ? 'Tiempo Excedido' : 'Tiempo Transcurrido'}
          </div>
          <div className="text-4xl font-mono font-bold">
            {timeFormatted.hours}:{timeFormatted.minutes}:{timeFormatted.seconds}
            <span className="text-2xl">.{timeFormatted.milliseconds}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            H : M : S : MS
          </div>
        </div>

        {/* Tiempo adicional si aplica */}
        {isOvertime && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <div className="text-xs text-red-600 font-medium mb-1">⚠️ Tiempo Adicional</div>
            <div className="text-xl font-mono font-bold text-red-600">
              +{overtimeFormatted.hours}:{overtimeFormatted.minutes}:{overtimeFormatted.seconds}.{overtimeFormatted.milliseconds}
            </div>
          </div>
        )}

        {/* Botones de control */}
        <div className="flex gap-2">
          <Button
            onClick={handleStartPause}
            variant={isRunning ? "destructive" : "default"}
            className="flex-1"
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pausar
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Reanudar
              </>
            )}
          </Button>
          
          <Button
            onClick={handleReset}
            variant="outline"
            size="icon"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
