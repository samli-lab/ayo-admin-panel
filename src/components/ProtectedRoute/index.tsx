import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * 路由守卫组件
 * 检查用户是否已登录，未登录则重定向到登录页面
 */
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  
  // 从 localStorage 中获取 token
  const token = localStorage.getItem("auth_token");
  
  // 如果没有 token，重定向到登录页面，并保存当前路径用于登录后跳转回来
  if (!token) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }
  
  // 有 token，允许访问
  return <>{children}</>;
}

export default ProtectedRoute;

