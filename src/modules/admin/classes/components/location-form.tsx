import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Switch } from '@/shared/components/ui/switch';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/shared/components/ui/form';
import type { Location, LocationRequest } from '../types/location';
import { LocationSchema } from '../types/location';

type LocationFormData = LocationRequest;

type LocationFormValues = LocationFormData;

type LocationFormProps = {
  initialData?: Location | null;
  onSubmit: (data: LocationFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
};

export function LocationForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}: LocationFormProps) {
  const form = useForm<LocationFormValues>({
    defaultValues: {
      name: '',
      description: '',
      ability: 1,
      active: true,
    },
    resolver: zodResolver(LocationSchema as any)
  });

  
  React.useEffect(() => {
    console.log('Initial data changed:', initialData);
    
    if (initialData) {
      form.reset({
        name: initialData.name || '',
        description: initialData.description || '',
        ability: initialData.capacity || 1, 
        active: initialData.isActive ?? true, 
      });
    } else {
      form.reset({
        name: '',
        description: '',
        ability: 1,
        active: true,
      });
    }
  }, [initialData, form]);
  
 
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      console.log('Form values changed:', value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de la Ubicación</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ej: Sala de Yoga" 
                    {...field} 
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descripción de la ubicación" 
                    {...field} 
                    disabled={isSubmitting}
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacidad</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min={1}
                    {...field} 
                    disabled={isSubmitting}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormDescription>
                  Número máximo de personas que caben en esta ubicación
                </FormDescription>
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
                    Ubicación activa
                  </FormLabel>
                  <FormDescription>
                    Las ubicaciones inactivas no estarán disponibles para asignar a nuevas clases.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

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
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
