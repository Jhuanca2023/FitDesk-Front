export interface CreateTokenPaymentResponse {
  id: string;
  first_six_digits: string;
  last_four_digits: string;
  expiration_month: number;
  expiration_year: number;
}

export interface CardData {
  cardNumber: string;
  cardholderName: string;
  cardExpirationMonth: string;
  cardExpirationYear: string;
  securityCode: string;
  identificationType: string;
  identificationNumber: string;
}
export interface UpgradeCostResponse {
  originalPrice: number;
  upgradeCost: number;
  unusedCredit: number;
  daysRemaining: number;
  newPlanName: string;
  newPlanDescription: string;
}

export interface CreatePaymentRequest {
  externalReference: string;
  userId: string;
  planId: string;
  amount: number;
  payerEmail: string;
  payerFirstName: string;
  payerLastName: string;
  description: string;
  token: string;
  installments: number;
  paymentMethodId: string;
  identificationType: string;
  identificationNumber: string;
}

export interface PaymentResponse {
  authorizationCode: string;
  currencyId: string;
  dateApproved: string;
  dateCreated: string;
  externalReference: string;
  paymentId: number;
  paymentMethodId: string;
  paymentTypeId: string;
  status: STATUS_PAYMENT;
  statusDetail: string;
  transactionAmount: number;
  transactionId: string;
}
export interface PlanUpgradeRequest {
  userId: string;
  newPlanId: string;
  token: string;
  installments: number;
  paymentMethodId: string;
  identificationType: string;
  identificationNumber: string;
}
export type STATUS_PAYMENT = "approved" | "pending" | "rejected";
