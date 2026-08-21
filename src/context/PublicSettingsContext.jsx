import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';

// Admin-editable public settings (social URLs, newsletter copy) fetched once
// per page load and shared by the header, footer and newsletter forms.
const PublicSettingsContext = createContext({ settings: {}, loading: true });

export function PublicSettingsProvider({ children }) {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get('/settings')
      .then((res) => {
        if (!cancelled) setSettings(res.data || {});
      })
      // Settings are cosmetic. If the request fails the site should still
      // render, just without social links.
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PublicSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </PublicSettingsContext.Provider>
  );
}

export function usePublicSettings() {
  return useContext(PublicSettingsContext);
}
