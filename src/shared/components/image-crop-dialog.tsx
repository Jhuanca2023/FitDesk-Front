import { useState, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Slider } from "@/shared/components/ui/slider";
import getCroppedImg from "@/core/utils/cropImage";
import { RotateCw } from "lucide-react";
import { Label } from "./ui/label";

interface ImageCropDialogProps {
  imageSrc: string | null;
  onClose: () => void;
  onCropComplete: (croppedImage: File) => void;
}

export function ImageCropDialog({
  imageSrc,
  onClose,
  onCropComplete,
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropPixelsChange = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleSave = async () => {
    if (imageSrc && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
      );
      if (croppedImage) {
        onCropComplete(croppedImage);
      }
    }
  };

  if (!imageSrc) return null;

  return (
    <Dialog open={!!imageSrc} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Recortar Imagen</DialogTitle>
        </DialogHeader>
        <div className="relative h-96 w-full bg-gray-200">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropPixelsChange}
            cropShape="round"
            showGrid={false}
          />
        </div>
        <div className="space-y-4 p-4">
          <div>
            <Label className="text-sm">Zoom</Label>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(value) => setZoom(value[0])}
            />
          </div>
          <div>
            <Label className="text-sm">Rotación</Label>
            <div className="flex items-center gap-2">
              <Slider
                value={[rotation]}
                min={0}
                max={360}
                step={1}
                onValueChange={(value) => setRotation(value[0])}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setRotation(rotation + 90)}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
