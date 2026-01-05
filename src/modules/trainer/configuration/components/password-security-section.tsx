import { memo } from 'react';
import { motion } from 'motion/react';
import {
  Lock,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

import { useConfigurationStore } from '../store/configuration-store';
import { useSecurityCheck } from '../hooks/use-configuration';
import { ChangePasswordModal } from './modals/change-password-modal';

import { Skeleton } from '@/shared/components/ui/skeleton';

const PasswordSecuritySection = memo(() => {
  const {
    openChangePasswordModal,
    showChangePasswordModal,
    closeChangePasswordModal,
  } = useConfigurationStore();

  const { data: securityCheck, isLoading: securityLoading } = useSecurityCheck();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.01 }}
        className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg p-3 bg-green-500/10">
              <Lock className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-foreground text-lg font-semibold">
              Contraseña y Seguridad
            </h3>
          </div>

          <p className="text-muted-foreground">
            Revisa los problemas de seguridad mediante comprobaciones en las apps, los dispositivos y los correos electrónicos enviados.
          </p>
        </div>
      </motion.div>

      {/* Security Check */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.01 }}
        className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg p-3 bg-blue-500/10">
              <Shield className="h-6 w-6 text-blue-500" />
            </div>
            <h4 className="text-foreground text-lg font-semibold">
              Controles de Seguridad
            </h4>
          </div>

          {securityLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : securityCheck ? (
            <div className="space-y-4">
              {/* Security Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg border ${securityCheck.hasWeakPassword
                  ? 'bg-red-500/10 border-red-500/20'
                  : 'bg-green-500/10 border-green-500/20'
                  }`}>
                  <div className="flex items-center gap-2">
                    {securityCheck.hasWeakPassword ? (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    <span className={`text-sm font-medium ${securityCheck.hasWeakPassword ? 'text-red-400' : 'text-green-400'
                      }`}>
                      Contraseña {securityCheck.hasWeakPassword ? 'Débil' : 'Segura'}
                    </span>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${securityCheck.hasUnusualActivity
                  ? 'bg-orange-500/10 border-orange-500/20'
                  : 'bg-green-500/10 border-green-500/20'
                  }`}>
                  <div className="flex items-center gap-2">
                    {securityCheck.hasUnusualActivity ? (
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    <span className={`text-sm font-medium ${securityCheck.hasUnusualActivity ? 'text-orange-400' : 'text-green-400'
                      }`}>
                      Actividad {securityCheck.hasUnusualActivity ? 'Inusual' : 'Normal'}
                    </span>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${securityCheck.hasUnverifiedDevices
                  ? 'bg-yellow-500/10 border-yellow-500/20'
                  : 'bg-green-500/10 border-green-500/20'
                  }`}>
                  <div className="flex items-center gap-2">
                    {securityCheck.hasUnverifiedDevices ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    <span className={`text-sm font-medium ${securityCheck.hasUnverifiedDevices ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                      Dispositivos {securityCheck.hasUnverifiedDevices ? 'Sin Verificar' : 'Verificados'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Último cambio de contraseña</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(securityCheck.lastPasswordChange)}
                  </p>
                </div>
              </div>


            </div>
          ) : (
            <p className="text-muted-foreground">No se pudo cargar la información de seguridad</p>
          )}
        </div>
      </motion.div>

      {/* Security Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Change Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.01 }}
          className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg p-3 bg-purple-500/10">
                <Lock className="h-6 w-6 text-purple-500" />
              </div>
              <h4 className="text-foreground text-lg font-semibold">
                Cambiar Contraseña
              </h4>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Actualiza tu contraseña para mantener tu cuenta segura
            </p>

            <Button
              onClick={openChangePasswordModal}
              className="w-full"
              variant="outline"
            >
              <Lock className="h-4 w-4 mr-2" />
              Cambiar Contraseña
            </Button>
          </div>
        </motion.div>

      </div>


      {/* Modals */}
      <ChangePasswordModal
        open={showChangePasswordModal}
        onClose={closeChangePasswordModal}
      />


    </div>
  );
});

PasswordSecuritySection.displayName = 'PasswordSecuritySection';

export { PasswordSecuritySection };
