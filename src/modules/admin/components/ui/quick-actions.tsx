import { memo } from 'react';
import { motion } from 'motion/react';
import { Users, Settings } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface QuickActionsProps {
  onAddUser: () => void;
  onExport: () => void;
}

const actions = [
  {
    icon: Users,
    label: 'Añadir nuevo entrenador',
    color: 'blue',
    shortcut: 'Ctrl+M',
    action: 'addUser',
  },
  {
    icon: Settings,
    label: 'Configuración del sistema',
    color: 'orange',
    shortcut: 'Ctrl+S',
    action: 'settings',
  },
];

export const QuickActions = memo(
  ({ onAddUser, onExport }: QuickActionsProps) => {
    const handleAction = (action: string) => {
      switch (action) {
        case 'addUser':
          onAddUser();
          break;
        case 'analytics':
          console.log('Viewing analytics...');
          break;
        case 'export':
          onExport();
          break;
        case 'settings':
          console.log('Opening settings...');
          break;
      }
    };

    return (
      <div className="border-border bg-card/40 rounded-xl border p-6">
        <h3 className="mb-4 text-xl font-semibold">Quick Actions</h3>
        <div className="space-y-3">
          {actions.map((action) => {
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
