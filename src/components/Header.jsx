import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import DailyTipBar from './DailyTipBar';
import SearchBar from './SearchBar';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/blog', label: 'Blog' },
  { to: '/resources', label: 'Downloads' },
  { to: '/videos', label: 'Watch' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const navLinkClass = ({ isActive }) =>
  `text-[15px] font-semibold transition-colors ${
    isActive ? 'text-brand-blue' : 'text-brand-ink/70 hover:text-brand-blue'
  }`;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="glass-panel card-shadow sticky top-0 z-30 border-b border-brand-ink/[0.06]">
      <DailyTipBar />

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-blue-dark text-lg shadow-sm">
            🌟
          </span>
          <span className="text-lg font-extrabold tracking-tight text-brand-ink sm:text-xl">
            Bright Side Insights
          </span>
        </Link>

        {/* The nav needs more room now that Downloads and Watch exist, so it
            appears at lg rather than sm and collapses to a menu below that. */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass} end={item.end}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          <SearchBar />

          <Link
            to="/admin/login"
            className="hidden rounded-full border border-brand-blue/25 px-4 py-2 text-sm font-semibold text-brand-blue transition-colors hover:bg-brand-blue hover:text-white lg:block"
          >
            Admin
          </Link>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full text-brand-ink/70 transition-colors hover:bg-brand-ink/5 lg:hidden"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-brand-ink/[0.06] bg-white lg:hidden">
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-2.5 text-[15px] font-semibold transition-colors ${
                    isActive
                      ? 'bg-brand-blue/8 text-brand-blue'
                      : 'text-brand-ink/75 hover:bg-brand-ink/5'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/admin/login"
              onClick={() => setMenuOpen(false)}
              className="mt-2 block rounded-xl px-3 py-2.5 text-[15px] font-semibold text-brand-blue hover:bg-brand-blue/5"
            >
              Admin
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
