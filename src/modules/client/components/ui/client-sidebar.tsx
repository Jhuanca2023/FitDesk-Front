import {
  Home,
  Calendar,
  BarChart3,
  CreditCard,
  MessageCircle,
  User,
  LogOut,
} from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router';
import { Button } from '@/shared/components/ui/button';
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
  useSidebar 
} from '@/shared/components/animated/sidebar';
import { ThemeTogglerButton } from '@/shared/components/animated/theme-toggler';
import { cn } from '@/core/lib/utils';

const menuItems = [
  { title: 'Inicio', icon: Home, href: '/client' },
  { title: 'Mi Perfil', icon: User, href: '/client/profile' },
  { title: 'Clases', icon: Calendar, href: '/client/classes' },
  { title: 'Historial', icon: BarChart3, href: '/client/history' },
  { title: 'Pagos', icon: CreditCard, href: '/client/payments' },
  { title: 'Chats', icon: MessageCircle, href: '/client/messages' },
];

const ClientSidebar = memo(() => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  
  const togglerWrapperClass = cn(
    "p-0",
    isCollapsed ? "flex justify-center" : "flex justify-start pl-2"
  )

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {/* Logo removed as requested */}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
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
                        className="flex items-center gap-2"
                      >
                        <Icon className="h-5 w-5" />
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

      <SidebarFooter className="mt-auto">
        <SidebarMenu>
          <SidebarMenuItem className={togglerWrapperClass}>
            <ThemeTogglerButton 
              variant="ghost" 
              size="sm" 
              direction="bottom-left"
              showLabel="auto"
              className="w-full justify-start"
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <LogOut className="h-5 w-5" />
                {!isCollapsed && <span>Cerrar Sesión</span>}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
});

ClientSidebar.displayName = 'ClientSidebar';
export default ClientSidebar;