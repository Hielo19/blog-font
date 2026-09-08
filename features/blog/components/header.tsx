'use client';

/* oxlint-disable next/no-img-element -- Original blog images are served locally. */

import { ArrowUpRight, BookOpen, Feather, Home } from 'lucide-react';
import { useLayoutEffect, useRef } from 'react';
import type { Appearance } from '@/features/theme/use-appearance';
import { AppearanceControls } from './theme-toggle';
import { blogUrl } from '@/config/site';
import { out, type LinkAction } from '../links';
import styles from '../blog.module.css';

export function Header({
  onHome,
  onJournal,
  article,
  appearance,
  docked,
}: {
  onHome: LinkAction;
  onJournal: LinkAction;
  article: boolean;
  appearance: Appearance;
  docked: boolean;
}) {
  const headerRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const measure = () => {
      document.documentElement.style.setProperty(
        '--hielo-header-height',
        `${header.getBoundingClientRect().height}px`,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--hielo-header-height');
    };
  }, []);
  return (
    <header
      ref={headerRef}
      data-smoo-header
      className={`${styles.header} ${docked ? styles.headerDocked : styles.headerFloating}`}
    >
      <a
        className={styles.brand}
        id="home-link"
        href="#/"
        onClick={onHome}
        aria-label="Hielo 首页"
      >
        <span className={styles.brandIcon}>
          <Feather size={21} aria-hidden="true" />
        </span>
        Hielo<span className={styles.brandSuffix}>のblog</span>
      </a>
      <nav className={styles.nav} aria-label="主导航">
        <a
          className={!article && !docked ? styles.navActive : undefined}
          href="#/"
          onClick={onHome}
        >
          <Home size={16} aria-hidden="true" />
          首页
        </a>
        <a
          className={article || docked ? styles.navActive : undefined}
          href="#journal"
          onClick={onJournal}
        >
          <BookOpen size={16} aria-hidden="true" />
          文章
        </a>
        <a href={`${blogUrl}/timeline/`} {...out}>
          归档
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
        <a href={`${blogUrl}/me/`} {...out}>
          关于
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </nav>
      <AppearanceControls appearance={appearance} />
    </header>
  );
}
