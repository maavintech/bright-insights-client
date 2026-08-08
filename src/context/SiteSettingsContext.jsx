import { createContext, useContext, useEffect, useState } from 'react';
import { THEMES } from '../lib/themes';

const SiteSettingsContext = createContext(null);

function applyTheme(themeKey) {
  const theme = THEMES[themeKey] || THEMES.sunrise;
  Object.entries(theme.tokens).forEach(([prop, value]) => {
    document.documentElement.style.setProperty(prop, value);
  });
}

export function SiteSettingsProvider({ children }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem('bi_theme') || 'sunrise');
  const [layout, setLayoutState] = useState(() => localStorage.getItem('bi_layout') || 'classifieds');

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function setTheme(key) {
    localStorage.setItem('bi_theme', key);
    setThemeState(key);
  }

  function setLayout(key) {
    localStorage.setItem('bi_layout', key);
    setLayoutState(key);
  }

  return (
    <SiteSettingsContext.Provider value={{ theme, setTheme, layout, setLayout }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error('useSiteSettings must be used within SiteSettingsProvider');
  return ctx;
}
