/** biome-ignore-all lint/complexity/noStaticOnlyClass: <> */
import { fitdeskApi } from "../api/fitdeskApi";
import type {
  ImageUploadResponseDto,
  MemberFilters,
  MemberPageResponse,
  MemberRequest,
  MemberResponse,
  MemberSecurityData,
  UpdateMemberPayload,
} from "../interfaces/member.interface";
import type { UserMemberships } from "../interfaces/plan.interface";

export class MemberService {
  static async getAllMembers(
    filters?: MemberFilters,
  ): Promise<MemberPageResponse> {
    try {
      const params = new URLSearchParams();

      if (filters?.search) params.append("search", filters.search);
      if (filters?.dni) params.append("dni", filters.dni);
      if (filters?.email) params.append("email", filters.email);
      if (filters?.firstName) params.append("firstName", filters.firstName);
      if (filters?.lastName) params.append("lastName", filters.lastName);
      if (filters?.membershipStatus)
        params.append("membershipStatus", filters.membershipStatus);

      params.append("page", String(filters?.page ?? 0));
      params.append("size", String(filters?.size ?? 10));
      params.append("sortField", filters?.sortField ?? "firstName");
      params.append("sortDirection", filters?.sortDirection ?? "asc");

      const { data } = await fitdeskApi.get<MemberPageResponse>(
        `/members/member?${params.toString()}`,
      );
      console.log("MemberService.getAllMembers response", data);
      return data;
    } catch (error) {
      throw new Error(
        `Error al obtener todos los miembros: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  static async getMemberByIdWithSecurity(
    id: string,
  ): Promise<MemberSecurityData> {
    try {
      const { data } = await fitdeskApi.get<MemberSecurityData>(
        `/members/member/user-security/${id}`,
      );
      return data;
    } catch (error) {
      throw new Error(
        `Error al obtener el miembro con ID ${id}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  static async getMemberById(id: string): Promise<MemberResponse> {
    try {
      const { data } = await fitdeskApi.get<MemberResponse>(
        `/members/member/user/${id}`,
      );
      return data;
    } catch (error) {
      throw new Error(
        `Error al obtener el miembro con ID ${id}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  static async updateMember(
    id: string,
    payload: UpdateMemberPayload,
  ): Promise<MemberResponse> {
    const formData = new FormData();
    try {
      if (Object.keys(payload.memberData).length > 0) {
        const memberDtoBlob = new Blob([JSON.stringify(payload.memberData)], {
          type: "application/json",
        });
        formData.append("member", memberDtoBlob);
      }

      if (payload.profileImage) {
        formData.append("profileImage", payload.profileImage);
      }
      const resp = await fitdeskApi.patch<MemberResponse>(
        `/members/member/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return resp.data;
    } catch (error) {
      throw new Error(
        `Error al actualizar el miembro: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  static async updateProfileImage(
    userId: string,
    file: File,
  ): Promise<ImageUploadResponseDto> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await fitdeskApi.post<ImageUploadResponseDto>(
        `/members/member/${userId}/profile-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return data;
    } catch (error) {
      throw new Error(
        `Error al actualizar la foto de perfil: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  static async getMyMembership(): Promise<UserMemberships> {
    try {
      const response = await fitdeskApi.get<UserMemberships>(
        `/members/memberships/my-active-membership`,
      );
      return response.data;
    } catch (error) {
      console.error("Error obteniendo membresía del usuario:", error);
      throw new Error(
        (error instanceof Error && error.message) ||
          "Error al obtener la membresía del usuario",
      );
    }
  }
}
