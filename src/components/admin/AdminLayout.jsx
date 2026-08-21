import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const linkClass = ({ isActive }) =>
  `block rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-brand-blue text-white' : 'text-brand-ink/70 hover:bg-brand-ink/5'
  }`;

export default function AdminLayout() {
  const { isAuthenticated, admin, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-brand-cream">
      <aside className="w-60 shrink-0 border-r border-brand-ink/10 bg-white p-4">
        <div className="mb-6 flex items-center gap-2 px-2">
          <span className="text-xl">🌟</span>
          <span className="font-bold text-brand-ink">Admin</span>
        </div>
        <nav className="space-y-1">
          <NavLink to="/admin" end className={linkClass}>Dashboard</NavLink>
          <NavLink to="/admin/categories" className={linkClass}>Categories</NavLink>
          <NavLink to="/admin/posts" className={linkClass}>Posts</NavLink>

          <p className="px-4 pb-1 pt-4 text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/35">
            Engagement
          </p>
          <NavLink to="/admin/daily-tips" className={linkClass}>Thought / Hack</NavLink>
          <NavLink to="/admin/polls" className={linkClass}>Polls</NavLink>
          <NavLink to="/admin/subscribers" className={linkClass}>Subscribers</NavLink>

          <p className="px-4 pb-1 pt-4 text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/35">
            Content
          </p>
          <NavLink to="/admin/resources" className={linkClass}>Downloads</NavLink>
          <NavLink to="/admin/videos" className={linkClass}>Videos</NavLink>
          <NavLink to="/admin/settings" className={linkClass}>Settings</NavLink>
        </nav>
        <div className="mt-8 border-t border-brand-ink/10 pt-4 px-2">
          <p className="truncate text-xs text-brand-ink/50">{admin?.email}</p>
          <button
            onClick={logout}
            className="mt-2 text-sm font-medium text-red-600 hover:underline"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
