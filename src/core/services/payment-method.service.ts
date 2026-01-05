/** biome-ignore-all lint/complexity/noThisInStatic: <> */
/** biome-ignore-all lint/complexity/noStaticOnlyClass: <> */

import { fitdeskApi } from "@/core/api/fitdeskApi";
import type {
    SavedPaymentMethod,
    CreatePaymentMethodRequest,
    UpdatePaymentMethodRequest,
    PaymentWithSavedCardRequest,
} from "@/core/interfaces/payment-method.interface";
import type { PaymentResponse } from "@/core/interfaces/payment.interface";

export class PaymentMethodService {

    static async savePaymentMethod(
        request: CreatePaymentMethodRequest
    ): Promise<SavedPaymentMethod> {
        const { data } = await fitdeskApi.post<SavedPaymentMethod>(
            "/billing/payment-methods",
            request
        );
        return data;
    }

    static async getUserPaymentMethods(): Promise<SavedPaymentMethod[]> {
        const { data } = await fitdeskApi.get<SavedPaymentMethod[]>(
            "/billing/payment-methods"
        );
        return data;
    }

    static async getPaymentMethod(cardId: string): Promise<SavedPaymentMethod> {
        const { data } = await fitdeskApi.get<SavedPaymentMethod>(
            `/billing/payment-methods/${cardId}`
        );
        return data;
    }

    static async updatePaymentMethod(
        cardId: string,
        request: UpdatePaymentMethodRequest
    ): Promise<SavedPaymentMethod> {
        const { data } = await fitdeskApi.patch<SavedPaymentMethod>(
            `/billing/payment-methods/${cardId}`,
            request
        );
        return data;
    }

    static async deletePaymentMethod(cardId: string): Promise<void> {
        await fitdeskApi.delete(`/billing/payment-methods/${cardId}`);
    }

    static async processPaymentWithSavedCard(
        request: PaymentWithSavedCardRequest
    ): Promise<PaymentResponse> {
        const { data } = await fitdeskApi.post<PaymentResponse>(
            `/billing/payment-methods/process-payment`,
            request
        );
        return data;
    }

}