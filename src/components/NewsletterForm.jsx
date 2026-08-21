import { useState } from 'react';
import api from '../api/client';
import { usePublicSettings } from '../context/PublicSettingsContext';

export default function NewsletterForm({ source = 'footer', compact = false }) {
  const { settings } = usePublicSettings();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    setMessage('');
    try {
      const res = await api.post('/subscribe', { email, source });
      setStatus('done');
      setMessage(res.data.message);
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  }

  if (status === 'done') {
    return (
      <div
        role="status"
        className="flex items-start gap-2.5 rounded-2xl border border-green-500/25 bg-green-50 p-4 text-[15px] text-green-800"
      >
        <span aria-hidden="true">✅</span>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div>
      {!compact && (
        <>
          <h3 className="text-lg font-extrabold tracking-tight text-brand-ink">
            {settings.newsletter_headline || 'Get the bright side, weekly'}
          </h3>
          {settings.newsletter_blurb && (
            <p className="mt-1.5 text-[14.5px] leading-relaxed text-brand-ink/60">
              {settings.newsletter_blurb}
            </p>
          )}
        </>
      )}

      <form onSubmit={handleSubmit} className={compact ? '' : 'mt-4'}>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor={`newsletter-email-${source}`}>
            Email address
          </label>
          <input
            id={`newsletter-email-${source}`}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="min-w-0 flex-1 rounded-full border border-brand-ink/12 bg-white px-4 py-2.5 text-[15px] text-brand-ink placeholder:text-brand-ink/35 focus:border-brand-blue/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/15"
          />
          <button
            type="submit"
            disabled={status === 'sending'}
            className="shrink-0 rounded-full bg-brand-blue px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'sending' ? 'Subscribing…' : 'Subscribe'}
          </button>
        </div>

        {status === 'error' && (
          <p role="alert" className="mt-2 text-sm font-medium text-red-600">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
