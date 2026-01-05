import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetMemberQuery, useUpdateMemberMutation } from '../query/useMemberQuery';
import { profileFormSchema, type ProfileFormValues } from '../schema/member.schemas';
import { useAuthStore } from '@/core/store/auth.store';
import { useProfileActions, useProfileImageState } from '../store/profile.store';
import type { MemberResponse, MemberRequest } from '@/core/interfaces/member.interface';

export const useProfileForm = () => {
  const user = useAuthStore((state) => state.user);
  const { data: member, isLoading } = useGetMemberQuery(user?.id ?? "");
  const { mutate: updateMember, isPending: isUpdating } = useUpdateMemberMutation(user?.id ?? "");

  const { newProfileImage, imageToCrop } = useProfileImageState();
  const { setIsEditing, setNewProfileImage, setImageToCrop, reset } = useProfileActions();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { firstName: '', lastName: '', dni: '', phone: '' },
  });

  useEffect(() => {
    if (member) {
      form.reset({
        firstName: member.firstName || '',
        lastName: member.lastName || '',
        dni: member.dni || '',
        phone: member.phone || '',
      });
    }
  }, [member, form]);

  const onSubmit = (values: ProfileFormValues) => {
    const changedData = Object.entries(values).reduce((acc, [key, value]) => {
      if (value !== member?.[key as keyof MemberResponse]) {
        acc[key as keyof MemberRequest] = value;
      }
      return acc;
    }, {} as MemberRequest);

    if (Object.keys(changedData).length > 0 || newProfileImage) {
      updateMember(
        { memberData: changedData, profileImage: newProfileImage },
        {
          onSuccess: () => reset(),
        }
      );
    } else {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    reset();
    if (member) {
      form.reset({
        firstName: member.firstName || '',
        lastName: member.lastName || '',
        dni: member.dni || '',
        phone: member.phone || '',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setImageToCrop(reader.result as string);
      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  const handleCropComplete = (croppedImageFile: File) => {
    setNewProfileImage(croppedImageFile);
    setImageToCrop(null);
    setIsEditing(true);
  };

  const profileImageUrl = newProfileImage
    ? URL.createObjectURL(newProfileImage)
    : member?.profileImageUrl || "/default-profile.png";

  return {
    form,
    member,
    isLoading,
    isUpdating,
    profileImageUrl,
    imageToCrop,
    onSubmit: form.handleSubmit(onSubmit),
    handleCancelEdit,
    handleFileChange,
    handleCropComplete,
    setImageToCrop,
  };
};
