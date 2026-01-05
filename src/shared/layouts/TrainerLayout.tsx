'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import TrainerSidebar from '@/modules/trainer/components/ui/trainer-sidebar';
import { DashboardHeader } from '@/modules/admin/components/ui/dashboard-header';
import { Outlet } from 'react-router';
import { SidebarInset, SidebarProvider } from '../components/animated/sidebar';

export default function TrainerLayout() {
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
            <TrainerSidebar />
            <SidebarInset>
                <DashboardHeader
                    onRefresh={handleRefresh}
                    isRefreshing={isRefreshing}
                />
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    );
}
