/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';


export interface ApiResponse<T = unknown> {
  data?: T;
  error?: {
    message: string;
    code?: string | number;
    details?: unknown;
  };
  status?: number;
}


class FitdeskApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      timeout: 10000,
      withCredentials: true
    });

    this.initializeRequestInterceptor();
    this.initializeResponseInterceptor();
  }

  public async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  public async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  public async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  public async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }

  public async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }



  private initializeRequestInterceptor() {
    this.instance.interceptors.request.use(
      (config) => {
        
        try {
          const method = (config.method || 'get').toLowerCase();
          const needsCsrf = method === 'post' || method === 'put' || method === 'patch' || method === 'delete';
          const hasHeader = !!config.headers && ('X-XSRF-TOKEN' in (config.headers as Record<string, unknown>) || 'x-xsrf-token' in (config.headers as Record<string, unknown>));
          if (needsCsrf && !hasHeader) {
            const token = getCookie('XSRF-TOKEN');
            if (token) {
              const headers = (config.headers ?? {}) as Record<string, unknown>;
              headers['X-XSRF-TOKEN'] = token;
              config.headers = headers as any;
            }
          }
        } catch {}
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  private initializeResponseInterceptor() {
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { data, status } = error.response;
        const message = (data as any)?.message || error.message || 'An error occurred';
        return new Error(`[${status}] ${message}`);
      } else if (error.request) {
        return new Error('No response received from server. Please check your connection.');
      }
    }
    return error instanceof Error ? error : new Error('Un error desconocido a ocurrido');
  }
}

const fitdeskApi = new FitdeskApiClient();
export { fitdeskApi };


function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}