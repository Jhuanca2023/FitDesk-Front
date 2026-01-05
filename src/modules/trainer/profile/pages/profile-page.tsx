import { useNavigate } from 'react-router';
import { useState } from 'react';
import { PageLoader } from '@/shared/components/page-loader';
import { TrainerDetailView } from '@/modules/admin/trainers/components/TrainerDetailView';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Image } from '@/shared/components/ui/image';
import { Camera, Loader2, Trash } from 'lucide-react';
import { ImageCropDialog } from '@/shared/components/image-crop-dialog';
import { CameraCaptureDialog } from '@/shared/components/camera-capture-dialog';
import { useTrainerProfileImage } from '@/modules/trainer/profile/hooks/useTrainerProfileImage';

export default function TrainerProfilePage() {
  const navigate = useNavigate();
  const [cameraOpen, setCameraOpen] = useState(false);

  const {
    trainer,
    isLoading,
    isUpdating,
    fileInputRef,
    imageToCrop,
    profileImageUrl,
    handleFileButtonClick,
    handleFileChange,
    handleCropComplete,
    handleDeleteImage,
    setImageToCrop,
  } = useTrainerProfileImage();

  if (isLoading) return <PageLoader />;
  if (!trainer) {
    return (
      <div className="p-6">
        <div className="rounded-lg border p-6 text-sm text-red-600 dark:text-red-400">
          Error cargando tu perfil. Intenta nuevamente más tarde.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <Button type="button" variant="outline" onClick={() => navigate('/trainer/dashboard')}>
          Volver
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Foto de perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="relative">
              <Image
                src={profileImageUrl}
                alt="Foto de perfil"
                className="w-32 h-32 rounded-full object-cover border-4 border-muted shadow-lg"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full"
                onClick={handleFileButtonClick}
                disabled={isUpdating}
                aria-label="Cambiar foto de perfil"
              >
                {isUpdating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/webp, image/gif"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={handleFileButtonClick} disabled={isUpdating}>
                <Camera className="h-4 w-4 mr-2" /> Cambiar foto
              </Button>
              <Button type="button" variant="outline" onClick={() => setCameraOpen(true)} disabled={isUpdating}>
                <Camera className="h-4 w-4 mr-2" /> Tomar foto
              </Button>
              <Button type="button" variant="destructive" onClick={handleDeleteImage} disabled={isUpdating}>
                <Trash className="h-4 w-4 mr-2" /> Eliminar foto
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <TrainerDetailView trainer={trainer} onBack={() => navigate('/trainer/dashboard')} />

      <ImageCropDialog
        imageSrc={imageToCrop}
        onClose={() => setImageToCrop(null)}
        onCropComplete={handleCropComplete}
      />

      <CameraCaptureDialog
        open={cameraOpen}
        onOpenChange={setCameraOpen}
        onCapture={(dataUrl) => {
          setCameraOpen(false);
          setImageToCrop(dataUrl);
        }}
      />
    </div>
  );
}


