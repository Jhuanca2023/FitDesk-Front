import { DashboardCard } from '../components/ui/dashboard-card'
import { RevenueChart } from '../components/ui/revenue-chart'
import { UsersTable } from '../components/ui/users-table'
import { QuickActions } from '../components/ui/quick-actions'
import { RecentActivity } from '../components/ui/recent-activity'
import { useKeyboardShortcuts } from './hooks/use-keyboard-shortcuts'
import { Users, DollarSign, Activity } from 'lucide-react'
import { useGetUserStatistics } from '@/core/queries/useAdminUserQuery'
import { useAdminRevenue, useAdminClassesSummary, useAdminMonthlyRevenueComparison } from '@/core/queries/useAdminDashboardQuery'

const handleAddUser = () => {
    console.log('Adding new user...');
};

const DashboardPage = () => {
    
    useKeyboardShortcuts();
    const { data: userStats } = useGetUserStatistics();
    const { data: revenue } = useAdminRevenue();
    const { data: revenueCompare } = useAdminMonthlyRevenueComparison();
    const { data: classes } = useAdminClassesSummary();

    const stats = [
        {
            title: 'Total de Usuarios',
            value: String(userStats?.totalUsers ?? 0),
            change: '',
            changeType: 'positive' as const,
            icon: Users,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
        },
        {
            title: 'Ganancias',
            value: `${revenue?.currency === 'PEN' ? 'S/' : revenue?.currency === 'USD' ? 'S/.' : ''}${(revenue?.totalRevenue ?? 0).toLocaleString('es-PE')}`,
            change: (() => {
                const curr = revenueCompare?.current ?? 0;
                const prev = revenueCompare?.previous ?? 0;
                const pct = prev > 0 ? ((curr - prev) / prev) * 100 : (curr > 0 ? 100 : 0);
                const sign = pct >= 0 ? '+' : '';
                return `${sign}${Math.round(pct)}%`;
            })(),
            changeType: ((revenueCompare?.current ?? 0) - (revenueCompare?.previous ?? 0)) >= 0 ? 'positive' as const : 'negative' as const,
            progress: (() => {
                const curr = revenueCompare?.current ?? 0;
                const prev = revenueCompare?.previous ?? 0;
                if (curr <= 0 && prev <= 0) return 0;
                const ratio = prev > 0 ? (curr / prev) * 100 : 100;
                return Math.max(0, Math.min(100, Math.round(ratio)));
            })(),
            icon: DollarSign,
            color: 'text-green-500',
            bgColor: 'bg-green-500/10',
        },
        {
            title: 'Sesiones Activas',
            value: String(classes?.active ?? 0),
            change: '',
            changeType: 'positive' as const,
            icon: Activity,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
        },
    ];

    return (
        <div className="flex flex-1 flex-col gap-2 p-2 pt-0 sm:gap-4 sm:p-4">
            <div className="min-h-[calc(100vh-4rem)] flex-1 rounded-lg p-3 sm:rounded-xl sm:p-4 md:p-6">
                <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
                    <div className="px-2 sm:px-0">
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Bienvenido 
                        </h1>
                        <p className="text-muted-foreground text-sm sm:text-base">
                            Resumen actualizado del estado de la plataforma.
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                        {stats.map((stat, index) => (
                            <DashboardCard key={stat.title} stat={stat} index={index} />
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
                        {/* Charts Section */}
                        <div className="space-y-4 sm:space-y-6 xl:col-span-2">
                            <RevenueChart />
                            <UsersTable onAddUser={handleAddUser} />
                        </div>

                        {/* Sidebar Section */}
                        <div className="space-y-4 sm:space-y-6">
                            <QuickActions
                                onAddUser={handleAddUser}
                                onExport={() => alert("Exportar")}
                            />
                        
                            <RecentActivity />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default DashboardPage;