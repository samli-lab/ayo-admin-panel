import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import ScriptsPage from "./pages/scripts";
import CreateScriptPage from "./pages/scripts/create";
import ScriptDetail from "./pages/script-editor";
import VideosPage from "./pages/videos";
import TagsPage from "./pages/tags";
import BlogListPage from "./pages/blog/list";
import CreateBlogPage from "./pages/blog/create";
import BlogEditPage from "./pages/blog/edit";
import BlogDetailPage from "./pages/blog/detail";
import CategoryPage from "./pages/blog/category";
import TagManagementPage from "./pages/blog/tag";
import GalleryListPage from "./pages/blog/gallery/list";
import CreateGalleryPage from "./pages/blog/gallery/create";
import EditGalleryPage from "./pages/blog/gallery/edit";
import GalleryDetailPage from "./pages/blog/gallery/detail";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 登录页面不需要保护 */}
        <Route path="/login" element={<Login />} />

        {/* 所有其他页面都需要登录才能访问 */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/scripts" element={<ProtectedRoute><ScriptsPage /></ProtectedRoute>} />
        <Route path="/scripts/create" element={<ProtectedRoute><CreateScriptPage /></ProtectedRoute>} />
        <Route path="/script/:id" element={<ProtectedRoute><ScriptDetail /></ProtectedRoute>} />
        <Route path="/videos" element={<ProtectedRoute><VideosPage /></ProtectedRoute>} />
        <Route path="/tags" element={<ProtectedRoute><TagsPage /></ProtectedRoute>} />
        <Route path="/blog/create" element={<ProtectedRoute><CreateBlogPage /></ProtectedRoute>} />
        <Route path="/blog/edit/:slug" element={<ProtectedRoute><BlogEditPage /></ProtectedRoute>} />
        <Route path="/blog/posts/:slug" element={<ProtectedRoute><BlogDetailPage /></ProtectedRoute>} />
        <Route path="/blog/category" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
        <Route path="/blog/tag" element={<ProtectedRoute><TagManagementPage /></ProtectedRoute>} />
        <Route path="/blog/list" element={<ProtectedRoute><BlogListPage /></ProtectedRoute>} />
        <Route path="/blog/gallery/list" element={<ProtectedRoute><GalleryListPage /></ProtectedRoute>} />
        <Route path="/blog/gallery/create" element={<ProtectedRoute><CreateGalleryPage /></ProtectedRoute>} />
        <Route path="/blog/gallery/edit/:id" element={<ProtectedRoute><EditGalleryPage /></ProtectedRoute>} />
        <Route path="/blog/gallery/:id" element={<ProtectedRoute><GalleryDetailPage /></ProtectedRoute>} />
        <Route path="/blog/gallery" element={<Navigate to="/blog/gallery/list" replace />} />
        <Route path="/blog" element={<Navigate to="/blog/list" replace />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
