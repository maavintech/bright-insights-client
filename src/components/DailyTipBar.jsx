import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../api/client';

const LABELS = {
  thought: { emoji: '💡', title: 'Thought for the Day', accent: 'text-brand-blue' },
  hack: { emoji: '⚡', title: 'Hack for the Day', accent: 'text-amber-600' },
};

export default function DailyTipBar() {
  const [tips, setTips] = useState([]);
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .get('/daily-tip')
      .then((res) => {
        if (cancelled) return;
        // The API returns both slots; keep whichever have content so the bar
        // still works when only one type has been filled in.
        const available = ['thought', 'hack']
          .map((type) => (res.data[type] ? { ...res.data[type], type } : null))
          .filter(Boolean);
        setTips(available);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // When both a thought and a hack exist, alternate between them rather than
  // showing two strips.
  useEffect(() => {
    if (tips.length < 2) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % tips.length), 9000);
    return () => clearInterval(id);
  }, [tips.length]);

  if (dismissed || tips.length === 0) return null;

  const tip = tips[index];
  const label = LABELS[tip.type] || LABELS.thought;

  return (
    <div className="border-b border-brand-ink/[0.06] bg-gradient-to-r from-brand-blue/[0.07] via-brand-yellow/[0.07] to-brand-blue/[0.07]">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 sm:px-6">
        <span className="hidden shrink-0 sm:inline" aria-hidden="true">
          {label.emoji}
        </span>

        <div className="min-w-0 flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${tip.type}-${tip.id}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col gap-x-2 sm:flex-row sm:items-baseline"
            >
              <span
                className={`shrink-0 text-[11px] font-extrabold uppercase tracking-widest ${label.accent}`}
              >
                {label.title}
              </span>
              <p className="text-[13.5px] leading-snug text-brand-ink/75">
                {tip.body}
                {tip.author && (
                  <span className="ml-1 font-semibold text-brand-ink/50">— {tip.author}</span>
                )}
                {tip.linkUrl && (
                  <Link
                    to={tip.linkUrl}
                    className="ml-2 font-bold text-brand-blue hover:underline"
                  >
                    Read more →
                  </Link>
                )}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {tips.length > 1 && (
          <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
            {tips.map((t, i) => (
              <button
                key={t.type}
                onClick={() => setIndex(i)}
                aria-label={`Show ${LABELS[t.type]?.title || t.type}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-5 bg-brand-blue' : 'w-1.5 bg-brand-ink/20 hover:bg-brand-ink/40'
                }`}
              />
            ))}
          </div>
        )}

        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="shrink-0 rounded-full p-1 text-brand-ink/35 transition-colors hover:bg-brand-ink/5 hover:text-brand-ink/70"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
