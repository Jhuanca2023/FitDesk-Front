import {
    Users,
    Calendar,
    ClipboardList,
    User,
    MessageSquare,
    LayoutDashboard,
    Settings,
    LogOut,
} from 'lucide-react';
import { memo } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '@/shared/components/ui/button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, useSidebar } from '@/shared/components/animated/sidebar';
import { ThemeTogglerButton } from '@/shared/components/animated/theme-toggler';
import { cn } from '@/core/lib/utils';
import { useAuthStore } from '@/core/store/auth.store';

const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, href: '/trainer' },
    { title: 'Mi Calendario', icon: Calendar, href: '/trainer/calendar' },
    { title: 'Asistencia', icon: ClipboardList, href: '/trainer/attendance' },
    { title: 'Mis Alumnos', icon: Users, href: '/trainer/students' },
    { title: 'Mensajes', icon: MessageSquare, href: '/trainer/messages' },
    { title: 'Configuración', icon: Settings, href: '/trainer/settings' },
];


const TrainerSidebar = memo(() => {
    const { state, } = useSidebar()
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const handleLogout = async () => {
        logout();
        navigate('/');
    };
    const isCollapsed = state === 'collapsed'
    const togglerWrapperClass = cn(
        "p-0",
        isCollapsed ? "flex justify-center" : "flex justify-start pl-2"
    )
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link prefetch='none' to="/trainer" viewTransition className="flex items-center gap-2">
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
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                to={item.href}
                                                prefetch='none'
                                                viewTransition
                                            >
                                                <Icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>

                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem className={togglerWrapperClass}>
                        <ThemeTogglerButton showLabel="auto" variant="ghost" direction='bottom-left' />
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link prefetch='none' to="/trainer/profile" viewTransition>
                                <User />
                                <span>Perfil Entrenador</span>
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

TrainerSidebar.displayName = 'TrainerSidebar';

export default TrainerSidebar;
