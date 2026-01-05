/** biome-ignore-all lint/complexity/noStaticOnlyClass: <> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import { fitdeskApi } from "../api/fitdeskApi";
import type {
  PlanResponse,
  CreatePlanRequest,
  UpdatePlanRequest,
} from "../interfaces/plan.interface";

export class PlanService {
  static async getActivePlans(): Promise<PlanResponse[]> {
    try {
      const response = await fitdeskApi.get<PlanResponse[]>(
        `/billing/plans/active`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error obteniendo planes activos:", error);
      throw new Error(error.message || "Error al obtener planes activos");
    }
  }

  static async getAllPlans(): Promise<PlanResponse[]> {
    try {
      const response = await fitdeskApi.get<PlanResponse[]>("/billing/plans");
      return response.data;
    } catch (error: any) {
      console.error("Error obteniendo todos los planes:", error);
      throw new Error(error.message || "Error al obtener los planes");
    }
  }

  static async getPlanById(id: string): Promise<PlanResponse> {
    try {
      const response = await fitdeskApi.get<PlanResponse>(
        `/billing/plans/${id}`
      );
      return response.data;
    } catch (error: any) {
      console.error(`Error obteniendo plan con ID ${id}:`, error);
      throw new Error(error.message || "Error al obtener el plan");
    }
  }

  static async createPlan(planData: CreatePlanRequest, billingImage?: File): Promise<PlanResponse> {
    try {

      const formData = new FormData();
      formData.append("plan", new Blob([JSON.stringify(planData)], { type: 'application/json' }));
      if (billingImage) {
        formData.append("billingImage", billingImage);
      }

      const response = await fitdeskApi.post<PlanResponse>(
        `/billing/plans`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error creando plan:", error);
      throw new Error(error.message || "Error al crear el plan");
    }
  }

  static async updatePlan(
    id: string,
    planData?: UpdatePlanRequest,
    billingImage?: File
  ): Promise<PlanResponse> {
    try {
      const formData = new FormData();
      if (planData) {
        formData.append("planReq", new Blob([JSON.stringify(planData)], { type: 'application/json' }));
      }
      if (billingImage) {
        formData.append("billingImage", billingImage);
      }

      const response = await fitdeskApi.patch<PlanResponse>(
        `/billing/plans/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(`Error actualizando plan con ID ${id}:`, error);
      throw new Error(error.message || "Error al actualizar el plan");
    }
  }

  static async deletePlan(id: string): Promise<void> {
    try {
      await fitdeskApi.delete(`/billing/plans/${id}`);
    } catch (error: any) {
      console.error(`Error eliminando plan con ID ${id}:`, error);
      throw new Error(error.message || "Error al eliminar el plan");
    }
  }

  static async getPopularPlans(): Promise<PlanResponse[]> {
    try {
      const plans = await this.getActivePlans();
      return plans.filter((plan) => plan.isPopular);
    } catch (error: any) {
      console.error("Error obteniendo planes populares:", error);
      throw new Error(error.message || "Error al obtener planes populares");
    }
  }

  static async getPlansByPriceRange(
    minPrice: number,
    maxPrice: number
  ): Promise<PlanResponse[]> {
    try {
      const plans = await this.getActivePlans();
      return plans.filter(
        (plan) => plan.price >= minPrice && plan.price <= maxPrice
      );
    } catch (error: any) {
      console.error("Error filtrando planes por precio:", error);
      throw new Error(error.message || "Error al filtrar planes por precio");
    }
  }

  static async getPlansByDuration(months: number): Promise<PlanResponse[]> {
    try {
      const plans = await this.getActivePlans();
      return plans.filter((plan) => plan.durationMonths === months);
    } catch (error: any) {
      console.error("Error filtrando planes por duración:", error);
      throw new Error(error.message || "Error al filtrar planes por duración");
    }
  }

  static async uploadPlanImage(planId: string, file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fitdeskApi.post<{ url: string }>(
        `/billing/plans/${planId}/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error(`Error subiendo imagen para plan ${planId}:`, error);
      throw new Error(error.message || "Error al subir imagen del plan");
    }
  }

  static async deletePlanImage(planId: string): Promise<boolean> {
    try {
      const res = await fitdeskApi.delete(`/billing/plans/${planId}/image`);
      return res.status === 204 || res.status === 200;
    } catch (error: any) {
      console.error(`Error eliminando imagen del plan ${planId}:`, error);
      return false;
    }
  }
}
