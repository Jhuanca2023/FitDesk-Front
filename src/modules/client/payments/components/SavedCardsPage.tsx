import { Card, CardContent } from "@/shared/components/ui/card";
import { PaymentMethodForm } from "./PaymentMethodForm";
import { PaymentMethodList } from "./PaymentMethodList";

export function SavedCardsPage() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center lg:text-left">Tarjetas Guardadas</h2>
            <PaymentMethodList />
          </div>
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Añadir Nueva Tarjeta</h2>
            <PaymentMethodForm />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
