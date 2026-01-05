import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { 
  startOfWeek, 
  endOfWeek
} from 'date-fns';

interface CalendarStore {
  currentDate: Date;
  selectedDate: Date | null;
  
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date | null) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  goToToday: () => void;
  goToDate: (date: Date) => void;
}

export const useCalendarStore = create<CalendarStore>()(
  immer((set, get) => ({
    currentDate: new Date(),
    selectedDate: null,
    
    setCurrentDate: (date) => set((state) => {
      state.currentDate = date;
    }),
    
    setSelectedDate: (date) => set((state) => {
      state.selectedDate = date;
    }),
    
    goToNext: () => set((state) => {
      const { currentDate } = get();
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 7);
      state.currentDate = new Date(newDate);
    }),
    
    goToPrevious: () => set((state) => {
      const { currentDate } = get();
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      state.currentDate = new Date(newDate);
    }),
    
    goToToday: () => set((state) => {
      state.currentDate = new Date();
    }),
    
    goToDate: (date) => set((state) => {
      state.currentDate = new Date(date);
    }),
  }))
);

export function useCalendarDateRange() {
  return useCalendarStore((state) => {
    const start = startOfWeek(state.currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(state.currentDate, { weekStartsOn: 1 });
    return { start, end };
  });
}
