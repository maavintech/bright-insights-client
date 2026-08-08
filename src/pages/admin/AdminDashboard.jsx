import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ categories: 0, posts: 0, published: 0, drafts: 0 });

  useEffect(() => {
    Promise.all([api.get('/admin/categories'), api.get('/admin/posts')]).then(
      ([catRes, postRes]) => {
        const posts = postRes.data;
        setStats({
          categories: catRes.data.length,
          posts: posts.length,
          published: posts.filter((p) => p.status === 'published').length,
          drafts: posts.filter((p) => p.status === 'draft').length,
        });
      }
    );
  }, []);

  const cards = [
    { label: 'Categories', value: stats.categories, to: '/admin/categories' },
    { label: 'Total Posts', value: stats.posts, to: '/admin/posts' },
    { label: 'Published', value: stats.published, to: '/admin/posts?status=published' },
    { label: 'Drafts', value: stats.drafts, to: '/admin/posts?status=draft' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-ink">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="rounded-2xl border border-brand-ink/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-3xl font-extrabold text-brand-blue">{c.value}</p>
            <p className="mt-1 text-sm text-brand-ink/60">{c.label}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 flex gap-3">
        <Link
          to="/admin/posts/new"
          className="rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue-dark"
        >
          + New Post
        </Link>
        <Link
          to="/admin/categories"
          className="rounded-full border border-brand-ink/15 px-5 py-2.5 text-sm font-semibold text-brand-ink hover:border-brand-blue/40"
        >
          Manage Categories
        </Link>
      </div>
    </div>
  );
}
