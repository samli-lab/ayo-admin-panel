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
