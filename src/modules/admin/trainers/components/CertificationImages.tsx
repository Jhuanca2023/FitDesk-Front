import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { motion } from 'motion/react';


const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface CertificationImagesProps {
  images?: string[];
  trainerName: string;
  certifications?: string;
  className?: string;
}

export const CertificationImages: React.FC<CertificationImagesProps> = ({
  images = [],
  trainerName,
  certifications,
  className
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const isPdf = (url: string) => url?.toLowerCase().endsWith('.pdf') || url?.startsWith('data:application/pdf');


  const getPdfPreviewUrl = (url: string) => {
    if (url.startsWith('data:application/pdf')) return url;
    return `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(url)}`;
  };

 
  const getCertificateTitle = (index: number) => {
    if (certifications) {
     
      const certificateList = certifications.split(',').map(cert => cert.trim());
      return certificateList[index] || `Certificado ${index + 1}`;
    }
    
   
    return `Certificado ${index + 1}`;
  };

  const handleDownloadCertificate = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const certificateTitle = getCertificateTitle(index).replace(/\s+/g, '-').toLowerCase();
      const ext = isPdf(imageUrl) || blob.type === 'application/pdf' ? 'pdf' : 'jpg';
      link.download = `${certificateTitle}-${trainerName.replace(/\s+/g, '-')}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error descargando certificado:', error);
    }
  };

  const handleShareCertificate = async (imageUrl: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Certificado de ${trainerName}`,
          text: `Certificado de ${trainerName}`,
          url: imageUrl,
        });
      } catch (error) {
        console.error('Error compartiendo certificado:', error);
      }
    } else {
  
      navigator.clipboard.writeText(imageUrl);
      alert('URL del certificado copiada al portapapeles');
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className={cn("flex items-center gap-2 text-muted-foreground", className)}>
        <span className="text-sm">Sin certificados</span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Grid de certificados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((image, index) => (
          <div key={index} className="space-y-3">
            {/* Imagen del certificado */}
            <div className="aspect-[4/3] rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 relative">
              {isPdf(image) ? (
                <>
                  <iframe
                    src={getPdfPreviewUrl(image)}
                    title={`Certificado ${index + 1} de ${trainerName}`}
                    className="w-full h-full"
                  />
                  <div className="absolute inset-0 pointer-events-none" />
                </>
              ) : (
                <img
                  src={image}
                  alt={`Certificado ${index + 1} de ${trainerName}`}
                  className="w-full h-full object-cover"
                />
              )}
              {isPdf(image) && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">PDF</div>
              )}
            </div>
            
            {/* Título del certificado */}
            <div className="text-center">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                {getCertificateTitle(index)}
              </h4>
            </div>
            
            {/* Botones de acción */}
            <div className="flex flex-col gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 underline"
                    onClick={() => setSelectedImage(image)}
                  >
                    Ver certificado
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl font-semibold">
                      {getCertificateTitle(index)}
                    </DialogTitle>
                  </DialogHeader>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300"
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    
                    <div className="relative flex flex-col items-center space-y-6">
                      {/* Vista del certificado en el modal (PDF o imagen) */}
                      <div className="max-w-2xl w-full">
                        {isPdf(selectedImage || image) ? (
                          <iframe
                            src={getPdfPreviewUrl(selectedImage || image)}
                            title={`Certificado de ${trainerName}`}
                            className="w-full h-[70vh] rounded-lg border"
                          />
                        ) : (
                          <img
                            src={selectedImage || image}
                            alt={`Certificado de ${trainerName}`}
                            className="w-full h-auto object-contain rounded-lg shadow-lg"
                          />
                        )}
                      </div>
                      
                      {/* Botones de acción en el modal */}
                      <div className="flex gap-4">
                        <Button
                          variant="outline"
                          onClick={() => handleShareCertificate(selectedImage || image)}
                          className="flex items-center gap-2"
                        >
                          <Share2 className="h-4 w-4" />
                          Compartir certificado
                        </Button>
                        <Button
                          onClick={() => handleDownloadCertificate(selectedImage || image, index)}
                          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white"
                        >
                          <Download className="h-4 w-4" />
                          Descargar certificado
                        </Button>
                      </div>
                      
                      <p className="text-sm text-gray-500 text-center">
                        Esta operación puede tardar algunos segundos...
                      </p>
                    </div>
                  </motion.div>
                </DialogContent>
              </Dialog>
              
              <Button
                variant="ghost"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
                onClick={() => handleDownloadCertificate(image, index)}
              >
                <Download className="mr-2 h-4 w-4" />
                Descargar certificado
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
