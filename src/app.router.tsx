import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { Login } from "./modules/shared/auth/login";
import { Register } from "./modules/shared/auth/register";
import { ForgotPassword } from "./modules/shared/auth/forgot-password";
import { PageLoader } from "./shared/components/page-loader";
import { TrainersPage } from "./modules/admin/trainers/pages/TrainersPage";
import { TrainerFormPage } from "./modules/admin/trainers/pages/TrainerFormPage";
import { TrainerDetailsPage } from "./modules/admin/trainers/pages/TrainerDetailsPage";
import { MembersPage } from "./modules/admin/members/pages/MembersPage";
import { CreateMemberPage } from "./modules/admin/members/pages/CreateMemberPage";
import { MemberDetailsPage } from "./modules/admin/members/pages/MemberDetailsPage";
import { EditMemberPage } from "./modules/admin/members/pages/EditMemberPage";
import { MessagePage } from "./modules/trainer/messages/message-page";
import { ClientMessagePage } from "./modules/client/messages/message-page";
import { OAuthCallback } from "./modules/shared/auth/oauth-callback";
import { ConfigurationPage } from "./modules/trainer/configuration";
import { TrainerRoute, AdminRoute, NotAuthenticatedRoute } from './shared/components/protected-routes';
import { MembershipPage } from "./modules/client/payments/membership-page";

//Admin
const AdminLayout = lazy(() => import("@/shared/layouts/AdminLayout"))
const DashboardPage = lazy(() => import("@/modules/admin/dashboard/DashboardPage"))
const PlansPage = lazy(() => import("@/modules/admin/plans/pages/plans-page"))
const ClassesPage = lazy(() => import("@/modules/admin/classes/pages/classes-page"))
const LocationsPage = lazy(() => import("@/modules/admin/classes/pages/locations-page"))
const BillingPage = lazy(() => import("@/modules/admin/billing/pages/BillingPage"))
const UserRolesPage = lazy(() => import("@/modules/admin/roles/pages/UserRolesPage"))
const AdminProfilePage = lazy(() => import("@/modules/admin/profile/pages/AdminProfilePage").then(m => ({ default: m.default })))

//Trainer
const TrainerLayout = lazy(() => import("@/shared/layouts/TrainerLayout"))
const DashboardTrainer = lazy(() => import("@/modules/trainer/dashboard/DashboardTrainer"))
// Add other trainer pages as needed
const TrainerCalendarPage = lazy(() => import("@/modules/trainer/calendar/pages/calendar-page"))
const TrainerAttendancePage = lazy(() => import("@/modules/trainer/attendance").then(m => ({ default: m.AttendancePage })))
const TrainerStudentsPage = lazy(() => import("@/modules/trainer/students/pages/students-page"))
const TrainerProfilePage = lazy(() => import("@/modules/trainer/profile/pages/profile-page"))



// Client
const ClientLayout = lazy(() => import("@/shared/layouts/ClientLayout"))
const ClientDashboardLayout = lazy(() => import("@/shared/layouts/ClientDashboardLayout"))
const LandingPage = lazy(() => import("@/modules/shared/landing/landing-page"))
const ClientDashboard = lazy(() => import("@/modules/client/dashboard/ClientDashboard"))
const ClientProfilePage = lazy(() => import("@/modules/client/profile/profile-page"))
const ClientClassesPage = lazy(() => import("@/modules/client/classes/pages/client-classes-page"))
const ClientPaymentsPage = lazy(() => import("@/modules/client/payments/payments-page"))
const ReservaClasePage = lazy(() => import("@/modules/client/reserva-clase").then(m => ({ default: m.ReservaClasePage })))
const SesionesPersonalizadasPage = lazy(() => import("@/modules/client/sesiones-personalizadas/pages/sesiones-personalizadas-page"))
const BlogPage = lazy(() => import("@/modules/client/blog/pages/blog-page"))
const NosotrosPage = lazy(() => import("@/modules/client/nosotros/pages/LandingPage"))
const AIChatbotPage = lazy(() => import("@/modules/client/ai-chatbot/pages/ai-chatbot-page"))

// Auth
const AuthLayout = lazy(() => import("@/shared/layouts/AuthLayout"))

// Payment
const PaymentPage = lazy(() => import("@/modules/client/payments/payments-page"))

export const appRouter = createBrowserRouter([
    {
        path: "/dashboard",
        element: <Navigate to="/client/dashboard" replace />
    },
    {
        path: "/payments",
        element: <Suspense><PaymentPage /></Suspense>
    },
    // Landing Page Route
    {
        path: "/",
        element: (
            <Suspense fallback={<PageLoader />}>
                <ClientLayout />
            </Suspense>
        ),
        children: [
            { index: true, element: <Suspense><LandingPage /></Suspense> },
            {
                path: "reserva-clase",
                element: <Suspense fallback={<PageLoader />}><ReservaClasePage /></Suspense>
            },
            {
                path: "sesiones-personalizadas",
                element: <Suspense fallback={<PageLoader />}><SesionesPersonalizadasPage /></Suspense>
            },
            {
                path: "blog",
                element: <Suspense fallback={<PageLoader />}><BlogPage /></Suspense>
            },
            {
                path: "about",
                element: <Suspense fallback={<PageLoader />}><NosotrosPage /></Suspense>
            }
        ]
    },
    // Client Routes
    {
        path: "/client",
        element: (
            <Suspense fallback={<PageLoader />}>
                <ClientDashboardLayout />
            </Suspense>
        ),
        children: [
            { index: true, element: <Navigate to="/client/dashboard" replace /> },
            {
                path: "dashboard",
                element: <Suspense><ClientDashboard /></Suspense>
            },
            {
                path: "membership",
                element: <Suspense><MembershipPage /></Suspense>
            },
            {
                path: "profile",
                element: <Suspense><ClientProfilePage /></Suspense>
            },
            {
                path: "classes",
                element: <Suspense><ClientClassesPage /></Suspense>
            },
            {
                path: "payments",
                element: <Suspense><ClientPaymentsPage /></Suspense>
            },
            {
                path: "messages",
                element: <Suspense fallback={<PageLoader />}><ClientMessagePage /></Suspense>
            },
            {
                path: "ai-chatbot",
                element: <Suspense fallback={<PageLoader />}><AIChatbotPage /></Suspense>
            },
        ]
    },

    {
        path: "/auth",
        element: (

            <NotAuthenticatedRoute>
                <Suspense fallback={<PageLoader />}>
                    <AuthLayout />
                </Suspense>
            </NotAuthenticatedRoute>

        ),
        children: [
            { index: true, element: <Suspense><Login /></Suspense> },
            { path: "register", element: <Suspense><Register /></Suspense> },
            { path: "forgot-password", element: <Suspense><ForgotPassword /></Suspense> },
            { path: "callback", element: <OAuthCallback /> }
        ]
    },
    {
        path: "/admin",
        element: (
            <AdminRoute>
                <Suspense fallback={<PageLoader />}>
                    <AdminLayout />
                </Suspense>
            </AdminRoute>
        ),
        children: [
            { index: true, element: <Suspense fallback={<PageLoader />}><DashboardPage /></Suspense> },
            {
                path: "plans",
                element: <Suspense fallback={<PageLoader />}><PlansPage /></Suspense>
            },
            {
                path: "classes",
                element: <Suspense fallback={<PageLoader />}><ClassesPage /></Suspense>
            },
            {
                path: "locations",
                element: <Suspense fallback={<PageLoader />}><LocationsPage /></Suspense>
            },
            {
                path: "billing",
                element: <Suspense fallback={<PageLoader />}><BillingPage /></Suspense>
            },
            {
                path: "trainers",
                element: <Suspense fallback={<PageLoader />}><TrainersPage /></Suspense>,
            },
            {
                path: "trainers/nuevo",
                element: <Suspense fallback={<PageLoader />}><TrainerFormPage /></Suspense>,
            },
            {
                path: "members",
                element: <Suspense fallback={<PageLoader />}><MembersPage /></Suspense>,
            },
            {
                path: "members/nuevo",
                element: <Suspense fallback={<PageLoader />}><CreateMemberPage /></Suspense>,
            },
            {
                path: "members/:id",
                element: <Suspense fallback={<PageLoader />}><MemberDetailsPage /></Suspense>,
            },
            {
                path: "members/editar/:id",
                element: <Suspense fallback={<PageLoader />}><EditMemberPage /></Suspense>,
            },
            {
                path: "trainers/editar/:id",
                element: <Suspense fallback={<PageLoader />}><TrainerFormPage isEditMode /></Suspense>,
            },
            {
                path: "trainers/:id",
                element: <Suspense fallback={<PageLoader />}><TrainerDetailsPage /></Suspense>,
            },
            {
                path: "roles",
                element: <Suspense fallback={<PageLoader />}><UserRolesPage /></Suspense>,
            },
            {
                path: "profile",
                element: <Suspense fallback={<PageLoader />}><AdminProfilePage /></Suspense>,
            }
        ]
    },
    // Trainer Routes
    {
        path: "/trainer",
        element: (
            <TrainerRoute>
                <Suspense fallback={<PageLoader />}>
                    <TrainerLayout />
                </Suspense>
            </TrainerRoute>
        ),
        children: [
            { index: true, element: <Navigate to="dashboard" replace /> },
            {
                path: "dashboard",
                element: <Suspense fallback={<PageLoader />}><DashboardTrainer /></Suspense>
            },
            {
                path: "calendar",
                element: <Suspense fallback={<PageLoader />}><TrainerCalendarPage /></Suspense>
            },
            {
                path: "attendance",
                element: <Suspense fallback={<PageLoader />}><TrainerAttendancePage /></Suspense>
            },
            {
                path: "students",
                element: <Suspense fallback={<PageLoader />}><TrainerStudentsPage /></Suspense>
            },
            {
                path: "messages",
                element: <Suspense fallback={<PageLoader />}><MessagePage /></Suspense>
            },
            {
                path: "profile",
                element: <Suspense fallback={<PageLoader />}><TrainerProfilePage /></Suspense>
            },
            {
                path: "settings",
                element: <Suspense fallback={<PageLoader />}><ConfigurationPage /></Suspense>
            },
        ]
    },
    {
        path: '*',
        element: (
            <Suspense fallback={null}>
                <Navigate to="/" replace />
            </Suspense>
        )
    }
])