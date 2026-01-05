import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notificaciones</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preferencias de Notificación</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configura cómo y cuándo recibir notificaciones.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuración de notificaciones */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Notificaciones</CardTitle>
          <p className="text-sm text-muted-foreground">
            Revisa las notificaciones recientes.
          </p>
        </CardHeader>
        <CardContent>
          {/* Lista de notificaciones */}
        </CardContent>
      </Card>
    </div>
  );
}
