import { useEffect, useState } from 'react';
import api from '../../api/client';

function isoDate(d) {
  return new Date(d).toISOString().slice(0, 10);
}

function nextWeek() {
  return isoDate(Date.now() + 7 * 86400000);
}

const EMPTY = {
  question: '',
  options: ['', '', '', ''],
  startsAt: isoDate(Date.now()),
  endsAt: nextWeek(),
  active: true,
};

export default function AdminPolls() {
  const [polls, setPolls] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    api
      .get('/admin/polls')
      .then((res) => setPolls(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load polls'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function resetForm() {
    setForm({ ...EMPTY, startsAt: isoDate(Date.now()), endsAt: nextWeek() });
    setEditingId(null);
    setError('');
  }

  function setOption(index, value) {
    setForm((f) => ({
      ...f,
      options: f.options.map((o, i) => (i === index ? value : o)),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const options = form.options.map((o) => o.trim()).filter(Boolean);
    if (options.length < 2) {
      setError('Please fill in at least 2 options');
      return;
    }

    const payload = { ...form, options };

    try {
      if (editingId) {
        const res = await api.put(`/admin/polls/${editingId}`, payload);
        setPolls((list) => list.map((p) => (p.id === editingId ? { ...p, ...res.data } : p)));
      } else {
        await api.post('/admin/polls', payload);
        load();
      }
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the poll');
    }
  }

  function startEdit(poll) {
    setEditingId(poll.id);
    setForm({
      question: poll.question,
      options: [...poll.options, '', '', '', ''].slice(0, Math.max(4, poll.options.length)),
      startsAt: isoDate(poll.startsAt),
      endsAt: isoDate(poll.endsAt),
      active: poll.active,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this poll and all its votes?')) return;
    try {
      await api.delete(`/admin/polls/${id}`);
      setPolls((list) => list.filter((p) => p.id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete');
    }
  }

  const now = Date.now();
  const field =
    'w-full rounded-xl border border-brand-ink/12 px-3.5 py-2.5 text-sm focus:border-brand-blue/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/15';

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-brand-ink">Polls</h1>
      <p className="mt-1 text-sm text-brand-ink/60">
        The poll whose date range covers today shows on the home page. Create one a week and it
        swaps over on its own.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-2xl border border-brand-ink/10 bg-white p-6"
      >
        <h2 className="font-extrabold text-brand-ink">
          {editingId ? 'Edit poll' : 'Create a poll'}
        </h2>

        <label className="mt-4 block">
          <span className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">
            Question
          </span>
          <input
            required
            maxLength={400}
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            placeholder="What would you like us to write about next?"
            className={`mt-1.5 ${field}`}
          />
        </label>

        <div className="mt-4">
          <span className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">
            Options — 2 to 4
          </span>
          <div className="mt-1.5 space-y-2">
            {form.options.map((option, i) => (
              <input
                key={i}
                value={option}
                onChange={(e) => setOption(i, e.target.value)}
                placeholder={`Option ${i + 1}${i > 1 ? ' (optional)' : ''}`}
                className={field}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">
              Starts
            </span>
            <input
              type="date"
              required
              value={form.startsAt}
              onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
              className={`mt-1.5 ${field}`}
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">Ends</span>
            <input
              type="date"
              required
              value={form.endsAt}
              onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
              className={`mt-1.5 ${field}`}
            />
          </label>
        </div>

        <label className="mt-4 flex items-center gap-2.5">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
            className="h-4 w-4 rounded border-brand-ink/25 text-brand-blue focus:ring-brand-blue/30"
          />
          <span className="text-sm font-semibold text-brand-ink/75">Active</span>
        </label>

        {error && (
          <p role="alert" className="mt-4 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        {editingId && (
          <p className="mt-3 rounded-xl bg-amber-50 p-3 text-[13px] text-amber-800">
            Options cannot be changed once voting has started — votes are stored by position, so
            editing them would reassign existing votes. Create a new poll instead.
          </p>
        )}

        <div className="mt-5 flex gap-2.5">
          <button
            type="submit"
            className="rounded-full bg-brand-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-blue-dark"
          >
            {editingId ? 'Save changes' : 'Create poll'}
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
      ) : polls.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-brand-ink/10 bg-white p-8 text-center text-brand-ink/60">
          No polls yet.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {polls.map((poll) => {
            const live =
              poll.active &&
              new Date(poll.startsAt).getTime() <= now &&
              new Date(poll.endsAt).getTime() >= now;

            return (
              <div key={poll.id} className="rounded-2xl border border-brand-ink/10 bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {live && (
                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-bold text-green-700">
                          ● Live now
                        </span>
                      )}
                      <span className="text-[11px] font-semibold text-brand-ink/45">
                        {isoDate(poll.startsAt)} → {isoDate(poll.endsAt)}
                      </span>
                    </div>
                    <h3 className="mt-1.5 font-extrabold text-brand-ink">{poll.question}</h3>
                  </div>

                  <div className="flex shrink-0 gap-3">
                    <button
                      onClick={() => startEdit(poll)}
                      className="text-sm font-semibold text-brand-blue hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(poll.id)}
                      className="text-sm font-semibold text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5">
                  {poll.options.map((option, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <span className="w-40 shrink-0 truncate text-brand-ink/75">{option}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-brand-ink/8">
                        <div
                          className="h-full rounded-full bg-brand-blue"
                          style={{ width: `${poll.results?.percentages?.[i] || 0}%` }}
                        />
                      </div>
                      <span className="w-20 shrink-0 text-right font-semibold tabular-nums text-brand-ink/60">
                        {poll.results?.percentages?.[i] || 0}% ({poll.results?.counts?.[i] || 0})
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-2.5 text-xs font-semibold text-brand-ink/45">
                  {poll.results?.total || 0} total votes
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
