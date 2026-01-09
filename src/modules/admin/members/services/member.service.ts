import type {
  Member,
  CreateMemberDTO,
  UpdateMemberDTO,
  MemberFilters,
  PaginationOptions,
  MemberStatus,
  MembershipStatus
} from '../types';
import { fitdeskApi } from '@/core/api/fitdeskApi';
import type { AxiosProgressEvent } from 'axios';

const BASE_URL = '/api/members';

export const memberService = {

  async getMembers(
    filters: MemberFilters = {},
    pagination: PaginationOptions = { page: 1, limit: 10 }
  ) {
    const params = new URLSearchParams();
    
    
    if (filters.status?.length) {
      filters.status.forEach(status => params.append('status', status));
    }
    if (filters.membershipStatus?.length) {
      filters.membershipStatus.forEach(status => params.append('membershipStatus', status));
    }
    if (filters.membershipType?.length) {
      filters.membershipType.forEach(type => params.append('membershipType', type));
    }
    if (filters.searchTerm) {
      params.append('search', filters.searchTerm);
    }
    if (filters.startDate) {
      params.append('startDate', filters.startDate);
    }
    if (filters.endDate) {
      params.append('endDate', filters.endDate);
    }

    params.append('page', pagination.page.toString());
    params.append('limit', pagination.limit.toString());
    if (pagination.sortBy) {
      params.append('sortBy', pagination.sortBy);
      params.append('sortOrder', pagination.sortOrder || 'asc');
    }

    const { data } = await fitdeskApi.get<{
      data: Member[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`${BASE_URL}?${params.toString()}`);

    return data;
  },

  
  async getMemberById(id: string): Promise<Member> {
    const { data } = await fitdeskApi.get<Member>(`${BASE_URL}/${id}`);
    return data;
  },

  
  async createMember(memberData: CreateMemberDTO): Promise<Member> {
    const formData = new FormData();
    
    
    Object.entries(memberData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'profileImage' && value instanceof File) {
          formData.append('profileImage', value);
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null) {
          formData.append(key, value.toString());
        }
      }
    });

    const { data } = await fitdeskApi.post<Member>(`${BASE_URL}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return data;
  },

  
  async updateMember(id: string, memberData: UpdateMemberDTO): Promise<Member> {
    const formData = new FormData();
    
  
    Object.entries(memberData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'profileImage' && value instanceof File) {
          formData.append('profileImage', value);
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null) {
          formData.append(key, value.toString());
        }
      }
    });

    const { data } = await fitdeskApi.put<Member>(`${BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  
  async deleteMember(id: string): Promise<void> {
    await fitdeskApi.delete(`${BASE_URL}/${id}`);
  },

  
  async updateMemberStatus(id: string, status: MemberStatus): Promise<Member> {
    const { data } = await fitdeskApi.patch<Member>(`${BASE_URL}/${id}/status`, { status });
    return data;
  },


  async updateMembershipStatus(
    id: string,
    status: MembershipStatus
  ): Promise<Member> {
    const { data } = await fitdeskApi.patch<Member>(`${BASE_URL}/${id}/membership-status`, { status });
    return data;
  },

 
  async renewMembership(
    id: string,
    endDate: string,
    status: MembershipStatus = 'ACTIVE'
  ): Promise<Member> {
    const { data } = await fitdeskApi.patch<Member>(
      `${BASE_URL}/${id}/membership/renew`,
      { endDate, status }
    );
    return data;
  },

  
  async uploadCertifications(
    memberId: string,
    files: File[],
    onUploadProgress?: (progress: number) => void
  ): Promise<void> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    await fitdeskApi.post(
      `${BASE_URL}/${memberId}/certifications`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onUploadProgress?.(progress);
          }
        },
      }
    );
  },

 
  async deleteCertification(
    memberId: string,
    certificationId: string
  ): Promise<void> {
    await fitdeskApi.delete(`${BASE_URL}/${memberId}/certifications/${certificationId}`);
  },

  async uploadFile(file: File, type: 'profile' | 'certification' = 'profile'): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const { data } = await fitdeskApi.post<{ url: string }>(`${BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return data;
  },

  async exportMembers(format: 'pdf' | 'excel' | 'csv' | 'xml' = 'pdf'): Promise<Blob> {
    const mimeTypes = {
      pdf: 'application/pdf',
      excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      csv: 'text/csv',
      xml: 'application/xml'
    };

    const response = await fitdeskApi.get<Blob>(`${BASE_URL}/export`, {
      params: { format },
      responseType: 'blob',
      headers: {
        'Accept': mimeTypes[format],
      },
    });
    
    return response.data;
  },
};
