// 认证服务 API

// 登录参数
export interface LoginParams {
  email: string;
  password: string;
}

// 登录响应数据结构
export interface LoginResponse {
  token: {
    type: string;
    value: string;
    expiresAt: string | null;
  };
  user: {
    id: string;
    email: string;
    fullName: string | null;
  };
}

// 登录（不使用 token，因为登录时还没有 token）
export const login = async (params: LoginParams): Promise<LoginResponse> => {
  const baseURL =
    import.meta.env.VITE_BLOG_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8000";
  const url = `${baseURL}/api/users/login`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      password: params.password,
    }),
  });

  const result = await response.json();

  if (!response.ok || (result.code !== 200 && result.code !== 201)) {
    throw new Error(result.message || "登录失败");
  }

  return result.data;
};

/**
 * 登出
 * 清除本地存储的 token 和用户信息
 */
export const logout = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_info");
};

/**
 * 检查是否已登录
 * @returns 如果已登录返回 true，否则返回 false
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("auth_token");
  return !!token;
};

/**
 * 获取当前登录用户信息
 * @returns 用户信息对象，如果未登录返回 null
 */
export const getCurrentUser = (): LoginResponse["user"] | null => {
  const userInfo = localStorage.getItem("user_info");
  if (!userInfo) {
    return null;
  }
  try {
    return JSON.parse(userInfo);
  } catch (error) {
    console.error("解析用户信息失败:", error);
    return null;
  }
};

/**
 * 获取当前 token
 * @returns token 字符串，如果未登录返回 null
 */
export const getToken = (): string | null => {
  return localStorage.getItem("auth_token");
};
