import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../api/client';

export default function AdminPosts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status') || '';
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/categories').then((res) => setCategories(res.data));
  }, []);

  function load() {
    setLoading(true);
    api
      .get('/admin/posts', { params: { status: status || undefined } })
      .then((res) => setPosts(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(load, [status]);

  async function handleDelete(post) {
    if (!confirm(`Delete post "${post.title}"?`)) return;
    await api.delete(`/admin/posts/${post.id}`);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-ink">Posts</h1>
        <Link
          to="/admin/posts/new"
          className="rounded-full bg-brand-blue px-5 py-2 text-sm font-semibold text-white hover:bg-brand-blue-dark"
        >
          + New Post
        </Link>
      </div>

      <div className="mt-4 flex gap-2">
        {['', 'published', 'draft'].map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setSearchParams(s ? { status: s } : {})}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              status === s
                ? 'bg-brand-blue text-white'
                : 'border border-brand-ink/15 text-brand-ink/70'
            }`}
          >
            {s ? s[0].toUpperCase() + s.slice(1) : 'All'}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-brand-ink/10 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-ink/5 text-brand-ink/60">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-4 text-brand-ink/50" colSpan={5}>Loading…</td></tr>
            ) : posts.length === 0 ? (
              <tr><td className="px-4 py-4 text-brand-ink/50" colSpan={5}>No posts yet.</td></tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-t border-brand-ink/5">
                  <td className="px-4 py-3 font-medium text-brand-ink">{post.title}</td>
                  <td className="px-4 py-3 text-brand-ink/60">{post.category?.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-brand-ink/50">
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/posts/${post.id}/edit`}
                      className="mr-3 font-medium text-brand-blue hover:underline"
                    >
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(post)} className="font-medium text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {categories.length === 0 && !loading && (
        <p className="mt-4 text-sm text-brand-ink/50">
          Tip: create a category first so you can assign posts to it.
        </p>
      )}
    </div>
  );
}
