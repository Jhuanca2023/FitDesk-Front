import { cn } from "@/core/lib/utils"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function LoadingSpinner({ className, ...props }: LoadingSpinnerProps) {
  return (
    <div
      className={cn("animate-spin rounded-full border-2 border-current border-t-transparent h-4 w-4", className)}
      {...props}
    >
      <span className="sr-only">Cargando...</span>
    </div>
  )
}
