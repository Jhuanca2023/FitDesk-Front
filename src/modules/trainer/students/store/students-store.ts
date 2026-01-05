import { create, type StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { 
  StudentsState, 
  Student, 
  StudentMetrics, 
  AttendanceRecord, 
  StudentFilters,
  StudentStatus 
} from '../types';


const initialState = {
  students: [],
  selectedStudent: null,
  metrics: null,
  attendanceHistory: [],
  filters: {} as StudentFilters,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  },
  viewMode: 'grid' as const,
  selectedTab: 'students' as const,
};


const studentsStore: StateCreator<StudentsState, [["zustand/immer", never]], []> = (set) => ({
  ...initialState,


  setStudents: (students: Student[]) => set({ students }),
  
  setSelectedStudent: (student: Student | null) => set({ selectedStudent: student }),
  

  setMetrics: (metrics: StudentMetrics | null) => set({ metrics }),
  
 
  setAttendanceHistory: (history: AttendanceRecord[]) => set({ attendanceHistory: history }),
  

  setFilters: (filters: Partial<StudentFilters>) => set((state) => {
    state.filters = { ...state.filters, ...filters };
    state.pagination.page = 1; 
  }),
  
 
  setPagination: (pagination: Partial<StudentsState['pagination']>) => set((state) => {
    Object.assign(state.pagination, pagination);
  }),
  
  
  setViewMode: (mode: StudentsState['viewMode']) => set({ viewMode: mode }),
  setSelectedTab: (tab: StudentsState['selectedTab']) => set({ selectedTab: tab }),

  
  updateStudentStatus: (studentId: string, status: StudentStatus) => set((state) => {
    const student = state.students.find(s => s.id === studentId);
    if (student) {
      student.status = status;
    }
    
    if (state.selectedStudent?.id === studentId) {
      state.selectedStudent.status = status;
    }
  }),
  

  addAttendanceRecord: (record: AttendanceRecord) => set((state) => {
    state.attendanceHistory.unshift(record);
    
    const student = state.students.find(s => s.id === record.studentId);
    if (student) {
      if (record.status === 'present') {
        student.stats.attendedClasses += 1;
      }
      student.stats.totalClasses += 1;
      student.stats.attendanceRate = (student.stats.attendedClasses / student.stats.totalClasses) * 100;
      student.lastActivity = record.date;
    }
  }),
  

  reset: () => set(initialState),
  

  resetFilters: () => set((state) => {
    state.filters = {};
    state.pagination = { ...initialState.pagination };
  }),
});

export const useStudentsStore = create<StudentsState>()(
  persist(
    devtools(
      immer(studentsStore),
      { name: 'students-store' }
    ),
    {
      name: 'fitdesk-students',
      partialize: (state) => ({
        filters: state.filters,
        viewMode: state.viewMode,
        selectedTab: state.selectedTab,
        pagination: { 
          page: state.pagination.page, 
          limit: state.pagination.limit 
        }
      })
    }
  )
);
