import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { usePaymentMethods } from "../hooks/usePaymentMethods";
import { PaymentService } from "@/core/services/payment.service";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/core/store/auth.store";

const formSchema = z.object({
    cardNumber: z
        .string()
        .min(15, "Número de tarjeta inválido")
        .max(16, "Número de tarjeta inválido")
        .regex(/^\d+$/, "Debe ser solo números"),
    cardHolderName: z.string().optional(),
    expirationMonth: z
        .string()
        .refine(
            (val) => parseInt(val) >= 1 && parseInt(val) <= 12,
            "Mes inválido",
        ),
    expirationYear: z
        .string()
        .refine(
            (val) => parseInt(val) >= new Date().getFullYear(),
            "Año inválido",
        ),
    cvv: z.string().min(3, "CVV inválido").max(4, "CVV inválido"),
    nickname: z.string().optional(),
    setAsDefault: z.boolean(),
    identificationType: z.string(),
    identificationNumber: z.string().min(5, "Número de documento muy corto"),
});

export function PaymentMethodForm() {
    const queryClient = useQueryClient();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            setAsDefault: false,
            cardNumber: "",
            cardHolderName: "APRO",
            cvv: "",
            identificationNumber: "",
        },
    });

    const { useAddCard } = usePaymentMethods();
    const { mutate: addCard, isPending } = useAddCard();

    async function onSubmit(values: z.infer<typeof formSchema>) {
        form.clearErrors();
        toast.loading("Procesando tarjeta...");

        try {
            const { user } = useAuthStore.getState();
            if (!user) {
                toast.error(
                    "Error de autenticación. Por favor, inicia sesión de nuevo.",
                );
                return;
            }

            const bin = values.cardNumber.substring(0, 6);
            const paymentMethodId =
                await PaymentService.detectPaymentMethod(bin);

            const { id: cardToken } = await PaymentService.createCardToken({
                cardNumber: values.cardNumber,
                cardholderName: "APRO",
                cardExpirationMonth: values.expirationMonth,
                cardExpirationYear: values.expirationYear,
                securityCode: values.cvv,
                identificationType: values.identificationType,
                identificationNumber: values.identificationNumber,
            });

            addCard(
                {
                    cardToken,
                    payerEmail: user.email,
                    cardNumber: values.cardNumber,
                    cardHolderName: "APRO",
                    expirationMonth: parseInt(values.expirationMonth),
                    expirationYear: parseInt(values.expirationYear),
                    cardBrand: paymentMethodId, // <-- Pasamos la marca correcta
                    nickname: values.nickname,
                    setAsDefault: values.setAsDefault,
                    identificationType: values.identificationType,
                    identificationNumber: values.identificationNumber,
                },
                {
                    onSuccess: () => {
                        toast.success("Tarjeta guardada exitosamente");
                        form.reset();
                        queryClient.invalidateQueries({
                            queryKey: ["paymentMethods"],
                        });
                    },
                    onError: (error: any) => {
                        toast.error(
                            error.message || "Error al guardar la tarjeta",
                        );
                    },
                },
            );
        } catch (error: any) {
            console.error("Error processing card:", error);
            toast.error(
                error.message ||
                    "Error al procesar la tarjeta. Revisa los datos.",
            );
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    name="cardNumber"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Número de Tarjeta</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="**** **** **** ****"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-3 gap-4">
                    <FormField
                        name="expirationMonth"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mes</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="MM"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="expirationYear"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Año</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="YYYY"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="cvv"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CVV</FormLabel>
                                <FormControl>
                                    <Input placeholder="123" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="identificationType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de Documento</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="DNI">DNI</SelectItem>
                                        <SelectItem value="CE">CE</SelectItem>
                                        <SelectItem value="RUC">RUC</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="identificationNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número de Documento</FormLabel>
                                <FormControl>
                                    <Input placeholder="12345678" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    name="nickname"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Apodo (opcional)</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ej: Tarjeta del trabajo"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="setAsDefault"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Establecer como método de pago por defecto
                                </FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Guardando..." : "Guardar Tarjeta"}
                </Button>
            </form>
        </Form>
    );
}
