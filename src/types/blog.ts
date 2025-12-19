// 博客相关类型定义

// 文章列表项
export interface PostListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string; // YYYY-MM-DD
  category: {
    id: string;
    name: string;
  };
  imageUrl?: string;
  readTime?: string;
  tags?: Array<{
    id: string;
    name: string;
  }>;
}

// 文章详情
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: string | {
    id: string;
    name: string;
  };
  readTime: string;
  imageUrl: string;
  content: string; // Markdown 格式
  excerpt?: string;
  tags?: Array<{
    id: string;
    name: string;
  }>;
  author?: {
    name: string;
    avatar?: string;
  };
  views?: number;
  likes?: number;
}

// 分页信息
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// 文章列表响应
export interface PostListResponse {
  posts: PostListItem[];
  pagination: Pagination;
}

// 个人信息
export interface ProfileInfo {
  name: string;
  avatar: string;
  bio: string;
  socialLinks: {
    github?: string;
    email?: string;
    twitter?: string;
    [key: string]: string | undefined;
  };
}

// 统计数据
export interface Statistics {
  articles: number;
  tags: number;
  categories: number;
}

// 标签
export interface Tag {
  id: string;
  name: string;
  count?: number;
}

// 分类
export interface Category {
  id: string;
  name: string;
  description?: string;
  count?: number;
}

// 侧边栏数据
export interface SidebarData {
  profile: ProfileInfo;
  statistics: Statistics;
  recentPosts: PostListItem[];
  tags: Tag[];
  categories: Category[];
  announcement?: string;
}

// 创建文章参数
export interface CreatePostParams {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: string;
  tags?: string[];
  imageUrl?: string;
  date?: string;
}

// 更新文章参数
export interface UpdatePostParams {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  imageUrl?: string;
  date?: string;
}

// 创建标签参数
export interface CreateTagParams {
  name: string;
}

// 更新标签参数
export interface UpdateTagParams {
  name: string;
}

// 创建分类参数
export interface CreateCategoryParams {
  name: string;
  description?: string;
}

// 更新分类参数
export interface UpdateCategoryParams {
  name: string;
  description?: string;
}

