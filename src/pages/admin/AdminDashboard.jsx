import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ categories: 0, posts: 0, published: 0, drafts: 0 });
  const [visits, setVisits] = useState(null);
  const [engagement, setEngagement] = useState({ subscribers: 0, downloads: 0 });

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

    // These panels are supplementary; a failure should leave the rest of the
    // dashboard usable rather than blanking it.
    api.get('/admin/stats/visits').then((res) => setVisits(res.data)).catch(() => {});

    Promise.all([api.get('/admin/subscribers'), api.get('/admin/resources')])
      .then(([subRes, resRes]) => {
        setEngagement({
          subscribers: subRes.data.filter((s) => s.status === 'active').length,
          downloads: resRes.data.reduce((sum, r) => sum + (r.downloadCount || 0), 0),
        });
      })
      .catch(() => {});
  }, []);

  const cards = [
    { label: 'Categories', value: stats.categories, to: '/admin/categories' },
    { label: 'Total Posts', value: stats.posts, to: '/admin/posts' },
    { label: 'Published', value: stats.published, to: '/admin/posts?status=published' },
    { label: 'Drafts', value: stats.drafts, to: '/admin/posts?status=draft' },
  ];

  const visitCards = visits && [
    { label: 'Visits today', value: visits.today },
    { label: 'Last 7 days', value: visits.last7 },
    { label: 'Last 30 days', value: visits.last30 },
    { label: 'All time', value: visits.total },
  ];

  const peak = visits?.series?.length
    ? Math.max(...visits.series.map((d) => d.visits), 1)
    : 1;

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

      {visitCards && (
        <>
          <h2 className="mt-10 text-xs font-extrabold uppercase tracking-widest text-brand-ink/50">
            Traffic
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {visitCards.map((c) => (
              <div key={c.label} className="rounded-2xl border border-brand-ink/10 bg-white p-6">
                <p className="text-3xl font-extrabold text-brand-ink">
                  {c.value.toLocaleString('en-IN')}
                </p>
                <p className="mt-1 text-sm text-brand-ink/60">{c.label}</p>
              </div>
            ))}
          </div>

          {visits.series?.length > 0 && (
            <div className="mt-4 rounded-2xl border border-brand-ink/10 bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">
                Last 14 days
              </p>
              <div className="mt-4 flex h-28 items-end gap-1.5">
                {visits.series.map((day) => (
                  <div key={day.visitDate} className="group relative flex-1">
                    <div
                      className="w-full rounded-t bg-brand-blue/75 transition-colors group-hover:bg-brand-blue"
                      style={{ height: `${Math.max((day.visits / peak) * 100, 3)}%` }}
                    />
                    <span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-brand-ink px-2 py-1 text-[11px] font-semibold text-white group-hover:block">
                      {day.visitDate}: {day.visits}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-brand-ink/40">
                Counts browser sessions, not page views. {visits.uniqueTotal.toLocaleString('en-IN')}{' '}
                first-time visitors all time.
              </p>
            </div>
          )}
        </>
      )}

      <h2 className="mt-10 text-xs font-extrabold uppercase tracking-widest text-brand-ink/50">
        Engagement
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-4">
        <Link
          to="/admin/subscribers"
          className="rounded-2xl border border-brand-ink/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <p className="text-3xl font-extrabold text-brand-blue">{engagement.subscribers}</p>
          <p className="mt-1 text-sm text-brand-ink/60">Newsletter subscribers</p>
        </Link>
        <Link
          to="/admin/resources"
          className="rounded-2xl border border-brand-ink/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <p className="text-3xl font-extrabold text-brand-blue">{engagement.downloads}</p>
          <p className="mt-1 text-sm text-brand-ink/60">File downloads</p>
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/admin/posts/new"
          className="rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue-dark"
        >
          + New Post
        </Link>
        <Link
          to="/admin/daily-tips"
          className="rounded-full border border-brand-ink/15 px-5 py-2.5 text-sm font-semibold text-brand-ink hover:border-brand-blue/40"
        >
          Add a Thought / Hack
        </Link>
        <Link
          to="/admin/polls"
          className="rounded-full border border-brand-ink/15 px-5 py-2.5 text-sm font-semibold text-brand-ink hover:border-brand-blue/40"
        >
          New Weekly Poll
        </Link>
      </div>
    </div>
  );
}
