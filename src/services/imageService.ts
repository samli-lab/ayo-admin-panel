import { apiPost } from "@/utils/api";

export interface ImageGenerateRequest {
  prompt: string;
  image?: File; // 用于图生图的原始文件
}

export interface ImageGenerateResponse {
  images: string[]; // 返回生成的图片数据（通常是 Base64）
}

/**
 * AI 图片生成服务
 */
export const imageService = {
  /**
   * 测试接口：图生图 (form-data)
   * 接口返回格式: { success: true, data: { result: "base64...", ... } }
   */
  generateImageTest: async (prompt: string, image?: File): Promise<string> => {
    const formData = new FormData();
    formData.append("prompt", prompt);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("http://localhost:3333/api/ai/test/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
      }

      const result = await response.json();
      if (result.success && result.data && result.data.result) {
        return result.data.result;
      } else {
        throw new Error(result.message || "接口返回格式错误");
      }
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  },

  /**
   * 通用文生图 / 图生图 (维持原样以备后用)
   */
  generateImage: async (data: any): Promise<ImageGenerateResponse> => {
    return apiPost<ImageGenerateResponse>("/api/ai/image-generate", data);
  },
};
