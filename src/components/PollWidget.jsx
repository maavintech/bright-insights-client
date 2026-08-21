import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/client';
import { getVisitorToken } from '../lib/visitor';

function daysLeft(endsAt) {
  const ms = new Date(endsAt).getTime() - Date.now();
  if (ms <= 0) return 'Closing now';
  const days = Math.ceil(ms / 86400000);
  return days === 1 ? '1 day left' : `${days} days left`;
}

export default function PollWidget({ className = '' }) {
  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState(null);
  const [myVote, setMyVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api
      .get('/poll', { params: { voterToken: getVisitorToken() } })
      .then((res) => {
        if (cancelled) return;
        setPoll(res.data.poll);
        setResults(res.data.results);
        setMyVote(res.data.hasVoted ? res.data.myVote : null);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function castVote(optionIndex) {
    if (submitting || myVote !== null) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post('/poll/vote', {
        optionIndex,
        voterToken: getVisitorToken(),
      });
      setMyVote(res.data.myVote);
      setResults(res.data.results);
    } catch (err) {
      const data = err.response?.data;
      // A 409 means this browser already voted — show them the results rather
      // than an error, which is what they actually wanted to see.
      if (data?.hasVoted) {
        setMyVote(data.myVote);
        setResults(data.results);
      } else {
        setError(data?.message || 'Could not record your vote. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !poll) return null;

  const voted = myVote !== null;

  return (
    <div className={`card-shadow rounded-2xl border border-brand-ink/[0.06] bg-white p-6 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-ink/50">
          Poll of the Week
        </h2>
        <span className="shrink-0 rounded-full bg-brand-blue/8 px-2.5 py-1 text-[11px] font-bold text-brand-blue">
          {daysLeft(poll.endsAt)}
        </span>
      </div>

      <p className="mt-3 text-[15.5px] font-bold leading-snug text-brand-ink">{poll.question}</p>

      <div className="mt-4 space-y-2">
        {poll.options.map((option, i) => {
          const pct = results?.percentages?.[i] ?? 0;
          const count = results?.counts?.[i] ?? 0;
          const isMine = myVote === i;

          if (!voted) {
            return (
              <button
                key={i}
                onClick={() => castVote(i)}
                disabled={submitting}
                className="w-full rounded-xl border border-brand-ink/10 px-4 py-2.5 text-left text-[14.5px] font-semibold text-brand-ink/80 transition-all hover:-translate-y-px hover:border-brand-blue/40 hover:bg-brand-blue/5 hover:text-brand-blue disabled:opacity-60"
              >
                {option}
              </button>
            );
          }

          return (
            <div
              key={i}
              className={`relative overflow-hidden rounded-xl border px-4 py-2.5 ${
                isMine ? 'border-brand-blue/40 bg-brand-blue/[0.04]' : 'border-brand-ink/10'
              }`}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`absolute inset-y-0 left-0 ${isMine ? 'bg-brand-blue/12' : 'bg-brand-ink/[0.05]'}`}
              />
              <div className="relative flex items-center justify-between gap-3">
                <span className="text-[14.5px] font-semibold text-brand-ink/85">
                  {option}
                  {isMine && <span className="ml-1.5 text-brand-blue" aria-label="your vote">✓</span>}
                </span>
                <span className="shrink-0 text-[13px] font-bold tabular-nums text-brand-ink/55">
                  {pct}% <span className="font-medium text-brand-ink/40">({count})</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      {voted && results && (
        <p className="mt-3.5 text-center text-[13px] font-medium text-brand-ink/45">
          {results.total} {results.total === 1 ? 'vote' : 'votes'} so far — thanks for voting!
        </p>
      )}
    </div>
  );
}
