import { useState } from 'react';
import api from '../api/client';

// Update CONTACT_EMAIL and MAP_QUERY (or swap the iframe src for your own
// Google Maps embed link) once real business details exist.
const CONTACT_EMAIL = 'hello@brightinsights.com';
const MAP_QUERY = 'New Delhi, India';
const MAP_SRC = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`;

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setError('');
    try {
      await api.post('/contact', form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-brand-ink">Get in Touch</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-brand-ink/70">
          We&rsquo;d love to hear from you! For collaborations, queries, or feedback, drop us a
          message — we read every note.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="card-shadow rounded-2xl border border-brand-ink/[0.06] bg-white p-7 sm:p-8">
          <h2 className="text-xl font-extrabold text-brand-ink">Send us a message</h2>

          {status === 'success' ? (
            <div className="mt-6 rounded-xl bg-green-50 px-4 py-4 text-sm font-medium text-green-700">
              Thanks for reaching out! We&rsquo;ll get back to you soon. You can also reach us
              directly at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                {CONTACT_EMAIL}
              </a>
              .
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
              )}
              <label className="block text-sm font-semibold text-brand-ink/80">
                Name
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-brand-ink/15 px-4 py-2.5 text-[15px] focus:border-brand-blue focus:outline-none"
                />
              </label>
              <label className="block text-sm font-semibold text-brand-ink/80">
                Email
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-brand-ink/15 px-4 py-2.5 text-[15px] focus:border-brand-blue focus:outline-none"
                />
              </label>
              <label className="block text-sm font-semibold text-brand-ink/80">
                Message
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-brand-ink/15 px-4 py-2.5 text-[15px] focus:border-brand-blue focus:outline-none"
                />
              </label>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full rounded-full bg-brand-blue px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-blue-dark disabled:opacity-60"
              >
                {status === 'submitting' ? 'Sending…' : 'Send Message'}
              </button>
              <p className="text-center text-sm text-brand-ink/50">
                Or email us directly at{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-brand-blue hover:underline">
                  {CONTACT_EMAIL}
                </a>
              </p>
            </form>
          )}
        </div>

        <div className="card-shadow overflow-hidden rounded-2xl border border-brand-ink/[0.06] bg-white">
          <iframe
            title="Location map"
            src={MAP_SRC}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 420 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <p className="mt-10 text-center text-sm text-brand-ink/50">
        Connect with us on YouTube, Instagram, and Twitter for daily insights.
      </p>
    </div>
  );
}
