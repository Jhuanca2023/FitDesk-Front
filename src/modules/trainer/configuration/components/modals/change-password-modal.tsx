import { memo, useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/shared/components/ui/form';

import { useChangePassword } from '../../hooks/use-configuration';
import type { ChangePasswordDTO } from '../../types';
import { ChangePasswordDTOSchema } from '@/core/zod/trainer-configuration.schemas';

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordModal = memo(({ open, onClose }: ChangePasswordModalProps) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const changePasswordMutation = useChangePassword();

  const form = useForm<ChangePasswordDTO>({
    resolver: zodResolver(ChangePasswordDTOSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = async (data: ChangePasswordDTO) => {
    try {
      await changePasswordMutation.mutateAsync(data);
      form.reset(); // ✅ Limpia el formulario automáticamente
      onClose();
    } catch (error) {
      // Error manejado por TanStack Query
    }
  };

  const handleClose = () => {
    if (!changePasswordMutation.isPending) {
      form.reset(); // ✅ Limpia el formulario con react-hook-form
      onClose();
    }
  };

  // ✅ Validación automática con react-hook-form
  const { watch, formState } = form;
  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');
  
  const getPasswordStrength = (password: string) => {
    if (!password) return null;
    if (password.length >= 12) return { strength: 'Fuerte', color: 'green' };
    if (password.length >= 8) return { strength: 'Media', color: 'orange' };
    return { strength: 'Débil', color: 'red' };
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          <div className="relative space-y-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl">
                <div className="rounded-lg p-2 bg-purple-500/10">
                  <Lock className="h-6 w-6 text-purple-500" />
                </div>
                Cambiar Contraseña
              </DialogTitle>
            </DialogHeader>

            {/* ✅ Form con react-hook-form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                
                {/* Current Password */}
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña actual *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showCurrentPassword ? 'text' : 'password'}
                            placeholder="Ingresa tu contraseña actual"
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* New Password */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nueva contraseña *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="Ingresa tu nueva contraseña"
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      
                      {/* Password Strength */}
                      {passwordStrength && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className={`h-2 w-full rounded-full bg-${passwordStrength.color}-500/20`}>
                            <div 
                              className={`h-full rounded-full bg-${passwordStrength.color}-500 transition-all duration-300`}
                              style={{ 
                                width: passwordStrength.strength === 'Débil' ? '33%' : 
                                       passwordStrength.strength === 'Media' ? '66%' : '100%' 
                              }}
                            />
                          </div>
                          <span className={`text-xs text-${passwordStrength.color}-400`}>
                            {passwordStrength.strength}
                          </span>
                        </div>
                      )}
                      
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar nueva contraseña *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirma tu nueva contraseña"
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      
                      {/* Password Match Indicator */}
                      {confirmPassword && (
                        <div className="flex items-center gap-2 mt-2">
                          {passwordsMatch ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-xs text-green-400">Las contraseñas coinciden</span>
                            </>
                          ) : (
                            <>
                              <div className="h-4 w-4 rounded-full bg-red-500" />
                              <span className="text-xs text-red-400">Las contraseñas no coinciden</span>
                            </>
                          )}
                        </div>
                      )}
                      
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Requirements */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-400 mb-2">Requisitos de contraseña:</p>
                  <ul className="text-xs text-blue-300 space-y-1">
                    <li>• Mínimo 8 caracteres</li>
                    <li>• Al menos una letra mayúscula</li>
                    <li>• Al menos una letra minúscula</li>
                    <li>• Al menos un número</li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={changePasswordMutation.isPending}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={!formState.isValid || changePasswordMutation.isPending}
                    className="flex-1"
                  >
                    {changePasswordMutation.isPending ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        Cambiando...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Cambiar Contraseña
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
});

ChangePasswordModal.displayName = 'ChangePasswordModal';

export { ChangePasswordModal };
