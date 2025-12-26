// 博客服务 API
import {
  BlogPost,
  PostListResponse,
  SidebarData,
  Tag,
  Category,
  CreatePostParams,
  UpdatePostParams,
  CreateTagParams,
  UpdateTagParams,
  CreateCategoryParams,
  UpdateCategoryParams,
} from "../types/blog";
import { blogApi } from "../utils/api";

// 获取文章列表
export const getPosts = async (params?: {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
  search?: string;
}): Promise<PostListResponse> => {
  return blogApi.get<PostListResponse>("/api/posts", params);
};

// 根据 slug 获取文章详情
export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    return await blogApi.get<BlogPost>(`/api/posts/${slug}`);
  } catch (error) {
    console.error("获取文章失败:", error);
    return null;
  }
};

// 获取侧边栏数据
export const getSidebarData = async (): Promise<SidebarData> => {
  return blogApi.get<SidebarData>("/api/sidebar");
};

// 获取分类列表
export const getCategories = async (): Promise<Category[]> => {
  return blogApi.get<Category[]>("/api/categories");
};

// 获取标签列表
export const getTags = async (): Promise<Tag[]> => {
  return blogApi.get<Tag[]>("/api/tags");
};

// 根据分类获取文章列表
export const getPostsByCategory = async (
  category: string,
  params?: {
    page?: number;
    pageSize?: number;
  }
): Promise<PostListResponse> => {
  return blogApi.get<PostListResponse>(
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
  return blogApi.get<PostListResponse>(
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
  return blogApi.get<PostListResponse>("/api/posts/search", params);
};

// 创建文章
export const createPost = async (
  params: CreatePostParams
): Promise<BlogPost> => {
  return blogApi.post<BlogPost>("/api/posts", params);
};

// 更新文章
export const updatePost = async (
  slug: string,
  params: UpdatePostParams
): Promise<BlogPost> => {
  return blogApi.put<BlogPost>(`/api/posts/${slug}`, params);
};

// 删除文章
export const deletePost = async (slug: string): Promise<void> => {
  return blogApi.delete<void>(`/api/posts/${slug}`);
};

// 创建标签
export const createTag = async (params: CreateTagParams): Promise<Tag> => {
  return blogApi.post<Tag>("/api/tags", params);
};

// 更新标签
export const updateTag = async (
  id: string | number,
  params: UpdateTagParams
): Promise<Tag> => {
  return blogApi.put<Tag>(`/api/tags/${id}`, params);
};

// 删除标签
export const deleteTag = async (id: string | number): Promise<void> => {
  return blogApi.delete<void>(`/api/tags/${id}`);
};

// 创建分类
export const createCategory = async (
  params: CreateCategoryParams
): Promise<Category> => {
  return blogApi.post<Category>("/api/categories", params);
};

// 更新分类
export const updateCategory = async (
  id: string | number,
  params: UpdateCategoryParams
): Promise<Category> => {
  return blogApi.put<Category>(`/api/categories/${id}`, params);
};

// 删除分类
export const deleteCategory = async (id: string | number): Promise<void> => {
  return blogApi.delete<void>(`/api/categories/${id}`);
};

// 上传图片/附件
export const uploadFile = async (
  file: File
): Promise<{ url: string; key: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  // 使用统一的 API 客户端
  return blogApi.post<{ url: string; key: string }>(
    "/api/posts/upload",
    formData
  );
};
