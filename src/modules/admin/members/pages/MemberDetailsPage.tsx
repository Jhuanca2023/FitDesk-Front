import { useParams, useNavigate } from 'react-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, Edit, Mail, Phone, AlertTriangle, User, Shield, Calendar } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';
import { useMemberByIdWithSecurityQuery } from '@/core/queries/useMemberQuery';
import { cn } from '@/core/lib/utils';

export function MemberDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: member, isLoading, error } = useMemberByIdWithSecurityQuery(id || '');


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="rounded-md bg-destructive/10 p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-destructive">
              No se pudo cargar la información del miembro
            </h3>
            <div className="mt-2 text-sm text-destructive">
              <p>{error instanceof Error ? error.message : 'El miembro solicitado no existe o no tienes permisos para verlo.'}</p>
            </div>
            <div className="mt-4">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => navigate('/admin/members')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a la lista
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Función auxiliar para obtener las iniciales
  const getInitials = () => {
    const firstInitial = member.firstName?.charAt(0) || '';
    const lastInitial = member.lastName?.charAt(0) || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="container mx-auto px-4 sm:px-6 py-6 space-y-6 max-w-7xl">
        {/* Encabezado */}
        <div className="flex flex-col space-y-4 p-4 sm:p-6 bg-card rounded-lg shadow-sm">
          <Button
            variant="ghost"
            className="w-fit p-0 hover:bg-transparent"
            onClick={() => navigate('/admin/members')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la lista
          </Button>

          <div className="flex flex-col space-y-4 md:flex-row md:items-start md:justify-between md:space-y-0">
            <div className="flex items-start space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={member.profileImageUrl || undefined} alt={member.firstName} />
                <AvatarFallback className="text-lg">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    {member.firstName} {member.lastName || ''}
                  </h1>
                  <p className="text-muted-foreground">{member.email}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={member.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {member.status || 'Sin estado'}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Shield className="h-3 w-3" />
                    {member.provider ? member.provider === null : 'LOCAL'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjetas de información */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Información Personal */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {member.dni ? (
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">DNI</span>
                  <span className="text-sm font-medium">{member.dni}</span>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic">
                  DNI no registrado
                </div>
              )}
              <Separator />
              <div className="flex justify-between items-start">
                <span className="text-sm text-muted-foreground">ID Usuario</span>
                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                  {member.userId.slice(0, 8)}...
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Información de Contacto */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${member.email}`} className="hover:underline truncate">
                    {member.email}
                  </a>
                </div>
                {member.phone ? (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${member.phone}`} className="hover:underline">
                      {member.phone}
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground italic">
                    <Phone className="h-4 w-4" />
                    Teléfono no registrado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Membresía
              </CardTitle>
            </CardHeader>
            <CardContent>
              {member.membership ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">Plan</span>
                    <span className="text-sm font-medium">{member.membership.planName}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">Estado</span>
                    <Badge variant={member.membership.isActive ? 'default' : 'secondary'}>
                      {member.membership.status}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">Fecha de inicio</span>
                    <span className="text-sm font-medium">
                      {format(new Date(member.membership.startDate), 'PPP', { locale: es })}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">Fecha de vencimiento</span>
                    <span className="text-sm font-medium">
                      {format(new Date(member.membership.endDate), 'PPP', { locale: es })}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">Días restantes</span>
                    <span
                      className={cn(
                        'text-sm font-medium',
                        member.membership.daysRemaining < 7 && 'text-destructive',
                        member.membership.daysRemaining < 15 &&
                        member.membership.daysRemaining >= 7 &&
                        'text-yellow-600'
                      )}
                    >
                      {member.membership.daysRemaining} días
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">Sin membresía activa</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Información de Seguridad */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Información de Cuenta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Proveedor de autenticación</span>
                  <Badge variant="outline">{member.provider || 'LOCAL'}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estado de la cuenta</span>
                  <Badge variant={member.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {member.status}
                  </Badge>
                </div>
              </div>
            
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}