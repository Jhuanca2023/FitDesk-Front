import type {
    CardData,
    CreatePaymentRequest,
    CreateTokenPaymentResponse,
    PaymentResponse,
    PlanUpgradeRequest,
    UpgradeCostResponse,
} from "../interfaces/payment.interface";
import { fitdeskApi } from "../api/fitdeskApi";

declare global {
    interface Window {
        MercadoPago: any;
    }
}

// biome-ignore lint/complexity/noStaticOnlyClass: <>
export class PaymentService {
    private static mp: any = null;
    private static publicKey: string =
        import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || "";

    static async initialize() {
        if (!this.mp) {
            await this.loadMercadoPagoScript();
            this.mp = new window.MercadoPago(this.publicKey, {
                locale: "es-PE",
            });
        }
        return this.mp;
    }

    private static loadMercadoPagoScript(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (window.MercadoPago) {
                resolve();
                return;
            }

            const script = document.createElement("script");
            script.src = "https://sdk.mercadopago.com/js/v2";
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () =>
                reject(new Error("Error cargando SDK de Mercado Pago"));
            document.body.appendChild(script);
        });
    }
    static async calculateUpgradeCost(userId: string, newPlanId: string): Promise<UpgradeCostResponse> {
        try {
            const response = await fitdeskApi.post<UpgradeCostResponse>(
                "/billing/payments/calculate-upgrade-cost",
                {
                    userId,
                    newPlanId
                }
            );
            return response.data;
        } catch (error: any) {
            console.error("Error calculando costo de upgrade:", error);
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error("Error al calcular el costo del upgrade");
        }
    }

    static async createCardToken(
        cardData: CardData
    ): Promise<CreateTokenPaymentResponse> {
        await this.initialize();

        try {

            const cardToken = await this.mp.createCardToken({
                cardNumber: cardData.cardNumber,
                cardholderName: cardData.cardholderName,
                cardExpirationMonth: cardData.cardExpirationMonth,
                cardExpirationYear: cardData.cardExpirationYear,
                securityCode: cardData.securityCode,
                identificationType: cardData.identificationType,
                identificationNumber: cardData.identificationNumber,
            });

            console.log("✅ Token creado exitosamente:", cardToken.id);
            return cardToken;
        } catch (error: any) {
            console.error(" Error detallado creando token:", error);

            // Manejo específico de errores de MP
            if (error.message?.includes("primary field")) {
                throw new Error("Error de configuración del SDK. Intenta de nuevo.");
            }

            if (error.cause?.length > 0) {
                const firstError = error.cause[0];
                throw new Error(`Error en ${firstError.field}: ${firstError.message}`);
            }

            throw new Error(error.message || "Error al procesar la tarjeta");
        }
    }

    static async detectPaymentMethod(bin: string): Promise<string> {
        try {
            await this.initialize();
            const paymentMethods = await this.mp.getPaymentMethods({ bin });

            if (paymentMethods.results && paymentMethods.results.length > 0) {
                return paymentMethods.results[0].id;
            }

            return "visa";
        } catch (error) {
            console.warn("Error detectando método de pago:", error);
            return "visa";
        }
    }

    static async processDirectPayment(paymentData: CreatePaymentRequest): Promise<PaymentResponse> {
        try {
            const response = await fitdeskApi.post<PaymentResponse>(
                "/billing/payments/process",
                paymentData
            );
            return response.data;
        } catch (error: any) {
            console.error("Error procesando pago:", error);

            if (error.message) {
                throw new Error(error.message);
            }

            throw new Error("Error de conexión con el servidor");
        }
    }
    // --- NUEVO MÉTODO PARA EL UPGRADE ---
    static async processPlanUpgrade(paymentData: PlanUpgradeRequest): Promise<PaymentResponse> {
        try {
            const response = await fitdeskApi.post<PaymentResponse>(
                "/billing/payments/upgrade-plan",
                paymentData
            );
            return response.data;
        } catch (error: any) {
            console.error("Error procesando upgrade de plan:", error);
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            if (error.message) {
                throw new Error(error.message);
            }
            throw new Error("Error de conexión con el servidor al actualizar el plan");
        }
    }

    static async getPaymentStatus(externalReference: string) {
        try {
            const response = await fitdeskApi.get(
                `/billing/payments/status/${externalReference}`
            );
            return response.data;
        } catch (error: any) {
            console.error("Error consultando estado:", error);
            throw new Error(error.message || "Error al consultar estado del pago");
        }
    }


    static async getPaymentMethods() {
        try {
            await this.initialize();
            return await this.mp.getPaymentMethods();
        } catch (error) {
            console.error("Error obteniendo métodos de pago:", error);
            return { results: [] };
        }
    }

    static async getCardInfo(bin: string) {
        try {
            await this.initialize();
            return await this.mp.getPaymentMethods({ bin });
        } catch (error) {
            console.error("Error obteniendo info de tarjeta:", error);
            return { results: [] };
        }
    }
  static async createClonedCardToken(
    cardId: string,
    securityCode: string
  ): Promise<{ id: string }> {
    await this.initialize();

    try {
      const clonedToken = await this.mp.createCardToken({
        cardId: cardId,
        securityCode: securityCode,
      });
      
      console.log("✅ Token clonado para pago creado:", clonedToken.id);
      return clonedToken;
    } catch (error: any) {
      console.error("Error creando token clonado:", error);
      if (error.cause?.length > 0) {
        const firstError = error.cause[0];
        if (firstError.code === "E302") {
             throw new Error("El código de seguridad (CVV) es incorrecto.");
        }
        throw new Error(`Error en la tarjeta guardada: ${firstError.message}`);
      }
      throw new Error(error.message || "Error al verificar el CVV de la tarjeta");
    }
  }
}
