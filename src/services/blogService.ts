// 博客服务 API
import {
  PostListItem,
  BlogPost,
  PostListResponse,
  SidebarData,
  Tag,
  Category,
  CreatePostParams,
  UpdatePostParams,
  CreateTagParams,
} from "../types/blog";
import { ApiResponse, ApiError } from "../utils/api";

// 博客 API 基础 URL
const BLOG_API_BASE_URL =
  import.meta.env.VITE_BLOG_API_URL || "http://localhost:8000";

// 获取认证 Token
const getAuthToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

// 博客 API 请求函数
const blogApiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  const url = `${BLOG_API_BASE_URL}${endpoint}`;

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

    if ((result as ApiResponse<T>).code !== 200) {
      throw new Error((result as ApiResponse<T>).message || "请求失败");
    }

    return (result as ApiResponse<T>).data;
  } catch (error) {
    console.error("Blog API Request Error:", error);
    throw error;
  }
};

// GET 请求
const blogApiGet = <T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<T> => {
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
  return blogApiRequest<T>(url, { method: "GET" });
};

// POST 请求
const blogApiPost = <T>(endpoint: string, data?: any): Promise<T> => {
  return blogApiRequest<T>(endpoint, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
};

// PUT 请求
const blogApiPut = <T>(endpoint: string, data?: any): Promise<T> => {
  return blogApiRequest<T>(endpoint, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
};

// DELETE 请求
const blogApiDelete = <T>(endpoint: string): Promise<T> => {
  return blogApiRequest<T>(endpoint, { method: "DELETE" });
};

// 获取文章列表
export const getPosts = async (params?: {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
  search?: string;
}): Promise<PostListResponse> => {
  return blogApiGet<PostListResponse>("/api/posts", params);
};

// 根据 slug 获取文章详情
export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    return await blogApiGet<BlogPost>(`/api/posts/${slug}`);
  } catch (error) {
    console.error("获取文章失败:", error);
    return null;
  }
};

// 获取侧边栏数据
export const getSidebarData = async (): Promise<SidebarData> => {
  return blogApiGet<SidebarData>("/api/sidebar");
};

// 获取分类列表
export const getCategories = async (): Promise<Category[]> => {
  return blogApiGet<Category[]>("/api/categories");
};

// 获取标签列表
export const getTags = async (): Promise<Tag[]> => {
  return blogApiGet<Tag[]>("/api/tags");
};

// 根据分类获取文章列表
export const getPostsByCategory = async (
  category: string,
  params?: {
    page?: number;
    pageSize?: number;
  }
): Promise<PostListResponse> => {
  return blogApiGet<PostListResponse>(
    `/api/categories/${encodeURIComponent(category)}/posts`,
    params
  );
};

// 根据标签获取文章列表
export const getPostsByTag = async (
  tag: string,
  params?: {
    page?: number;
    pageSize?: number;
  }
): Promise<PostListResponse> => {
  return blogApiGet<PostListResponse>(
    `/api/tags/${encodeURIComponent(tag)}/posts`,
    params
  );
};

// 搜索文章
export const searchPosts = async (params: {
  q: string;
  page?: number;
  pageSize?: number;
}): Promise<PostListResponse> => {
  return blogApiGet<PostListResponse>("/api/posts/search", params);
};

// 创建文章
export const createPost = async (
  params: CreatePostParams
): Promise<BlogPost> => {
  return blogApiPost<BlogPost>("/api/posts", params);
};

// 更新文章
export const updatePost = async (
  slug: string,
  params: UpdatePostParams
): Promise<BlogPost> => {
  return blogApiPut<BlogPost>(`/api/posts/${slug}`, params);
};

// 删除文章
export const deletePost = async (slug: string): Promise<void> => {
  return blogApiDelete<void>(`/api/posts/${slug}`);
};

// 创建标签
export const createTag = async (params: CreateTagParams): Promise<Tag> => {
  return blogApiPost<Tag>("/api/tags", params);
};
