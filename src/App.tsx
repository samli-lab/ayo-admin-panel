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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scripts" element={<ScriptsPage />} />
        <Route path="/scripts/create" element={<CreateScriptPage />} />
        <Route path="/script/:id" element={<ScriptDetail />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/tags" element={<TagsPage />} />
        <Route path="/blog/create" element={<CreateBlogPage />} />
        <Route path="/blog/edit/:slug" element={<BlogEditPage />} />
        <Route path="/blog/posts/:slug" element={<BlogDetailPage />} />
        <Route path="/blog/category" element={<CategoryPage />} />
        <Route path="/blog/tag" element={<TagManagementPage />} />
        <Route path="/blog/list" element={<BlogListPage />} />
        <Route path="/blog" element={<Navigate to="/blog/list" replace />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
