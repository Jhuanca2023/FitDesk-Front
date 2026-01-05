import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import type { AuthRequestLogin } from "../interfaces/auth.interface";

export const useAuth = () => {
  const loginStore = useAuthStore((state) => state.login);

  const loginMutation = useMutation({
    mutationFn: (credentials: AuthRequestLogin) => AuthService.login(credentials),
    onSuccess: async (data, credentials) => {
      if (data.success) {
        await loginStore(credentials);
      } else {
        useAuthStore.setState({ user: null, authStatus: "not-authenticated" });
      }
    },
    onError: () => {
      useAuthStore.setState({ user: null, authStatus: "not-authenticated" });
    },
  });


  return {
    loginMutation,
    
  };
};