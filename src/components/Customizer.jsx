import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { THEMES, LAYOUTS } from '../lib/themes';

export default function Customizer() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme, layout, setLayout } = useSiteSettings();

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="mb-3 w-72 rounded-2xl border border-brand-ink/10 bg-white p-5 shadow-xl"
          >
            <p className="text-sm font-bold text-brand-ink">Customize</p>
            <p className="mt-0.5 text-xs text-brand-ink/50">Preview a layout &amp; color theme</p>

            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-ink/60">
              Layout
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {Object.entries(LAYOUTS).map(([key, l]) => (
                <button
                  key={key}
                  onClick={() => setLayout(key)}
                  className={`rounded-xl border px-3 py-2 text-left text-xs font-medium transition-colors ${
                    layout === key
                      ? 'border-brand-blue bg-brand-blue/10 text-brand-blue'
                      : 'border-brand-ink/10 text-brand-ink/70 hover:border-brand-blue/40'
                  }`}
                >
                  <span className="block font-bold">{l.label}</span>
                  <span className="mt-0.5 block text-[11px] text-brand-ink/50">{l.description}</span>
                </button>
              ))}
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-ink/60">
              Color Theme
            </p>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {Object.entries(THEMES).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  aria-label={t.label}
                  title={t.label}
                  className={`flex h-12 flex-col overflow-hidden rounded-xl border-2 transition-transform hover:scale-105 ${
                    theme === key ? 'border-brand-ink' : 'border-transparent'
                  }`}
                >
                  <span className="h-1/2 w-full" style={{ background: t.swatch[0] }} />
                  <span className="h-1/2 w-full" style={{ background: t.swatch[1] }} />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open customizer"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-ink text-xl text-white shadow-lg transition-transform hover:scale-105"
      >
        🎨
      </button>
    </div>
  );
}
