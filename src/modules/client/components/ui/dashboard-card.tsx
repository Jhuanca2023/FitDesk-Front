import { cn } from "@/core/lib/utils"
import { ArrowUp, ArrowDown } from "lucide-react"

interface StatCardProps {
  stat: {
    title: string
    value: string
    change?: string
    changeType?: 'positive' | 'negative' | 'neutral'
    icon: React.ComponentType<{ className?: string }>
    color: string
    bgColor: string
    description?: string
  }
  index: number
}

export function DashboardCard({ stat, index }: StatCardProps) {
  const Icon = stat.icon
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md",
        "dark:border-gray-800 dark:bg-gray-900/50"
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {stat.title}
          </p>
          <p className="mt-1 text-2xl font-bold">
            {stat.value}
          </p>
          {stat.description && (
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          )}
          {stat.change && (
            <div className={cn(
              "mt-1 flex items-center text-xs",
              stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 
              stat.changeType === 'negative' ? 'text-red-600 dark:text-red-400' :
              'text-amber-600 dark:text-amber-400'
            )}>
              {stat.changeType === 'positive' ? (
                <ArrowUp className="mr-1 h-3 w-3" />
              ) : stat.changeType === 'negative' ? (
                <ArrowDown className="mr-1 h-3 w-3" />
              ) : null}
              {stat.change}
            </div>
          )}
        </div>
        <div className={cn("rounded-lg p-3", stat.bgColor)}>
          <Icon className={cn("h-6 w-6", stat.color)} />
        </div>
      </div>
      
      {/* Animated background decoration */}
      <div 
        className={cn(
          "absolute -right-10 -top-10 h-24 w-24 rounded-full opacity-10",
          stat.bgColor.replace('bg-', 'bg-').replace('/10', '/20')
        )}
      />
    </div>
  )
}
