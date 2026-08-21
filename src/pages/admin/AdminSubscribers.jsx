import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    api
      .get('/admin/subscribers')
      .then((res) => setSubscribers(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load subscribers'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(id, email) {
    if (!window.confirm(`Remove ${email} from the list? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/subscribers/${id}`);
      setSubscribers((list) => list.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete subscriber');
    }
  }

  // The export endpoint needs the bearer token, so it cannot be a plain <a
  // download>. Fetch it as a blob and hand it to a temporary link instead.
  async function handleExport() {
    try {
      const res = await api.get('/admin/subscribers/export', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError('Could not export the list');
    }
  }

  const active = subscribers.filter((s) => s.status === 'active');

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-brand-ink">Subscribers</h1>
          <p className="mt-1 text-sm text-brand-ink/60">
            {active.length} active · {subscribers.length - active.length} unsubscribed
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={active.length === 0}
          className="rounded-full bg-brand-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          Export CSV
        </button>
      </div>

      <p className="mt-3 rounded-xl border border-brand-blue/20 bg-brand-blue/[0.04] p-3.5 text-[13.5px] text-brand-ink/70">
        Import this CSV into Mailchimp, Brevo or any mail tool when you're ready to send. Only
        active subscribers are exported.
      </p>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-8 text-brand-ink/60">Loading…</p>
      ) : subscribers.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-brand-ink/10 bg-white p-8 text-center text-brand-ink/60">
          No subscribers yet. The signup form lives in the site footer and on the Downloads page.
        </p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-brand-ink/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-brand-ink/10 bg-brand-cream/50">
              <tr className="text-xs font-extrabold uppercase tracking-wide text-brand-ink/50">
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id} className="border-b border-brand-ink/[0.06] last:border-b-0">
                  <td className="px-4 py-3 font-semibold text-brand-ink">{s.email}</td>
                  <td className="px-4 py-3 text-brand-ink/60">{s.source || '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        s.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-brand-ink/8 text-brand-ink/50'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-brand-ink/60">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(s.id, s.email)}
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
