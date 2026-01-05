import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { memberService } from '../services/member.service';
import { useState } from 'react';
import { Loader2, Calendar as CalendarIcon, User, Camera } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Calendar } from '@/shared/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { cn } from '@/core/lib/utils';
import { useMembers } from '../hooks/useMembers';
import type { 
  Member, 
  Gender, 
  MemberStatus, 
  Address, 
  EmergencyContact, 
  Membership, 
  MembershipType, 
  MembershipStatus 
} from '../types';

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'MALE', label: 'Masculino' },
  { value: 'FEMALE', label: 'Femenino' },
  { value: 'OTHER', label: 'Otro' },
];

const MEMBERSHIP_TYPE_OPTIONS: { value: MembershipType; label: string }[] = [
  { value: 'MONTHLY', label: 'Mensual' },
  { value: 'QUARTERLY', label: 'Trimestral' },
  { value: 'ANNUAL', label: 'Anual' },
  { value: 'PREMIUM', label: 'Premium' },
];

const MEMBERSHIP_STATUS_OPTIONS: { value: MembershipStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Activa' },
  { value: 'SUSPENDED', label: 'Suspendida' },
  { value: 'EXPIRED', label: 'Vencida' },
  { value: 'CANCELLED', label: 'Cancelada' },
];

const MEMBER_STATUS_OPTIONS: { value: MemberStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'SUSPENDED', label: 'Suspendido' },
  { value: 'DELETED', label: 'Eliminado' },
];


const addressSchema = z.object({
  street: z.string().min(1, 'La calle es requerida'),
  city: z.string().min(1, 'La ciudad es requerida'),
  district: z.string().min(1, 'El distrito es requerido'),
  reference: z.string().optional(),
}) satisfies z.ZodType<Omit<Address, 'id'>>;


const emergencyContactSchema = z.object({
  name: z.string().min(1, 'El nombre del contacto de emergencia es requerido'),
  phone: z.string().min(1, 'El teléfono de emergencia es requerido'),
  relationship: z.string().optional(),
}) satisfies z.ZodType<Omit<EmergencyContact, 'id'>>;


const membershipSchema = z.object({
  type: z.enum(['MONTHLY', 'QUARTERLY', 'ANNUAL', 'PREMIUM', 'OTHER']) as unknown as z.ZodType<MembershipType>,
  startDate: z.string().min(1, 'La fecha de inicio es requerida'),
  endDate: z.string().min(1, 'La fecha de fin es requerida'),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'EXPIRED', 'CANCELLED']) as unknown as z.ZodType<MembershipStatus>,
}) satisfies z.ZodType<Omit<Membership, 'id' | 'memberId'>>;


const memberFormSchema = z.object({
  
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'Los apellidos son requeridos'),
  documentNumber: z.string().optional(),
  birthDate: z.string().min(1, 'La fecha de nacimiento es requerida'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']) as unknown as z.ZodType<Gender>,
  profileImage: z.union([z.instanceof(File), z.string()]).optional(),
  
  
  phone: z.string().min(1, 'El teléfono es requerido'),
  email: z.string().email('Correo electrónico inválido'),
  address: addressSchema,
  emergencyContact: emergencyContactSchema,
  

  membership: membershipSchema,
  
 
  status: z.enum(['ACTIVE', 'SUSPENDED', 'DELETED']) as unknown as z.ZodType<MemberStatus>,
  
  
  notes: z.string().optional()
});


type MemberFormValues = Omit<z.infer<typeof memberFormSchema>, 'gender' | 'membership' | 'emergencyContact' | 'address'> & {
  gender: Gender;
  membership: {
    type: MembershipType;
    status: MembershipStatus;
    startDate: string;
    endDate: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  address: {
    street: string;
    city: string;
    district: string;
    reference?: string;
  };
};


interface MemberFormProps {
  member?: Omit<Member, 'createdAt' | 'updatedAt'> & {
    createdAt?: string;
    updatedAt?: string;
  };
  onSuccess?: (newMember?: { id: string }) => void;
  onCancel?: () => void;
  className?: string;
}

export function MemberForm({ member, onSuccess, onCancel }: MemberFormProps) {
  const navigate = useNavigate();
  const isEditing = !!member;
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    member?.profileImage || null
  );
  

  const { 
    createMember,
    updateMember,
    isCreating,
    isUpdating
  } = useMembers();
  
  const isLoading = isCreating || isUpdating;
  
  
  const resolver = zodResolver(memberFormSchema) as any;

  const form = useForm<MemberFormValues>({
    resolver,
    defaultValues: {
      firstName: member?.firstName || '',
      lastName: member?.lastName || '',
      documentNumber: member?.documentNumber || '',
      birthDate: member?.birthDate || '',
      gender: member?.gender || 'MALE',
      phone: member?.phone || '',
      email: member?.email || '',
      address: {
        street: member?.address?.street || '',
        city: member?.address?.city || '',
        district: member?.address?.district || '',
        reference: member?.address?.reference || '',
      },
      emergencyContact: {
        name: member?.emergencyContact?.name || '',
        phone: member?.emergencyContact?.phone || '',
        relationship: member?.emergencyContact?.relationship || '',
      },
      membership: {
        type: member?.membership?.type || 'MONTHLY',
        startDate: member?.membership?.startDate || new Date().toISOString().split('T')[0],
        endDate: member?.membership?.endDate || '',
        status: member?.membership?.status || 'ACTIVE',
      },
      status: member?.status || 'ACTIVE',
      notes: member?.notes || '',
    },
  });

  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, sube un archivo de imagen válido');
      return;
    }

    setIsUploading(true);
    
    try {
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);

     
      const { url } = await memberService.uploadFile(file, 'profile');
      
      
      form.setValue('profileImage', url);
      toast.success('Imagen subida exitosamente');
    } catch (error) {
      toast.error('Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  
  const mapFormToDTO = (formValues: MemberFormValues) => {
    const { profileImage, ...rest } = formValues;
    const memberData = {
      ...rest,
      profileImage: typeof profileImage === 'string' ? profileImage : '',
      registrationDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    return memberData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      
      const isValid = await form.trigger();
      if (!isValid) {
        toast.error('Por favor, completa todos los campos requeridos');
        return;
      }
      
      setIsUploading(true);
      
   
      const formValues = form.getValues();
      const memberData = mapFormToDTO(formValues);
      
      if (isEditing && member) {
       
        const response = await updateMember({ id: member.id, data: memberData });
        onSuccess?.(response);
      } else {
     
        const response = await createMember(memberData);
        if (response && typeof response === 'object' && 'id' in response) {
          onSuccess?.(response);
        } else {
          onSuccess?.();
        }
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ocurrió un error al guardar el miembro';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Error desconocido');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {isEditing ? 'Editar Miembro' : 'Nuevo Miembro'}
        </h2>
        
        {/* Sección de datos básicos */}
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Datos Básicos</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Foto de perfil */}
            <div className="md:col-span-2 flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-muted overflow-hidden border">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <User className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="profileImage"
                  className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span className="sr-only">Cambiar foto</span>
                </label>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Formatos soportados: JPG, PNG</p>
                <p>Tamaño máximo: 5MB</p>
              </div>
            </div>
            
            {/* Nombre y Apellidos */}
            <div>
              <Label htmlFor="firstName">Nombres</Label>
              <Input
                id="firstName"
                {...form.register('firstName')}
                placeholder="Ingrese los nombres"
                className={form.formState.errors.firstName && 'border-destructive'}
              />
            </div>
            
            <div>
              <Label htmlFor="lastName">Apellidos</Label>
              <Input
                id="lastName"
                {...form.register('lastName')}
                placeholder="Ingrese los apellidos"
                className={form.formState.errors.lastName && 'border-destructive'}
              />
            </div>
            
            {/* Documento y Fecha de Nacimiento */}
            <div>
              <Label htmlFor="documentNumber">DNI / Documento de Identidad</Label>
              <Input
                id="documentNumber"
                {...form.register('documentNumber')}
                placeholder="Ingrese el número de documento"
                className={form.formState.errors.documentNumber && 'border-destructive'}
              />
            </div>
            
            <div>
              <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
              <Controller
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(new Date(field.value), 'PPP', { locale: es })
                        ) : (
                          <span>Seleccione una fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <Calendar
                        mode="single"
                        className="text-gray-900 dark:text-white"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) =>
                          field.onChange(date?.toISOString().split('T')[0])
                        }
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {form.formState.errors.birthDate && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.birthDate.message}
                </p>
              )}
            </div>
            
            {/* Género */}
            <div>
              <Label>Género</Label>
              <Controller
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un género" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDER_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.gender && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.gender.message}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Sección datos de contacto */}
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Datos de Contacto</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                {...form.register('phone')}
                placeholder="Ingrese el teléfono"
                className={form.formState.errors.phone && 'border-destructive'}
              />
            </div>
            
            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                {...form.register('email')}
                placeholder="Ingrese el correo electrónico"
                className={form.formState.errors.email && 'border-destructive'}
              />
            </div>
            
            <div className="md:col-span-2">
              <Label>Dirección</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Input
                    {...form.register('address.street')}
                    placeholder="Calle y número"
                    className={form.formState.errors.address?.street && 'border-destructive'}
                  />
                </div>
                <div>
                  <Input
                    {...form.register('address.district')}
                    placeholder="Distrito"
                    className={form.formState.errors.address?.district && 'border-destructive'}
                  />
                </div>
                <div>
                  <Input
                    {...form.register('address.city')}
                    placeholder="Ciudad"
                    className={form.formState.errors.address?.city && 'border-destructive'}
                  />
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <Label>Contacto de Emergencia</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Input
                    {...form.register('emergencyContact.name')}
                    placeholder="Nombre completo"
                    className={form.formState.errors.emergencyContact?.name && 'border-destructive'}
                  />
                </div>
                <div>
                  <Input
                    {...form.register('emergencyContact.phone')}
                    placeholder="Teléfono"
                    className={form.formState.errors.emergencyContact?.phone && 'border-destructive'}
                  />
                </div>
                <div>
                  <Input
                    {...form.register('emergencyContact.relationship')}
                    placeholder="Parentesco (opcional)"
                    className={form.formState.errors.emergencyContact?.relationship && 'border-destructive'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sección de membresía */}
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Información de Membresía</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Tipo de Membresía</Label>
              <Controller
                control={form.control}
                name="membership.type"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {MEMBERSHIP_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.membership?.type && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.membership.type.message}
                </p>
              )}
            </div>
            
            <div>
              <Label>Estado de la Membresía</Label>
              <Controller
                control={form.control}
                name="membership.status"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {MEMBERSHIP_STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.membership?.status && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.membership.status.message}
                </p>
              )}
            </div>
            
            <div>
              <Label>Fecha de Inicio</Label>
              <Controller
                control={form.control}
                name="membership.startDate"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(new Date(field.value), 'PPP', { locale: es })
                        ) : (
                          <span>Seleccione una fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <Calendar
                        mode="single"
                        className="text-gray-900 dark:text-white"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) =>
                          field.onChange(date?.toISOString().split('T')[0])
                        }
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {form.formState.errors.membership?.startDate && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.membership.startDate.message}
                </p>
              )}
            </div>
            
            <div>
              <Label>Fecha de Vencimiento</Label>
              <Controller
                control={form.control}
                name="membership.endDate"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(new Date(field.value), 'PPP', { locale: es })
                        ) : (
                          <span>Seleccione una fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <Calendar
                        mode="single"
                        className="text-gray-900 dark:text-white"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) =>
                          field.onChange(date?.toISOString().split('T')[0])
                        }
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {form.formState.errors.membership?.endDate && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.membership.endDate.message}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Sección de información adicional */}
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Información Adicional</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Estado del Miembro</Label>
              <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {MEMBER_STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.status && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.status.message}
                </p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="notes">Notas Adicionales</Label>
              <Textarea
                id="notes"
                {...form.register('notes')}
                placeholder="Ingrese notas adicionales"
                rows={3}
                className={form.formState.errors.notes && 'border-destructive'}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Acciones del formulario */}
       <div className="flex justify-end space-x-3 mt-8 mb-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => (onCancel ? onCancel() : navigate(-1))}
          disabled={isLoading || isUploading}
        >
          Cancelar
        </Button>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button type="submit" className="w-full sm:w-auto" disabled={isLoading || isUploading}>
            {isLoading || isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUploading ? 'Subiendo...' : 'Guardando...'}
              </>
            ) : isEditing ? (
              'Actualizar Miembro'
            ) : (
              'Crear Miembro'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

