import { useEffect } from "react";
import { useNavigate } from "react-router";
import { PageLoader } from "@/shared/components/page-loader";
import { useAuthStore } from "@/core/store/auth.store";
import { AuthService } from "@/core/services/auth.service";
import type { UserLogin } from "@/core/interfaces/auth.interface";

export const OAuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleOAuthCallback = async () => {
            const params = new URLSearchParams(window.location.search);
            const success = params.get("success");
            const error = params.get("error");

            if (error) {
                console.error("Error en OAuth:", error);
                navigate("/auth?error=oauth_failed");
                return;
            }

            if (success === "true") {
                try {
                    const meData = await AuthService.me();
                    
                    const roles = meData.authorities
                        .filter(auth => auth.authority.startsWith("ROLE_"))
                        .map(auth => auth.authority.replace("ROLE_", ""));
                    
                    console.log("Roles del usuario OAuth2:", roles);
                    
                    const user: UserLogin = {
                        id: meData.id,
                        email: meData.email,
                        roles,
                    };

                    useAuthStore.setState({ 
                        user, 
                        authStatus: 'authenticated' 
                    });

                    if (roles.includes("ADMIN")) {
                        navigate("/admin");
                    } else if (roles.includes("TRAINER")) {
                        navigate("/trainer");
                    } else {
                        navigate("/client");
                    }
                    
                } catch (error) {
                    console.error("Error al verificar autenticación:", error);
                    navigate("/auth?error=auth_check_failed");
                }
            } else {
                navigate("/auth?error=oauth_failed");
            }
        };

        handleOAuthCallback();
    }, [navigate]);

    return <PageLoader />;
};