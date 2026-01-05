import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { PlanState } from '../types';

const initialState: Omit<PlanState, 'setCurrentPlanId' | 'setIsDialogOpen' | 'setFilters' | 'reset'> = {
  currentPlanId: null,
  isDialogOpen: false,
  filters: {
    isActive: true,
    searchTerm: '',
    target: 'all',
  },
};

const usePlanStore = create<PlanState>()(
  devtools(
    immer((set) => ({
      ...initialState,
      setCurrentPlanId: (id) => 
        set((state) => {
          state.currentPlanId = id;
        }),
      setIsDialogOpen: (isOpen) => 
        set((state) => {
          state.isDialogOpen = isOpen;
        }),
      setFilters: (filters) =>
        set((state) => {
          Object.assign(state.filters, filters);
        }),
      reset: () => 
        set((state) => {
          Object.assign(state, initialState);
        }),
    }))
  )
);

export const usePlanFilters = () => usePlanStore((state) => state.filters);
export const useCurrentPlanId = () => usePlanStore((state) => state.currentPlanId);
export const useIsDialogOpen = () => usePlanStore((state) => state.isDialogOpen);
export { usePlanStore };
