import type {
  MemberRequest,
  MemberResponse,
  UpdateMemberPayload,
} from "@/core/interfaces/member.interface";
import { MemberService } from "@/core/services/member.service";
import { toast } from "@/shared/components/ui/toast-provider";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useGetMemberQuery = (id: string) =>
  useQuery({
    queryKey: ["member", id],
    queryFn: () => MemberService.getMemberById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

export const useUpdateProfileImageMutation = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file }: { file: File }) =>
      MemberService.updateProfileImage(userId, file),

    onMutate: async ({ file }) => {
      await queryClient.cancelQueries({ queryKey: ["member", userId] });
      const previousMemberData = queryClient.getQueryData<MemberResponse>([
        "member",
        userId,
      ]);

      const tempImageUrl = URL.createObjectURL(file);
      queryClient.setQueryData<MemberResponse>(
        ["member", userId],
        (oldData) => {
          if (!oldData) return undefined;
          return {
            ...oldData,
            profileImageUrl: tempImageUrl,
          };
        },
      );

      return { previousMemberData, tempImageUrl };
    },

    onError: (err, variables, context) => {
      if (context?.previousMemberData) {
        queryClient.setQueryData(
          ["member", userId],
          context.previousMemberData,
        );
      }
      toast.error(`Error al subir la imagen: ${err.message}`);
    },

    onSettled: (data, error, variables, context) => {
      if (context?.tempImageUrl) {
        URL.revokeObjectURL(context.tempImageUrl);
      }
      queryClient.invalidateQueries({ queryKey: ["member", userId] });
    },

    onSuccess: () => {
      toast.success("¡Foto de perfil actualizada con éxito!");
    },
  });
};
export const useUpdateMemberMutation = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        // La función de mutación ahora espera nuestro tipo de payload específico
        mutationFn: (payload: UpdateMemberPayload) => MemberService.updateMember(userId, payload),

        // Actualización optimista
        onMutate: async (payload: UpdateMemberPayload) => {
            await queryClient.cancelQueries({ queryKey: ["member", userId] });
            const previousMemberData = queryClient.getQueryData<MemberResponse>(["member", userId]);

            let tempImageUrl: string | null = null;
            queryClient.setQueryData<MemberResponse>(["member", userId], (oldData) => {
                if (!oldData) return undefined;

                if (payload.profileImage) {
                    tempImageUrl = URL.createObjectURL(payload.profileImage);
                }

                return {
                    ...oldData,
                    ...payload.memberData,
                    profileImageUrl: tempImageUrl ?? oldData.profileImageUrl, 
                };
            });

            return { previousMemberData, tempImageUrl };
        },

        onError: (err, variables, context) => {
            if (context?.previousMemberData) {
                queryClient.setQueryData(["member", userId], context.previousMemberData);
            }
            toast.error(`Error al actualizar el perfil: ${err.message}`);
        },

        onSettled: (data, error, variables, context) => {
            if (context?.tempImageUrl) {
                URL.revokeObjectURL(context.tempImageUrl);
            }
            queryClient.invalidateQueries({ queryKey: ["member", userId] });
        },

        onSuccess: () => {
            toast.success("¡Perfil actualizado con éxito!");
        }
    });
};