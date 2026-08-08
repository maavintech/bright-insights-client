import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/admin/AdminLayout';

import Home from './pages/Home';
import Blog from './pages/Blog';
import CategoryPage from './pages/CategoryPage';
import PostDetail from './pages/PostDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminPosts from './pages/admin/AdminPosts';
import AdminPostForm from './pages/admin/AdminPostForm';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SiteSettingsProvider>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<PostDetail />} />
              <Route path="category/:slug" element={<CategoryPage />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
            </Route>

            <Route path="admin/login" element={<AdminLogin />} />
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="posts" element={<AdminPosts />} />
              <Route path="posts/new" element={<AdminPostForm />} />
              <Route path="posts/:id/edit" element={<AdminPostForm />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </SiteSettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
