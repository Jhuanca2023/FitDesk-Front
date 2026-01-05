import { useEffect } from "react";
import { motion } from "motion/react";
import {  Calendar, CreditCard, CheckCircle, Users, ArrowRight, ArrowUpCircle, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useNavigate } from "react-router";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useMyMembership } from "./useMembershipQuery";
import { useMembershipStore } from "./store/useMembershipState";
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from "@/shared/components/animated/tabs";
import { SavedCardsPage } from "./components/SavedCardsPage";

export const MembershipPage = () => {
    const { data: membership, isLoading, isError, error } = useMyMembership();
    const setMembership = useMembershipStore((state) => state.setMembership);
    const setIsUpgrade = useMembershipStore((state) => state.setIsUpgrade);
    const navigate = useNavigate();

    useEffect(() => {
        if (membership) setMembership(membership);
    }, [membership, setMembership]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        try {
            return format(new Date(dateString), "d 'de' MMMM, yyyy", { locale: es });
        } catch {
            return "N/A";
        }
    };

    if (isLoading) {
        return (
            <div className="container max-w-4xl mx-auto p-6 space-y-8">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (isError || !membership) {
        return (
            <div className="container max-w-4xl mx-auto p-6">
                <Card className="border-destructive/30 bg-destructive/10 text-center">
                    <CardHeader>
                        <CardTitle className="text-destructive">No tienes una membresía activa</CardTitle>
                        <CardDescription>{error instanceof Error ? error.message : "No pudimos cargar los datos de tu membresía."}</CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center">
                        <Button onClick={() => navigate("/#pricing-section")}>Adquirir Membresía</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="container max-w-4xl mx-auto p-6 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-3xl font-bold tracking-tight">Mi Cuenta</h1>
                <p className="text-muted-foreground">Gestiona tu membresía y métodos de pago.</p>
            </motion.div>

            <Tabs defaultValue="membership" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                    <TabsTrigger value="membership"><User className="mr-2 h-4 w-4" />Mi Membresía</TabsTrigger>
                    <TabsTrigger value="cards"><CreditCard className="mr-2 h-4 w-4" />Mis Tarjetas</TabsTrigger>
                </TabsList>
                <TabsContents>

                    <TabsContent value="membership" className="mt-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                            <Card className="overflow-hidden">
                                <CardHeader className="bg-gradient-to-br from-orange-500/5 to-red-500/5">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-2xl">{membership.planName}</CardTitle>
                                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="mr-1 h-3 w-3" />Activo</Badge>
                                    </div>
                                    <CardDescription className="mt-2">{membership.daysRemaining} días restantes</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white">
                                        <div className="space-y-1 mb-4 sm:mb-0"><h3 className="font-medium">Miembro desde</h3><p className="text-xl font-bold">{formatDate(membership.startDate)}</p></div>
                                        <div className="space-y-1"><h3 className="font-medium">Vigente hasta</h3><p className="text-xl font-bold">{formatDate(membership.endDate)}</p></div>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-3">
                                        <Card className="bg-muted/40"><CardContent className="p-4 flex items-center gap-3"><div className="rounded-full p-2 bg-orange-500/10 text-orange-500"><Calendar className="h-5 w-5" /></div><div><h3 className="font-medium">{membership.durationMonths} meses</h3><p className="text-sm text-muted-foreground">Duración</p></div></CardContent></Card>
                                        <Card className="bg-muted/40"><CardContent className="p-4 flex items-center gap-3"><div className="rounded-full p-2 bg-green-500/10 text-green-500"><CreditCard className="h-5 w-5" /></div><div><h3 className="font-medium">{new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(membership.amountPaid ?? 0)}</h3><p className="text-sm text-muted-foreground">Inversión</p></div></CardContent></Card>
                                        <Card className="bg-muted/40"><CardContent className="p-4 flex items-center gap-3"><div className="rounded-full p-2 bg-blue-500/10 text-blue-500"><Users className="h-5 w-5" /></div><div><h3 className="font-medium">Acceso total</h3><p className="text-sm text-muted-foreground">Beneficios</p></div></CardContent></Card>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end border-t p-6 bg-muted/30 gap-4">
                                    <Button variant="outline" className="gap-2" onClick={() => navigate("/dashboard")}><ArrowRight className="h-4 w-4" />Ir al Dashboard</Button>
                                    <Button className="gap-2 bg-green-600 hover:bg-green-700" onClick={() => { setIsUpgrade(true); navigate("/#pricing-section"); }}><ArrowUpCircle className="h-4 w-4" />Cambiar de Plan</Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="cards" className="mt-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                            <SavedCardsPage />
                        </motion.div>
                    </TabsContent>
                </TabsContents>
            </Tabs>
        </div>
    );
};

export default MembershipPage;
