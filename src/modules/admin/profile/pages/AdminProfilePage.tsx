import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Form } from '@/shared/components/ui/form';
import { useAdminProfile, useUpdateAdminProfile, useAdminActivity, useAdminStatistics } from '../query/useAdminProfileQuery';
import { UpdateAdminProfileSchema, type UpdateAdminProfile } from '@/core/zod/admin/profile.schemas';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileInfoCard } from '../components/ProfileInfoCard';
import { RecentActivityCard } from '../components/RecentActivityCard';
import { StatisticsCard } from '../components/StatisticsCard';

type ProfileFormValues = UpdateAdminProfile;

const AdminProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { data: admin, isLoading, isError } = useAdminProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateAdminProfile();
  const { data: activities = [], isLoading: isLoadingActivities } = useAdminActivity();
  const { data: statistics = [], isLoading: isLoadingStatistics } = useAdminStatistics();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(UpdateAdminProfileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  });


  useEffect(() => {
    if (admin) {
      form.reset({
        name: admin.name,
        email: admin.email,
        phone: admin.phone || '',
        address: admin.address || '',
      });
    }
  }, [admin, form]);

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile(data, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.reset({
      name: admin?.name || '',
      email: admin?.email || '',
      phone: admin?.phone || '',
      address: admin?.address || '',
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (isError || !admin) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-destructive">
          Error al cargar el perfil
        </h2>
        <p className="text-muted-foreground mt-2">
          No se pudo cargar la información del administrador
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-2 p-2 pt-0 sm:gap-4 sm:p-4">
      <div className="min-h-[calc(100vh-4rem)] flex-1 rounded-lg p-3 sm:rounded-xl sm:p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
          <ProfileHeader
            isEditing={isEditing}
            isUpdating={isUpdating}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onSave={form.handleSubmit(onSubmit)}
          />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2 space-y-4 sm:space-y-6">
                  <ProfileInfoCard
                    admin={admin}
                    isEditing={isEditing}
                    form={form}
                  />
                  <RecentActivityCard 
                    activities={activities} 
                    isLoading={isLoadingActivities}
                  />
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <StatisticsCard 
                    statistics={statistics} 
                    isLoading={isLoadingStatistics}
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
