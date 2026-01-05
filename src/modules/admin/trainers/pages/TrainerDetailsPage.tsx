import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Calendar, Mail, MapPin, Phone, User, Award, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { useTrainer } from '../hooks/use-trainers';
import { Skeleton } from '@/shared/components/ui/skeleton';

export function TrainerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { trainer, isLoading } = useTrainer(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-2">Entrenador no encontrado</h2>
        <p className="text-muted-foreground mb-4">
          El entrenador que estás buscando no existe o ha sido eliminado.
        </p>
        <Button onClick={() => navigate('/admin/trainers')}>
          Volver a la lista de entrenadores
        </Button>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'default' as const;
      case 'INACTIVE':
        return 'secondary' as const;
      case 'SUSPENDED':
        return 'destructive' as const;
      default:
        return 'outline' as const;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const ddmmyyyy = /^\d{2}-\d{2}-\d{4}$/;
    const yyyymmdd = /^\d{4}-\d{2}-\d{2}$/;
    let date: Date;
    if (ddmmyyyy.test(dateString)) {
      const [day, month, year] = dateString.split('-').map(Number);
      date = new Date(year, month - 1, day);
    } else if (yyyymmdd.test(dateString)) {
      date = new Date(dateString);
    } else {
      const tryDate = new Date(dateString);
      if (isNaN(tryDate.getTime())) return dateString;
      date = tryDate;
    }
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const availability = Object.entries(trainer.availability || {})
    .filter(([_, isAvailable]) => isAvailable)
    .map(([day]) => {
      const dayName = day.charAt(0).toUpperCase() + day.slice(1);
      return {
        day: dayName,
        startTime: trainer.startTime || '09:00',
        endTime: trainer.endTime || '18:00',
      };
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => navigate(`/admin/trainers/edit/${trainer.id}`)}>
            Editar
          </Button>
          <Button>Generar Reporte</Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Encabezado con información básica */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {trainer.profileImage && typeof trainer.profileImage === 'string' ? (
                    <img
                      src={trainer.profileImage}
                      alt={`${trainer.firstName} ${trainer.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold">
                      {trainer.firstName} {trainer.lastName}
                    </h1>
                    <Badge variant={getStatusVariant(trainer.status)}>
                      {trainer.status === 'ACTIVE' && 'Activo'}
                      {trainer.status === 'INACTIVE' && 'Inactivo'}
                      {trainer.status === 'SUSPENDED' && 'Suspendido'}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {trainer.specialties?.split(',').map(s => s.trim())[0]}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar mensaje
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="mr-2 h-4 w-4" />
                  Llamar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Documento</p>
                  <p className="font-medium">{trainer.documentNumber}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
                  <p className="font-medium">{formatDate(trainer.birthDate)}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Award className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Años de Experiencia</p>
                  <p className="font-medium">{trainer.yearsOfExperience} años</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Salario</p>
                  <p className="font-medium">${trainer.salary?.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Información de contacto */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Correo Electrónico</p>
                  <p className="font-medium">{trainer.email}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p className="font-medium">{trainer.phone}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dirección</p>
                  <p className="font-medium">{trainer.address || 'No especificada'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disponibilidad */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Disponibilidad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {availability.length > 0 ? (
                  availability.map(({ day, startTime, endTime }) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="font-medium">{day}</span>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {startTime} - {endTime}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Sin horarios definidos</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Información Adicional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tipo de Contrato</p>
                <p className="font-medium">
                  {trainer.contractType === 'FULL_TIME' && 'Tiempo Completo'}
                  {trainer.contractType === 'PART_TIME' && 'Medio Tiempo'}
                  {trainer.contractType === 'FREELANCE' && 'Freelance'}
                  {trainer.contractType === 'PER_HOUR' && 'Por Hora'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Fecha de Ingreso</p>
                <p className="font-medium">{formatDate(trainer.joinDate)}</p>
              </div>
              {trainer.bankInfo && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Información Bancaria</p>
                  <p className="font-medium">{trainer.bankInfo}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Especialidades y Certificaciones */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Especialidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {trainer.specialties?.split(',').map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {specialty.trim()}
                  </Badge>
                )) || (
                  <p className="text-sm text-muted-foreground">
                    No se han especificado especialidades
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Certificaciones</CardTitle>
            </CardHeader>
            <CardContent>
              {trainer.certifications ? (
                <div className="space-y-2">
                  {trainer.certifications.split(',').map((cert, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{cert.trim()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No se han cargado certificaciones
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notas adicionales */}
        {trainer.notes && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Notas Adicionales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{trainer.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default TrainerDetailsPage;
