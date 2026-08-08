import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-cream px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-brand-ink/10 bg-white p-8 shadow-sm"
      >
        <div className="mb-6 text-center">
          <span className="text-3xl">🌟</span>
          <h1 className="mt-2 text-xl font-bold text-brand-ink">Bright Side Insights</h1>
          <p className="text-sm text-brand-ink/60">Admin Login</p>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <label className="mb-3 block text-sm font-medium text-brand-ink/80">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-ink/15 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
          />
        </label>

        <label className="mb-6 block text-sm font-medium text-brand-ink/80">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-ink/15 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-dark disabled:opacity-60"
        >
          {submitting ? 'Logging in…' : 'Log In'}
        </button>
      </form>
    </div>
  );
}
