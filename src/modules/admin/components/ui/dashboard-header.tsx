import { memo } from 'react';
import { motion } from 'motion/react';
import { MoreHorizontal } from 'lucide-react';
import { Separator } from '@/shared/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/shared/components/ui/breadcrumb';
import { Button } from '@/shared/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/shared/components/animated/sidebar';
import { RefreshCw } from '@/shared/components/animated/icons/refresh-cw';

interface DashboardHeaderProps {
    onRefresh: () => void;
    isRefreshing: boolean;
}

export const DashboardHeader = memo(
    ({ onRefresh, isRefreshing }: DashboardHeaderProps) => {
        return (
            <header className="bg-background/95 sticky top-0 z-50 flex h-16 w-full shrink-0 items-center gap-2 border-b backdrop-blur transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="ml-auto flex items-center gap-2 px-4">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2"
                    >
                        {/* Acción: Refresh (desktop) */}
                        <div className="hidden items-center gap-2 md:flex">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onRefresh}
                                disabled={isRefreshing}
                            >
                                <RefreshCw animateOnView 
                                    className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                                />
                                Refresh
                            </Button>
                        </div>

                        {/* Mobile Menu: solo Refresh */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className="md:hidden">
                                <Button variant="outline" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem className='cursor-pointer' onClick={onRefresh}>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Recargar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </motion.div>
                </div>
            </header>
        );
    },
);

DashboardHeader.displayName = 'DashboardHeader';