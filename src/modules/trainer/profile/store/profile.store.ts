import { create } from "zustand";
import { useShallow } from "zustand/shallow";

interface TrainerProfileState {
  isEditing: boolean;
  imageToCrop: string | null;
  newProfileImage: File | null;
  actions: {
    setIsEditing: (isEditing: boolean) => void;
    setImageToCrop: (image: string | null) => void;
    setNewProfileImage: (file: File | null) => void;
    reset: () => void;
  };
}

const useTrainerProfileStore = create<TrainerProfileState>((set) => ({
  isEditing: false,
  imageToCrop: null,
  newProfileImage: null,
  actions: {
    setIsEditing: (isEditing) => set({ isEditing }),
    setImageToCrop: (image) => set({ imageToCrop: image }),
    setNewProfileImage: (file) => set({ newProfileImage: file }),
    reset: () => set({ isEditing: false, newProfileImage: null, imageToCrop: null }),
  },
}));

export const useTrainerIsEditing = () => useTrainerProfileStore((state) => state.isEditing);

export const useTrainerProfileImageState = () =>
  useTrainerProfileStore(
    useShallow((state) => ({
      imageToCrop: state.imageToCrop,
      newProfileImage: state.newProfileImage,
    })),
  );

export const useTrainerProfileActions = () =>
  useTrainerProfileStore((state) => state.actions);


