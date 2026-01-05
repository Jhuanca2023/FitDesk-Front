import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, devtools } from 'zustand/middleware';
import type {
  AttendanceSession,
  AttendanceFilters,
  AttendanceSummary,
  MemberAttendanceHistory,
  AttendanceStatus
} from '../types';

interface AttendanceState {
  sessions: AttendanceSession[];
  currentSession: AttendanceSession | null;
  memberHistory: MemberAttendanceHistory[];
  summary: AttendanceSummary | null;
  quickStats: {
    todaySessions: number;
    todayAttendance: number;
    weeklyAverage: number;
    monthlyTotal: number;
  } | null;

  selectedDate: Date;
  filters: AttendanceFilters;
  searchTerm: string;
  viewMode: 'calendar' | 'list' | 'history';
  isSessionModalOpen: boolean;
  isAttendanceModalOpen: boolean;
  selectedSessionId: string | null;

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };

  setSessions: (sessions: AttendanceSession[]) => void;
  addSession: (session: AttendanceSession) => void;
  updateSession: (sessionId: string, updates: Partial<AttendanceSession>) => void;
  removeSession: (sessionId: string) => void;
  setCurrentSession: (session: AttendanceSession | null) => void;
  setMemberHistory: (history: MemberAttendanceHistory[]) => void;
  setSummary: (summary: AttendanceSummary) => void;
  setQuickStats: (stats: { todaySessions: number; todayAttendance: number; weeklyAverage: number; monthlyTotal: number; }) => void;

  setSelectedDate: (date: Date) => void;
  setFilters: (filters: Partial<AttendanceFilters>) => void;
  resetFilters: () => void;
  setSearchTerm: (term: string) => void;
  setViewMode: (mode: 'calendar' | 'list' | 'history') => void;
  setSessionModalOpen: (open: boolean) => void;
  setAttendanceModalOpen: (open: boolean) => void;
  setSelectedSessionId: (sessionId: string | null) => void;

  setPagination: (pagination: Partial<AttendanceState['pagination']>) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;

  updateAttendanceRecord: (sessionId: string, memberId: string, status: AttendanceStatus, notes?: string) => void;
  bulkUpdateAttendance: (sessionId: string, updates: { memberId: string; status: AttendanceStatus; notes?: string; }[]) => void;
  markAllPresent: (sessionId: string) => void;
  markAllAbsent: (sessionId: string) => void;

  getSessionById: (sessionId: string) => AttendanceSession | undefined;
  getSessionsByDate: (date: Date) => AttendanceSession[];
  getTodaySessions: () => AttendanceSession[];
  getAttendanceRate: (sessionId: string) => number;
  getMemberAttendanceInSession: (sessionId: string, memberId: string) => AttendanceStatus | null;

  reset: () => void;
}

const initialFilters: AttendanceFilters = {};

const initialPagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false
};

const attendanceStore = immer<AttendanceState>((set, get) => ({
    sessions: [],
    currentSession: null,
    memberHistory: [],
    summary: null,
    quickStats: null,
    selectedDate: new Date(),
    filters: initialFilters,
    searchTerm: '',
    viewMode: 'calendar',
    isSessionModalOpen: false,
    isAttendanceModalOpen: false,
    selectedSessionId: null,
    pagination: initialPagination,

    setSessions: (sessions) => set((state) => {
      state.sessions = sessions;
    }),

    addSession: (session) => set((state) => {
      state.sessions.unshift(session);
    }),

    updateSession: (sessionId, updates) => set((state) => {
      const index = state.sessions.findIndex(s => s.id === sessionId);
      if (index !== -1) {
        Object.assign(state.sessions[index], updates);
      }
      if (state.currentSession?.id === sessionId) {
        Object.assign(state.currentSession, updates);
      }
    }),

    removeSession: (sessionId) => set((state) => {
      state.sessions = state.sessions.filter(s => s.id !== sessionId);
      if (state.currentSession?.id === sessionId) {
        state.currentSession = null;
      }
    }),

    setCurrentSession: (session) => set((state) => {
      state.currentSession = session;
    }),

    setMemberHistory: (history) => set((state) => {
      state.memberHistory = history;
    }),

    setSummary: (summary) => set((state) => {
      state.summary = summary;
    }),

    setQuickStats: (stats) => set((state) => {
      state.quickStats = stats;
    }),

    setSelectedDate: (date) => set((state) => {
      state.selectedDate = date;
    }),

    setFilters: (filters) => set((state) => {
      Object.assign(state.filters, filters);
      state.pagination.page = 1;
    }),

    resetFilters: () => set((state) => {
      state.filters = initialFilters;
      state.searchTerm = '';
      state.pagination.page = 1;
    }),

    setSearchTerm: (term) => set((state) => {
      state.searchTerm = term;
      state.pagination.page = 1;
    }),

    setViewMode: (mode) => set((state) => {
      state.viewMode = mode;
    }),

    setSessionModalOpen: (open) => set((state) => {
      state.isSessionModalOpen = open;
    }),

    setAttendanceModalOpen: (open) => set((state) => {
      state.isAttendanceModalOpen = open;
    }),

    setSelectedSessionId: (sessionId) => set((state) => {
      state.selectedSessionId = sessionId;
    }),

    setPagination: (pagination) => set((state) => {
      Object.assign(state.pagination, pagination);
    }),

    nextPage: () => set((state) => {
      if (state.pagination.hasNext) {
        state.pagination.page += 1;
      }
    }),

    prevPage: () => set((state) => {
      if (state.pagination.hasPrev) {
        state.pagination.page -= 1;
      }
    }),

    goToPage: (page) => set((state) => {
      if (page >= 1 && page <= state.pagination.totalPages) {
        state.pagination.page = page;
      }
    }),

    updateAttendanceRecord: (sessionId, memberId, status, notes) => set((state) => {
      const session = state.sessions.find(s => s.id === sessionId);
      if (session) {
        const record = session.attendanceRecords.find(r => r.memberId === memberId);
        if (record) {
          record.status = status;
          record.notes = notes;
          record.checkInTime = (status === 'present' || status === 'late') ? new Date() : undefined;
          record.updatedAt = new Date();
        }
        
        session.presentCount = session.attendanceRecords.filter(r => r.status === 'present').length;
        session.absentCount = session.attendanceRecords.filter(r => r.status === 'absent').length;
        session.lateCount = session.attendanceRecords.filter(r => r.status === 'late').length;
        session.excusedCount = session.attendanceRecords.filter(r => r.status === 'excused').length;
      }

      if (state.currentSession?.id === sessionId) {
        const record = state.currentSession.attendanceRecords.find(r => r.memberId === memberId);
        if (record) {
          record.status = status;
          record.notes = notes;
          record.checkInTime = (status === 'present' || status === 'late') ? new Date() : undefined;
          record.updatedAt = new Date();
        }
        
        state.currentSession.presentCount = state.currentSession.attendanceRecords.filter(r => r.status === 'present').length;
        state.currentSession.absentCount = state.currentSession.attendanceRecords.filter(r => r.status === 'absent').length;
        state.currentSession.lateCount = state.currentSession.attendanceRecords.filter(r => r.status === 'late').length;
        state.currentSession.excusedCount = state.currentSession.attendanceRecords.filter(r => r.status === 'excused').length;
      }
    }),

    bulkUpdateAttendance: (sessionId, updates) => set((state) => {
      updates.forEach(({ memberId, status, notes }) => {
        const session = state.sessions.find(s => s.id === sessionId);
        if (session) {
          const record = session.attendanceRecords.find(r => r.memberId === memberId);
          if (record) {
            record.status = status;
            record.notes = notes;
            record.checkInTime = (status === 'present' || status === 'late') ? new Date() : undefined;
            record.updatedAt = new Date();
          }
        }

        if (state.currentSession?.id === sessionId) {
          const record = state.currentSession.attendanceRecords.find(r => r.memberId === memberId);
          if (record) {
            record.status = status;
            record.notes = notes;
            record.checkInTime = (status === 'present' || status === 'late') ? new Date() : undefined;
            record.updatedAt = new Date();
          }
        }
      });

      const session = state.sessions.find(s => s.id === sessionId);
      if (session) {
        session.presentCount = session.attendanceRecords.filter(r => r.status === 'present').length;
        session.absentCount = session.attendanceRecords.filter(r => r.status === 'absent').length;
        session.lateCount = session.attendanceRecords.filter(r => r.status === 'late').length;
        session.excusedCount = session.attendanceRecords.filter(r => r.status === 'excused').length;
      }

      if (state.currentSession?.id === sessionId) {
        state.currentSession.presentCount = state.currentSession.attendanceRecords.filter(r => r.status === 'present').length;
        state.currentSession.absentCount = state.currentSession.attendanceRecords.filter(r => r.status === 'absent').length;
        state.currentSession.lateCount = state.currentSession.attendanceRecords.filter(r => r.status === 'late').length;
        state.currentSession.excusedCount = state.currentSession.attendanceRecords.filter(r => r.status === 'excused').length;
      }
    }),

    markAllPresent: (sessionId) => set((state) => {
      const session = state.sessions.find(s => s.id === sessionId);
      if (session) {
        session.attendanceRecords.forEach(record => {
          record.status = 'present';
          record.checkInTime = new Date();
          record.updatedAt = new Date();
        });
        session.presentCount = session.attendanceRecords.length;
        session.absentCount = 0;
        session.lateCount = 0;
        session.excusedCount = 0;
      }

      if (state.currentSession?.id === sessionId) {
        state.currentSession.attendanceRecords.forEach(record => {
          record.status = 'present';
          record.checkInTime = new Date();
          record.updatedAt = new Date();
        });
        state.currentSession.presentCount = state.currentSession.attendanceRecords.length;
        state.currentSession.absentCount = 0;
        state.currentSession.lateCount = 0;
        state.currentSession.excusedCount = 0;
      }
    }),

    markAllAbsent: (sessionId) => set((state) => {
      const session = state.sessions.find(s => s.id === sessionId);
      if (session) {
        session.attendanceRecords.forEach(record => {
          record.status = 'absent';
          record.checkInTime = undefined;
          record.updatedAt = new Date();
        });
        session.presentCount = 0;
        session.absentCount = session.attendanceRecords.length;
        session.lateCount = 0;
        session.excusedCount = 0;
      }

      if (state.currentSession?.id === sessionId) {
        state.currentSession.attendanceRecords.forEach(record => {
          record.status = 'absent';
          record.checkInTime = undefined;
          record.updatedAt = new Date();
        });
        state.currentSession.presentCount = 0;
        state.currentSession.absentCount = state.currentSession.attendanceRecords.length;
        state.currentSession.lateCount = 0;
        state.currentSession.excusedCount = 0;
      }
    }),

    getSessionById: (sessionId) => {
      return get().sessions.find(s => s.id === sessionId);
    },

    getSessionsByDate: (date) => {
      const dateStr = date.toDateString();
      return get().sessions.filter(s => new Date(s.date).toDateString() === dateStr);
    },

    getTodaySessions: () => {
      const today = new Date().toDateString();
      return get().sessions.filter(s => new Date(s.date).toDateString() === today);
    },

    getAttendanceRate: (sessionId) => {
      const session = get().sessions.find(s => s.id === sessionId);
      if (!session || session.totalMembers === 0) return 0;
      return (session.presentCount / session.totalMembers) * 100;
    },

    getMemberAttendanceInSession: (sessionId, memberId) => {
      const session = get().sessions.find(s => s.id === sessionId);
      const record = session?.attendanceRecords.find(r => r.memberId === memberId);
      return record?.status || null;
    },

    reset: () => set((state) => {
      state.sessions = [];
      state.currentSession = null;
      state.memberHistory = [];
      state.summary = null;
      state.quickStats = null;
      state.selectedDate = new Date();
      state.filters = initialFilters;
      state.searchTerm = '';
      state.viewMode = 'calendar';
      state.isSessionModalOpen = false;
      state.isAttendanceModalOpen = false;
      state.selectedSessionId = null;
      state.pagination = initialPagination;
    })
  })
);

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    devtools(
      attendanceStore,
      { name: 'attendance-store' }
    ),
    {
      name: 'fitdesk-attendance',
      partialize: (state) => ({
        selectedDate: state.selectedDate,
        filters: state.filters,
        searchTerm: state.searchTerm,
        viewMode: state.viewMode,
        pagination: {
          page: state.pagination.page,
          limit: state.pagination.limit
        }
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.selectedDate) {
          state.selectedDate = new Date(state.selectedDate);
        }
      }
    }
  )
);
