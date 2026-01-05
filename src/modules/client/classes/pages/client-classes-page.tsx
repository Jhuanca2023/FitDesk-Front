import { motion } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Button } from '@/shared/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useClientClasses } from '../hooks/use-client-classes';
import { useClientClassesStore } from '../store/client-classes-store';
import { ClassesList } from '../components/ClassesList';
import type { ClientClass } from '../types';

export default function ClientClassesPage() {
  const { selectedTab, setSelectedTab } = useClientClassesStore();
  
  const { data: classesResponse, isLoading, refetch, isFetching } = useClientClasses({ 
    status: selectedTab === 'all' ? undefined : selectedTab 
  });
  
  const allClasses = classesResponse?.data || [];


  const upcomingClasses = allClasses.filter((cls: ClientClass) => cls.status === 'upcoming');
  const pendingClasses = allClasses.filter((cls: ClientClass) => cls.status === 'pending');
  const completedClasses = allClasses.filter((cls: ClientClass) => cls.status === 'completed');

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <h1 className="text-3xl font-bold text-foreground">Mis Reservas de Clases</h1>
        
        <Button
          onClick={handleRefresh}
          disabled={isFetching}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </motion.div>

      {/* Pestañas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs 
          value={selectedTab} 
          onValueChange={(value) => setSelectedTab(value as 'all' | 'upcoming' | 'pending' | 'completed')}
          defaultValue="upcoming"
          className="w-full"
        >
          <TabsList className="flex gap-3 bg-transparent p-0">
            <TabsTrigger 
              value="upcoming"
              className="!bg-gray-700 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground !text-gray-300 hover:!bg-gray-600 transition-all px-6 py-2 rounded-lg font-medium shadow-sm"
            >
              Próximas
            </TabsTrigger>
            <TabsTrigger 
              value="pending"
              className="!bg-gray-700 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground !text-gray-300 hover:!bg-gray-600 transition-all px-6 py-2 rounded-lg font-medium shadow-sm"
            >
              Pendientes
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="!bg-gray-700 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground !text-gray-300 hover:!bg-gray-600 transition-all px-6 py-2 rounded-lg font-medium shadow-sm"
            >
              Completadas
            </TabsTrigger>
          </TabsList>

          {/* Contenido de las pestañas */}
          <div className="mt-6">
            <TabsContent value="upcoming" className="space-y-6">
              <ClassesList
                classes={upcomingClasses}
                title="Próximas Clases"
                emptyMessage="No tienes reservas próximas. ¡Reserva tu primera clase!"
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="pending" className="space-y-6">
              <ClassesList
                classes={pendingClasses}
                title="Clases Pendientes"
                emptyMessage="No tienes clases pendientes de confirmación"
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              <ClassesList
                classes={completedClasses}
                title="Clases Completadas"
                emptyMessage="Aún no has completado ninguna clase"
                isLoading={isLoading}
              />
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
}
