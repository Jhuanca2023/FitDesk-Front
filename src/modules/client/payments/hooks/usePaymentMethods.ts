import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PaymentMethodService } from "@/core/services/payment-method.service";
import type {
    CreatePaymentMethodRequest,
    UpdatePaymentMethodRequest,
    SavedPaymentMethod,
} from "@/core/interfaces/payment-method.interface";

export function usePaymentMethods() {
    const queryClient = useQueryClient();


    const useFetchCards = () =>
        useQuery<SavedPaymentMethod[], Error>({
            queryKey: ["paymentMethods"],
            queryFn: PaymentMethodService.getUserPaymentMethods,
        });


    const useAddCard = () =>
        useMutation({
            mutationFn: (data: CreatePaymentMethodRequest) =>
                PaymentMethodService.savePaymentMethod(data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
            },
        });


    const useUpdateCard = () =>
        useMutation({
            mutationFn: ({ cardId, data }: { cardId: string; data: UpdatePaymentMethodRequest }) =>
                PaymentMethodService.updatePaymentMethod(cardId, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
            },
        });


    const useDeleteCard = () =>
        useMutation({
            mutationFn: (cardId: string) => PaymentMethodService.deletePaymentMethod(cardId),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
            },
        });

    return {
        useFetchCards,
        useAddCard,
        useUpdateCard,
        useDeleteCard,
    };
}
