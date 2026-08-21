import { useEffect, useState } from 'react';
import api from '../api/client';
import {
  isNewVisitor,
  markVisitCounted,
  markVisitorSeen,
  shouldCountVisit,
} from '../lib/visitor';

export default function VisitCounter() {
  const [total, setTotal] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        if (shouldCountVisit()) {
          const newVisitor = isNewVisitor();
          const res = await api.post('/visits', { isNewVisitor: newVisitor });
          // Mark only after the request succeeds, so a failed call retries on
          // the next page load rather than silently losing the visit.
          markVisitCounted();
          if (newVisitor) markVisitorSeen();
          if (!cancelled) setTotal(res.data.total);
        } else {
          const res = await api.get('/visits');
          if (!cancelled) setTotal(res.data.total);
        }
      } catch {
        // A counter is not worth surfacing an error for.
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (total === null) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-ink/45">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="2.8" />
      </svg>
      {total.toLocaleString('en-IN')} visits
    </span>
  );
}
