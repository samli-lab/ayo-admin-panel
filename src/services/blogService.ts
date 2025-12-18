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
} from '../types/blog';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';

// 获取文章列表
export const getPosts = async (params?: {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
  search?: string;
}): Promise<PostListResponse> => {
  return apiGet<PostListResponse>('/api/posts', params);
};

// 根据 slug 获取文章详情
export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    return await apiGet<BlogPost>(`/api/posts/${slug}`);
  } catch (error) {
    console.error('获取文章失败:', error);
    return null;
  }
};

// 获取侧边栏数据
export const getSidebarData = async (): Promise<SidebarData> => {
  return apiGet<SidebarData>('/api/sidebar');
};

// 获取分类列表
export const getCategories = async (): Promise<Category[]> => {
  return apiGet<Category[]>('/api/categories');
};

// 获取标签列表
export const getTags = async (): Promise<Tag[]> => {
  return apiGet<Tag[]>('/api/tags');
};

// 根据分类获取文章列表
export const getPostsByCategory = async (
  category: string,
  params?: {
    page?: number;
    pageSize?: number;
  }
): Promise<PostListResponse> => {
  return apiGet<PostListResponse>(`/api/categories/${encodeURIComponent(category)}/posts`, params);
};

// 根据标签获取文章列表
export const getPostsByTag = async (
  tag: string,
  params?: {
    page?: number;
    pageSize?: number;
  }
): Promise<PostListResponse> => {
  return apiGet<PostListResponse>(`/api/tags/${encodeURIComponent(tag)}/posts`, params);
};

// 搜索文章
export const searchPosts = async (params: {
  q: string;
  page?: number;
  pageSize?: number;
}): Promise<PostListResponse> => {
  return apiGet<PostListResponse>('/api/posts/search', params);
};

// 创建文章
export const createPost = async (params: CreatePostParams): Promise<BlogPost> => {
  return apiPost<BlogPost>('/api/posts', params);
};

// 更新文章
export const updatePost = async (
  slug: string,
  params: UpdatePostParams
): Promise<BlogPost> => {
  return apiPut<BlogPost>(`/api/posts/${slug}`, params);
};

// 删除文章
export const deletePost = async (slug: string): Promise<void> => {
  return apiDelete<void>(`/api/posts/${slug}`);
};

// 创建标签
export const createTag = async (params: CreateTagParams): Promise<Tag> => {
  return apiPost<Tag>('/api/tags', params);
};

