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
import CreateTagPage from "./pages/blog/tag/create";

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
        <Route path="/blog/tag/create" element={<CreateTagPage />} />
        <Route path="/blog/list" element={<BlogListPage />} />
        <Route path="/blog" element={<Navigate to="/blog/list" replace />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
