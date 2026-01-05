import * as React from 'react';

type ToastType = 'default' | 'destructive' | 'success' | 'warning' | 'info';

interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
}

interface ToastContextType {
  showToast: (options: Omit<Toast, 'id'>) => void;
  toast: (options: Omit<Toast, 'id'>) => void; // Alias para mantener compatibilidad
  hideToast: (id: string) => void;
  toasts: Toast[];
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const showToast = React.useCallback(({ title, description, type = 'default' }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    setToasts(currentToasts => [...currentToasts, { id, title, description, type }]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
    }, 5000);
  }, []);

  const hideToast = React.useCallback((id: string) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  }, []);

  const value = React.useMemo(() => ({
    showToast,
    toast: showToast, // Alias para mantener compatibilidad
    hideToast,
    toasts,
  }), [showToast, hideToast, toasts]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Componente Toaster para mostrar las notificaciones
export function Toaster() {
  const { toasts, hideToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => {
        const iconMap = {
          default: 'ℹ️',
          success: '✅',
          warning: '⚠️',
          destructive: '❌',
          info: 'ℹ️',
        } as const;

        const bgColorMap = {
          default: 'bg-background',
          success: 'bg-green-500/15',
          warning: 'bg-yellow-500/15',
          destructive: 'bg-destructive/15',
          info: 'bg-blue-500/15',
        } as const;

        const textColorMap = {
          default: 'text-foreground',
          success: 'text-green-500',
          warning: 'text-yellow-500',
          destructive: 'text-destructive',
          info: 'text-blue-500',
        } as const;

        const icon = iconMap[toast.type || 'default'];
        const bgColor = bgColorMap[toast.type || 'default'];
        const textColor = textColorMap[toast.type || 'default'];

        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 p-4 pr-10 rounded-lg shadow-lg max-w-sm w-full relative border border-border/50 ${bgColor}`}
          >
            <span className={`text-xl ${textColor}`}>{icon}</span>
            <div className="flex-1">
              {toast.title && (
                <h4 className="font-medium text-foreground">
                  {toast.title}
                </h4>
              )}
              {toast.description && (
                <p className="text-sm text-muted-foreground">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => hideToast(toast.id)}
              className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 hover:text-foreground focus:outline-none"
              aria-label="Cerrar notificación"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
