// 博客相关类型定义

// 文章列表项
export interface PostListItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string; // YYYY-MM-DD
  category: string;
  imageUrl?: string;
  readTime?: string;
  tags?: string[];
}

// 文章详情
export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: string;
  readTime: string;
  imageUrl: string;
  content: string; // Markdown 格式
  excerpt?: string;
  tags?: string[];
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
  id: number;
  name: string;
  count?: number;
}

// 分类
export interface Category {
  id: number;
  name: string;
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

