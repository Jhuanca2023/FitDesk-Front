import { fitdeskApi } from "../api/fitdeskApi";

export interface MonthlyPoint {
  monthKey: string;
  label: string;
  value: number;
}

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabelEs(d: Date): string {
  return d.toLocaleString('es-PE', { month: 'short' }).replace('.', '');
}

export class AdminRevenueService {
  static async getLast6MonthsSeries(): Promise<MonthlyPoint[]> {
    const now = new Date();
    const months: { key: string; date: Date }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ key: monthKey(d), date: d });
    }

    let payments: any[] = [];
    try {
      const { data } = await fitdeskApi.get<any>(`/billing/payments/details?page=0&size=500&sort=paymentDate,desc&status=approved`);
      const content = Array.isArray((data as any)?.content) ? (data as any).content : (Array.isArray(data) ? data : []);
      payments = content;
    } catch {}

    const totals: Record<string, number> = {};
    months.forEach(m => (totals[m.key] = 0));

    payments.forEach((p: any) => {
      const ts = p?.paymentDate || p?.paidAt || p?.createdAt || p?.date || p?.timestamp;
      const amount = Number(p?.amount || p?.totalAmount || p?.total || 0);
      if (!ts || !isFinite(amount)) return;
      const d = new Date(ts);
      if (isNaN(d.getTime())) return;
      const key = monthKey(new Date(d.getFullYear(), d.getMonth(), 1));
      if (key in totals) totals[key] += amount;
    });

    return months.map(m => ({
      monthKey: m.key,
      label: monthLabelEs(m.date),
      value: totals[m.key] || 0,
    }));
  }
}


