import { useEffect, useState } from 'react';
import api from '../../api/client';

const EMPTY = {
  title: '',
  description: '',
  platform: 'youtube',
  url: '',
  thumbnail: '',
  sortOrder: 0,
  published: true,
};

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    api
      .get('/admin/videos')
      .then((res) => setVideos(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load videos'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function resetForm() {
    setForm(EMPTY);
    setEditingId(null);
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        const res = await api.put(`/admin/videos/${editingId}`, form);
        setVideos((list) => list.map((v) => (v.id === editingId ? res.data : v)));
      } else {
        const res = await api.post('/admin/videos', form);
        setVideos((list) => [...list, res.data]);
      }
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the video');
    }
  }

  function startEdit(video) {
    setEditingId(video.id);
    setForm({
      title: video.title,
      description: video.description || '',
      platform: video.platform,
      url: video.url,
      thumbnail: video.thumbnail || '',
      sortOrder: video.sortOrder,
      published: video.published,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id, title) {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await api.delete(`/admin/videos/${id}`);
      setVideos((list) => list.filter((v) => v.id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete');
    }
  }

  const field =
    'w-full rounded-xl border border-brand-ink/12 px-3.5 py-2.5 text-sm focus:border-brand-blue/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/15';

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-brand-ink">Videos</h1>
      <p className="mt-1 text-sm text-brand-ink/60">
        Paste a YouTube or Instagram link and it appears on the public Watch page. YouTube plays
        inline; Instagram opens on Instagram, since they provide no public embed player.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-2xl border border-brand-ink/10 bg-white p-6"
      >
        <h2 className="font-extrabold text-brand-ink">
          {editingId ? 'Edit video' : 'Add a video'}
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">
              Platform
            </span>
            <select
              value={form.platform}
              onChange={(e) => setForm({ ...form, platform: e.target.value })}
              className={`mt-1.5 ${field}`}
            >
              <option value="youtube">▶️ YouTube</option>
              <option value="instagram">📸 Instagram</option>
            </select>
          </label>

          <label className="block sm:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">URL</span>
            <input
              required
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder={
                form.platform === 'youtube'
                  ? 'https://www.youtube.com/watch?v=…'
                  : 'https://www.instagram.com/reel/…'
              }
              className={`mt-1.5 ${field}`}
            />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">Title</span>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={`mt-1.5 ${field}`}
          />
        </label>

        <label className="mt-4 block">
          <span className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">
            Description
          </span>
          <textarea
            rows={2}
            maxLength={600}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={`mt-1.5 ${field}`}
          />
        </label>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">
              Thumbnail URL{' '}
              <span className="font-medium normal-case text-brand-ink/35">
                {form.platform === 'youtube' ? '(auto)' : '(recommended)'}
              </span>
            </span>
            <input
              value={form.thumbnail}
              onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
              placeholder={
                form.platform === 'youtube'
                  ? 'Filled in automatically from the video id'
                  : 'Instagram gives no thumbnail — paste an image URL'
              }
              className={`mt-1.5 ${field}`}
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">
              Sort order
            </span>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
              className={`mt-1.5 ${field}`}
            />
            <span className="mt-1 block text-xs text-brand-ink/40">Lower numbers show first.</span>
          </label>
        </div>

        <label className="mt-4 flex items-center gap-2.5">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            className="h-4 w-4 rounded border-brand-ink/25 text-brand-blue focus:ring-brand-blue/30"
          />
          <span className="text-sm font-semibold text-brand-ink/75">Published</span>
        </label>

        {error && (
          <p role="alert" className="mt-4 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <div className="mt-5 flex gap-2.5">
          <button
            type="submit"
            className="rounded-full bg-brand-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-blue-dark"
          >
            {editingId ? 'Save changes' : 'Add video'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-brand-ink/15 px-5 py-2.5 text-sm font-bold text-brand-ink/70 hover:bg-brand-ink/5"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="mt-8 text-brand-ink/60">Loading…</p>
      ) : videos.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-brand-ink/10 bg-white p-8 text-center text-brand-ink/60">
          No videos yet.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {videos.map((v) => (
            <div
              key={v.id}
              className={`flex gap-3 rounded-2xl border bg-white p-3 ${
                v.published ? 'border-brand-ink/10' : 'border-brand-ink/[0.06] opacity-60'
              }`}
            >
              {v.thumbnail ? (
                <img
                  src={v.thumbnail}
                  alt=""
                  className="h-16 w-24 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <span className="flex h-16 w-24 shrink-0 items-center justify-center rounded-xl bg-brand-ink/5 text-xl">
                  {v.platform === 'instagram' ? '📸' : '▶️'}
                </span>
              )}

              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold uppercase text-brand-blue">
                  {v.platform} · #{v.sortOrder}
                </span>
                <h3 className="truncate font-bold text-brand-ink">{v.title}</h3>
                <div className="mt-1 flex gap-3">
                  <button
                    onClick={() => startEdit(v)}
                    className="text-sm font-semibold text-brand-blue hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(v.id, v.title)}
                    className="text-sm font-semibold text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
