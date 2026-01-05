import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { format, addDays, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Settings } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Calendar } from '@/shared/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/shared/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';

import { 
  DURATION_OPTIONS, 
  type Class, 
  type ClassRequest
} from '../types/class';
import { useTrainersForSelect } from '../../trainers/hooks/use-trainers';
import { useLocations } from '../hooks/use-locations';

export type ClassFormValues = {
  className: string;
  locationId: string;
  trainerId: string;
  date: Date;
  duration: number;
  maxCapacity: number;
  startTime: string;
  endTime: string;
  active: boolean;
  description?: string;
};

type ClassFormProps = {
  initialData?: Class | null;
  onSubmit: (data: ClassRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
};

export function ClassForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}: ClassFormProps) {
  const { trainers = [], isLoading: isLoadingTrainers, error: trainersError } = useTrainersForSelect();
  const { locations = [], isLoading: isLoadingLocations } = useLocations();
  const isInitialized = useRef(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const form = useForm<ClassFormValues>({
    defaultValues: {
      className: '',
      description: '',
      trainerId: '',
      locationId: '',
      date: addDays(new Date(), 1),
      startTime: '09:00',
      endTime: '10:00',
      duration: 60,
      maxCapacity: 1,
      active: true,
    },
  });

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);


  useEffect(() => {

    if (!isMounted || isLoadingTrainers || isLoadingLocations || isInitialized.current) return;

   
    if (!initialData) {
      isInitialized.current = true;

      setTimeout(() => {
        if (isMounted) {
          form.reset({
            className: '',
            description: '',
            trainerId: '',
            locationId: '',
            date: addDays(new Date(), 1),
            startTime: '09:00',
            endTime: '10:00',
            duration: 60,
            maxCapacity: 1,
            active: true,
          });
        }
      }, 0);
      return;
    }


    if (!initialData.id || !trainers.length || !locations.length) return;
    
    isInitialized.current = true;
    
    let parsedDate: Date;
    try {
      if (typeof initialData.classDate === 'string' && initialData.classDate.includes('-')) {
        const [day, month, year] = initialData.classDate.split('-');
        parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        parsedDate = parseISO(initialData.classDate);
      }

      if (isNaN(parsedDate.getTime())) {
        parsedDate = addDays(new Date(), 1);
      }
    } catch {
      parsedDate = addDays(new Date(), 1);
    }

    const trainer = trainers.find(t => t.name === initialData.trainerName);
    const location = locations.find(l => l.name === initialData.locationName);
    const scheduleParts = initialData.schedule ? initialData.schedule.split(' - ') : [];

    setTimeout(() => {
      if (isMounted) {
        form.reset({
          className: initialData.className || '',
          description: initialData.description || '',
          trainerId: trainer?.id || '',
          locationId: location?.id || '',
          date: parsedDate,
          startTime: scheduleParts[0] || '09:00',
          endTime: scheduleParts[1] || '10:00',
          duration: initialData.duration || 60,
          maxCapacity: initialData.maxCapacity || 1,
          active: initialData.active ?? true,
        });
      }
    }, 0);

  }, [isMounted, initialData?.id, trainers.length, locations.length, isLoadingTrainers, isLoadingLocations]);


  useEffect(() => {
    isInitialized.current = false;
  }, [initialData?.id]);

  const handleFormSubmit = (formData: ClassFormValues) => {
    if (!formData.className || formData.className.length < 3) {
      form.setError('className', {
        type: 'manual',
        message: 'El nombre debe tener al menos 3 caracteres'
      });
      return;
    }

    if (!formData.locationId) {
      form.setError('locationId', {
        type: 'manual',
        message: 'Selecciona una ubicación'
      });
      return;
    }

    if (!formData.trainerId) {
      form.setError('trainerId', {
        type: 'manual',
        message: 'Selecciona un entrenador'
      });
      return;
    }

    const [startHour, startMin] = formData.startTime.split(':').map(Number);
    const [endHour, endMin] = formData.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    if (endMinutes <= startMinutes) {
      form.setError('endTime', {
        type: 'manual',
        message: 'La hora de fin debe ser posterior a la hora de inicio'
      });
      return;
    }

    const classData: ClassRequest = {
      className: formData.className,
      locationId: formData.locationId,
      trainerId: formData.trainerId,
      classDate: format(formData.date, 'dd-MM-yyyy'),
      duration: formData.duration,
      maxCapacity: formData.maxCapacity,
      startTime: formData.startTime,
      endTime: formData.endTime,
      active: formData.active,
      description: formData.description,
    };

    onSubmit(classData);
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 6; hour <= 21; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return times;
  };

  const selectedLocationId = form.watch('locationId');
  const selectedLocation = locations.find(loc => loc.id === selectedLocationId);
  const capacity = selectedLocation?.capacity || 0;


  useEffect(() => {
    if (isMounted && selectedLocation?.capacity !== undefined) {
      const currentMaxCapacity = form.getValues('maxCapacity');
      if (currentMaxCapacity !== selectedLocation.capacity) {
       
        setTimeout(() => {
          if (isMounted) {
            form.setValue('maxCapacity', selectedLocation.capacity);
          }
        }, 0);
      }
    }

  }, [isMounted, selectedLocationId]);

  const renderFormButtons = () => (
    <div className="flex justify-end space-x-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar Clase' : 'Crear Clase'}
      </Button>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="className"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de la Clase</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Yoga Matutino" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trainerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entrenador</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un entrenador" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingTrainers ? (
                      <div className="p-2 text-sm text-muted-foreground">Cargando entrenadores...</div>
                    ) : trainersError ? (
                      <div className="p-2 text-sm text-destructive">Error cargando entrenadores</div>
                    ) : Array.isArray(trainers) && trainers.length > 0 ? (
                      trainers.map((trainer) => (
                        <SelectItem key={trainer.id} value={trainer.id || ''}>
                          {trainer.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-muted-foreground">No hay entrenadores disponibles</div>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="locationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ubicación</FormLabel>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Select
                      disabled={isLoadingLocations || locations.length === 0}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue 
                            placeholder={
                              locations.length === 0 
                                ? 'No hay ubicaciones disponibles' 
                                : 'Selecciona una ubicación'
                            } 
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locations.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground">
                            No hay ubicaciones disponibles
                          </div>
                        ) : (
                          locations.map((location) => (
                            <SelectItem 
                              key={location.id} 
                              value={location.id || ''}
                              disabled={!location.isActive}
                            >
                              {location.name}
                              {!location.isActive && ' (Inactiva)'}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    title="Gestionar ubicaciones"
                    onClick={() => {
                      window.location.href = '/admin/locations';
                    }}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Capacidad Máxima</FormLabel>
            <Input 
              type="number"
              readOnly
              value={capacity}
              className="bg-muted/50"
            />
            <FormDescription>
              La capacidad se establece según la ubicación seleccionada
            </FormDescription>
          </FormItem>

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de la Clase</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={"w-full pl-3 text-left font-normal"}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: es })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        date.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de Inicio</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una hora" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {generateTimeOptions().map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de Fin</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una hora" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {generateTimeOptions().map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duración (minutos)</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))} 
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la duración" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DURATION_OPTIONS.map((duration) => (
                      <SelectItem key={duration} value={duration.toString()}>
                        {duration} minutos
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Clase Activa
                  </FormLabel>
                  <FormDescription>
                    Las clases inactivas no serán visibles para los usuarios
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descripción de la clase, requisitos, nivel, etc." 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {renderFormButtons()}
      </form>
    </Form>
  );
}
