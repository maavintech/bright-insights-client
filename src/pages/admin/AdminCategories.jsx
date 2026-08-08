import { useEffect, useState } from 'react';
import api from '../../api/client';

const emptyForm = { name: '', description: '' };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function load() {
    setLoading(true);
    api.get('/admin/categories').then((res) => setCategories(res.data)).finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/admin/categories/${editingId}`, form);
      } else {
        await api.post('/admin/categories', form);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(cat) {
    setEditingId(cat.id);
    setForm({ name: cat.name, description: cat.description || '' });
    setError('');
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  }

  async function handleDelete(cat) {
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    try {
      await api.delete(`/admin/categories/${cat.id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-ink">Categories</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-lg rounded-2xl border border-brand-ink/10 bg-white p-6 shadow-sm"
      >
        <h2 className="font-semibold text-brand-ink">{editingId ? 'Edit Category' : 'New Category'}</h2>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <label className="mt-4 block text-sm font-medium text-brand-ink/80">
          Name
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-brand-ink/15 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
          />
        </label>
        <label className="mt-3 block text-sm font-medium text-brand-ink/80">
          Description
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="mt-1 w-full rounded-lg border border-brand-ink/15 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
          />
        </label>
        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-brand-blue px-5 py-2 text-sm font-semibold text-white hover:bg-brand-blue-dark disabled:opacity-60"
          >
            {editingId ? 'Save Changes' : 'Add Category'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-full border border-brand-ink/15 px-5 py-2 text-sm font-semibold text-brand-ink/70"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 overflow-hidden rounded-2xl border border-brand-ink/10 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-ink/5 text-brand-ink/60">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-4 text-brand-ink/50" colSpan={4}>Loading…</td></tr>
            ) : categories.length === 0 ? (
              <tr><td className="px-4 py-4 text-brand-ink/50" colSpan={4}>No categories yet.</td></tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="border-t border-brand-ink/5">
                  <td className="px-4 py-3 font-medium text-brand-ink">{cat.name}</td>
                  <td className="px-4 py-3 text-brand-ink/50">{cat.slug}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-brand-ink/60">{cat.description}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => startEdit(cat)} className="mr-3 font-medium text-brand-blue hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(cat)} className="font-medium text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
