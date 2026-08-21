import { useEffect, useState } from 'react';
import api from '../../api/client';

const EMPTY = {
  type: 'thought',
  body: '',
  author: '',
  linkUrl: '',
  scheduledDate: '',
  active: true,
};

export default function AdminDailyTips() {
  const [tips, setTips] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    api
      .get('/admin/daily-tips')
      .then((res) => setTips(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load tips'))
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

    const payload = {
      ...form,
      scheduledDate: form.scheduledDate || null,
      author: form.author || null,
      linkUrl: form.linkUrl || null,
    };

    try {
      if (editingId) {
        const res = await api.put(`/admin/daily-tips/${editingId}`, payload);
        setTips((list) => list.map((t) => (t.id === editingId ? res.data : t)));
      } else {
        const res = await api.post('/admin/daily-tips', payload);
        setTips((list) => [res.data, ...list]);
      }
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the tip');
    }
  }

  function startEdit(tip) {
    setEditingId(tip.id);
    setForm({
      type: tip.type,
      body: tip.body,
      author: tip.author || '',
      linkUrl: tip.linkUrl || '',
      scheduledDate: tip.scheduledDate || '',
      active: tip.active,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this tip?')) return;
    try {
      await api.delete(`/admin/daily-tips/${id}`);
      setTips((list) => list.filter((t) => t.id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete the tip');
    }
  }

  const counts = {
    thought: tips.filter((t) => t.type === 'thought' && t.active && !t.scheduledDate).length,
    hack: tips.filter((t) => t.type === 'hack' && t.active && !t.scheduledDate).length,
  };

  const field =
    'w-full rounded-xl border border-brand-ink/12 px-3.5 py-2.5 text-sm focus:border-brand-blue/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/15';

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-brand-ink">
        Thought &amp; Hack of the Day
      </h1>
      <p className="mt-1 text-sm text-brand-ink/60">
        One entry of each type shows in the site header and changes automatically every day at
        midnight IST. No scheduling needed — the pool rotates on its own.
      </p>

      <div className="mt-3 flex flex-wrap gap-3 text-[13.5px]">
        <span className="rounded-full bg-brand-blue/8 px-3 py-1.5 font-semibold text-brand-blue">
          💡 {counts.thought} thoughts — repeats every {counts.thought || '—'} days
        </span>
        <span className="rounded-full bg-amber-500/10 px-3 py-1.5 font-semibold text-amber-700">
          ⚡ {counts.hack} hacks — repeats every {counts.hack || '—'} days
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-2xl border border-brand-ink/10 bg-white p-6"
      >
        <h2 className="font-extrabold text-brand-ink">
          {editingId ? 'Edit entry' : 'Add a new entry'}
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">Type</span>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className={`mt-1.5 ${field}`}
            >
              <option value="thought">💡 Thought for the Day</option>
              <option value="hack">⚡ Hack for the Day</option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">
              Author <span className="font-medium normal-case text-brand-ink/35">(optional)</span>
            </span>
            <input
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              placeholder="e.g. Warren Buffett"
              className={`mt-1.5 ${field}`}
            />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">
            Text — 2 to 3 lines
          </span>
          <textarea
            required
            rows={3}
            maxLength={600}
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="Keep it short enough to read in the header at a glance."
            className={`mt-1.5 ${field}`}
          />
          <span className="mt-1 block text-xs text-brand-ink/40">
            {form.body.length}/600 characters
          </span>
        </label>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">
              Link <span className="font-medium normal-case text-brand-ink/35">(optional)</span>
            </span>
            <input
              value={form.linkUrl}
              onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
              placeholder="/blog/some-article"
              className={`mt-1.5 ${field}`}
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">
              Pin to date{' '}
              <span className="font-medium normal-case text-brand-ink/35">(optional)</span>
            </span>
            <input
              type="date"
              value={form.scheduledDate}
              onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
              className={`mt-1.5 ${field}`}
            />
            <span className="mt-1 block text-xs text-brand-ink/40">
              Leave blank to join the automatic rotation.
            </span>
          </label>
        </div>

        <label className="mt-4 flex items-center gap-2.5">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
            className="h-4 w-4 rounded border-brand-ink/25 text-brand-blue focus:ring-brand-blue/30"
          />
          <span className="text-sm font-semibold text-brand-ink/75">
            Active — include in the rotation
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
            className="rounded-full bg-brand-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-blue-dark"
          >
            {editingId ? 'Save changes' : 'Add entry'}
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
      ) : (
        <div className="mt-6 space-y-2.5">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className={`rounded-2xl border bg-white p-4 ${
                tip.active ? 'border-brand-ink/10' : 'border-brand-ink/[0.06] opacity-55'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        tip.type === 'hack'
                          ? 'bg-amber-500/10 text-amber-700'
                          : 'bg-brand-blue/8 text-brand-blue'
                      }`}
                    >
                      {tip.type === 'hack' ? '⚡ Hack' : '💡 Thought'}
                    </span>
                    {tip.scheduledDate && (
                      <span className="rounded-full bg-brand-ink/8 px-2.5 py-1 text-[11px] font-bold text-brand-ink/60">
                        📌 {tip.scheduledDate}
                      </span>
                    )}
                    {!tip.active && (
                      <span className="rounded-full bg-brand-ink/8 px-2.5 py-1 text-[11px] font-bold text-brand-ink/50">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-brand-ink/80">{tip.body}</p>
                  {tip.author && (
                    <p className="mt-1 text-[13px] font-semibold text-brand-ink/45">
                      — {tip.author}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 gap-3">
                  <button
                    onClick={() => startEdit(tip)}
                    className="text-sm font-semibold text-brand-blue hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tip.id)}
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
