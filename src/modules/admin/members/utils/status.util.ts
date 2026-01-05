export const getMembershipStatusVariant = (status: string | null): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (!status) return 'outline';
    switch (status) {
        case 'ACTIVE':
            return 'default';
        case 'SUSPENDED':
            return 'secondary';
        case 'EXPIRED':
            return 'destructive';
        case 'CANCELLED':
            return 'outline';
        default:
            return 'outline';
    }
};

export const getMembershipStatusLabel = (status: string | null): string => {
    if (!status) return 'Sin membresía';
    switch (status) {
        case 'ACTIVE':
            return 'Activa';
        case 'SUSPENDED':
            return 'Suspendida';
        case 'EXPIRED':
            return 'Vencida';
        case 'CANCELLED':
            return 'Cancelada';
        case 'PENDING':
            return 'Pendiente';
        default:
            return status;
    }
};