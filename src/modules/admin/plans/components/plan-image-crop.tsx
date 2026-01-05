import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/animated/dialog';
import { Slider } from '@/shared/components/ui/slider';
import { Label } from '@/shared/components/ui/label';
import type { Area } from 'react-easy-crop';

interface PlanImageCropProps {
  imageSrc: string | null;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<File> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'plan-image.jpg', { type: 'image/jpeg' });
        resolve(file);
      }
    }, 'image/jpeg', 0.8);
  });
};

export function PlanImageCrop({ imageSrc, onCropComplete, onCancel, isOpen }: PlanImageCropProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropCompleteCallback = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    
    setIsProcessing(true);
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedFile);
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!imageSrc) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Recortar imagen del plan</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
            <Cropper
              image={imageSrc}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={16 / 9}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropCompleteCallback}
              onZoomChange={setZoom}
            />
          </div>
          
          <div className="space-y-3">
            <div>
              <Label>Zoom</Label>
              <Slider
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                min={1}
                max={3}
                step={0.1}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label>Rotación</Label>
              <Slider
                value={[rotation]}
                onValueChange={(value) => setRotation(value[0])}
                min={0}
                max={360}
                step={1}
                className="mt-2"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button onClick={handleCrop} disabled={isProcessing}>
            {isProcessing ? 'Procesando...' : 'Aplicar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}