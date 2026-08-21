import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ variant = 'header' }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(variant === 'inline');
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && variant === 'header') inputRef.current?.focus();
  }, [open, variant]);

  // Escape closes the expanded header field without submitting.
  useEffect(() => {
    if (!open || variant !== 'header') return undefined;
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, variant]);

  function handleSubmit(e) {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setQuery('');
    if (variant === 'header') setOpen(false);
  }

  const searchIcon = (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );

  if (variant === 'header' && !open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="flex h-9 w-9 items-center justify-center rounded-full text-brand-ink/60 transition-colors hover:bg-brand-ink/5 hover:text-brand-blue"
      >
        {searchIcon}
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={variant === 'header' ? 'relative' : 'relative w-full'}
    >
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-ink/35">
        {searchIcon}
      </span>
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={() => variant === 'header' && !query && setOpen(false)}
        placeholder="Search articles and downloads…"
        aria-label="Search articles and downloads"
        className={`rounded-full border border-brand-ink/12 bg-white py-2.5 pl-10 pr-4 text-[15px] text-brand-ink placeholder:text-brand-ink/35 focus:border-brand-blue/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/15 ${
          variant === 'header' ? 'w-56 sm:w-64' : 'w-full'
        }`}
      />
    </form>
  );
}
