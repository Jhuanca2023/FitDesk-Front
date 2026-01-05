import { create, type StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Member, MemberFilters, MemberStatus, MembershipStatus } from '../types';
import { memberService } from '../services/member.service';
import { immer } from 'zustand/middleware/immer';

interface MemberState {
  members: Member[];
  currentMember: Member | null;
  filters: MemberFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  
  setMembers: (members: Member[]) => void;
  setCurrentMember: (member: Member | null) => void;
  setFilters: (filters: Partial<MemberFilters>) => void;
  setPagination: (pagination: Partial<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }>) => void;


  updateMemberStatus: (memberId: string, status: MemberStatus) => void;
  updateMembershipStatus: (memberId: string, status: MembershipStatus) => void;
  deleteMember: (memberId: string) => Promise<boolean>;

  reset: () => void;
}

const initialState = {
  members: [],
  currentMember: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
};


const memberApi: StateCreator<MemberState, [["zustand/immer", never]], []> = (set) => ({
  ...initialState,

  setMembers: (members) => set({ members }),

  setCurrentMember: (member) => set({ currentMember: member }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 },
    })),

  setPagination: (pagination) => set((state) => {
    Object.assign(state.pagination, pagination);
  }),

  updateMemberStatus: (memberId, status) => set((state) => {
    state.members.forEach(member => {
      if (member.id === memberId) member.status = status;
    });

    if (state.currentMember?.id === memberId) {
      state.currentMember.status = status
    }
  }),

  updateMembershipStatus: (memberId, status) => set((state) => {

    state.members.forEach(member => {
      if (member.id === memberId && member.membership) {
        member.membership.status = status;
      }
    });
    if (state.currentMember?.id === memberId && state.currentMember.membership) {
      state.currentMember.membership.status = status;
    }
  }),


  deleteMember: async (memberId: string) => {
    try {

      await memberService.deleteMember(memberId);

      set(state => ({
        members: state.members.filter(member => member.id !== memberId),
        currentMember: state.currentMember?.id === memberId ? null : state.currentMember,
      }));
      return true;
    } catch (error) {
      return false;
    }
  },

  reset: () => set(initialState),
})

export const useMemberStore = create<MemberState>()(
  devtools(
    immer(
      memberApi
    )
  )
);
