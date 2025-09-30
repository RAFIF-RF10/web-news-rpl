// Router.js
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import News from "./pages/News";
import AllNews from "./pages/AllNews";
import NewsDetail from "./pages/NewsDetail";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import AdminIndex from "./pages/Admin/Index";
import AuthorDashboard from "./pages/Author/Dashboard";
import AuthorIndex from "./pages/Author/Index";
import { Dashboard } from "./pages/Admin/Dashboard";
import Berita from "./pages/Admin/Berita";
import AddBerita from "./pages/Admin/AddBerita";
import Login from "./pages/Admin/Login";
import Gallery from "./pages/Gallery";
import GalleryAdmin from "./pages/Admin/GalleryAdmin";
import Settings from "./pages/Admin/Settings";
import UserManagement from "./pages/Admin/UserManagement";
import AddGallery from "./pages/Admin/AddGallery";
import EditBerita from "./pages/Admin/EditBerita";
import AddBeritaAuthor from "./pages/Author/AddBeritaAuthor";
import BeritaAuthor from "./pages/Author/BeritaAuthor";
import NotFound from "./components/NotFound";
import EditGallery from "./pages/Admin/EditGallery";
import EditBeritaAuthor from "./pages/Author/EditBeritaAuthor";
import SettingsAuthor from "./pages/Author/SettingsAuthor";
// import EditBeritaAuthor from "./pages/Author/EditBeritaAuthor";

const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

const ProtectedAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  if (!user || user.role !== "admin") {
    return <Navigate to="/author" replace />;
  }
  return children;
};

// ✅ Author only
const ProtectedAuthorRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  if (!user || user.role !== "author") {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/news/all" element={<AllNews />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminIndex />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="news" element={<Berita />} />
          <Route path="news/add" element={<AddBerita />} />
          <Route path="news/edit/:id" element={<EditBerita />} />
          <Route path="galleryAdmin" element={<GalleryAdmin />} />
          <Route path="gallery/add" element={<AddGallery />} />
          <Route path="gallery/edit/:id" element={<EditGallery />} />

          <Route path="userManagement" element={<UserManagement />} />
          <Route path="analytics" element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={<UserManagement />} />
        </Route>

        {/* Author routes */}
        <Route
          path="/author"
          element={
            <ProtectedAuthorRoute>
              <AuthorIndex />
            </ProtectedAuthorRoute>
          }
        >
          <Route index element={<AuthorDashboard />} />
          <Route path="news/add-author" element={<AddBeritaAuthor />} />
          <Route path="news/" element={<BeritaAuthor />} />
          <Route path="news/edit/:id" element={<EditBeritaAuthor />} />
          <Route path="settings" element={<SettingsAuthor />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
