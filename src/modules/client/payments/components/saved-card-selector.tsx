import { useState, useEffect } from 'react';
import { usePaymentMethods } from '../hooks/usePaymentMethods';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { FlippableCard } from './flippable-card';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/core/lib/utils';
import { useAuthStore } from '@/core/store/auth.store';
import type { SavedPaymentMethod } from '@/core/interfaces/payment-method.interface';

interface SavedCardSelectorProps {
  onSelectionChange: (selection: { card: SavedPaymentMethod; cvv: string } | null) => void;
}

export function SavedCardSelector({ onSelectionChange }: SavedCardSelectorProps) {
  const { useFetchCards } = usePaymentMethods();
  const { data: cards, isLoading, isError } = useFetchCards();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [cvv, setCvv] = useState('');
  const user = useAuthStore((s) => s.user);

  // Seleccionar la tarjeta por defecto al cargar
  useEffect(() => {
    if (cards) {
      const defaultCard = cards.find(c => c.isDefault);
      if (defaultCard) {
        setSelectedCardId(defaultCard.id);
      } else if (cards.length > 0) {
        setSelectedCardId(cards[0].id);
      }
    }
  }, [cards]);

  // Informar al componente padre sobre la selección
  useEffect(() => {
    const selectedCard = cards?.find(c => c.id === selectedCardId);
    if (selectedCard && cvv.length >= 3) {
      onSelectionChange({ card: selectedCard, cvv }); // <-- CAMBIO: Pasa el objeto 'card' completo
    } else {
      onSelectionChange(null);
    }
  }, [selectedCardId, cvv, onSelectionChange, cards]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-56 w-full max-w-sm mx-auto rounded-2xl" />
        <Skeleton className="h-10 w-24 mx-auto rounded-md" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500 text-center py-8">No se pudieron cargar tus tarjetas guardadas.</p>;
  }
  
  if (!cards || cards.length === 0) {
      return <p className="text-center text-muted-foreground py-8">No tienes tarjetas guardadas. Puedes añadir una desde la pestaña 'Mis Tarjetas'.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className={cn(
              "rounded-2xl p-2 transition-all duration-300 transform-gpu",
              selectedCardId === card.id 
                ? 'bg-primary/10 ring-2 ring-primary scale-105' 
                : 'cursor-pointer hover:scale-105'
            )}
            onClick={() => setSelectedCardId(card.id)}
          >
            <FlippableCard card={card} />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedCardId && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-sm mx-auto pt-4 border-t"
          >
            <Label htmlFor="saved-card-cvv" className="font-semibold text-center block">
              CVV de la tarjeta seleccionada
            </Label>
            <Input
              id="saved-card-cvv"
              type="password"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              maxLength={4}
              className="mt-2 text-center text-2xl font-mono tracking-widest"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
