/** biome-ignore-all lint/complexity/noThisInStatic: <> */
/** biome-ignore-all lint/complexity/noStaticOnlyClass: <> */
import { fitdeskApi } from "../api/fitdeskApi";

import type {
  BillingDetails,
  BillingDetailsParams,
  BillingStatistics,
} from "../interfaces/billing.interface";

export class BillingService {
  private static readonly BASE_URL = "/billing/payments";

  static async getBillingDetails(
    params: BillingDetailsParams = {},
  ): Promise<BillingDetails> {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined)
      queryParams.append("page", params.page.toString());
    if (params.size !== undefined)
      queryParams.append("size", params.size.toString());
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.status) queryParams.append("status", params.status);
    if (params.paymentMethodId)
      queryParams.append("paymentMethodId", params.paymentMethodId);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    const url = `${this.BASE_URL}/details?${queryParams.toString()}`;
    try {
      const { data } = await fitdeskApi.get<BillingDetails>(url);
      return data;
    } catch (_) {
      throw new Error("Failed to fetch billing details");
    }
  }

  static async getDashboardStatistics(): Promise<BillingStatistics> {
    try {
      const { data } =
        await fitdeskApi.get<BillingStatistics>(`${this.BASE_URL}/statistics`);
      return data;
    } catch (_) {
      throw new Error("Failed to fetch dashboard statistics");
    }
  }
}
