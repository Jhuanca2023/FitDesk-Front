import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { SavedPaymentMethod } from "@/core/interfaces/payment-method.interface";

interface PaymentMethodState {
  savedCards: SavedPaymentMethod[];
  selectedCard: SavedPaymentMethod | null;
  isLoading: boolean;
  error: string | null;
}

interface PaymentMethodActions {
  setSavedCards: (cards: SavedPaymentMethod[]) => void;
  addCard: (card: SavedPaymentMethod) => void;
  updateCard: (cardId: string, card: Partial<SavedPaymentMethod>) => void;
  removeCard: (cardId: string) => void;
  selectCard: (card: SavedPaymentMethod | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearState: () => void;
}

const initialState: PaymentMethodState = {
  savedCards: [],
  selectedCard: null,
  isLoading: false,
  error: null,
};

export const usePaymentMethodStore = create<PaymentMethodState & PaymentMethodActions>()(
  immer((set) => ({
    ...initialState,
    setSavedCards: (cards) => {
      set((state) => {
        state.savedCards = cards;
      });
    },
    addCard: (card) => {
      set((state) => {
        state.savedCards.push(card);
      });
    },
    updateCard: (cardId, updatedData) => {
      set((state) => {
        const cardIndex = state.savedCards.findIndex((c) => c.id === cardId);
        if (cardIndex !== -1) {
          state.savedCards[cardIndex] = { ...state.savedCards[cardIndex], ...updatedData };
        }
      });
    },
    removeCard: (cardId) => {
      set((state) => {
        state.savedCards = state.savedCards.filter((c) => c.id !== cardId);
      });
    },
    selectCard: (card) => {
      set((state) => {
        state.selectedCard = card;
      });
    },
    setLoading: (loading) => {
      set((state) => {
        state.isLoading = loading;
      });
    },
    setError: (error) => {
      set((state) => {
        state.error = error;
      });
    },
    clearState: () => {
      set(initialState);
    },
  }))
);
