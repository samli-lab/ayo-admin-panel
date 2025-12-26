// 相册照片类型定义

export interface Photo {
  id: string;
  title: string;
  description: string | null;
  url: string;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface PhotoListResponse {
  photos: Photo[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface CreatePhotoParams {
  title: string;
  url: string;
  description?: string;
  sortOrder?: number;
}

export interface UpdatePhotoParams {
  title?: string;
  url?: string;
  description?: string;
  sortOrder?: number;
}

