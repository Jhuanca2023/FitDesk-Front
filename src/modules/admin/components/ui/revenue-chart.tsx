'use client';

import { memo } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Calendar } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useAdminRevenueSeries } from '@/core/queries/useAdminDashboardQuery';

export const RevenueChart = memo(() => {
  const { data: series } = useAdminRevenueSeries();
  const values = (series ?? []).map(s => s.value);
  const maxVal = Math.max(1, ...values);
  const total = values.reduce((a,b)=>a+b,0);
  const avg = values.length ? total / values.length : 0;
  const growth = (() => {
    if (!values.length) return 0;
    const curr = values[values.length - 1] || 0;
    const prev = values[values.length - 2] || 0;
    if (prev === 0) return curr > 0 ? 100 : 0;
    return ((curr - prev) / prev) * 100;
  })();
  const palette = ['bg-blue-500','bg-green-500','bg-purple-500','bg-cyan-500','bg-yellow-500','bg-pink-500'];
  return (
    <div className="border-border bg-card/40 rounded-xl border p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <BarChart3 className="h-5 w-5 text-green-500" />
            Analítica de ingresos
          </h3>
          <p className="text-muted-foreground text-sm">
            Rendimiento mensual (últimos 6 meses)
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          Últimos 6 meses
        </Button>
      </div>

      {/* Fixed Chart Area */}
      <div className="relative mb-4 h-64 rounded-lg p-4">
        <div className="flex h-full items-end justify-between gap-3">
          {(series ?? []).map((item, index) => (
            <div
              key={item.monthKey}
              className="group flex flex-1 flex-col items-center"
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.value / maxVal) * 180}px` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={`w-full ${palette[index % palette.length]} relative min-h-[20px] cursor-pointer rounded-t-lg transition-opacity hover:opacity-80`}
              >
                {/* Tooltip */}
                <div className="border-border bg-popover absolute -top-16 left-1/2 z-10 -translate-x-1/2 transform rounded-lg border px-3 py-2 text-sm whitespace-nowrap opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  <div className="font-medium">
                    S/ {item.value.toLocaleString('es-PE')}
                  </div>
                </div>
              </motion.div>
              <div className="text-muted-foreground mt-2 text-center text-xs font-medium">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="border-border/50 grid grid-cols-3 gap-4 border-t pt-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">S/ {total.toLocaleString('es-PE')}</div>
          <div className="text-muted-foreground text-xs">Ingresos totales</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${growth >= 0 ? 'text-blue-500' : 'text-red-500'}`}>{`${growth >= 0 ? '+' : ''}${Math.round(growth)}%`}</div>
          <div className="text-muted-foreground text-xs">Crecimiento</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-500">S/ {Math.round(avg).toLocaleString('es-PE')}</div>
          <div className="text-muted-foreground text-xs">Promedio</div>
        </div>
      </div>
    </div>
  );
});

RevenueChart.displayName = 'RevenueChart';