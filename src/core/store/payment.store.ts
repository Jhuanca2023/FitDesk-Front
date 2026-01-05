import { create, type StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

export type CardType = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

export interface PaymentFormData {
    cardNumber: string;
    cardName: string;
    expDate: string;
    ccv: string;
    dni: string;
    comments: string;
}

interface PaymentStore {
    // Estado
    formData: PaymentFormData;
    cardType: CardType;
    showBack: boolean;
    isSubmitting: boolean;
    
    // Acciones
    setCardNumber: (value: string) => void;
    setCardName: (value: string) => void;
    setExpDate: (value: string) => void;
    setCcv: (value: string) => void;
    setDni: (value: string) => void;
    setComments: (value: string) => void;
    setShowBack: (value: boolean) => void;
    toggleShowBack: () => void;
    resetForm: () => void;
    submitPayment: (data: PaymentFormData) => Promise<void>;
}

const initialFormData: PaymentFormData = {
    cardNumber: '',
    cardName: '',
    expDate: '',
    ccv: '',
    dni: '',
    comments: '',
};

const paymentStoreAPI: StateCreator<PaymentStore> = (set, get) => ({
    // Estado inicial
    formData: initialFormData,
    cardType: 'unknown',
    showBack: false,
    isSubmitting: false,

    // Acciones
    setCardNumber: (value: string) => {
        set((state) => ({
            formData: { ...state.formData, cardNumber: value },
        }));
    },

    setCardName: (value: string) => {
        set((state) => ({
            formData: { ...state.formData, cardName: value },
        }));
    },

    setExpDate: (value: string) => {
        set((state) => ({
            formData: { ...state.formData, expDate: value },
        }));
    },

    setCcv: (value: string) => {
        set((state) => ({
            formData: { ...state.formData, ccv: value },
        }));
    },

    setDni: (value: string) => {
        set((state) => ({
            formData: { ...state.formData, dni: value },
        }));
    },

    setComments: (value: string) => {
        set((state) => ({
            formData: { ...state.formData, comments: value },
        }));
    },

    setShowBack: (value: boolean) => {
        set({ showBack: value });
    },

    toggleShowBack: () => {
        set((state) => ({ showBack: !state.showBack }));
    },

    resetForm: () => {
        set({
            formData: initialFormData,
            cardType: 'unknown',
            showBack: false,
            isSubmitting: false,
        });
    },

    submitPayment: async (data: PaymentFormData) => {
        set({ isSubmitting: true });
        try {
            // Aquí iría la lógica de pago real
            console.log('Payment submitted:', {
                ...data,
                cardType: get().cardType,
            });
            
            // Simular llamada API
            await new Promise((resolve) => setTimeout(resolve, 1000));
            
            // Resetear formulario después del éxito
            get().resetForm();
        } catch (error) {
            console.error('Payment error:', error);
            throw error;
        } finally {
            set({ isSubmitting: false });
        }
    },
});

export const usePaymentStore = create<PaymentStore>()(
    devtools(paymentStoreAPI, { name: 'payment-store' })
);