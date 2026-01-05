import type {  UserMemberships } from "@/core/interfaces/plan.interface";
import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";


interface MembershipState {
    membership: UserMemberships | null;
    isUpgrade: boolean; 
    setMembership: (membership: UserMemberships) => void;
    clearMembership: () => void;
    setIsUpgrade: (isUpgrade: boolean) => void; 
}

const membershipAPI: StateCreator<MembershipState, [], [["zustand/immer", never], ["zustand/devtools", never]]> = (set) => ({
    membership: null,
    isUpgrade: false,
    setMembership: (membership) => set({ membership }),
    clearMembership: () => set({ membership: null, isUpgrade: false }),
    setIsUpgrade: (isUpgrade) => set({ isUpgrade }),
})

export const useMembershipStore = create<MembershipState>()(
    immer(
        devtools(
            membershipAPI
        )
    )
)