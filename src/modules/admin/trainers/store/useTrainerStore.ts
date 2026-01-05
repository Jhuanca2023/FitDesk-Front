import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Trainer } from '../types';

interface TrainerState {
  currentTrainer: Trainer | null;
  setCurrentTrainer: (trainer: Trainer | null) => void;
  resetCurrentTrainer: () => void;
}

export const useTrainerStore = create<TrainerState>()(
  persist(
    devtools(
      immer((set) => ({
        currentTrainer: null,
        setCurrentTrainer: (trainer) => 
          set((state) => {
            state.currentTrainer = trainer;
          }),
        resetCurrentTrainer: () => 
          set((state) => {
            state.currentTrainer = null;
          }),
      }))
    ),
    { name: 'trainer-storage' }
  )
);
