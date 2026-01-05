'use client';

import { memo, useMemo } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Calendar } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

const defaultChartData = [
  { month: 'Lun', value: 85, growth: 12, color: 'bg-blue-500' },
  { month: 'Mar', value: 70, growth: -8, color: 'bg-red-500' },
  { month: 'Mié', value: 95, growth: 25, color: 'bg-green-500' },
  { month: 'Jue', value: 88, growth: 15, color: 'bg-yellow-500' },
  { month: 'Vie', value: 92, growth: 18, color: 'bg-purple-500' },
  { month: 'Sáb', value: 78, growth: 5, color: 'bg-cyan-500' },
  { month: 'Dom', value: 82, growth: 10, color: 'bg-orange-500' },
];

interface RevenueChartProps {
  title?: string;
  subtitle?: string;
  data?: { label: string; value: number; growth?: number }[];
  average?: number; // 0-100
  previousAverage?: number; // 0-100 (para calcular mejora)
  activeStudents?: number;
}

export const RevenueChart = memo(({ 
  title = "Progreso de Alumnos", 
  subtitle = "Rendimiento general de la semana",
  data,
  average,
  previousAverage,
  activeStudents,
}: RevenueChartProps) => {
  const bars = useMemo(() => {
    const colors = ['bg-blue-500','bg-red-500','bg-green-500','bg-yellow-500','bg-purple-500','bg-cyan-500','bg-orange-500'];
    const source = data && data.length ? data : defaultChartData.map(d => ({ label: d.month, value: d.value, growth: d.growth }));
    return source.map((item, idx) => ({
      month: item.label,
      value: Math.max(0, Math.min(100, Math.round(item.value))),
      growth: Math.round(item.growth ?? 0),
      color: colors[idx % colors.length]
    }));
  }, [data]);

  const averageDisplay = typeof average === 'number' ? Math.max(0, Math.min(100, Math.round(average))) : 87;
  const growthPct = useMemo(() => {
    if (typeof average === 'number' && typeof previousAverage === 'number' && previousAverage > 0) {
      return Math.round(((average - previousAverage) / previousAverage) * 100);
    }
    return 12;
  }, [average, previousAverage]);
  const activeDisplay = typeof activeStudents === 'number' ? Math.max(0, Math.round(activeStudents)) : 45;
  return (
    <div className="border-border bg-card/40 rounded-xl border p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <BarChart3 className="h-5 w-5 text-green-500" />
            {title}
          </h3>
          <p className="text-muted-foreground text-sm">
            {subtitle}
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          Última semana
        </Button>
      </div>

      {/* Fixed Chart Area */}
      <div className="relative mb-4 h-64 rounded-lg p-4">
        <div className="flex h-full items-end justify-between gap-3">
          {bars.map((item, index) => (
            <div
              key={item.month}
              className="group flex flex-1 flex-col items-center"
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.value / 100) * 180}px` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={`w-full ${item.color} relative min-h-[20px] cursor-pointer rounded-t-lg transition-opacity hover:opacity-80`}
              >
                {/* Tooltip */}
                <div className="border-border bg-popover absolute -top-16 left-1/2 z-10 -translate-x-1/2 transform rounded-lg border px-3 py-2 text-sm whitespace-nowrap opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  <div className="font-medium">
                    {item.value}% asistencia
                  </div>
                  <div
                    className={`text-xs ${item.growth > 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {item.growth > 0 ? '+' : ''}
                    {item.growth}%
                  </div>
                </div>
              </motion.div>
              <div className="text-muted-foreground mt-2 text-center text-xs font-medium">
                {item.month}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="border-border/50 grid grid-cols-3 gap-4 border-t pt-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">{averageDisplay}%</div>
          <div className="text-muted-foreground text-xs">Asistencia Promedio</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-500">{growthPct > 0 ? '+' : ''}{growthPct}%</div>
          <div className="text-muted-foreground text-xs">Mejora Semanal</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-500">{activeDisplay}</div>
          <div className="text-muted-foreground text-xs">Alumnos Activos</div>
        </div>
      </div>
    </div>
  );
});

RevenueChart.displayName = 'RevenueChart';
