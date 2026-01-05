import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { ConfigurationSection } from '../types';


interface ConfigurationState {
  activeSection: ConfigurationSection;
  showChangePasswordModal: boolean;
  showDeactivateAccountModal: boolean;
  showDeleteAccountModal: boolean;
  showSessionsModal: boolean;
  showRecentEmailsModal: boolean;

  setActiveSection: (section: ConfigurationSection) => void;
  openChangePasswordModal: () => void;
  closeChangePasswordModal: () => void;
}


const configurationStore = (set: (fn: (state: ConfigurationState) => void) => void) => ({
  activeSection: 'personal-data' as ConfigurationSection,
  showChangePasswordModal: false,
  showDeactivateAccountModal: false,
  showDeleteAccountModal: false,
  showSessionsModal: false,
  showRecentEmailsModal: false,

  setActiveSection: (section: ConfigurationSection) => set((state: ConfigurationState) => {
    state.activeSection = section;
  }),


  openChangePasswordModal: () => set((state: ConfigurationState) => {
    state.showChangePasswordModal = true;
  }),

  closeChangePasswordModal: () => set((state: ConfigurationState) => {
    state.showChangePasswordModal = false;
  }),






});




export const useConfigurationStore = create<ConfigurationState>()(
  persist(
    devtools(
      immer(configurationStore), { name: 'configuration-store' }),
    {
      name: 'fitdesk-trainer-configuration',
      partialize: (state) => ({
        activeSection: state.activeSection,
      }),
    }
  )
);
