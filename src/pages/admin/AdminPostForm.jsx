import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/client';
import RichTextEditor from '../../components/admin/RichTextEditor';
import ImageUploader from '../../components/admin/ImageUploader';

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  categoryId: '',
  featuredImage: null,
  status: 'draft',
};

export default function AdminPostForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/admin/categories').then((res) => {
      setCategories(res.data);
      setForm((f) => (f.categoryId ? f : { ...f, categoryId: res.data[0]?.id || '' }));
    });
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/admin/posts/${id}`).then((res) => {
      const p = res.data;
      setForm({
        title: p.title,
        excerpt: p.excerpt || '',
        content: p.content,
        categoryId: p.categoryId,
        featuredImage: p.featuredImage,
        status: p.status,
      });
      setLoading(false);
    });
  }, [id, isEdit]);

  async function handleSubmit(e, publishOverride) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const payload = { ...form, status: publishOverride || form.status };
    try {
      if (isEdit) {
        await api.put(`/admin/posts/${id}`, payload);
      } else {
        await api.post('/admin/posts', payload);
      }
      navigate('/admin/posts');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-brand-ink/60">Loading…</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-brand-ink">{isEdit ? 'Edit Post' : 'New Post'}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <label className="block text-sm font-medium text-brand-ink/80">
          Title
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1 w-full rounded-lg border border-brand-ink/15 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
          />
        </label>

        <label className="block text-sm font-medium text-brand-ink/80">
          Category
          <select
            required
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="mt-1 w-full rounded-lg border border-brand-ink/15 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-brand-ink/80">
          Excerpt
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            rows={2}
            maxLength={500}
            className="mt-1 w-full rounded-lg border border-brand-ink/15 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
          />
        </label>

        <div>
          <span className="block text-sm font-medium text-brand-ink/80">Featured Image</span>
          <div className="mt-1">
            <ImageUploader
              value={form.featuredImage}
              onChange={(url) => setForm({ ...form, featuredImage: url })}
            />
          </div>
        </div>

        <div>
          <span className="block text-sm font-medium text-brand-ink/80">Content</span>
          <div className="mt-1">
            <RichTextEditor
              value={form.content}
              onChange={(html) => setForm({ ...form, content: html })}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            onClick={(e) => handleSubmit(e, 'draft')}
            disabled={submitting}
            className="rounded-full border border-brand-ink/15 px-5 py-2.5 text-sm font-semibold text-brand-ink hover:border-brand-blue/40 disabled:opacity-60"
          >
            Save Draft
          </button>
          <button
            type="submit"
            onClick={(e) => handleSubmit(e, 'published')}
            disabled={submitting}
            className="rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue-dark disabled:opacity-60"
          >
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}
