// payment-method.interface.ts
export interface SavedPaymentMethod {
    id: string;
    cardToken: string; // <-- AÑADE ESTE CAMPO
    lastFourDigits: string;
    cardHolderName: string;
    cardBrand: string;
    cardType: string;
    expirationMonth: number;
    expirationYear: number;
    isDefault: boolean;
    nickname?: string;
    isExpired: boolean;
    displayName: string;
}

export interface CreatePaymentMethodRequest {
    cardToken: string;
    payerEmail: string;
    cardNumber: string;
    cardHolderName: string;
    expirationMonth: number;
    expirationYear: number;
    nickname?: string;
    cardBrand: string;
    setAsDefault: boolean;
    identificationType: string;
    identificationNumber: string;
}

export interface UpdatePaymentMethodRequest {
    nickname?: string;
    setAsDefault?: boolean;
}

export interface PaymentWithSavedCardRequest {
    savedCardId: string;
    userId: string;
    planId: string;
    payerEmail: string;
    payerName: string;
    amount: number;
    description?: string;
    installments?: number;
    cvv: string;
}
