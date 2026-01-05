import { Toaster } from '@/shared/components/ui/sonner';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { Button } from '@/shared/components/ui/button';
import { ThemeTogglerButton } from '@/shared/components/animated/theme-toggler';
import { MessageCircle, Calendar, CreditCard, Home, LogOut, Menu, Search, User, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Image } from '../components/ui/image';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/core/store/auth.store';
import { MemberService } from '@/core/services/member.service';
import { ChatbotWidget } from '@/modules/client/ai-chatbot/components/ChatbotWidget';


export default function ClientDashboardLayout() {


  const dashboardPaths = [
    { id: 'inicio', icon: Home, label: 'Inicio', path: '/client/dashboard' },
    { id: 'clases', icon: Calendar, label: 'Clases', path: '/client/classes' },
    { id: 'pagos', icon: CreditCard, label: 'Pagos', path: '/client/membership' },
    { id: 'perfil', icon: User, label: 'Perfil', path: '/client/profile' },
  ]

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);


  const handlePrefetch = (path: string) => {
    if (!user?.id) return;

    if (path === "/client/dashboard") {
      // Prefetch para la data del dashboard
    } else if (path === '/client/membership') {
      queryClient.prefetchQuery({
        queryKey: ['membership', user.id],
        queryFn: () => MemberService.getMyMembership,
        staleTime: 5 * 60 * 1000,
      });
    } else if (path === '/client/classes') {
      // Prefetch para las clases del usuario
    } else if (path === '/client/profile') {
      queryClient.prefetchQuery({
        queryKey: ['user', user.id],
        queryFn: () => MemberService.getMemberById(user?.id ?? ''),
        staleTime: 5 * 60 * 1000,
      });
    } else if (path === '/client/ai-chatbot') {
      // Prefetch para el chatbot si es necesario
    }

  }


  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('classes')) return 'clases';
    if (path.includes('membership')) return 'membresía';
    if (path.includes('profile')) return 'perfil';
    if (path.includes('messages')) return 'mensajes';
    return 'inicio';
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);


  const handleLogout = async () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {mobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 sm:hidden"
          onClick={() => setMobileMenuOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setMobileMenuOpen(false);
            }
          }}
          aria-label="Cerrar menú"
          tabIndex={0}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-background shadow-lg transition-transform duration-300 ease-in-out transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } sm:hidden flex flex-col`}
      >
        <div className="flex justify-end items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/client/messages">
                <MessageCircle className="h-5 w-5" />

              </Link>
            </Button>
            <ThemeTogglerButton
              variant="ghost"
              size="icon"
              showLabel={false}
              direction="top-right"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Cerrar menú</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <nav className="space-y-2">
            {dashboardPaths.map((tab) => (
              <Button
                key={tab.id}
                asChild
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                className={`justify-start sm:justify-center gap-2 ${activeTab === tab.id ? 'shadow' : ''}`}
                onMouseOver={() => handlePrefetch(tab.path)}
              >
                <Link to={tab.path}>
                  <tab.icon className="h-4 w-4" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </Link>
              </Button>
            ))}
          </nav>

          <div className="pt-4 border-t space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>


      
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto flex flex-row h-16 items-center justify-between px-4 sm:px-6 md:px-8">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/client/dashboard" className="flex items-center gap-2">
              <Image
                src="/favicon.svg"
                alt="FitDesk Logo"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Mobile Menu Button - Moved to right */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            className="sm:hidden ml-2"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menú</span>
          </Button>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex flex-1 flex-row items-center justify-center mx-4 gap-1">
            {dashboardPaths.map((tab) => (
              <Button
                key={tab.id}
                asChild
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                className={`justify-start sm:justify-center gap-2 ${activeTab === tab.id ? 'shadow' : ''}`}
                onMouseOver={() => handlePrefetch(tab.path)}
              >
                <Link to={tab.path}>
                  <tab.icon className="h-4 w-4" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </Link>
              </Button>
            ))}
          </nav>

          {/* User actions */}
          <div className="hidden sm:flex items-center gap-2 py-2 sm:py-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar..."
                className="h-10 w-full rounded-lg border bg-transparent pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link to="/client/messages">
                  <MessageCircle className="h-5 w-5" />
                </Link>
              </Button>
              <ThemeTogglerButton
                variant="ghost"
                size="icon"
                showLabel={false}
                direction="top-right"
              />

              <Button onClick={handleLogout} variant="ghost" size="icon" className="hidden md:inline-flex">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Cerrar sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 pt-16">
        {location.pathname.includes('/messages') ? (
          <div className="w-full lg:container lg:max-w-7xl lg:mx-auto lg:px-4 xl:px-6 2xl:px-8">
            <Outlet />
          </div>
        ) : (
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
            <Outlet />
          </div>
        )}
      </main>
      <ChatbotWidget />
      <Toaster />
    </div>
  );
}
