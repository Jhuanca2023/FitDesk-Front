import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from "@/shared/components/ui/card"

const data = [
  { name: 'Lun', value: 65 },
  { name: 'Mar', value: 59 },
  { name: 'Mié', value: 80 },
  { name: 'Jue', value: 81 },
  { name: 'Vie', value: 56 },
  { name: 'Sáb', value: 55 },
  { name: 'Dom', value: 40 },
]

interface ProgressChartProps {
  title?: string
  subtitle?: string
  className: string
}

export function ProgressChart({ 
  title = 'Mi Progreso', 
  subtitle = 'Actividad de la semana',
  className = '' 
}: ProgressChartProps) {
  return (
    <Card className={cn("p-6", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280' }}
              width={30}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
              }}
            />
            <Bar 
              dataKey="value" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
              barSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
