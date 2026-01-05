import { memo, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart3 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router';

interface QuickActionsProps {
  title?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    icon: React.ReactNode;
  }>;
}

const defaultActions = [
  {
    icon: BarChart3,
    label: 'Ver Estadísticas',
    color: 'green',
    shortcut: 'Ctrl+V',
    action: 'analytics',
  },
];

export const QuickActions = memo(
  ({ title = "Acciones Rápidas" }: QuickActionsProps) => {
    const navigate = useNavigate();
    const handleAction = (action: string) => {
      switch (action) {
        case 'analytics':
          console.log('Viendo estadísticas...');
          break;
      }
    };

   
    useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) {
          e.preventDefault();
          navigate('/trainer/students?tab=metrics');
        }
      };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }, [navigate]);

    return (
      <div className="border-border bg-card/40 rounded-xl border p-6">
        <h3 className="mb-4 text-xl font-semibold">{title}</h3>
        <div className="space-y-3">
          {defaultActions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className={`h-12 w-full justify-start hover:bg-${action.color}-500/10 hover:border-${action.color}-500/50 transition-all duration-200`}
                  onClick={() => handleAction(action.action)}
                >
                  <Icon className={`mr-3 h-5 w-5 text-${action.color}-500`} />
                  <span className="font-medium">{action.label}</span>
                  <div className="text-muted-foreground ml-auto text-xs">
                    {action.shortcut}
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  },
);

QuickActions.displayName = 'QuickActions';
