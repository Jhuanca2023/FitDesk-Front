import { motion } from 'motion/react';
import type { Statistic } from '../types';

interface StatisticsCardProps {
  statistics?: Statistic[];
  isLoading?: boolean;
}

export const StatisticsCard = ({ statistics = [], isLoading = false }: StatisticsCardProps) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="border-border bg-card/40 rounded-xl border p-6"
      >
        <div className="relative">
          <h3 className="mb-4 text-xl font-semibold">Estadísticas</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border-border/50 rounded-lg border p-4">
                <div className="h-8 bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      className="group relative cursor-pointer"
    >
      <div className="border-border bg-card/40 rounded-xl border p-6 transition-all duration-300 hover:shadow-lg">
        <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="relative">
          <h3 className="mb-4 text-xl font-semibold">Estadísticas</h3>
          <div className="space-y-4">
            {statistics.length > 0 ? (
              statistics.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="border-border/50 rounded-lg border p-4 transition-colors hover:bg-accent/50"
                >
                  <div className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-muted-foreground">No hay estadísticas disponibles</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
