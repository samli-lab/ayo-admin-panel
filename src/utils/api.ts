/**
 * API 工具模块
 *
 * 支持多个不同的 API 基础 URL，每个服务可以使用独立的 API 客户端。
 *
 * 使用示例：
 *
 * 1. 使用预定义的 API 客户端：
 *    import { blogApi, galleryApi, branchApi } from '@/utils/api';
 *
 *    // Blog API（使用 VITE_BLOG_API_URL 环境变量）
 *    const posts = await blogApi.get('/api/posts');
 *    await blogApi.post('/api/posts', data);
 *
 *    // Gallery API（使用默认 API_BASE_URL）
 *    const photos = await galleryApi.get('/api/gallery');
 *
 *    // Branch API（使用默认 API_BASE_URL）
 *    await branchApi.post('/api/scripts/1/branches', data);
 *
 * 2. 创建自定义 API 客户端：
 *    import { createApiClient } from '@/utils/api';
 *
 *    const customApi = createApiClient('https://api.example.com');
 *    const data = await customApi.get('/endpoint');
 *
 * 3. 使用默认 API 客户端（向后兼容）：
 *    import { apiGet, apiPost } from '@/utils/api';
 *
 *    const data = await apiGet('/api/endpoint');
 *    await apiPost('/api/endpoint', data);
 */

// API 配置
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// API 响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// API 错误类型
export interface ApiError {
  code: number;
  message: string;
  error?: {
    type: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}

// 获取认证 Token（从 localStorage 或其他地方）
const getAuthToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

// API 客户端接口
export interface ApiClient {
  get: <T>(endpoint: string, params?: Record<string, any>) => Promise<T>;
  post: <T>(endpoint: string, data?: any) => Promise<T>;
  put: <T>(endpoint: string, data?: any) => Promise<T>;
  delete: <T>(endpoint: string) => Promise<T>;
  request: <T>(endpoint: string, options?: RequestInit) => Promise<T>;
}

// 创建 API 客户端
export const createApiClient = (baseURL: string): ApiClient => {
  // 通用 API 请求函数
  const apiRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const token = getAuthToken();
    const url = `${baseURL}${endpoint}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const result: ApiResponse<T> | ApiError = await response.json();

      if (!response.ok) {
        throw new Error((result as ApiError).message || "请求失败");
      }

      const successCodes = [200, 201];
      if (!successCodes.includes((result as ApiResponse<T>).code)) {
        throw new Error((result as ApiResponse<T>).message || "请求失败");
      }

      return (result as ApiResponse<T>).data;
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  };

  return {
    get: <T>(endpoint: string, params?: Record<string, any>): Promise<T> => {
      let url = endpoint;
      if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        url += `?${searchParams.toString()}`;
      }
      return apiRequest<T>(url, { method: "GET" });
    },

    post: <T>(endpoint: string, data?: any): Promise<T> => {
      return apiRequest<T>(endpoint, {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      });
    },

    put: <T>(endpoint: string, data?: any): Promise<T> => {
      return apiRequest<T>(endpoint, {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      });
    },

    delete: <T>(endpoint: string): Promise<T> => {
      return apiRequest<T>(endpoint, { method: "DELETE" });
    },

    request: apiRequest,
  };
};

// 默认 API 客户端（使用默认的 API_BASE_URL）
const defaultApiClient = createApiClient(API_BASE_URL);

// 导出默认的 API 方法（保持向后兼容）
export const apiGet = defaultApiClient.get;
export const apiPost = defaultApiClient.post;
export const apiPut = defaultApiClient.put;
export const apiDelete = defaultApiClient.delete;
export const apiRequest = defaultApiClient.request;

// 预定义的 API 客户端实例
export const blogApi = createApiClient(
  import.meta.env.VITE_BLOG_API_URL || API_BASE_URL
);

export const branchApi = createApiClient(API_BASE_URL);

export const galleryApi = createApiClient(API_BASE_URL);
