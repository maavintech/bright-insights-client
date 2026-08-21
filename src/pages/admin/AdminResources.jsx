import { useEffect, useRef, useState } from 'react';
import api from '../../api/client';

const KINDS = [
  { value: 'calculator', label: '🧮 Calculator' },
  { value: 'worksheet', label: '📝 Worksheet' },
  { value: 'template', label: '📋 Template' },
  { value: 'guide', label: '📘 Guide' },
];

const EMPTY = {
  title: '',
  description: '',
  kind: 'calculator',
  fileUrl: '',
  fileName: '',
  fileExt: '',
  fileSize: null,
  published: true,
};

function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminResources() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fileInput = useRef(null);

  function load() {
    api
      .get('/admin/resources')
      .then((res) => setResources(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load resources'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function resetForm() {
    setForm(EMPTY);
    setEditingId(null);
    setError('');
    if (fileInput.current) fileInput.current.value = '';
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Checked here as well as on the server so the admin gets told immediately
    // rather than after uploading two megabytes.
    if (file.size > 2 * 1024 * 1024) {
      setError(`"${file.name}" is ${formatSize(file.size)} — the limit is 2 MB.`);
      e.target.value = '';
      return;
    }

    setUploading(true);
    setError('');
    const data = new FormData();
    data.append('document', file);

    try {
      const res = await api.post('/admin/upload-document', data);
      setForm((f) => ({
        ...f,
        fileUrl: res.data.url,
        fileName: res.data.fileName,
        fileExt: res.data.fileExt,
        fileSize: res.data.fileSize,
        title: f.title || res.data.fileName.replace(/\.[^.]+$/, ''),
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
      e.target.value = '';
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!editingId && !form.fileUrl) {
      setError('Please upload a file first');
      return;
    }

    try {
      if (editingId) {
        // fileUrl is only populated by a fresh upload. Sending it empty leaves
        // the existing attachment alone, which is what a metadata-only edit
        // should do.
        const { fileUrl, ...rest } = form;
        const payload = fileUrl ? form : rest;
        const res = await api.put(`/admin/resources/${editingId}`, payload);
        setResources((list) => list.map((r) => (r.id === editingId ? res.data : r)));
      } else {
        const res = await api.post('/admin/resources', form);
        setResources((list) => [res.data, ...list]);
      }
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save');
    }
  }

  function startEdit(resource) {
    setEditingId(resource.id);
    setForm({
      title: resource.title,
      description: resource.description || '',
      kind: resource.kind,
      // Left blank deliberately — only a new upload should set this.
      fileUrl: '',
      fileName: resource.fileName,
      fileExt: resource.fileExt,
      fileSize: resource.fileSize,
      published: resource.published,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id, title) {
    if (!window.confirm(`Delete "${title}"? The file will be removed from the server.`)) return;
    try {
      await api.delete(`/admin/resources/${id}`);
      setResources((list) => list.filter((r) => r.id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete');
    }
  }

  const field =
    'w-full rounded-xl border border-brand-ink/12 px-3.5 py-2.5 text-sm focus:border-brand-blue/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/15';

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-brand-ink">Downloads</h1>
      <p className="mt-1 text-sm text-brand-ink/60">
        Excel calculators, Word worksheets and PDFs shown on the public Downloads page. Max 2 MB
        per file — .xlsx, .xls, .docx, .doc, .pdf and .csv.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-2xl border border-brand-ink/10 bg-white p-6"
      >
        <h2 className="font-extrabold text-brand-ink">
          {editingId ? 'Edit download' : 'Add a download'}
        </h2>

        <label className="mt-4 block">
          <span className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">
            File {editingId && <span className="font-medium normal-case">— upload only to replace</span>}
          </span>
          <input
            ref={fileInput}
            type="file"
            accept=".xls,.xlsx,.doc,.docx,.pdf,.csv"
            onChange={handleFile}
            className="mt-1.5 w-full rounded-xl border border-dashed border-brand-ink/20 p-3 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-brand-blue file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-brand-blue-dark"
          />
          {uploading && <span className="mt-1 block text-sm text-brand-ink/60">Uploading…</span>}
          {form.fileName && !uploading && (
            <span className="mt-1.5 block text-sm font-semibold text-green-700">
              ✅ {form.fileName} {form.fileSize ? `(${formatSize(form.fileSize)})` : ''}
            </span>
          )}
        </label>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">Title</span>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="SIP Return Calculator"
              className={`mt-1.5 ${field}`}
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">Type</span>
            <select
              value={form.kind}
              onChange={(e) => setForm({ ...form, kind: e.target.value })}
              className={`mt-1.5 ${field}`}
            >
              {KINDS.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="mt-4 block">
          <span className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">
            Description
          </span>
          <textarea
            rows={2}
            maxLength={600}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What does this file do, and who is it for?"
            className={`mt-1.5 ${field}`}
          />
        </label>

        <label className="mt-4 flex items-center gap-2.5">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            className="h-4 w-4 rounded border-brand-ink/25 text-brand-blue focus:ring-brand-blue/30"
          />
          <span className="text-sm font-semibold text-brand-ink/75">
            Published — visible on the site
          </span>
        </label>

        {error && (
          <p role="alert" className="mt-4 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <div className="mt-5 flex gap-2.5">
          <button
            type="submit"
            disabled={uploading}
            className="rounded-full bg-brand-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-blue-dark disabled:opacity-50"
          >
            {editingId ? 'Save changes' : 'Add download'}
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
      ) : resources.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-brand-ink/10 bg-white p-8 text-center text-brand-ink/60">
          No downloads yet.
        </p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-brand-ink/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-brand-ink/10 bg-brand-cream/50">
              <tr className="text-xs font-extrabold uppercase tracking-wide text-brand-ink/50">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">File</th>
                <th className="px-4 py-3">Downloads</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.id} className="border-b border-brand-ink/[0.06] last:border-b-0">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-brand-ink">{r.title}</span>
                    {!r.published && (
                      <span className="ml-2 rounded-full bg-brand-ink/8 px-2 py-0.5 text-[11px] font-bold text-brand-ink/50">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-brand-ink/60">{r.kind}</td>
                  <td className="px-4 py-3 text-brand-ink/60">
                    {r.fileExt?.toUpperCase()} · {formatSize(r.fileSize)}
                  </td>
                  <td className="px-4 py-3 font-semibold tabular-nums text-brand-ink/70">
                    {r.downloadCount}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => startEdit(r)}
                      className="mr-3 text-sm font-semibold text-brand-blue hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(r.id, r.title)}
                      className="text-sm font-semibold text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
