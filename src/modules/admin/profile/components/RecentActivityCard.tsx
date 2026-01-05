import { motion } from 'motion/react';
import { User } from 'lucide-react';
import type { Activity } from '../types';

interface RecentActivityCardProps {
  activities?: Activity[];
  isLoading?: boolean;
}

export const RecentActivityCard = ({ activities = [], isLoading = false }: RecentActivityCardProps) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border-border bg-card/40 rounded-xl border p-6"
      >
        <div className="relative">
          <h3 className="mb-4 text-xl font-semibold">Actividad Reciente</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg p-2">
                <div className="bg-accent/50 rounded-lg p-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="h-4 bg-muted rounded animate-pulse mb-1"></div>
                  <div className="h-3 bg-muted rounded animate-pulse w-3/4"></div>
                </div>
                <div className="h-3 bg-muted rounded animate-pulse w-12"></div>
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
      transition={{ delay: 0.2 }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      className="group relative cursor-pointer"
    >
      <div className="border-border bg-card/40 rounded-xl border p-6 transition-all duration-300 hover:shadow-lg">
        <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="relative">
          <h3 className="mb-4 text-xl font-semibold">Actividad Reciente</h3>
          <div className="space-y-3">
            {activities.length > 0 ? (
              activities.map((activity, index) => {
                const IconComponent = activity.icon || User;
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-accent/50 flex items-center gap-3 rounded-lg p-2 transition-colors"
                  >
                    <div className="bg-accent/50 rounded-lg p-2">
                      <IconComponent className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{activity.title}</div>
                      <div className="text-muted-foreground truncate text-xs">
                        {activity.description}
                      </div>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {activity.time}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay actividad reciente</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
