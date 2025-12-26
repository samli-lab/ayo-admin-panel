// 相册照片服务 API
import {
  Photo,
  PhotoListResponse,
  CreatePhotoParams,
  UpdatePhotoParams,
} from "../types/gallery";
import { blogApi } from "../utils/api";

// 相册 API 基础路径
const GALLERY_API_BASE = "/api/gallery";

// 获取照片列表
export const getPhotos = async (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<PhotoListResponse> => {
  return blogApi.get<PhotoListResponse>(GALLERY_API_BASE, params);
};

// 获取单张照片详情
export const getPhotoById = async (id: string): Promise<Photo> => {
  return blogApi.get<Photo>(`${GALLERY_API_BASE}/${id}`);
};

// 创建照片
export const createPhoto = async (
  params: CreatePhotoParams
): Promise<Photo> => {
  return blogApi.post<Photo>(GALLERY_API_BASE, params);
};

// 更新照片
export const updatePhoto = async (
  id: string,
  params: UpdatePhotoParams
): Promise<Photo> => {
  return blogApi.put<Photo>(`${GALLERY_API_BASE}/${id}`, params);
};

// 删除照片
export const deletePhoto = async (id: string): Promise<void> => {
  return blogApi.delete<void>(`${GALLERY_API_BASE}/${id}`);
};
