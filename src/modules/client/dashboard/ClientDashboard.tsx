import { motion } from 'framer-motion';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import { Link } from 'react-router';
import {
  Dumbbell,
  Clock,
  Calendar,
  CreditCard,
  Loader2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useAuthStore } from '@/core/store/auth.store';
import { useGetMemberQuery } from '../profile/query/useMemberQuery';
import { useDashboardMember } from './hooks/useDashboard';
import { useMisReservas } from '../reserva-clase/hooks/useClasses';


const weeklyActivity = [
  { name: 'Lun', minutos: 65, calorias: 320 },
  { name: 'Mar', minutos: 59, calorias: 280 },
  { name: 'Mié', minutos: 80, calorias: 400 },
  { name: 'Jue', minutos: 81, calorias: 405 },
  { name: 'Vie', minutos: 56, calorias: 270 },
  { name: 'Sáb', minutos: 55, calorias: 260 },
  { name: 'Dom', minutos: 40, calorias: 200 },
];



const ClientDashboard = () => {
  const user = useAuthStore(state => state.user);
  const { data: member } = useGetMemberQuery(user?.id || '');
 
  const { data: dashboardData } = useDashboardMember();
  const { data: myReservations, isLoading: reservationsLoading } = useMisReservas(false); // Solo reservas activas

  const handleViewInvoices = () => {
    console.log('Ver facturas...');
  };


  const calculatedStats = [
    {
      id: 1,
      title: 'Clases Restantes',
      value: dashboardData ? `${dashboardData.remainingClasses || 0}` : '0',
      description: 'Este mes',
      icon: Dumbbell,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      progress: dashboardData ? Math.round((dashboardData.remainingClasses || 0) * 10) : 0
    },
    {
      id: 2,
      title: 'Próxima Clase',
      value: dashboardData?.nextClassName || 'Ninguna',
      description: dashboardData?.nextClassTime || 'No programada',
      icon: Clock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      progress: 0
    },
  ];


  const mappedUpcomingClasses = myReservations?.slice(0, 3).map((reservation: any) => ({
    id: reservation.reservationId,
    title: reservation.className,
    time: reservation.schedule,
    instructor: reservation.trainerName,
    level: 'Intermedio',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Fitness',
    spots: 5,
    status: reservation.action
  })) || [];




  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Hola {member?.firstName} {member?.lastName}
            </h1>
            <p className="text-muted-foreground mt-1">
              ¡Bienvenido de nuevo a tu rutina de entrenamiento! 🚀
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {calculatedStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group relative h-full overflow-hidden p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                      <p className="text-sm text-muted-foreground">{stat.description}</p>
                    </div>
                    <div className={`rounded-lg p-2 ${stat.bgColor} ${stat.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span>Progreso</span>
                      <span className="font-medium">{stat.progress}%</span>
                    </div>
                    <Progress value={stat.progress} className="h-2" />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Activity Chart */}
      <div className="mb-8">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Actividad Semanal</h2>
            <Button variant="outline" size="sm">Ver más</Button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyActivity}>
                <defs>
                  <linearGradient id="colorMinutos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorCalorias" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#3b82f6"
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#10b981"
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="minutos"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorMinutos)"
                  name="Minutos"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="calorias"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorCalorias)"
                  name="Calorías"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Mis Reservas */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Mis Reservas</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/client/classes">Ver todas</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {reservationsLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Cargando reservas...</span>
              </div>
            ) : mappedUpcomingClasses.length > 0 ? (
              mappedUpcomingClasses.map((classItem, index) => (
                <motion.div
                  key={classItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden transition-all hover:shadow-md">
                    <div className="flex">
                      <div className="h-24 w-24 flex-shrink-0">
                        <img
                          src={classItem.image}
                          alt={classItem.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{classItem.title}</h3>
                            <p className="text-sm text-muted-foreground">{classItem.time}</p>
                            <p className="mt-1 text-sm">
                              <span className="text-muted-foreground">Instructor:</span>{' '}
                              <span className="font-medium">{classItem.instructor}</span>
                            </p>
                          </div>
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            {classItem.status}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            {classItem.spots} cupos disponibles
                          </span>
                          <Button size="sm" asChild>
                            <Link to="/client/classes">Gestionar</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card className="p-8 text-center">
                <div className="text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No tienes reservas activas</h3>
                  <p className="text-sm mb-4">¡Reserva tu primera clase y comienza tu rutina de entrenamiento!</p>
                  <Button asChild>
                    <Link to="/reserva-clase">Reservar Clase</Link>
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>


      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Button
            variant="outline"
            className="h-auto flex-col items-start gap-3 p-4 text-left"
            asChild
          >
            <Link to="/reserva-clase">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Reservar Clase</h3>
                <p className="text-sm text-muted-foreground">Encuentra y reserva tu próxima clase</p>
              </div>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="h-auto flex-col items-start gap-3 p-4 text-left"
            onClick={handleViewInvoices}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Ver Facturas</h3>
              <p className="text-sm text-muted-foreground">Revisa tu historial de pagos</p>
            </div>
          </Button>
        </div>
      </div>

      {/* Membership Status */}
      <div className="mt-8">
        <Card className="overflow-hidden bg-gradient-to-r from-primary/5 to-blue-500/5">
          <div className="p-6">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <div className="mb-4 text-center md:mb-0 md:text-left">
                <h3 className="text-lg font-medium">Tu Membresía</h3>
                <p className="text-muted-foreground">
                  {dashboardData?.consecutiveDays ? (
                    <>
                      Has asistido <span className="font-medium text-foreground">{dashboardData.consecutiveDays}</span> días consecutivos
                    </>
                  ) : (
                    'Comienza tu rutina de entrenamiento'
                  )}
                </p>
              </div>
              <Progress 
                value={dashboardData?.consecutiveDays ? Math.min((dashboardData.consecutiveDays / 30) * 100, 100) : 0} 
                className="h-2 w-full max-w-md" 
              />
              <Button variant="ghost" size="sm" className="mt-4 md:mt-0 md:ml-4" asChild>
                <Link to="/reserva-clase">Reservar Clase</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;
