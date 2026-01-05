import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { AlertCircle, UserPlus, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { trainerService, type TrainerRegistrationRequest } from '../services/trainer.service';

const basicTrainerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  dni: z.string().min(6, 'El DNI debe tener al menos 6 dígitos').max(9, 'El DNI debe tener máximo 9 dígitos'),
  phone: z.string().min(9, 'El teléfono debe tener al menos 9 dígitos').max(9, 'El teléfono debe tener exactamente 9 dígitos')
});

type BasicTrainerFormData = z.infer<typeof basicTrainerSchema>;

interface BasicTrainerFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export function BasicTrainerForm({ onSuccess, onCancel }: BasicTrainerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<BasicTrainerFormData>({
    resolver: zodResolver(basicTrainerSchema)
  });

  const onSubmit = async (data: BasicTrainerFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const trainerData: TrainerRegistrationRequest = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        dni: data.dni,
        phone: data.phone
      };

      await trainerService.createBasicTrainer(trainerData);
      
      // Resetear formulario
      reset();
      
      // Llamar callback de éxito
      onSuccess();
      
    } catch (err: any) {
      console.error('Error creating trainer:', err);
      setError(err.response?.data?.message || 'Error al crear el entrenador. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Crear Nuevo Entrenador
        </CardTitle>
        <CardDescription>
          Complete los datos básicos del entrenador. Podrá completar la información adicional editando el entrenador después.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre *</Label>
              <Input
                id="firstName"
                {...register('firstName')}
                placeholder="Ej: Carlos"
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido *</Label>
              <Input
                id="lastName"
                {...register('lastName')}
                placeholder="Ej: Rodríguez"
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Ej: trainer@gmail.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña *</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              placeholder="Mínimo 8 caracteres"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dni">DNI *</Label>
              <Input
                id="dni"
                {...register('dni')}
                placeholder="Ej: 74894286"
                disabled={isLoading}
              />
              {errors.dni && (
                <p className="text-sm text-red-600">{errors.dni.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="Ej: 951890369"
                disabled={isLoading}
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            )}
            
            <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creando...
                </>
              ) : (
                <>
                  Crear Entrenador
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
