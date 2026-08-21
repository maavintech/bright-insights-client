import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import api, { API_ORIGIN } from '../api/client';
import NewsletterForm from '../components/NewsletterForm';

const KINDS = [
  { key: 'all', label: 'All', emoji: '📁' },
  { key: 'calculator', label: 'Calculators', emoji: '🧮' },
  { key: 'worksheet', label: 'Worksheets', emoji: '📝' },
  { key: 'template', label: 'Templates', emoji: '📋' },
  { key: 'guide', label: 'Guides', emoji: '📘' },
];

const FILE_ICONS = {
  xlsx: '📊',
  xls: '📊',
  csv: '📊',
  doc: '📄',
  docx: '📄',
  pdf: '📕',
};

function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/resources')
      .then((res) => setResources(res.data))
      .catch(() => setResources([]))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(
    () => (filter === 'all' ? resources : resources.filter((r) => r.kind === filter)),
    [resources, filter]
  );

  // Only offer filters that actually have something behind them.
  const availableKinds = useMemo(() => {
    const present = new Set(resources.map((r) => r.kind));
    return KINDS.filter((k) => k.key === 'all' || present.has(k.key));
  }, [resources]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-ink sm:text-4xl">
          Free Downloads
        </h1>
        <p className="mt-3 text-[16px] leading-relaxed text-brand-ink/60">
          Calculators, worksheets and templates you can open in Excel or Word — free, no signup
          required. Built to be simple enough to actually use.
        </p>
      </div>

      {availableKinds.length > 2 && (
        <div className="mt-7 flex flex-wrap gap-2">
          {availableKinds.map((k) => (
            <button
              key={k.key}
              onClick={() => setFilter(k.key)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                filter === k.key
                  ? 'border-brand-blue bg-brand-blue text-white'
                  : 'border-brand-ink/10 text-brand-ink/70 hover:border-brand-blue/40 hover:text-brand-blue'
              }`}
            >
              <span aria-hidden="true">{k.emoji}</span>
              {k.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="mt-10 text-brand-ink/60">Loading…</p>
      ) : visible.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-brand-ink/[0.06] bg-white p-10 text-center">
          <p className="text-brand-ink/60">
            No downloads here yet — we're building these out. Subscribe below and we'll tell you
            when the first ones land.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((resource, i) => (
            <motion.a
              key={resource.id}
              href={`${API_ORIGIN}/api/resources/${resource.slug}/download`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
              className="card-shadow group flex flex-col rounded-2xl border border-brand-ink/[0.06] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue/10 to-brand-yellow/20 text-2xl">
                {FILE_ICONS[resource.fileExt] || '📄'}
              </span>

              <h2 className="mt-4 text-lg font-extrabold leading-snug tracking-tight text-brand-ink">
                {resource.title}
              </h2>

              {resource.description && (
                <p className="mt-1.5 flex-1 text-[14.5px] leading-relaxed text-brand-ink/60">
                  {resource.description}
                </p>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-brand-ink/[0.06] pt-3.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-ink/40">
                  {resource.fileExt?.toUpperCase()}
                  {resource.fileSize ? ` · ${formatSize(resource.fileSize)}` : ''}
                </span>
                <span className="flex items-center gap-1.5 text-sm font-bold text-brand-blue">
                  Download
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-y-0.5"
                  >
                    <path d="M12 3v13m0 0 5-5m-5 5-5-5M4 21h16" />
                  </svg>
                </span>
              </div>

              {resource.downloadCount > 0 && (
                <span className="mt-2 text-[11px] font-medium text-brand-ink/35">
                  Downloaded {resource.downloadCount.toLocaleString('en-IN')} times
                </span>
              )}
            </motion.a>
          ))}
        </div>
      )}

      <div className="card-shadow mt-14 rounded-2xl border border-brand-ink/[0.06] bg-white p-8">
        <NewsletterForm source="resources" />
      </div>
    </section>
  );
}
