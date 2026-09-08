'use client';

import { Moon, Sun } from 'lucide-react';
import type { Appearance } from '@/features/theme/use-appearance';
import styles from '../blog.module.css';

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
