import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

interface CameraCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCapture: (dataUrl: string) => void;
}

export function CameraCaptureDialog({ open, onOpenChange, onCapture }: CameraCaptureDialogProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!open) {
      stopStream();
      return;
    }
    let mounted = true;
    const start = async () => {
      try {
        setIsStarting(true);
        setErrorMsg(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } },
          audio: false,
        });
        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        setErrorMsg("No se pudo acceder a la cámara. Revisa permisos del navegador.");
      } finally {
        if (mounted) setIsStarting(false);
      }
    };
    start();
    return () => {
      mounted = false;
      stopStream();
    };
  }, [open, stopStream]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 640;
    const size = Math.min(width, height);
    const sx = (width - size) / 2;
    const sy = (height - size) / 2;

    const canvas = canvasRef.current ?? document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    onCapture(dataUrl);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tomar foto</DialogTitle>
          <DialogDescription>
            Alinea tu rostro y presiona Capturar. La imagen se recortará en formato cuadrado.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {errorMsg ? (
            <div className="text-sm text-red-600 dark:text-red-400">{errorMsg}</div>
          ) : (
            <div className="aspect-square w-full max-w-sm mx-auto bg-black/50 rounded-lg overflow-hidden">
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isStarting}>
              Cerrar
            </Button>
            <Button type="button" onClick={handleCapture} disabled={!!errorMsg || isStarting}>
              {isStarting ? 'Iniciando cámara…' : 'Capturar'}
            </Button>
          </div>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}


