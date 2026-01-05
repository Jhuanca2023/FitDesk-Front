import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createPaymentsSlice, type PaymentsSlice } from './slices/payments.slice';

export type BillingState = PaymentsSlice;

export const useBillingStore = create<BillingState>()(
  devtools(
    immer((...args) => ({
      ...createPaymentsSlice(...args),
    }))
  )
);