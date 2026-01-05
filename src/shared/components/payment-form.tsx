/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { CardDesing } from "./ui/card-desing";
import { Field, FieldLabel, FieldLegend, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import { motion } from "motion/react";
import type { PlanResponse } from "@/core/interfaces/plan.interface";
import type { PaymentResponse, UpgradeCostResponse } from "@/core/interfaces/payment.interface"; // ✅ ACTUALIZADO
import { CheckCircle, CreditCard, Lock, Shield, ArrowUpCircle } from "lucide-react"; // ✅ AÑADIDO ArrowUpCircle
import { usePaymentForm } from "@/core/hooks/use-payment-form";
import { Badge } from "./ui/badge"; // ✅ AÑADIDO

interface PaymentFormProps {
  userId: string;
  userEmail: string;
  plan: PlanResponse;
  onPaymentSuccess: (paymentData: PaymentResponse) => void;
  isProcessingPayment?: boolean;
  isUpgrade: boolean;
  upgradeInfo?: UpgradeCostResponse | null; // ✅ NUEVO
}

const PaymentForm = ({
  userId,
  userEmail,
  plan,
  onPaymentSuccess,
  isProcessingPayment,
  isUpgrade,
  upgradeInfo, // ✅ NUEVO
}: PaymentFormProps) => {
  const {
    formData,
    cardRef,
    cardType,
    isSubmitting,
    handleCardNumberChange,
    onExpChange,
    onCcvChange,
    onDniChange,
    toggleBackCard,
    showBackCard,
    hideBackCard,
    handleSubmit,
    getCardGradient,
  } = usePaymentForm({
    userId,
    userEmail,
    plan,
    onPaymentSuccess,
    isUpgrade,
    upgradeInfo, 
  });

  const getDisplayAmount = () => {
    return isUpgrade && upgradeInfo ? upgradeInfo.upgradeCost : plan.price;
  };

  const CardLogo = CardDesing[cardType];
  
  if (isProcessingPayment) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center py-16 px-4"
      >
        <div className="rounded-full bg-green-100 p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">¡Pago exitoso!</h2>
        <p className="text-muted-foreground mb-8">
          Tu membresía ha sido {isUpgrade ? "actualizada" : "activada"} correctamente. Estamos
          redireccionándote...
        </p>
        <div className="flex items-center justify-center">
          <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5 }}
            />
          </div>
        </div>
      </motion.div>
    );
  }
  
  return (
    <>
      <style>{`
        .creditCard { transform-style: preserve-3d; transition: transform 0.5s; }
        .creditCard.seeBack { transform: rotateY(-180deg); }
        .cardFace { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .cardBack { transform: rotateY(180deg); }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="relative mx-auto max-w-2xl text-center">
          <div
            className="absolute -top-6 -z-10 transform-gpu blur-3xl"
            aria-hidden="true"
          >
            <div className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-r from-orange-500 to-red-500 opacity-25" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {isUpgrade ? (
              <span className="flex items-center justify-center gap-3">
                <ArrowUpCircle className="h-8 w-8 text-orange-500" />
                Actualizar a {plan.name}
              </span>
            ) : (
              plan.name
            )}
          </h2>
          <p className="mt-2 text-lg leading-8 text-muted-foreground">
            {plan.description}
          </p>
          {isUpgrade && upgradeInfo && (
            <Badge variant="secondary" className="mt-4 text-sm px-4 py-1">
              Solo pagas la diferencia prorrateada por {upgradeInfo.daysRemaining} días
            </Badge>
          )}
        </div>
      </motion.div>

      <Card className="w-full max-w-6xl mx-auto border border-border/40 bg-card/80 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b border-border/10 bg-muted/50">
          <CardTitle className="flex items-center gap-3">
            <div className="rounded-full p-2 bg-orange-500/10 text-orange-500">
              <Lock className="h-5 w-5" />
            </div>
            <span>Información de Pago Seguro</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-green-500" />
            Todas las transacciones son seguras y encriptadas
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col lg:flex-row gap-8"
          >
            <div className="w-full lg:w-1/2 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <FieldSet className="bg-card rounded-lg border border-border/50 p-4">
                  <FieldLegend className="bg-background px-2 text-foreground">
                    Datos de la Tarjeta
                  </FieldLegend>

                  <Field className="mb-4">
                    <FieldLabel htmlFor="card-number" className="font-medium">
                      Número de Tarjeta
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id="card-number"
                        type="text"
                        onFocus={hideBackCard}
                        onClick={hideBackCard}
                        value={formData.cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        maxLength={19}
                        placeholder="XXXX XXXX XXXX XXXX"
                        className="pl-10"
                        required
                      />
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>

                    {cardType !== "unknown" && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs mt-1.5 flex items-center gap-2"
                      >
                        <span className="font-semibold capitalize text-foreground">
                          {cardType}
                        </span>
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Tarjeta detectada
                        </span>
                      </motion.div>
                    )}
                  </Field>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                
                    <div className="grid grid-cols-2 gap-2">
                      <Field>
                        <FieldLabel htmlFor="card-date" className="font-medium">
                          Fecha de Exp.
                        </FieldLabel>
                        <Input
                          id="card-date"
                          type="text"
                          value={formData.expDate}
                          onChange={onExpChange}
                          onFocus={hideBackCard}
                          onClick={hideBackCard}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="card-ccv" className="font-medium">
                          CCV
                        </FieldLabel>
                        <Input
                          id="card-ccv"
                          type="text"
                          value={formData.ccv}
                          onChange={onCcvChange}
                          onFocus={showBackCard}
                          onClick={showBackCard}
                          placeholder="•••"
                          maxLength={3}
                          required
                        />
                      </Field>
                    </div>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="dni" className="font-medium">
                      DNI del Titular
                    </FieldLabel>
                    <Input
                      id="dni"
                      type="text"
                      value={formData.dni}
                      onChange={onDniChange}
                      onFocus={hideBackCard}
                      onClick={hideBackCard}
                      placeholder="12345678"
                      maxLength={9}
                      required
                    />
                  </Field>
                </FieldSet>
              </motion.div>
            </div>

            {/* Columna derecha - Previsualización de tarjeta */}
            <div className="w-full lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                ref={cardRef}
                className={`creditCard relative h-56 mx-auto max-w-sm ${
                  formData.showBack ? "seeBack" : ""
                }`}
                onClick={toggleBackCard}
              >
                {/* Frente de la tarjeta */}
                <div
                  className={`absolute w-full h-56 rounded-2xl text-white shadow-2xl cardFace p-6 flex flex-col justify-between overflow-hidden bg-gradient-to-br ${getCardGradient()}`}
                >
                  <div className="absolute inset-0 bg-[url('/card-pattern.svg')] opacity-10"></div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <div className="h-12 w-12 rounded-md bg-white/20 p-2 backdrop-blur-sm">
                          <div className="h-full w-full rounded bg-white/80"></div>
                        </div>
                      </div>
                      <CardLogo />
                    </div>

                    <div className="flex items-center gap-2 mt-6 mb-8">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-inner"></div>
                      <div className="flex-1 opacity-90">
                        <div className="h-0.5 bg-white/20 mb-1"></div>
                        <div className="h-0.5 bg-white/20"></div>
                      </div>
                    </div>

                    {/* Número de tarjeta */}
                    <div className="mb-6">
                      <div>
                        <p className="font-mono text-xl tracking-[0.2em] mb-1">
                          {formData.cardNumber || "•••• •••• •••• ••••"}
                        </p>
                      </div>

                      {/* Nombre y Fecha */}
                      <div className="flex justify-between items-end">
                        <div className="flex-1">
                          <p className="text-[10px] opacity-70 mb-1">TITULAR</p>
                          <p className="font-semibold text-sm tracking-wider uppercase">
                            {formData.cardName || "NOMBRE APELLIDO"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] opacity-70 mb-1">VENCE</p>
                          <p className="font-semibold text-sm tracking-wider">
                            {formData.expDate || "MM/YY"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reverso de la tarjeta */}
                  <div
                    className={`absolute w-full h-56 rounded-2xl text-white shadow-2xl cardFace cardBack overflow-hidden bg-gradient-to-br ${getCardGradient()}`}
                  >
                    <div className="w-full h-full flex flex-col">
                      {/* Banda magnética */}
                      <div className="bg-black h-12 mt-6"></div>

                      {/* CCV */}
                      <div className="px-6 mt-4 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex-1 h-10 bg-white rounded"></div>
                          <div className="bg-white text-black flex items-center justify-center w-16 h-10 font-bold rounded text-sm">
                            {formData.ccv || "•••"}
                          </div>
                        </div>
                        <p className="text-[10px] opacity-70 text-right">
                          CÓDIGO DE SEGURIDAD
                        </p>

                        {/* Logo en reverso */}
                        <div className="flex justify-end mt-4">
                          <CardLogo />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-end gap-4 p-6 border-t border-border/10 bg-muted/30">
          <Button
            type="button"
            variant="outline"
            className="transition-all duration-200"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white transition-all duration-300 shadow-md hover:shadow-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="h-5 w-5 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                Procesando...
              </>
            ) : (
              <>
                {isUpgrade && <ArrowUpCircle className="mr-2 h-5 w-5" />}
                <span>{isUpgrade ? "Actualizar Plan" : "Confirmar Pago"}</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 max-w-6xl mx-auto"
      >
        <Card className="border border-border/40 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              {isUpgrade && <ArrowUpCircle className="h-5 w-5 text-orange-500" />}
              {isUpgrade ? "Resumen del Upgrade" : "Resumen del Plan"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between py-1 text-sm">
                <span className="text-muted-foreground">
                  {isUpgrade ? "Nuevo Plan:" : "Plan:"}
                </span>
                <span className="font-medium">{plan.name}</span>
              </div>
              
              {isUpgrade && upgradeInfo ? (
                <>
                  <div className="flex justify-between py-1 text-sm">
                    <span className="text-muted-foreground">Precio original:</span>
                    <span className="font-medium line-through text-muted-foreground">
                      {new Intl.NumberFormat("es-PE", {
                        style: "currency",
                        currency: "PEN",
                      }).format(plan.price)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 text-sm">
                    <span className="text-muted-foreground">Crédito aplicado:</span>
                    <span className="font-medium text-green-600">
                      -{new Intl.NumberFormat("es-PE", {
                        style: "currency",
                        currency: "PEN",
                      }).format(upgradeInfo.unusedCredit)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 text-sm">
                    <span className="text-muted-foreground">Días restantes:</span>
                    <span className="font-medium">{upgradeInfo.daysRemaining} días</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between py-1 text-sm">
                    <span className="text-muted-foreground">Precio:</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat("es-PE", {
                        style: "currency",
                        currency: "PEN",
                      }).format(plan.price)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 text-sm">
                    <span className="text-muted-foreground">Duración:</span>
                    <span className="font-medium">{plan.durationMonths} meses</span>
                  </div>
                </>
              )}
              
              <div className="border-t border-border mt-2 pt-2">
                <div className="flex justify-between text-base font-semibold">
                  <span>Total a pagar:</span>
                  <span className="text-orange-600">
                    {new Intl.NumberFormat("es-PE", {
                      style: "currency",
                      currency: "PEN",
                    }).format(getDisplayAmount())}
                  </span>
                </div>
                {isUpgrade && upgradeInfo && (
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    Pago único por actualización
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default PaymentForm;
