'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import styles from './preview.module.css';

const STORAGE_KEY = 'hielo-glass-appearance';
const THEME_EVENT = 'hielo-theme-change';
type Mode = 'light' | 'dark' | 'system';
let fallbackMode: Mode | null = null;

function readMode(): Mode {
  if (fallbackMode !== null) return fallbackMode;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    // Older motion preferences are intentionally ignored.
    if (['light', 'dark', 'system'].includes(saved?.mode)) return saved.mode;
  } catch {
    /* Theme switching also works without storage. */
  }
  return 'system';
}

function subscribeMode(notify: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    fallbackMode = null;
    notify();
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(THEME_EVENT, notify);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(THEME_EVENT, notify);
  };
}

function mediaPreference(query: string) {
  return {
    subscribe: (notify: () => void) => {
      const media = matchMedia(query);
      media.addEventListener('change', notify);
      return () => media.removeEventListener('change', notify);
    },
    snapshot: () => matchMedia(query).matches,
  };
}

const darkPreference = mediaPreference('(prefers-color-scheme: dark)');
const reducedPreference = mediaPreference('(prefers-reduced-motion: reduce)');
const serverMode = (): Mode => 'system';
const serverMedia = () => false;

export function useAppearance() {
  const mode = useSyncExternalStore(subscribeMode, readMode, serverMode);
  const systemDark = useSyncExternalStore(
    darkPreference.subscribe,
    darkPreference.snapshot,
    serverMedia,
  );
  const systemReduce = useSyncExternalStore(
    reducedPreference.subscribe,
    reducedPreference.snapshot,
    serverMedia,
  );
  const theme = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;
  const update = ({ mode: next }: { mode: Mode }) => {
    fallbackMode = next;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode: next }));
      fallbackMode = null;
    } catch {
      /* Storage is optional. */
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  };
  return {
    theme,
    motion: !systemReduce,
    attributes: {
      'data-hielo-theme': theme,
      'data-hielo-motion': systemReduce ? 'off' : 'on',
    },
    update,
  };
}

export type Appearance = ReturnType<typeof useAppearance>;

export function AppearanceControls({ appearance }: { appearance: Appearance }) {
  const { theme, update } = appearance;
  const label = `切换到${theme === 'dark' ? '浅色' : '深色'}模式`;
  return (
    <div className={styles.headerActions}>
      <button
        type="button"
        className={styles.modeToggle}
        aria-label={label}
        title={label}
        onClick={() => update({ mode: theme === 'dark' ? 'light' : 'dark' })}
      >
        {theme === 'dark' ? (
          <Moon size={18} aria-hidden="true" />
        ) : (
          <Sun size={18} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
