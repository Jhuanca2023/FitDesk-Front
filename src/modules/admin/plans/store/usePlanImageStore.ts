import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface PlanImageState {
  selectedImage: File | null;
  imageToCrop: string | null;
  croppedImageFile: File | null;
  isUploading: boolean;
  uploadProgress: number;
  
  // Actions
  setSelectedImage: (file: File | null) => void;
  setImageToCrop: (imageUrl: string | null) => void;
  setCroppedImageFile: (file: File | null) => void;
  setIsUploading: (uploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  reset: () => void;
}

const initialState = {
  selectedImage: null,
  imageToCrop: null,
  croppedImageFile: null,
  isUploading: false,
  uploadProgress: 0,
};

export const usePlanImageStore = create<PlanImageState>()(
  devtools(
    immer((set) => ({
      ...initialState,
      
      setSelectedImage: (file) =>
        set((state) => {
          state.selectedImage = file;
        }),
        
      setImageToCrop: (imageUrl) =>
        set((state) => {
          state.imageToCrop = imageUrl;
        }),
        
      setCroppedImageFile: (file) =>
        set((state) => {
          state.croppedImageFile = file;
        }),
        
      setIsUploading: (uploading) =>
        set((state) => {
          state.isUploading = uploading;
        }),
        
      setUploadProgress: (progress) =>
        set((state) => {
          state.uploadProgress = progress;
        }),
        
      reset: () =>
        set((state) => {
          Object.assign(state, initialState);
        }),
    }))
  )
);