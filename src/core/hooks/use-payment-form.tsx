import { useState, useRef } from "react";
import { PaymentService } from "@/core/services/payment.service";
import type {
  CreatePaymentRequest,
  PaymentResponse,
  PlanUpgradeRequest,
  UpgradeCostResponse,
} from "@/core/interfaces/payment.interface";
import type { PlanResponse } from "@/core/interfaces/plan.interface";
import { toast } from "@/shared/components/ui/toast-provider";

export type CardType = "visa" | "mastercard" | "amex" | "discover" | "unknown";

export interface PaymentFormData {
  cardNumber: string;
  cardName: string;
  expDate: string;
  ccv: string;
  dni: string;
  comments: string;
  showBack: boolean;
}

export function usePaymentForm(options: {
  userId: string;
  userEmail: string;
  plan: PlanResponse;
  onPaymentSuccess: (data: PaymentResponse) => void;
  isUpgrade: boolean;
  upgradeInfo?: UpgradeCostResponse | null; 
}) {
  const { userId, userEmail, plan, onPaymentSuccess, isUpgrade, upgradeInfo } = options; 
  const [detectedPaymentMethod, setDetectedPaymentMethod] = useState("visa");
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: "",
    cardName: "APRO",
    expDate: "",
    ccv: "",
    dni: "",
    comments: "",
    showBack: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleInputChange = (
    field: keyof PaymentFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleBackCard = () =>
    handleInputChange("showBack", !formData.showBack);
  const showBackCard = () => handleInputChange("showBack", true);
  const hideBackCard = () => handleInputChange("showBack", false);

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpDate = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return digits.slice(0, 2) + "/" + digits.slice(2);
  };

  const formatCcv = (value: string) => value.replace(/\D/g, "").slice(0, 3);
  const formatDni = (value: string) => value.replace(/\D/g, "").slice(0, 9);

  const onExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpDate(e.target.value);
    handleInputChange("expDate", formatted || "");
  };

  const onCcvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCcv(e.target.value);
    handleInputChange("ccv", formatted || "");
  };

  const onDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDni(e.target.value);
    handleInputChange("dni", formatted || "");
  };

  const detectCardType = (number: string): CardType => {
    const cleaned = number.replace(/\s/g, "");
    if (/^4/.test(cleaned)) return "visa";
    if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return "mastercard";
    if (/^3[47]/.test(cleaned)) return "amex";
    if (/^6(?:011|5)/.test(cleaned)) return "discover";
    return "unknown";
  };

  const cardType = detectCardType(formData.cardNumber);

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    const cleanNumber = formatted.replace(/\s/g, "");
    setFormData((prev) => ({ ...prev, cardNumber: cleanNumber }));

    if (cleanNumber.length >= 6) {
      const bin = cleanNumber.substring(0, 6);
      PaymentService.detectPaymentMethod(bin)
        .then((method) => {
          console.log("🔍 Método de pago detectado:", method);
          setDetectedPaymentMethod(method);
        })
        .catch((err) => console.warn("Error detectando método:", err));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
        const expMonth = formData.expDate.slice(0, 2);
        const expYear = formData.expDate.slice(3, 5);
        const fullYear = expYear.length === 2 ? `20${expYear}` : expYear;

        const cardToken = await PaymentService.createCardToken({
            cardNumber: formData.cardNumber,
            cardholderName: formData.cardName,
            cardExpirationMonth: expMonth,
            cardExpirationYear: fullYear,
            securityCode: formData.ccv,
            identificationType: "DNI",
            identificationNumber: formData.dni,
        });

      let paymentResponse: PaymentResponse;

      if (isUpgrade) {
        console.log("Iniciando proceso de Upgrade de Plan...");
        console.log("Usando costo prorrateado:", upgradeInfo?.upgradeCost); 
        
        const upgradeRequest: PlanUpgradeRequest = {
          userId,
          newPlanId: plan.id,
          token: cardToken.id,
          installments: 1,
          paymentMethodId: detectedPaymentMethod,
          identificationType: "DNI",
          identificationNumber: formData.dni,
        };
        paymentResponse = await PaymentService.processPlanUpgrade(upgradeRequest);
      } else {
        console.log("💳 Procesando pago para nueva membresía...");
        const externalReference = `MEMBERSHIP_${userId}_${Date.now()}`;
        const paymentRequest: CreatePaymentRequest = {
          externalReference,
          userId,
          planId: plan.id,
          amount: plan.price, 
          payerEmail: userEmail,
          payerFirstName: formData.cardName.split(" ")[0],
          payerLastName: formData.cardName.split(" ").slice(1).join(" ") || "N/A",
          description: `Membresía ${plan.name} - FitDesk`,
          token: cardToken.id,
          installments: 1,
          paymentMethodId: detectedPaymentMethod,
          identificationType: "DNI",
          identificationNumber: formData.dni,
        };
        paymentResponse = await PaymentService.processDirectPayment(paymentRequest);
      }
      console.log("✅ Proceso de pago finalizado en backend:", paymentResponse);

      if (paymentResponse.status === "approved") {
        toast.success(
          `¡${isUpgrade ? "Upgrade" : "Pago"} exitoso! Tu membresía ha sido ${isUpgrade ? "actualizada" : "activada"}.`,
        );
        onPaymentSuccess(paymentResponse);
      } else if (paymentResponse.status === "pending") {
        toast.info(
          "Tu pago está pendiente. Te notificaremos cuando se complete.",
        );
        onPaymentSuccess(paymentResponse);
      } else {
        throw new Error(
          `Pago ${paymentResponse.status}: ${paymentResponse.statusDetail}`,
        );
      }
    } catch (error: any) {
      console.error(" Error procesando pago:", error);
      toast.error(`Error al procesar el pago: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCardGradient = () => {
    switch (cardType) {
      case "visa":
        return "from-blue-700 via-blue-800 to-blue-900";
      case "mastercard":
        return "from-slate-800 via-slate-900 to-black";
      case "amex":
        return "from-blue-600 via-blue-700 to-blue-800";
      case "discover":
        return "from-orange-600 via-orange-700 to-orange-800";
      default:
        return "from-slate-700 via-slate-800 to-slate-900";
    }
  };

  const getDisplayAmount = () => {
    return isUpgrade && upgradeInfo ? upgradeInfo.upgradeCost : plan.price;
  };

  return {
    formData,
    cardRef,
    cardType,
    isSubmitting,
    detectedPaymentMethod,
    handleInputChange,
    handleCardNumberChange,
    onExpChange,
    onCcvChange,
    onDniChange,
    toggleBackCard,
    showBackCard,
    hideBackCard,
    handleSubmit,
    getCardGradient,
    getDisplayAmount,
    upgradeInfo,
  };
}
