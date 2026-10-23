import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import type { Category, PublicSettings } from '../types';

interface StorefrontContextValue {
  settings: PublicSettings | null;
  categories: Category[];
  status: 'loading' | 'ready' | 'error';
  error: string | null;
  refresh: () => Promise<void>;
}

const StorefrontContext = createContext<StorefrontContextValue | undefined>(undefined);

export const StorefrontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const [nextSettings, nextCategories] = await Promise.all([
        api.getSettings(),
        api.getCategories(),
      ]);
      setSettings(nextSettings);
      setCategories(nextCategories);
      setStatus('ready');
    } catch (err) {
      setStatus('error');
      setError(
        err instanceof Error ? err.message : 'Unable to load the DesiDhar storefront configuration.'
      );
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo(
    () => ({ settings, categories, status, error, refresh: load }),
    [settings, categories, status, error, load]
  );

  return <StorefrontContext.Provider value={value}>{children}</StorefrontContext.Provider>;
};

export function useStorefront(): StorefrontContextValue {
  const context = useContext(StorefrontContext);
  if (!context) {
    throw new Error('useStorefront must be used inside StorefrontProvider');
  }
  return context;
}
