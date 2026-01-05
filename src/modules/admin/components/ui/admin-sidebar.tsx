import {
    LayoutDashboard,
    Users,
    DollarSign,
    Shield,
    Calendar,
    MapPin,
    LogOut,
} from 'lucide-react';
import { memo } from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from '@/shared/components/animated/sidebar';
import { Link, useNavigate } from 'react-router';
import { Button } from '@/shared/components/ui/button';
import { ThemeTogglerButton } from '@/shared/components/animated/theme-toggler';
import { User } from '@/shared/components/animated/icons/user';
import { cn } from '@/core/lib/utils';
import { useAuthStore } from '@/core/store/auth.store';
import { usePrefetchRoutes } from '@/core/routes/usePrefetchRoutes';

const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, href: '/admin', prefetchKey: null },
    { title: 'Miembros', icon: Users, href: '/admin/members', prefetchKey: 'prefetchMembers' },
    { title: 'Entrenadores', icon: Users, href: '/admin/trainers', prefetchKey: 'prefetchTrainers' },
    { title: 'Roles', icon: Shield, href: '/admin/roles', prefetchKey: 'prefetchRoles' },
    { title: 'Clases', icon: Calendar, href: '/admin/classes', prefetchKey: 'prefetchClasses' },
    { title: 'Ubicaciones', icon: MapPin, href: '/admin/locations', prefetchKey: 'prefetchLocations' },
    { title: 'Facturación', icon: DollarSign, href: '/admin/billing', prefetchKey: 'prefetchBilling' },
    { title: 'Planes', icon: Shield, href: '/admin/plans', prefetchKey: 'prefetchPlans' }
] as const;
export const AdminSidebar = memo(() => {
    const { state } = useSidebar();
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
     const prefetchHooks = usePrefetchRoutes();
    const handleLogout = async () => {
        logout();
        navigate('/');
    };

    const handleMouseEnter = (prefetchKey: string | null) => {
        if (prefetchKey && prefetchKey in prefetchHooks) {
            const prefetchFn = prefetchHooks[prefetchKey as keyof typeof prefetchHooks];
            if (typeof prefetchFn === 'function') {
                prefetchFn();
            }
        }
    };

    const isCollapsed = state === 'collapsed';
    const togglerWrapperClass = cn(
        "p-0",
        isCollapsed ? "flex justify-center" : "flex justify-start pl-2"
    );
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link prefetch='none' to="/admin" viewTransition className="flex items-center gap-2">
                                {isCollapsed ? (
                                    <img
                                        src="/src/assets/logo.svg"
                                        alt="App Logo"
                                        loading="lazy"
                                        className="h-10 w-10"
                                    />
                                ) : (
                                    <>
                                        <img
                                            src="/favicon.svg"
                                            alt="App Logo"
                                            loading="lazy"
                                            className="h-20 w-20"
                                        />
                                    </>
                                )}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navegacion</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <SidebarMenuItem 
                                    onMouseOver={() => handleMouseEnter(item.prefetchKey)}
                                    key={item.href}>
                                        <SidebarMenuButton asChild>
                                            <Link prefetch='none' to={item.href} viewTransition>
                                                <Icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem className={togglerWrapperClass}>
                        <div className="flex w-full justify-center p-0">
                            <ThemeTogglerButton showLabel="auto" variant="ghost" direction='bottom-left' />
                        </div>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link prefetch='none' to="/admin/profile" viewTransition>
                                <User animateOnHover />
                                <span>Perfil Administrador</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        {isCollapsed ? (
                            <SidebarMenuButton asChild>
                                <Button onClick={handleLogout} variant="destructive" size="icon">
                                    <LogOut className="h-4 w-4" />
                                    <span className="sr-only">Cerrar Sesión</span>
                                </Button>
                            </SidebarMenuButton>

                        ) : (
                            <SidebarMenuButton asChild>
                                <Button onClick={handleLogout} variant={'destructive'}>
                                    Cerrar Sesion
                                </Button>
                            </SidebarMenuButton>
                        )}

                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
});

AdminSidebar.displayName = 'AdminSidebar';