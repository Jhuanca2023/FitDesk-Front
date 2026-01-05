import { memo } from 'react';
import { motion } from 'motion/react';
import { User, Users, Calendar, DollarSign } from 'lucide-react';
import { useAdminRecentActivity } from '@/core/queries/useAdminActivityQuery';

function timeAgo(iso?: string): string {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Ahora';
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h`;
  const d = Math.floor(h / 24);
  return `${d} d`;
}

export const RecentActivity = memo(() => {
  const { data: items } = useAdminRecentActivity(3);

  const iconMap: Record<string, any> = {
    user: Users,
    class: Calendar,
    payment: DollarSign,
  };
  const colorMap: Record<string, string> = {
    user: 'text-blue-500',
    class: 'text-purple-500',
    payment: 'text-green-500',
  };

  return (
    <div className="border-border bg-card/40 rounded-xl border p-6">
      <h3 className="mb-4 text-xl font-semibold">Actividad reciente</h3>
      <div className="space-y-3">
        {(items ?? []).map((a, index) => {
          const Icon = iconMap[a.type] ?? User;
          const color = colorMap[a.type] ?? 'text-muted-foreground';
          const key = `${a.type}-${a.title}-${a.subtitle}-${index}`;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="hover:bg-accent/50 flex items-center gap-3 rounded-lg p-2 transition-colors"
            >
              <div className={`bg-accent/50 rounded-lg p-2`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{a.title}</div>
                <div className="text-muted-foreground truncate text-xs">{a.subtitle}</div>
              </div>
              <div className="text-muted-foreground text-xs">{timeAgo(a.occurredAt)}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

