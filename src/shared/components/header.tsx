import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import fitdeskLogo from "@/assets/logo.svg";
import { Image } from "./ui/image";
import { ThemeTogglerButton } from "./animated/theme-toggler";
import { useTheme } from "@/core/providers/theme-provider";
import { Button } from "./ui/button";
import { useAuthStore } from "@/core/store/auth.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useGetMemberQuery } from "@/modules/client/profile/query/useMemberQuery";

interface NavItem {
  name: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: { name: string; href: string; description?: string }[];
}

const navItems: NavItem[] = [
  { name: "Inicio", href: "/" },
  { name: "Características", href: "/features" },
  {
    name: "Entrena con Nosotros",
    href: "/book-class",
    hasDropdown: true,
    dropdownItems: [
      {
        name: "Reserva tu clase",
        href: "/reserva-clase",
        description: "Vive la experiencia de entrenar con nosotros",
      },
      {
        name: "Sesiones personalizadas",
        href: "/sesiones-personalizadas",
        description: "Entrena con un coach que se adapta a tu ritmo",
      },
      {
        name: "Blog",
        href: "/blog",
        description: "Descubre nuevas rutinas y mantén la motivación",
      },
    ],
  },
  { name: "Precios", href: "#pricing-section" },
  { name: "Acerca de", href: "/about" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const userAuth = useAuthStore((state) => state.user);
  const { data: user } = useGetMemberQuery(userAuth?.id || "");
  const authStatus = useAuthStore((state) => state.authStatus);
  
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName) return "U";
    const firstInitial = firstName.charAt(0);
    const lastInitial = lastName ? lastName.charAt(0) : "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);

      if (location.pathname === "/") {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        navigate(`/${href}`);
      }
    }
  };

  const headerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    scrolled: {
      backdropFilter: "blur(20px)",
      backgroundColor:
        theme === "dark" ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    },
  };
  const mobileMenuVariants = {
    closed: { opacity: 0, height: 0 },
    open: { opacity: 1, height: "auto" },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <motion.header
      className="fixed top-0 right-0 left-0 z-50 transition-all duration-150"
      variants={headerVariants}
      initial="initial"
      animate={isScrolled ? "scrolled" : "animate"}
      transition={{ duration: 0.1, ease: "easeInOut" }}
      style={{
        backdropFilter: isScrolled ? "blur(20px)" : "none",
        backgroundColor: isScrolled
          ? theme === "dark"
            ? "rgba(0, 0, 0, 0.8)"
            : "rgba(255, 255, 255, 0.8)"
          : "transparent",
        boxShadow: isScrolled ? "0 8px 32px rgba(0, 0, 0, 0.1)" : "none",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link
              prefetch="none"
              to="/"
              className="flex items-center space-x-2"
            >
              <Image
                src={fitdeskLogo}
                className=" h-9 w-9"
                alt="Logo de Aplicacion"
              />
              <span className="bg-gradient-to-r from-rose-500 to-rose-700 bg-clip-text text-xl font-bold text-transparent">
                FitDesk .
              </span>
            </Link>
          </motion.div>

          <nav className="hidden items-center space-x-8 lg:flex">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <div className="relative">
                    <Button
                      variant={"ghost"}
                      className="text-foreground flex items-center space-x-1 font-medium transition-colors duration-200 hover:text-rose-500"
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === item.name ? null : item.name,
                        )
                      }
                      onMouseEnter={() => setActiveDropdown(item.name)}
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          activeDropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                    </Button>

                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div
                          className="border-border bg-background/95 absolute top-full left-0 mt-2 w-64 overflow-hidden rounded-xl border shadow-xl backdrop-blur-lg z-50"
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          transition={{ duration: 0.2 }}
                          onMouseEnter={() => setActiveDropdown(item.name)}
                          onMouseLeave={() => setActiveDropdown(null)}
                        >
                          {item.dropdownItems?.map((dropdownItem) => (
                            <Link
                              prefetch="none"
                              key={dropdownItem.name}
                              to={dropdownItem.href}
                              className="hover:bg-muted block px-4 py-3 transition-colors duration-200"
                            >
                              <div className="text-foreground font-medium">
                                {dropdownItem.name}
                              </div>
                              {dropdownItem.description && (
                                <div className="text-muted-foreground text-sm">
                                  {dropdownItem.description}
                                </div>
                              )}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    prefetch="none"
                    to={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="text-foreground font-medium transition-colors duration-200 hover:text-rose-500"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden items-center space-x-4 lg:flex">
            <ThemeTogglerButton
              direction="top-right"
              showLabel={false}
              variant={"ghost"}
            />
            {authStatus === "authenticated" && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user.profileImageUrl ?? ""}
                        alt={user.email ?? "Usuario"}
                      />
                      <AvatarFallback>
                        {getInitials(user.firstName, user.lastName ?? "")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  prefetch="none"
                  to="/auth"
                  viewTransition
                  className="text-foreground font-medium transition-colors duration-200 hover:text-rose-500"
                >
                  Inicia Sesion
                </Link>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    prefetch="none"
                    viewTransition
                    to="/auth/register"
                    className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-rose-500 to-rose-700 px-6 py-2.5 font-medium text-white transition-all duration-200 hover:shadow-lg"
                  >
                    <span>Registrarse</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          <motion.button
            className="hover:bg-muted rounded-lg p-2 transition-colors duration-200 lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="overflow-hidden lg:hidden"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="border-border bg-background/95 mt-4 space-y-2 rounded-xl border py-4 shadow-xl backdrop-blur-lg">
                {navItems.map((item) => (
                  <Link
                    prefetch="none"
                    key={item.name}
                    to={item.href}
                    className="text-foreground hover:bg-muted block px-4 py-3 font-medium transition-colors duration-200"
                    onClick={(e) => {
                      handleNavClick(e, item.href);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="space-y-2 px-4 py-2">
                  <ThemeTogglerButton
                    direction="top-left"
                    showLabel={false}
                    size="icon"
                  />
                  {authStatus === "authenticated" ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="text-foreground hover:bg-muted block w-full rounded-lg py-2.5 text-center font-medium transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full"
                      >
                        Cerrar sesión
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        prefetch="none"
                        to="/auth"
                        className="text-foreground hover:bg-muted block w-full rounded-lg py-2.5 text-center font-medium transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Inicia Sesion
                      </Link>
                      <Link
                        prefetch="none"
                        to="/auth/register"
                        className="block w-full rounded-lg bg-gradient-to-r from-rose-500 to-rose-700 py-2 text-center font-medium text-white transition-all duration-200 hover:shadow-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Registrarse
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};
