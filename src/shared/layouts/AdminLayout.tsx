import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { AdminSidebar } from '@/modules/admin/components/ui/admin-sidebar';
import { DashboardHeader } from '@/modules/admin/components/ui/dashboard-header';
import { Outlet } from 'react-router';
import { SidebarInset, SidebarProvider } from '../components/animated/sidebar';


export default function AdminDashboard() {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const queryClient = useQueryClient();

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await queryClient.refetchQueries({ type: 'active' });
        } finally {
            setIsRefreshing(false);
        }
    };



    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
                <div className="px-4 md:px-6 py-4">
                    <DashboardHeader
                        onRefresh={handleRefresh}
                        isRefreshing={isRefreshing}
                    />
                    <main className="mt-6">
                        <Outlet />
                    </main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}