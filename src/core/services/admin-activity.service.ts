import { fitdeskApi } from "../api/fitdeskApi";
import { MemberService } from "./member.service";

export type ActivityItem = {
  type: 'user' | 'class' | 'payment';
  title: string;
  subtitle: string;
  occurredAt?: string;
};

function toISOOrUndefined(v: any): string | undefined {
  if (!v) return undefined;
  try {
    const d = new Date(v);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
  } catch { return undefined; }
}

export class AdminActivityService {
  static async fetchRecentUsers(limit = 3): Promise<ActivityItem[]> {
    try {
      const res = await MemberService.getAllMembers({ page: 0, size: limit, sortField: 'createdAt', sortDirection: 'desc' });
      const members = Array.isArray((res as any)?.members) ? (res as any).members : [];
      return members.slice(0, limit).map((m: any) => ({
        type: 'user',
        title: 'Nuevo usuario registrado',
        subtitle: `${m.firstName ?? ''} ${m.lastName ?? ''}`.trim() || (m.email ?? ''),
        occurredAt: toISOOrUndefined((m as any).createdAt),
      }));
    } catch {
      return [];
    }
  }

  static async fetchRecentClasses(limit = 3): Promise<ActivityItem[]> {
    try {
      const { data } = await fitdeskApi.get<any[]>(`/classes/classes`);
      const list = Array.isArray(data) ? data : [];
      const last = list.slice(-limit).reverse();
      return last.map((c: any) => ({
        type: 'class',
        title: 'Clase creada',
        subtitle: String(c?.className ?? c?.name ?? c?.id ?? 'Clase'),
        occurredAt: toISOOrUndefined(c?.createdAt ?? c?.classDate),
      }));
    } catch { return []; }
  }

  static async fetchRecentPayments(limit = 3): Promise<ActivityItem[]> {
    try {
      const { data } = await fitdeskApi.get<any>(`/billing/payments/details?page=0&size=${limit}&sort=paymentDate,desc&status=approved`);
      const content = Array.isArray((data as any)?.content) ? (data as any).content : (Array.isArray(data) ? data : []);
      return content.slice(0, limit).map((p: any) => ({
        type: 'payment',
        title: 'Pago realizado',
        subtitle: String(p?.payerEmail ?? p?.userEmail ?? p?.payerName ?? p?.id ?? 'Pago'),
        occurredAt: toISOOrUndefined(p?.paymentDate ?? p?.paidAt ?? p?.createdAt),
      }));
    } catch { return []; }
  }

  static async getRecentActivity(limit = 3): Promise<ActivityItem[]> {
    const [users, classes, payments] = await Promise.all([
      this.fetchRecentUsers(limit),
      this.fetchRecentClasses(limit),
      this.fetchRecentPayments(limit),
    ]);

    const all = [...users, ...classes, ...payments];
   
    all.sort((a, b) => {
      const ta = a.occurredAt ? new Date(a.occurredAt).getTime() : 0;
      const tb = b.occurredAt ? new Date(b.occurredAt).getTime() : 0;
      return tb - ta;
    });
    return all.slice(0, limit);
  }
}


