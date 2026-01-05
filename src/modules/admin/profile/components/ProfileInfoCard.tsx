import { motion } from 'motion/react';
import { User, Phone, Calendar, MapPin } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';
import type { UseFormReturn } from 'react-hook-form';
import type { UpdateAdminProfile } from '@/core/zod/admin/profile.schemas';
import type { AdminProfile } from '../types';

interface ProfileInfoCardProps {
  admin: AdminProfile;
  isEditing: boolean;
  form: UseFormReturn<UpdateAdminProfile>;
}

export const ProfileInfoCard = ({ admin, isEditing, form }: ProfileInfoCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      className="group relative cursor-pointer"
    >
      <div className="border-border bg-card/40 rounded-xl border p-6 transition-all duration-300 hover:shadow-lg">
        <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="relative">
          <div className="mb-6 flex items-center justify-between border-b border-border/50 pb-6">
            <div className="flex items-center space-x-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full">
                {admin.avatar ? (
                  <img
                    src={admin.avatar}
                    alt={admin.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} className="text-xl font-semibold" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    admin.name
                  )}
                </h2>
                <p className="text-muted-foreground">
                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    admin.email
                  )}
                </p>
                <Badge variant="outline" className="mt-1">
                  {admin.role}
                </Badge>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Phone className="h-5 w-5 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Teléfono</p>
                    {isEditing ? (
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="Ej: +51 987 654 321" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <p>{admin.phone || 'No especificado'}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de ingreso</p>
                    <p>{admin.joinDate}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Dirección</p>
                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Ej: Av. Principal 123, Lima" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <p>{admin.address || 'No especificada'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
