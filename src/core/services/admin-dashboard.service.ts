import { fitdeskApi } from "../api/fitdeskApi";

export interface RevenueSummary {
  totalRevenue: number;
  currency?: string;
}

export interface MonthlyRevenueComparison {
  current: number;
  previous: number;
  currency?: string;
}

export interface ClassesSummary {
  active: number;
  inactive: number;
  total: number;
}

export class AdminDashboardService {
  static async getRevenueSummary(): Promise<RevenueSummary> {
    try {
      const { data } = await fitdeskApi.get<RevenueSummary>("/billing/metrics/summary");
      return {
        totalRevenue: Number((data as any)?.totalRevenue ?? 0),
        currency: (data as any)?.currency ?? "USD",
      };
    } catch {
      return { totalRevenue: 0, currency: "USD" };
    }
  }

  static async getClassesSummary(): Promise<ClassesSummary> {

    try {
      const { data } = await fitdeskApi.get<any[]>("/classes/classes");
      const list = Array.isArray(data) ? data : [];
      const total = list.length;
      const active = list.filter((c: any) => c?.active === true).length;
      const inactive = Math.max(0, total - active);
      return { active, inactive, total };
    } catch {}


    try {
      const { data } = await fitdeskApi.get<any>("/classes/stadistic/summary");
      const active = Number((data as any)?.active ?? 0);
      const inactive = Number((data as any)?.inactive ?? 0);
      const total = Number((data as any)?.total ?? active + inactive);
      return { active, inactive, total };
    } catch {}


    try {
      const { data } = await fitdeskApi.get<any[]>(`/classes/stadistic/my-classes/stats`);
      if (!Array.isArray(data)) return { active: 0, inactive: 0, total: 0 };

      const normalizeStatus = (s?: string) => {
        if (!s) return '';
        const u = String(s).toUpperCase().trim();
        if (u.includes('CANCEL')) return 'CANCELADA';
        if (u.includes('COMPLET')) return 'COMPLETADA';
        if (u.includes('PROGRES') || u.includes('PROCES')) return 'EN_PROCESO';
        return 'PROGRAMADA';
      };

      const total = data.length;
      const active = data.filter((c: any) => normalizeStatus(c.status) !== 'CANCELADA').length;
      const inactive = Math.max(0, total - active);
      return { active, inactive, total };
    } catch {}


    try {
      const { data } = await fitdeskApi.get<any>(`/classes/classes/paginated?page=0&size=1000`);
      const content = Array.isArray((data as any)?.content) ? (data as any).content : [];
      const normalizeStatus = (s?: string) => {
        if (!s) return '';
        const u = String(s).toUpperCase().trim();
        if (u.includes('CANCEL')) return 'CANCELADA';
        if (u.includes('COMPLET')) return 'COMPLETADA';
        if (u.includes('PROGRES') || u.includes('PROCES')) return 'EN_PROCESO';
        return 'PROGRAMADA';
      };
      const total = content.length;
      const active = content.filter((c: any) => (c.active === true) && normalizeStatus(c.status) !== 'CANCELADA').length;
      const inactive = Math.max(0, total - active);
      return { active, inactive, total };
    } catch {}

    return { active: 0, inactive: 0, total: 0 };
  }

  static async getMonthlyRevenueComparison(): Promise<MonthlyRevenueComparison> {
    try {
      const { data } = await fitdeskApi.get<any>(`/billing/metrics/monthly-summary`);
      return {
        current: Number((data as any)?.current ?? 0),
        previous: Number((data as any)?.previous ?? 0),
        currency: (data as any)?.currency ?? 'USD',
      };
    } catch {
      return { current: 0, previous: 0, currency: 'USD' };
    }
  }
}
