import { CheckCircle2, Clock, AlertCircle, Calendar } from "lucide-react"

type ActivityType = 'completed' | 'upcoming' | 'cancelled'

interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description: string
  time: string
  date: string
}

const activityData: ActivityItem[] = [
  {
    id: '1',
    type: 'completed',
    title: 'Clase de Spinning',
    description: 'Completada con éxito',
    time: '08:00 AM',
    date: 'Hoy'
  },
  {
    id: '2',
    type: 'upcoming',
    title: 'Entrenamiento Funcional',
    description: 'Próxima clase',
    time: '06:00 PM',
    date: 'Hoy'
  },
  {
    id: '3',
    type: 'cancelled',
    title: 'Yoga',
    description: 'Clase cancelada',
    time: '07:00 AM',
    date: 'Ayer'
  },
]

export function RecentActivity() {
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'upcoming':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Actividad Reciente</h3>
        <button className="text-sm text-muted-foreground hover:text-foreground">
          Ver todo
        </button>
      </div>
      
      <div className="mt-4 space-y-4">
        {activityData.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="mt-1">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{activity.title}</h4>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {activity.description}
              </p>
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                {activity.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
