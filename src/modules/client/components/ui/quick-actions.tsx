import { Button } from "@/shared/components/ui/button"
import { cn } from "@/core/lib/utils"

type Action = {
  label: string
  onClick: () => void
  icon: React.ReactNode
  variant?: "default" | "outline" | "secondary" | "ghost" | "link"
}

interface QuickActionsProps {
  title: string
  actions: Action[]
  className?: string
}

export function QuickActions({ title, actions, className }: QuickActionsProps) {
  return (
    <div className={cn("rounded-xl border bg-card p-6 shadow-sm", className)}>
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <div className="space-y-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || "outline"}
            className="w-full justify-start"
            onClick={action.onClick}
          >
            <span className="mr-2">{action.icon}</span>
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
