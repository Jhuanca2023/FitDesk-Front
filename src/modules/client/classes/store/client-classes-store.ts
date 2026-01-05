import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { ClassFilters } from '../types';

type TabType = 'all' | 'upcoming' | 'pending' | 'completed';

interface ClientClassesState {
  selectedTab: TabType;
  filters: ClassFilters;
  

  setSelectedTab: (tab: TabType) => void;
  setFilters: (filters: Partial<ClassFilters>) => void;
  resetFilters: () => void;
}

const initialFilters: ClassFilters = {
  status: 'upcoming'
};

const clientClassesStore = (set: any) => ({
  selectedTab: 'upcoming' as TabType,
  filters: initialFilters,

  setSelectedTab: (tab: TabType) =>
    set((state: ClientClassesState) => {
      state.selectedTab = tab;
      if (tab !== 'all') {
        state.filters.status = tab;
      } else {
        state.filters.status = 'all';
      }
    }),

  setFilters: (newFilters: Partial<ClassFilters>) =>
    set((state: ClientClassesState) => {
      Object.assign(state.filters, newFilters);
    }),

  resetFilters: () =>
    set((state: ClientClassesState) => {
      Object.assign(state.filters, initialFilters);
      state.selectedTab = 'upcoming';
    })
});

export const useClientClassesStore = create<ClientClassesState>()(
  devtools(
    immer(clientClassesStore),
    { name: 'client-classes-store' }
  )
);
