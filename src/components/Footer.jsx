import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-brand-ink/10 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌟</span>
            <span className="font-bold text-brand-ink">Bright Side Insights</span>
          </div>
          <nav className="flex gap-6 text-sm text-brand-ink/70">
            <Link to="/" className="hover:text-brand-blue">Home</Link>
            <Link to="/blog" className="hover:text-brand-blue">Blog</Link>
            <Link to="/about" className="hover:text-brand-blue">About</Link>
            <Link to="/contact" className="hover:text-brand-blue">Contact</Link>
          </nav>
        </div>
        <p className="mt-6 text-center text-xs text-brand-ink/50">
          © {new Date().getFullYear()} Bright Side Insights. Simple knowledge for a better everyday life.
        </p>
      </div>
    </footer>
  );
}
