# 认证系统文档

## 概述

本项目已实现完整的登录认证保护机制，确保所有页面在访问前都会检查用户的登录状态。

## 实现的功能

### 1. 路由守卫 (`ProtectedRoute`)

创建了 `/src/components/ProtectedRoute/index.tsx` 组件，用于保护需要登录才能访问的路由。

**工作原理：**
- 检查 `localStorage` 中是否存在 `auth_token`
- 如果没有 token，自动重定向到登录页面
- 重定向时会保存当前路径，登录成功后可以跳转回来
- 如果有 token，允许访问页面

**使用方式：**
```tsx
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
```

### 2. 受保护的路由

以下页面已全部添加登录保护：
- Dashboard（首页）
- Scripts（剧本管理）
- Videos（视频管理）
- Tags（标签管理）
- Blog 相关页面（列表、创建、编辑、详情、分类、标签）
- Gallery 相关页面（列表、创建、编辑、详情）

**唯一例外：** `/login` 登录页面不需要保护

### 3. 登录页面优化

登录页面 (`/src/pages/login/index.tsx`) 已优化：
- 如果用户已经登录（有 token），自动跳转到首页或重定向目标页面
- 避免已登录用户重复登录

### 4. 认证服务增强

在 `/src/services/authService.ts` 中新增以下工具函数：

#### `logout()`
```typescript
logout(): void
```
退出登录，清除本地存储的 token 和用户信息。

#### `isAuthenticated()`
```typescript
isAuthenticated(): boolean
```
检查用户是否已登录。

#### `getCurrentUser()`
```typescript
getCurrentUser(): User | null
```
获取当前登录用户的信息。

#### `getToken()`
```typescript
getToken(): string | null
```
获取当前的认证 token。

### 5. 布局组件优化

`AppLayout` 组件 (`/src/components/AppLayout/index.tsx`) 已更新：
- 显示真实的用户名（从 `getCurrentUser()` 获取）
- 退出登录时正确清除 token 和用户信息
- 使用 `logout()` 函数确保完全退出

## 登录流程

1. **未登录用户访问受保护页面**
   - 自动重定向到 `/login?redirect=/目标页面`
   - 用户看到登录界面

2. **用户输入凭证并登录**
   - 调用 `login()` API
   - 成功后将 token 保存到 `localStorage`
   - 保存用户信息到 `localStorage`
   - 跳转到重定向目标或默认首页

3. **登录后访问**
   - `ProtectedRoute` 检查到 token 存在
   - 允许访问页面

4. **退出登录**
   - 用户点击"退出登录"
   - 调用 `logout()` 清除本地数据
   - 重定向到登录页面

## 安全性说明

### Token 存储
- Token 存储在 `localStorage` 中（键名：`auth_token`）
- 用户信息存储在 `localStorage` 中（键名：`user_info`）

### 注意事项
1. **客户端验证**：当前实现仅在前端检查 token 是否存在，实际的 token 验证应该在后端 API 中进行
2. **Token 过期**：建议在 API 请求拦截器中处理 token 过期的情况（如 401 响应时自动退出）
3. **XSS 防护**：确保应用没有 XSS 漏洞，防止 token 被窃取

## 建议的后续优化

1. **Token 刷新机制**
   - 实现 token 自动刷新
   - 在 token 即将过期时自动续期

2. **API 拦截器**
   - 统一处理 401 未授权响应
   - 自动在请求头中添加 token

3. **记住登录状态**
   - 支持"记住我"功能
   - 使用 refresh token 机制

4. **更安全的存储方式**
   - 考虑使用 httpOnly cookie
   - 或者实现更安全的 token 存储方案

## 测试建议

### 测试场景

1. **未登录访问测试**
   - 直接访问 `/dashboard`
   - 应该重定向到 `/login?redirect=%2Fdashboard`

2. **登录流程测试**
   - 输入正确的邮箱和密码
   - 应该成功登录并跳转到首页或重定向页面
   - token 应该保存到 localStorage

3. **已登录访问测试**
   - 登录后访问各个页面
   - 应该可以正常访问，不被重定向

4. **退出登录测试**
   - 点击退出登录
   - 应该清除 token 并跳转到登录页面
   - 再次访问受保护页面应该被拦截

5. **已登录访问登录页测试**
   - 已登录的情况下访问 `/login`
   - 应该自动跳转到首页

## 文件清单

新增/修改的文件：
- `/src/components/ProtectedRoute/index.tsx` - 路由守卫组件（新增）
- `/src/App.tsx` - 更新所有路由，添加保护
- `/src/pages/login/index.tsx` - 添加已登录用户自动跳转
- `/src/services/authService.ts` - 新增认证工具函数
- `/src/components/AppLayout/index.tsx` - 更新退出登录逻辑

