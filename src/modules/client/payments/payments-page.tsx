import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";

import type { PlanResponse } from "@/core/interfaces/plan.interface";
import type {
    UpgradeCostResponse,
    PaymentResponse,
} from "@/core/interfaces/payment.interface";
import { useAuthStore } from "@/core/store/auth.store";
import { useMembershipStore } from "./store/useMembershipState";
import { PaymentService } from "@/core/services/payment.service"; 
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { CreditCard, Wallet } from "lucide-react";

import { PaymentMethodForm } from "./components/PaymentMethodForm";
import { usePaymentMethods } from "./hooks/usePaymentMethods";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { SavedCardSelector } from "./components/saved-card-selector";
import { cn } from "@/core/lib/utils";
import type { SavedPaymentMethod } from "@/core/interfaces/payment-method.interface";
import { useGetMemberQuery } from "../profile/query/useMemberQuery";

export default function PaymentsPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [paymentType, setPaymentType] = useState<"new" | "saved">("new");
    const [savedCardSelection, setSavedCardSelection] = useState<{
        card: SavedPaymentMethod;
        cvv: string;
    } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const [selectedPlan, setSelectedPlan] = useState<PlanResponse | null>(null);
    const [isUpgrade, setIsUpgrade] = useState<boolean>(false);
    const [upgradeInfo, setUpgradeInfo] = useState<UpgradeCostResponse | null>(
        null,
    );
    const { user } = useAuthStore();
    const { data: member } = useGetMemberQuery(user?.id || "");
    const setIsUpgradeStore = useMembershipStore((state) => state.setIsUpgrade);
    const { data: savedCards, isLoading: isLoadingCards } =
        usePaymentMethods().useFetchCards();

    useEffect(() => {
        const state = location.state as any;
        if (state?.selectedPlan) {
            setSelectedPlan(state.selectedPlan);
            setIsUpgrade(state.isUpgrade || false);
            setUpgradeInfo(state.upgradeInfo || null);
        } else {
            navigate("/");
        }
    }, [location, navigate]);

    useEffect(() => {
        if (!isLoadingCards) {
            setPaymentType(
                savedCards && savedCards.length > 0 ? "saved" : "new",
            );
        }
    }, [savedCards, isLoadingCards]);

    useEffect(() => () => setIsUpgradeStore(false), [setIsUpgradeStore]);

    const handlePaymentSuccess = (paymentData: PaymentResponse) => {
        toast.success("¡Pago realizado con éxito!");
        setIsProcessing(true);
        setTimeout(() => navigate("/client/membership"), 1800);
    };

        const handleFinalSubmit = async () => {
        if (!user || !selectedPlan) {
            toast.error("Faltan datos para procesar el pago.");
            return;
        }

        setIsProcessing(true);
        toast.loading("Procesando pago...");

        try {
            if (paymentType === "saved") {
                if (!savedCardSelection) {
                    throw new Error(
                        "Por favor, selecciona una tarjeta y completa el CVV.",
                    );
                }
                const { card, cvv } = savedCardSelection;

                const oneTimeToken = await PaymentService.createClonedCardToken(
                    card.cardToken,
                    cvv
                );

                if (isUpgrade) {
                    
                    const upgradeRequest = {
                        userId: user.id,
                        newPlanId: selectedPlan.id,
                        token: oneTimeToken.id,
                        installments: 1,
                        paymentMethodId: card.cardBrand.toLowerCase(),
                        identificationType: "DNI",
                        identificationNumber: member?.dni || "00000000",
                    };
                    const response = await PaymentService.processPlanUpgrade(upgradeRequest);
                    handlePaymentSuccess(response);
                } else {
                    
                    const paymentRequest = {
                        token: oneTimeToken.id,
                        externalReference: `SAVED_CARD_${user.id}_${Date.now()}`,
                        userId: user.id,
                        planId: selectedPlan.id,
                        amount: selectedPlan.price,
                        payerEmail: user.email,
                        payerFirstName: member?.firstName || "Usuario",
                        payerLastName: member?.lastName || "FitDesk",
                        description: `Pago con tarjeta guardada (${card.displayName})`,
                        installments: 1,
                        paymentMethodId: card.cardBrand.toLowerCase(),
                        identificationType: "DNI",
                        identificationNumber: member?.dni || "00000000",
                    };
                    const response = await PaymentService.processDirectPayment(paymentRequest);
                    handlePaymentSuccess(response);
                }
            } else {
                toast.info(
                    "Por favor, utiliza el formulario para añadir una nueva tarjeta.",
                );
                setIsProcessing(false);
            }
        } catch (error: any) {
            toast.error(
                error.message || "Ocurrió un error al procesar el pago.",
            );
        } finally {
            setIsProcessing(false);
        }
    };

    if (!selectedPlan)
        return <div className="text-center p-8">Cargando...</div>;

    return (
        <div className="container max-w-2xl mx-auto py-12">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Completa tu pago</CardTitle>
                    <p className="text-muted-foreground">
                        Estás a punto de suscribirte al plan:{" "}
                        <span className="font-bold text-primary">
                            {selectedPlan.name}
                        </span>
                    </p>
                </CardHeader>
                <CardContent className="space-y-8">
                    {savedCards && savedCards.length > 0 && (
                        <RadioGroup
                            value={paymentType}
                            onValueChange={(value: "new" | "saved") =>
                                setPaymentType(value)
                            }
                            className="grid grid-cols-2 gap-4"
                        >
                            <Label
                                htmlFor="r2"
                                className={cn(
                                    "flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground",
                                    paymentType === "saved" &&
                                        "border-primary bg-accent",
                                )}
                            >
                                <RadioGroupItem
                                    value="saved"
                                    id="r2"
                                    className="sr-only"
                                />
                                <Wallet className="mb-3 h-6 w-6" />
                                Tarjeta Guardada
                            </Label>
                            <Label
                                htmlFor="r1"
                                className={cn(
                                    "flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground",
                                    paymentType === "new" &&
                                        "border-primary bg-accent",
                                )}
                            >
                                <RadioGroupItem
                                    value="new"
                                    id="r1"
                                    className="sr-only"
                                />
                                <CreditCard className="mb-3 h-6 w-6" />
                                Nueva Tarjeta
                            </Label>
                        </RadioGroup>
                    )}

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={paymentType}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {paymentType === "new" ? (
                                <div>
                                    <h3 className="font-semibold mb-4">
                                        Ingresa los datos de tu nueva tarjeta
                                    </h3>
                                    <PaymentMethodForm />
                                    <p className="text-xs text-muted-foreground mt-4">
                                        Nota: La tarjeta se guardará en tu
                                        cuenta para futuros pagos.
                                    </p>
                                </div>
                            ) : (
                                <SavedCardSelector
                                    onSelectionChange={setSavedCardSelection}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {paymentType === "saved" && (
                        <Button
                            onClick={handleFinalSubmit}
                            disabled={isProcessing || !savedCardSelection}
                            className="w-full"
                        >
                            {isProcessing
                                ? "Procesando..."
                                : `Pagar S/ ${upgradeInfo?.upgradeCost ?? selectedPlan.price}`}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
