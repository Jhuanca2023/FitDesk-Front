'use client';

import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SonnerToaster position="top-right" richColors expand={true} closeButton />
    </>
  );
}

// Export toast directly from sonner
export const toast = sonnerToast;
