import { Card, CardContent } from "@/shared/components/ui/card";
import { PaymentMethodForm } from "./PaymentMethodForm";
import { PaymentMethodList } from "./PaymentMethodList";

export function SavedCardsPage() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Tarjetas Guardadas</h2>
            <PaymentMethodList />
          </div>
          <div>
            <h2 className="mb-4 text-xl font-semibold">Añadir Nueva Tarjeta</h2>
            <PaymentMethodForm />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
