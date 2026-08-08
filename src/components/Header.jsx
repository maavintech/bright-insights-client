import { Link, NavLink } from 'react-router-dom';

const navLinkClass = ({ isActive }) =>
  `text-[15px] font-semibold transition-colors ${
    isActive ? 'text-brand-blue' : 'text-brand-ink/70 hover:text-brand-blue'
  }`;

export default function Header() {
  return (
    <header className="glass-panel card-shadow sticky top-0 z-30 border-b border-brand-ink/[0.06]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-blue-dark text-lg shadow-sm">
            🌟
          </span>
          <span className="text-xl font-extrabold tracking-tight text-brand-ink">
            Bright Side Insights
          </span>
        </Link>
        <nav className="hidden items-center gap-8 sm:flex">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/blog" className={navLinkClass}>
            Blog
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>
        <Link
          to="/admin/login"
          className="rounded-full border border-brand-blue/25 px-4 py-2 text-sm font-semibold text-brand-blue transition-colors hover:bg-brand-blue hover:text-white"
        >
          Admin
        </Link>
      </div>
    </header>
  );
}
