/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
import { Badge } from '@/shared/components/ui/badge';
import { ArrowRight, Check, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { cn } from '@/core/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router';
import { useActivePlans } from '@/modules/admin/plans';
import type { PlanResponse } from '@/core/interfaces/plan.interface';
import { Avatar, AvatarImage } from '@/shared/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { useMembershipStore } from '@/modules/client/payments/store/useMembershipState';
import { useEffect, useState } from 'react';
import { PaymentService } from '@/core/services/payment.service';
import { useAuthStore } from '@/core/store/auth.store';
import type { UpgradeCostResponse } from '@/core/interfaces/payment.interface';

export const PriceSection = () => {
    const { data: plans } = useActivePlans();
    const navigate = useNavigate();
    const isUpgrade = useMembershipStore((state) => state.isUpgrade);
    const user = useAuthStore((state) => state.user);
    const [upgradeCosts, setUpgradeCosts] = useState<Record<string, UpgradeCostResponse>>({});
    const [loadingCosts, setLoadingCosts] = useState<boolean>(false);

    // Calcular costos de upgrade cuando sea necesario
    useEffect(() => {
        const calculateUpgradeCosts = async () => {
            if (isUpgrade && user && plans) {
                setLoadingCosts(true);
                const costs: Record<string, UpgradeCostResponse> = {};
                
                for (const plan of plans) {
                    try {
                        const cost = await PaymentService.calculateUpgradeCost(
                            user.id, 
                            plan.id  // plan.id ya es string (UUID)
                        );
                        costs[plan.id] = cost;
                    } catch (error) {
                        console.error(`Error calculando costo para plan ${plan.id}:`, error);
                    }
                }
                
                setUpgradeCosts(costs);
                setLoadingCosts(false);
            }
        };
        
        calculateUpgradeCosts();
    }, [isUpgrade, user, plans]);

    const handlePayment = (plan: PlanResponse) => {
        console.log("🎯 Navegando a payments con isUpgrade:", isUpgrade);
        
        const upgradeInfo = isUpgrade ? upgradeCosts[plan.id] : null;
        
        navigate('/payments', { 
            state: { 
                selectedPlan: plan,
                isUpgrade: isUpgrade,
                upgradeInfo: upgradeInfo  // Pasar información del upgrade
            } 
        });
    }

    // Función para renderizar el precio
    const renderPrice = (plan: PlanResponse) => {
        const upgradeInfo = upgradeCosts[plan.id];
        
        if (isUpgrade && upgradeInfo) {
            return (
                <div className="space-y-3">
                    {/* Precio original tachado */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-semibold text-muted-foreground line-through">
                            S/.{plan.price}
                        </span>
                        <span className="text-sm text-muted-foreground">/mes</span>
                    </div>
                    
                    {/* Precio del upgrade */}
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-primary">
                                S/.{upgradeInfo.upgradeCost}
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                            Pago único por {upgradeInfo.daysRemaining} días restantes
                        </span>
                    </div>
                    
                    {/* Badge de ahorro si hay crédito */}
                    {upgradeInfo.unusedCredit > 0 && (
                        <Badge variant="secondary" className="mt-2 w-fit">
                            <Sparkles className="mr-1 h-3 w-3" />
                            Crédito aplicado: S/.{upgradeInfo.unusedCredit}
                        </Badge>
                    )}
                </div>
            );
        }
        
        // Precio normal
        return (
            <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">S/.{plan.price}</span>
                <span className="text-sm text-muted-foreground">/mes</span>
            </div>
        );
    };

    return (
        <div id="pricing-section" className="not-prose relative flex w-full flex-col gap-16 overflow-hidden px-4 py-24 text-center sm:px-8">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="bg-primary/10 absolute -top-[10%] left-[50%] h-[40%] w-[60%] -translate-x-1/2 rounded-full blur-3xl" />
                <div className="bg-primary/5 absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full blur-3xl" />
                <div className="bg-primary/5 absolute -bottom-[10%] -left-[10%] h-[40%] w-[40%] rounded-full blur-3xl" />
            </div>

            <div className="flex flex-col items-center justify-center gap-8">
                <div className="flex flex-col items-center space-y-2">
                    <Badge
                        variant="outline"
                        className="border-primary/20 bg-primary/5 mb-4 rounded-full px-4 py-1 text-sm font-medium"
                    >
                        <Sparkles className="text-primary mr-1 h-3.5 w-3.5 animate-pulse" />
                        {isUpgrade ? "Actualizar Plan" : "Planes de Precios"}
                    </Badge>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="from-foreground to-foreground/30 bg-gradient-to-b bg-clip-text text-4xl font-bold text-transparent sm:text-5xl"
                    >
                        {isUpgrade ? "Mejora tu experiencia" : "Elige el plan perfecto para ti"}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-muted-foreground max-w-md pt-2 text-lg"
                    >
                        {isUpgrade 
                            ? "Actualiza tu plan y disfruta de más beneficios. Solo pagas la diferencia prorrateada."
                            : "Precios simples y transparentes que se adaptan a ti. Sin tarifas ocultas, sin sorpresas."
                        }
                    </motion.p>
                </div>

                <div className="mt-8 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
                    {loadingCosts && isUpgrade ? (
                        <div className="col-span-3 flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Calculando costos de actualización...</p>
                        </div>
                    ) : (
                        plans?.map((plan, index) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="flex"
                            >
                                <Card
                                    className={cn(
                                        'bg-secondary/20 relative h-full w-full text-left transition-all duration-300 hover:shadow-lg',
                                        plan.isPopular
                                            ? 'ring-primary/50 dark:shadow-primary/10 shadow-md ring-2'
                                            : 'hover:border-primary/30',
                                        plan.isPopular &&
                                        'from-primary/[0.03] bg-gradient-to-b to-transparent',
                                    )}
                                >
                                    {plan.isPopular && (
                                        <div className="absolute -top-3 right-0 left-0 mx-auto w-fit">
                                            <Badge className="bg-primary text-primary-foreground rounded-full px-4 py-1 shadow-sm">
                                                <Sparkles className="mr-1 h-3.5 w-3.5" />
                                                Popular
                                            </Badge>
                                        </div>
                                    )}
                                    {isUpgrade && upgradeCosts[plan.id] && upgradeCosts[plan.id].upgradeCost <= 0 && (
                                        <div className="absolute -top-3 right-4">
                                            <Badge className="bg-yellow-500 text-yellow-50 rounded-full px-3 py-1 shadow-sm">
                                                Plan actual
                                            </Badge>
                                        </div>
                                    )}
                                    <CardHeader className={cn('pb-4', plan.isPopular && 'pt-8')}>
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <Avatar>
                                                    <AvatarImage
                                                        src={plan.planImageUrl}
                                                        alt={plan.name}
                                                        className="h-8 w-8 rounded-full"
                                                    />
                                                    <AvatarFallback>
                                                        {plan.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <CardTitle
                                                className={cn(
                                                    'text-xl font-bold',
                                                    plan.isPopular && 'text-primary',
                                                )}
                                            >
                                                {plan.name}
                                            </CardTitle>
                                        </div>
                                        <CardDescription className="mt-3 space-y-2">
                                            <p className="text-sm">{plan.description}</p>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-3 pb-6">
                                        {renderPrice(plan)}
                                        {plan.features.map((feature, featureIndex) => (
                                            <motion.div
                                                key={`${plan.id}-${featureIndex}`}
                                                initial={{ opacity: 0, x: -5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: 0.5 + featureIndex * 0.05 }}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <div
                                                    className={cn(
                                                        'flex h-5 w-5 items-center justify-center rounded-full',
                                                        plan.isPopular
                                                            ? 'bg-primary/10 text-primary'
                                                            : 'bg-secondary text-secondary-foreground',
                                                    )}
                                                >
                                                    <Check className="h-3.5 w-3.5" />
                                                </div>
                                                <span
                                                    className={
                                                        plan.isPopular
                                                            ? 'text-foreground'
                                                            : 'text-muted-foreground'
                                                    }
                                                >
                                                    {feature}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            variant={plan.isPopular ? 'default' : 'outline'}
                                            onClick={() => handlePayment(plan)}
                                            disabled={isUpgrade && upgradeCosts[plan.id]?.upgradeCost <= 0}
                                            className={cn(
                                                'w-full font-medium transition-all duration-300',
                                                plan.isPopular
                                                    ? 'bg-primary hover:bg-primary/90 hover:shadow-primary/20 hover:shadow-md'
                                                    : 'hover:border-primary/30 hover:bg-primary/5 hover:text-primary',
                                            )}
                                        >
                                            {isUpgrade 
                                                ? (upgradeCosts[plan.id]?.upgradeCost <= 0 
                                                    ? "Plan actual" 
                                                    : "Actualizar a este plan")
                                                : "Comenzar ahora"
                                            }
                                            {(!isUpgrade || (isUpgrade && upgradeCosts[plan.id]?.upgradeCost > 0)) && (
                                                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                            )}
                                        </Button>
                                    </CardFooter>

                                    {plan.isPopular ? (
                                        <>
                                            <div className="from-primary/[0.05] pointer-events-none absolute right-0 bottom-0 left-0 h-1/2 rounded-b-lg bg-gradient-to-t to-transparent" />
                                            <div className="border-primary/20 pointer-events-none absolute inset-0 rounded-lg border" />
                                        </>
                                    ) : (
                                        <div className="hover:border-primary/10 pointer-events-none absolute inset-0 rounded-lg border border-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
                                    )}
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
