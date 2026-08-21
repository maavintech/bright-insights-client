import { useEffect, useState } from 'react';
import api from '../../api/client';

const SOCIAL_FIELDS = [
  { key: 'social_youtube', label: 'YouTube', placeholder: 'https://youtube.com/@yourchannel' },
  { key: 'social_instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourhandle' },
  { key: 'social_facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
  { key: 'social_twitter', label: 'X (Twitter)', placeholder: 'https://x.com/yourhandle' },
  { key: 'social_linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/…' },
  { key: 'social_whatsapp', label: 'WhatsApp channel', placeholder: 'https://whatsapp.com/channel/…' },
  { key: 'social_telegram', label: 'Telegram', placeholder: 'https://t.me/yourchannel' },
  { key: 'social_pinterest', label: 'Pinterest', placeholder: 'https://pinterest.com/yourhandle' },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/settings')
      .then((res) => setSettings(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load settings'))
      .finally(() => setLoading(false));
  }, []);

  function update(key, value) {
    setSettings((s) => ({ ...s, [key]: value }));
    setMessage('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const res = await api.put('/admin/settings', settings);
      setSettings(res.data);
      setMessage('Settings saved. Reload the public site to see the change.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save settings');
    } finally {
      setSaving(false);
    }
  }

  const field =
    'w-full rounded-xl border border-brand-ink/12 px-3.5 py-2.5 text-sm focus:border-brand-blue/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/15';

  if (loading) return <p className="text-brand-ink/60">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-brand-ink">Site Settings</h1>
      <p className="mt-1 text-sm text-brand-ink/60">
        Social links appear in the site footer and on the Watch page. Leave a field blank to hide
        that icon entirely.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <section className="rounded-2xl border border-brand-ink/10 bg-white p-6">
          <h2 className="font-extrabold text-brand-ink">Social channels</h2>
          <div className="mt-4 space-y-3">
            {SOCIAL_FIELDS.map((f) => (
              <label key={f.key} className="block">
                <span className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">
                  {f.label}
                </span>
                <input
                  type="url"
                  value={settings[f.key] || ''}
                  onChange={(e) => update(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className={`mt-1.5 ${field}`}
                />
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-brand-ink/10 bg-white p-6">
          <h2 className="font-extrabold text-brand-ink">Newsletter copy</h2>
          <p className="mt-1 text-[13.5px] text-brand-ink/55">
            Shown above the signup form in the footer and on the Downloads page.
          </p>

          <label className="mt-4 block">
            <span className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">
              Headline
            </span>
            <input
              value={settings.newsletter_headline || ''}
              onChange={(e) => update('newsletter_headline', e.target.value)}
              className={`mt-1.5 ${field}`}
            />
          </label>

          <label className="mt-4 block">
            <span className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">
              Blurb
            </span>
            <textarea
              rows={3}
              value={settings.newsletter_blurb || ''}
              onChange={(e) => update('newsletter_blurb', e.target.value)}
              className={`mt-1.5 ${field}`}
            />
          </label>
        </section>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="rounded-xl bg-green-50 p-3 text-sm font-medium text-green-700">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-brand-blue px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-blue-dark disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </form>
    </div>
  );
}
