import { useEffect, useMemo, useRef } from 'react';
import { useAuthStore } from '@/core/store/auth.store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { trainerService } from '@/modules/admin/trainers/services/trainer.service';
import { toast } from '@/shared/components/ui/toast-provider';
import { useTrainerProfileActions, useTrainerProfileImageState } from '../store/profile.store';

export const useTrainerProfileImage = () => {
  const user = useAuthStore((s) => s.user);
  const trainerId = useMemo(() => user?.id ?? '', [user]);

  const queryClient = useQueryClient();
  const { data: trainer, isLoading } = useQuery({
    queryKey: ['trainer-profile', trainerId],
    queryFn: async () => {
      if (!trainerId) throw new Error('No trainer id');
      return trainerService.getById(trainerId);
    },
    enabled: Boolean(trainerId),
    staleTime: 60 * 1000,
  });

  const { imageToCrop, newProfileImage } = useTrainerProfileImageState();
  const { setImageToCrop, setNewProfileImage, reset } = useTrainerProfileActions();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append('trainer', JSON.stringify({}));
      form.append('profileImage', file);
      return trainerService.update(trainerId, form);
    },
    onMutate: async (file) => {
      await queryClient.cancelQueries({ queryKey: ['trainer-profile', trainerId] });
      const previous = queryClient.getQueryData(['trainer-profile', trainerId]);
      const tempUrl = URL.createObjectURL(file);
      queryClient.setQueryData(['trainer-profile', trainerId], (old: any) => old ? { ...old, profileImage: tempUrl } : old);
      return { previous, tempUrl } as const;
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(['trainer-profile', trainerId], ctx.previous);
      }
      toast.error(`Error al actualizar la foto: ${String((err as any)?.message || err)}`);
    },
    onSettled: (_data, _err, _vars, ctx) => {
      if (ctx?.tempUrl) URL.revokeObjectURL(ctx.tempUrl);
      queryClient.invalidateQueries({ queryKey: ['trainer-profile', trainerId] });
    },
    onSuccess: () => {
      toast.success('¡Foto de perfil actualizada!');
      reset();
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async () => {
   
      const form = new FormData();
     
      form.append('trainer', JSON.stringify({ profileImageUrl: "" }));
      return trainerService.update(trainerId, form);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['trainer-profile', trainerId] });
      const previous = queryClient.getQueryData(['trainer-profile', trainerId]);
      queryClient.setQueryData(['trainer-profile', trainerId], (old: any) => old ? { ...old, profileImage: null } : old);
      return { previous } as const;
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(['trainer-profile', trainerId], ctx.previous);
      }
      toast.error(`Error al eliminar la foto: ${String((err as any)?.message || err)}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['trainer-profile', trainerId] });
      queryClient.invalidateQueries({ queryKey: ['trainer', trainerId] });
    },
    onSuccess: () => {
      queryClient.setQueryData(['trainer-profile', trainerId], (old: any) => old ? { ...old, profileImage: null } : old);
      toast.success('Foto de perfil eliminada');
      reset();
    },
  });

  useEffect(() => {
    return () => {
      if (newProfileImage) {
        URL.revokeObjectURL(URL.createObjectURL(newProfileImage));
      }
    };
  }, []);

  const handleFileButtonClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setImageToCrop(reader.result as string);
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleCropComplete = (croppedImageFile: File) => {
    setNewProfileImage(croppedImageFile);
    setImageToCrop(null);
    updateImageMutation.mutate(croppedImageFile);
  };

  const handleDeleteImage = () => {
    deleteImageMutation.mutate();
  };

  const profileImageUrl = newProfileImage
    ? URL.createObjectURL(newProfileImage)
    : (typeof trainer?.profileImage === 'string' && trainer.profileImage) ? trainer.profileImage : '/default-profile.png';

  return {
    trainer,
    isLoading,
    fileInputRef,
    imageToCrop,
    profileImageUrl,
    handleFileButtonClick,
    handleFileChange,
    handleCropComplete,
    handleDeleteImage,
    setImageToCrop,
    isUpdating: updateImageMutation.isPending || deleteImageMutation.isPending,
  };
};


