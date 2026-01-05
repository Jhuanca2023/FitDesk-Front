/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
import { Check, Star, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';

const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');
import type { PlanResponse, UpdatePlanRequest } from '@/core/interfaces/plan.interface';

type PlanCardProps = {
  plan: PlanResponse;
  onEdit: (plan: PlanResponse) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
};

export function PlanCard({ plan, onEdit, onDelete, isDeleting }: PlanCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all hover:shadow-lg",
      plan.isPopular ? "border-2 border-amber-400 dark:border-amber-500" : "border-border/50"
    )}>
      {/* Plan Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
        {plan.planImageUrl ? (
          <img
            src={plan.planImageUrl}
            alt={plan.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <ImageIcon className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
        
        {/* Popular Badge */}
        {plan.isPopular && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-md">
            <Star className="w-3 h-3 mr-1" />
            POPULAR
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div>
            <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
            <CardDescription className="mt-1 text-sm">{plan.description}</CardDescription>
          </div>
          <Badge variant={plan.isActive ? 'default' : 'secondary'} className="shrink-0">
            {plan.isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-end">
              <span className="text-3xl font-bold">
                S/.{plan.price.toFixed(2)}
              </span>
              <span className="text-muted-foreground ml-2">
                /{plan.durationMonths} {plan.durationMonths === 1 ? 'mes' : 'meses'}
              </span>
            </div>
          </div>

          {plan.features?.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="font-medium text-sm text-muted-foreground">INCLUYE:</h4>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t pt-4">
        <div className="w-full flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(plan)}
            className="flex-1"
          >
            Editar Plan
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(plan.id)}
            disabled={isDeleting}
            className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive flex-1"
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}