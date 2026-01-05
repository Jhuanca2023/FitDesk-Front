/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useRef } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Switch } from '@/shared/components/ui/switch';
import { Plus, X, Camera, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import type { PlanResponse } from '@/core/interfaces/plan.interface';
import { usePlanImageStore } from '../store/usePlanImageStore';
import { PlanImageCrop } from './plan-image-crop';

declare global {
  interface Window {
    z: typeof z;
  }
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  description: z.string().min(10, {
    message: 'La descripción debe tener al menos 10 caracteres.',
  }),
  price: z.number().min(0, {
    message: 'El precio no puede ser negativo.',
  }),
  durationMonths: z.number().min(1, {
    message: 'La duración debe ser de al menos 1 mes.',
  }),
  isActive: z.boolean().default(true),
  isPopular: z.boolean().default(false),
  currency: z.string().default('PEN'),
  features: z.array(z.string().min(1, 'La característica no puede estar vacía')).min(1, 'Debe agregar al menos una característica'),
});

type PlanFormProps = {
  plan?: PlanResponse;
  onSubmit: (values: FormValues & { image?: File }) => void;
  isLoading?: boolean;
};

export type FormValues = z.infer<typeof formSchema>;

export function PlanForm({ plan, onSubmit, isLoading = false }: PlanFormProps) {
  const [featureInput, setFeatureInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    selectedImage,
    imageToCrop,
    croppedImageFile,
    setSelectedImage,
    setImageToCrop,
    setCroppedImageFile,
    reset: resetImageStore
  } = usePlanImageStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: plan?.name || '',
      description: plan?.description || '',
      price: plan?.price || 0,
      durationMonths: plan?.durationMonths || 1,
      isActive: plan?.isActive ?? true,
      isPopular: plan?.isPopular ?? false,
      currency: plan?.currency || 'PEN',
      features: plan?.features || [],
    },
  });

  const { setValue, watch, handleSubmit, formState } = form;
  const features = watch('features');

  const addFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (featureInput.trim() && !features.includes(featureInput.trim())) {
      setValue('features', [...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setValue('features', features.filter(f => f !== featureToRemove));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    setCroppedImageFile(croppedFile);
    setImageToCrop(null);
  };

  const handleCropCancel = () => {
    setImageToCrop(null);
    setSelectedImage(null);
  };

  const removeImage = () => {
    resetImageStore();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
    onSubmit({
      ...data,
      image: croppedImageFile || undefined
    });
  };

  const getImagePreview = () => {
    if (croppedImageFile) {
      return URL.createObjectURL(croppedImageFile);
    }
    if (plan?.planImageUrl) {
      return plan.planImageUrl;
    }
    return null;
  };

  const imagePreview = getImagePreview();

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Image Upload Section */}
        <div className="space-y-4">
          <FormLabel>Imagen del plan</FormLabel>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-32 h-20 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              
              {imagePreview && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={removeImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            <div className="flex-1 space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Camera className="mr-2 h-4 w-4" />
                {imagePreview ? 'Cambiar imagen' : 'Seleccionar imagen'}
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              
              <p className="text-xs text-muted-foreground">
                Recomendado: 800x450px (16:9). Máximo 5MB.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del plan</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Plan Básico" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio mensual</FormLabel>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">S/.</span>
                  </div>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      className="pl-7"
                      value={field.value}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                </div>
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
                    placeholder="Describe los beneficios principales de este plan..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="durationMonths"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duración (meses)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    value={field.value}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activo</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPopular"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Popular</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Moneda</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormLabel>Características del plan</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="Agregar característica"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature(e))}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={addFeature}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {features.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(feature)}
                    className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          {formState.errors.features && (
            <p className="text-sm font-medium text-destructive">
              {formState.errors.features.message}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar Plan'}
          </Button>
        </div>
      </form>

      {/* Image Crop Modal */}
      <PlanImageCrop
        imageSrc={imageToCrop}
        onCropComplete={handleCropComplete}
        onCancel={handleCropCancel}
        isOpen={!!imageToCrop}
      />
    </Form>
  );
}