import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <h1 className="text-4xl font-extrabold text-brand-ink">404</h1>
      <p className="mt-3 text-brand-ink/70">This page doesn&rsquo;t exist.</p>
      <Link to="/" className="mt-6 inline-block text-brand-blue hover:underline">
        Back to Home
      </Link>
    </div>
  );
}
