import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/animated/dialog';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  className?: string;
  title?: string;
  description?: string;
  confirmText?: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
  className = '',
  title = '¿Eliminar clase?',
  description = 'Esta acción no se puede deshacer. La clase desaparecerá del calendario permanentemente.',
  confirmText = 'Eliminar Clase'
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-md ${className}`}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle className="text-lg font-semibold text-destructive">
              {title}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
          
          <div className="flex items-center gap-2 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
            <Trash2 className="h-4 w-4 text-destructive flex-shrink-0" />
            <span className="text-sm text-destructive font-medium">
              Esta acción es irreversible
            </span>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isDeleting}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 hover:bg-destructive/90 transition-all duration-200 hover:scale-105"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                {confirmText}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
