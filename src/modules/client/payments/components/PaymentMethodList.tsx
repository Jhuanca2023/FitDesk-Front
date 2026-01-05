import { useEffect } from "react";
import { usePaymentMethods } from "../hooks/usePaymentMethods";
import { usePaymentMethodStore } from "../store/usePaymentMethodStore";
import { Button } from "@/shared/components/ui/button";
import { Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { FlippableCard } from "./flippable-card";

export function PaymentMethodList() {
    const { useFetchCards, useDeleteCard, useUpdateCard } = usePaymentMethods();
    const { data: cards, isLoading, isError, error } = useFetchCards();
    const { mutate: deleteCard } = useDeleteCard();
    const { mutate: updateCard } = useUpdateCard();
    const setSavedCards = usePaymentMethodStore((state) => state.setSavedCards);
    console.error("Error loading cards:", error?.message);
    console.log("Loaded cards:", cards);
    useEffect(() => {
        if (cards) {
            setSavedCards(cards);
        }
    }, [cards, setSavedCards]);

    const handleDelete = (cardId: string) => {
        toast.warning("¿Eliminar esta tarjeta de forma permanente?", {
            action: { label: "Eliminar", onClick: () => deleteCard(cardId, { onSuccess: () => toast.success("Tarjeta eliminada") }) },
            cancel: { label: "Cancelar", onClick: () => toast.info("Acción cancelada") },
        });
    };

    const handleSetDefault = (cardId: string) => {
        updateCard({ cardId, data: { setAsDefault: true } }, {
            onSuccess: () => toast.success("Tarjeta actualizada como predeterminada"),
        });
    };

    if (isLoading) {
        return <Skeleton className="h-56 w-full max-w-sm mx-auto rounded-2xl" />;
    }

    if (isError) {
        return <p className="text-red-500 text-center">Error al cargar las tarjetas.</p>;
    }

    if (!cards || cards.length === 0) {
        return <p className="text-center text-muted-foreground mt-10">Aún no tienes tarjetas guardadas.</p>;
    }

    return (
        <div className="space-y-10">
            {cards.map((card) => (
                <div key={card.id}>
                    <FlippableCard card={card} />
                    <div className="mt-4 flex justify-center items-center gap-4">
                        {!card.isDefault && (
                            <Button variant="outline" size="sm" onClick={() => handleSetDefault(card.id)}>
                                <Star className="mr-2 h-4 w-4" /> Poner por defecto
                            </Button>
                        )}
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(card.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                        </Button>
                    </div>
                    {card.isDefault && (
                        <p className="text-center text-sm font-semibold text-green-600 mt-2">Tarjeta predeterminada</p>
                    )}
                </div>
            ))}
        </div>
    );
}
