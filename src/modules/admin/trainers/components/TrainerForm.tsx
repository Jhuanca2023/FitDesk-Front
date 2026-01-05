import { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Label } from '@/shared/components/ui/label';
import { Loader2, Upload, X } from 'lucide-react';
import type { Trainer, TrainerFormData } from '../types';
import { TrainerSchema, GENDER_OPTIONS, STATUS_OPTIONS, CONTRACT_TYPE_OPTIONS, DAYS_OF_WEEK } from '../types';
import { useTrainers } from '../hooks/use-trainers';

interface TrainerFormProps {
  trainer?: Trainer;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TrainerForm({ trainer, onSuccess, onCancel }: TrainerFormProps) {
  const { createTrainer, updateTrainer } = useTrainers();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [certifications, setCertifications] = useState<File[]>([]);
  const [certificationPreviews, setCertificationPreviews] = useState<string[]>([]);
  const blobUrlRef = useRef<string | null>(null);

  
  const defaultValues: TrainerFormData = {
    firstName: '',
    lastName: '',
    documentNumber: '',
    birthDate: '',
    gender: 'MALE',
    phone: '',
    email: '',
    address: '',
    specialties: '',
    yearsOfExperience: 0,
    joinDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
    contractType: 'FULL_TIME',
    salary: 0,
    availability: DAYS_OF_WEEK.reduce((acc, day) => ({
      ...acc,
      [day.toLowerCase()]: false,
    }), {} as Record<string, boolean>),
  };

  const form = useForm<TrainerFormData>({
    resolver: zodResolver(TrainerSchema) as any, 
    defaultValues: defaultValues,
    mode: 'onChange',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = form;

  
  useEffect(() => {
    if (trainer) {
     
      const formatDateForForm = (dateString: string) => {
        if (!dateString) return '';
        if (dateString.includes('-') && dateString.split('-')[0].length === 4) {
          return dateString;
        }
 
        if (dateString.includes('-') && dateString.split('-')[0].length === 2) {
          const [day, month, year] = dateString.split('-');
          return `${year}-${month}-${day}`;
        }
        return dateString;
      };

 
      const formattedBirthDate = formatDateForForm(trainer.birthDate || '');
      const formattedJoinDate = formatDateForForm(trainer.joinDate || '');
    
    
      const allDaysLower = DAYS_OF_WEEK.map((d) => d.toLowerCase());
      const sourceAvailability = trainer.availability || {};
      const fullAvailability = allDaysLower.reduce((acc: Record<string, boolean>, dLower) => {
        const isAvailable = Object.keys(sourceAvailability).some((k) => k.toLowerCase() === dLower && (sourceAvailability as any)[k]);
        acc[dLower] = !!isAvailable;
        return acc;
      }, {} as Record<string, boolean>);

      reset({
        ...trainer,
        birthDate: formattedBirthDate,
        joinDate: formattedJoinDate,
        availability: fullAvailability,
      });
      
  
      setValue('birthDate', formattedBirthDate);
      setValue('joinDate', formattedJoinDate);
      
  
     
      if (trainer.profileImage && typeof trainer.profileImage === 'string') {
        setPreviewImage(trainer.profileImage);
       
        setValue('profileImage', trainer.profileImage);
      }
    }
  }, [trainer, reset, setValue]);

 
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, sube un archivo de imagen válido');
      return;
    }

    
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('El archivo es demasiado grande. El tamaño máximo permitido es 5MB');
      return;
    }

    setIsUploading(true);
    
    try {
      
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
      
     
      const blobUrl = URL.createObjectURL(file);
      blobUrlRef.current = blobUrl;
      setPreviewImage(blobUrl);
      
      
      setValue('profileImage', file);
      toast.success('Imagen seleccionada correctamente');
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      toast.error('Error al procesar la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCertificationUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );

    if (newFiles.length === 0) {
      toast.error('Por favor, sube archivos de imagen o PDF');
      return;
    }

   
    newFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setCertificationPreviews(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      } else {
        setCertificationPreviews(prev => [...prev, '/pdf-icon.png']);
      }
    });

    setCertifications(prev => [...prev, ...newFiles]);
  };

  const removeCertification = (index: number) => {
    setCertifications(prev => prev.filter((_, i: number) => i !== index));
    setCertificationPreviews(prev => prev.filter((_, i: number) => i !== index));
  };

  const onSubmit = async (data: TrainerFormData) => {
    try {
      setIsSubmitting(true);
      console.log('Iniciando actualización de entrenador:', { 
        trainerId: trainer?.id, 
        hasPreviewImage: !!previewImage,
        previewImageType: typeof previewImage,
        certificationsCount: certifications.length 
      });
      
      const formDataObj = new FormData();
      
      
      const formatDateForBackend = (dateString: string) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
      };

     
      const mapGender = (gender: string) => {
        const genderMap: Record<string, string> = {
          'MALE': 'MASCULINO',
          'FEMALE': 'FEMENINO',
          'OTHER': 'OTRO'
        };
        return genderMap[gender] || gender;
      };

    
      const mapStatus = (status: string) => {
        const statusMap: Record<string, string> = {
          'ACTIVE': 'ACTIVO',
          'INACTIVE': 'INACTIVO',
          'SUSPENDED': 'SUSPENDIDO'
        };
        return statusMap[status] || status;
      };

      
      const mapContractType = (contractType: string) => {
        const contractMap: Record<string, string> = {
          'FULL_TIME': 'TIEMPO_COMPLETO',
          'PART_TIME': 'MEDIO_TIEMPO',
          'FREELANCE': 'INDEPENDIENTE',
          'PER_HOUR': 'TEMPORAL'
        };
        return contractMap[contractType] || contractType;
      };

      
      const mapAvailability = (availability: string[]) => {
        const dayMap: Record<string, string> = {
          'lunes': 'LUNES',
          'Lunes': 'LUNES',
          'martes': 'MARTES',
          'Martes': 'MARTES',
          'miercoles': 'MIERCOLES',
          'Miércoles': 'MIERCOLES',
          'jueves': 'JUEVES',
          'Jueves': 'JUEVES',
          'viernes': 'VIERNES',
          'Viernes': 'VIERNES',
          'sabado': 'SABADO',
          'sábado': 'SABADO',
          'Sábado': 'SABADO',
          'domingo': 'DOMINGO',
          'Domingo': 'DOMINGO'
        };
        return availability.map(day => {
          return dayMap[day] || day.toUpperCase().replace(/[ÁÉÍÓÚ]/g, match => {
            const accents: Record<string, string> = { 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U' };
            return accents[match] || match;
          });
        });
      };

      
      const trainerData = {
        firstName: data.firstName,
        lastName: data.lastName,
        dni: data.documentNumber,
        birthDate: formatDateForBackend(data.birthDate),
        gender: mapGender(data.gender),
        phone: data.phone,
        email: data.email,
        address: data.address,
        specialties: data.specialties,
        yearsOfExperience: data.yearsOfExperience,
        availability: mapAvailability(Object.keys(data.availability).filter(day => data.availability[day])),
        hireDate: formatDateForBackend(data.joinDate),
        status: mapStatus(data.status),
        contractType: mapContractType(data.contractType),
        salaryPerClass: data.salary,
        bankInfo: data.bankInfo,
        notes: data.notes
      };


      formDataObj.append('trainer', JSON.stringify(trainerData));
    
     
      if (previewImage && typeof previewImage === 'string' && previewImage.startsWith('blob:')) {
       
        const file = form.getValues('profileImage') as File;
        if (file && file instanceof File) {
          console.log('Agregando imagen de perfil:', { fileName: file.name, fileSize: file.size });
          formDataObj.append('profileImage', file);
        }
      } else if (previewImage && typeof previewImage === 'object' && 'name' in previewImage) {
        
        console.log('Agregando imagen de perfil (File directo):', { fileName: (previewImage as File).name });
        formDataObj.append('profileImage', previewImage);
      }

      
      certifications.forEach((file) => {
        console.log('Agregando certificación:', { fileName: file.name, fileSize: file.size });
        formDataObj.append('certifications', file);
      });

      if (trainer?.id) {
        await updateTrainer({
          id: trainer.id,
          data: formDataObj,
        });
      } else {
        await createTrainer(formDataObj);
      }
      
      onSuccess?.();
    } catch (error) {
      console.error('Error al guardar el entrenador:', error);
      toast.error('No se pudo guardar el entrenador');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Guardando entrenador...</span>
          </div>
        </div>
      )}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium">Información Personal</h2>
          <p className="text-sm text-muted-foreground">
            Información básica del entrenador
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">Nombres</Label>
            <Input
              id="firstName"
              {...register('firstName')}
              placeholder="Ingrese los nombres"
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName">Apellidos</Label>
            <Input
              id="lastName"
              {...form.register('lastName')}
              placeholder="Ingrese los apellidos"
            />
            {form.formState.errors.lastName && (
              <p className="text-sm text-red-500">
                {form.formState.errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="documentNumber">DNI / Documento</Label>
            <Input
              id="documentNumber"
              {...form.register('documentNumber')}
              placeholder="Ingrese el número de documento"
            />
            {form.formState.errors.documentNumber && (
              <p className="text-sm text-red-500">
                {form.formState.errors.documentNumber.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
            <Input
              id="birthDate"
              type="date"
              {...form.register('birthDate')}
            />
            {form.formState.errors.birthDate && (
              <p className="text-sm text-red-500">
                {form.formState.errors.birthDate.message}
              </p>
            )}
          </div>

          <div>
            <Label>Sexo</Label>
            <Controller
              name="gender"
              control={form.control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sexo" />
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
              <p className="text-sm text-red-500">
                {form.formState.errors.gender.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              {...form.register('phone')}
              placeholder="Ingrese el teléfono"
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-red-500">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              placeholder="Ingrese el correo electrónico"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              {...form.register('address')}
              placeholder="Ingrese la dirección"
            />
            {form.formState.errors.address && (
              <p className="text-sm text-red-500">
                {form.formState.errors.address.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label>Foto de Perfil (Opcional)</Label>
            <div className="mt-2 flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-muted overflow-hidden border">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <svg className="w-12 h-12" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  )}
                </div>
                <label 
                  htmlFor="profileImage"
                  className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                      <circle cx="12" cy="13" r="3"></circle>
                    </svg>
                  )}
                  <span className="sr-only">Cambiar foto</span>
                </label>
                <input 
                  id="profileImage" 
                  accept="image/*" 
                  className="hidden" 
                  type="file"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Formatos soportados: JPG, PNG</p>
                <p>Tamaño máximo: 5MB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información Profesional</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="specialties">Especialidades</Label>
            <Input
              id="specialties"
              {...form.register('specialties')}
              placeholder="Ej: Entrenamiento funcional, Hipertrofia, etc."
            />
            {form.formState.errors.specialties && (
              <p className="text-sm text-red-500">
                {form.formState.errors.specialties.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="yearsOfExperience">Años de Experiencia</Label>
            <Input
              id="yearsOfExperience"
              type="number"
              min="0"
              {...form.register('yearsOfExperience', { valueAsNumber: true })}
              placeholder="Años de experiencia"
            />
            {form.formState.errors.yearsOfExperience && (
              <p className="text-sm text-red-500">
                {form.formState.errors.yearsOfExperience.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label>Certificaciones</Label>
            <div className="mt-2">
              <div className="flex flex-wrap gap-2 mb-2">
                {certificationPreviews.map((preview: string, index: number) => (
                  <div key={index} className="relative">
                    <div className="h-20 w-20 rounded border border-gray-200 overflow-hidden">
                      {preview.startsWith('data:image') ? (
                        <img
                          src={preview}
                          alt={`Certificación ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-100">
                          <span className="text-xs text-gray-500">PDF</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCertification(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                id="certifications"
                multiple
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleCertificationUpload}
              />
              <Label
                htmlFor="certifications"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 cursor-pointer"
              >
                <Upload className="mr-2 h-4 w-4" />
                Subir Certificados
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Disponibilidad / Horarios</h3>
        <div className="space-y-2">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="flex items-center space-x-4">
              <Controller
                name={`availability.${day.toLowerCase()}`}
                control={form.control}
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`available-${day}`}
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor={`available-${day}`} className="w-24">
                      {day}
                    </Label>
                  </div>
                )}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información Administrativa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="joinDate">Fecha de Ingreso</Label>
            <Input
              id="joinDate"
              type="date"
              {...form.register('joinDate')}
            />
            {form.formState.errors.joinDate && (
              <p className="text-sm text-red-500">
                {form.formState.errors.joinDate.message}
              </p>
            )}
          </div>

          <div>
            <Label>Estado</Label>
            <Controller
              name="status"
              control={form.control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label>Tipo de Contrato</Label>
            <Controller
              name="contractType"
              control={form.control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo de contrato" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTRACT_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label htmlFor="salary">Salario/Pago por Clase</Label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">S/.</span>
              </div>
              <Input
                id="salary"
                type="number"
                min="0"
                step="0.01"
                className="pl-7"
                {...form.register('salary', { valueAsNumber: true })}
                placeholder="0.00"
              />
            </div>
            {form.formState.errors.salary && (
              <p className="text-sm text-red-500">
                {form.formState.errors.salary.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="bankInfo">Información Bancaria (Opcional)</Label>
            <Input
              id="bankInfo"
              {...form.register('bankInfo')}
              placeholder="Ingrese la información bancaria"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="notes">Notas Adicionales</Label>
            <Textarea
              id="notes"
              {...form.register('notes')}
              placeholder="Ingrese notas adicionales"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer hover:bg-primary/90 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : trainer ? (
            'Actualizar Entrenador'
          ) : (
            'Crear Entrenador'
          )}
        </Button>
      </div>
    </form>
  );
}
