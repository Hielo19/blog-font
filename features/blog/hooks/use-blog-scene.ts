'use client';

import { useLayoutEffect, useState, type RefObject } from 'react';
import { VISUAL_SCROLL_EVENT } from '@/features/scroll/smoo-scroll';

export function useBlogScene({
  article,
  revision,
  motion,
  getScrollY,
  previewRef,
}: {
  article: boolean;
  revision: number;
  motion: boolean;
  getScrollY: () => number;
  previewRef: RefObject<HTMLDivElement | null>;
}) {
  const [headerDocked, setHeaderDocked] = useState(false);
  useLayoutEffect(() => {
    let frame = 0;
    const dashboard = document.getElementById('dashboard-start');
    const profile = document.getElementById('profile-card');
    const profileCore = document.getElementById('profile-core');
    const identity = document.getElementById('hero-identity');
    const measure = () => {
      frame = 0;
      const root = previewRef.current;
      if (!root) return;
      const visualY = getScrollY();
      const viewportWidth = document.documentElement.clientWidth;
      const narrow = viewportWidth <= 700;
      const compact = viewportWidth <= 1050;
      const scrollPadding = Number.parseFloat(
        getComputedStyle(document.documentElement).scrollPaddingTop,
      );
      const scrollMargin = dashboard
        ? Number.parseFloat(getComputedStyle(dashboard).scrollMarginTop)
        : 48;
      const dashboardTop = dashboard
        ? dashboard.getBoundingClientRect().top + visualY
        : window.innerHeight;
      const travel = Math.max(
        1,
        dashboardTop -
          (Number.isFinite(scrollPadding) ? scrollPadding : 74) -
          (Number.isFinite(scrollMargin) ? scrollMargin : 48),
      );
      const rawProgress = article
        ? 1
        : visualY >= travel - 1
          ? 1
          : Math.min(1, Math.max(0, visualY / travel));
      const progress = motion
        ? rawProgress * rawProgress * (3 - 2 * rawProgress)
        : article || rawProgress > 0.78
          ? 1
          : 0;
      // Read all moving geometry before writing this frame's styles.
      const profileRect = profile?.getBoundingClientRect();
      const profileCoreRect = profileCore?.getBoundingClientRect();
      const startInset = narrow ? 16 : Math.max(34, (viewportWidth - 1180) / 2);
      const startTop = narrow ? 16 : 30;
      const startPadding = narrow ? 14 : 22;
      const endPadding = narrow
        ? 14
        : Math.max(22, (viewportWidth - 1180) / 2 + 22);
      root.style.setProperty(
        '--header-inset',
        `${startInset * (1 - progress)}px`,
      );
      root.style.setProperty('--header-top', `${startTop * (1 - progress)}px`);
      root.style.setProperty('--header-radius', `${22 * (1 - progress)}px`);
      root.style.setProperty(
        '--header-padding-x',
        `${startPadding + (endPadding - startPadding) * progress}px`,
      );
      root.style.setProperty(
        '--header-min-height',
        `${(narrow ? 66 : 64) - (narrow ? 0 : 4) * progress}px`,
      );
      root.style.setProperty(
        '--hero-explore-opacity',
        String(1 - Math.min(1, progress / 0.32)),
      );

      if (profileRect && profileCoreRect && identity && motion) {
        const targetScale = 1;
        const targetX = profileCoreRect.left + profileCoreRect.width / 2;
        const targetY = profileCoreRect.top + profileCoreRect.height / 2;
        const positionProgress = Math.min(1, progress / 0.86);
        const moveX = (targetX - viewportWidth / 2) * positionProgress;
        const moveY = (targetY - window.innerHeight / 2) * positionProgress;
        const scale = 1 + (targetScale - 1) * positionProgress;
        const startAvatar = narrow
          ? 108
          : Math.min(140, Math.max(108, viewportWidth * 0.09));
        const startTitle = narrow
          ? Math.min(58.4, Math.max(44, viewportWidth * 0.13))
          : Math.min(107.2, Math.max(56, viewportWidth * 0.078));
        const targetTitle = compact ? 29.6 : 32;
        const startSignature = narrow ? 20 : 26.4;
        const cardProgress = Math.min(1, Math.max(0, (progress - 0.16) / 0.72));
        const cardReveal = Math.min(1, Math.max(0, (progress - 0.25) / 0.55));
        root.style.setProperty('--identity-x', `${moveX}px`);
        root.style.setProperty('--identity-y', `${moveY}px`);
        root.style.setProperty('--identity-scale', String(scale));
        root.style.setProperty(
          '--identity-core-width',
          `${profileCoreRect.width}px`,
        );
        root.style.setProperty(
          '--identity-avatar-size',
          `${startAvatar + (112 - startAvatar) * positionProgress}px`,
        );
        root.style.setProperty(
          '--identity-title-size',
          `${startTitle + (targetTitle - startTitle) * positionProgress}px`,
        );
        root.style.setProperty(
          '--identity-signature-size',
          `${startSignature + (16.8 - startSignature) * positionProgress}px`,
        );
        root.style.setProperty(
          '--identity-avatar-margin-top',
          `${25 * positionProgress}px`,
        );
        root.style.setProperty(
          '--identity-signature-margin-top',
          `${17 + (5 - 17) * positionProgress}px`,
        );
        root.style.setProperty(
          '--identity-signature-margin-bottom',
          `${20 * positionProgress}px`,
        );
        root.style.setProperty(
          '--identity-note-padding-y',
          `${7 * (1 - positionProgress)}px`,
        );
        root.style.setProperty(
          '--identity-note-padding-x',
          `${14 * (1 - positionProgress)}px`,
        );
        root.style.setProperty(
          '--identity-note-radius',
          `${10 * (1 - positionProgress)}px`,
        );
        root.style.setProperty(
          '--identity-note-alpha',
          String(0.26 * (1 - positionProgress)),
        );
        root.style.setProperty(
          '--identity-line-opacity',
          String(positionProgress),
        );
        root.style.setProperty(
          '--identity-title-line-height',
          String(1 + 0.25 * positionProgress),
        );
        root.style.setProperty('--identity-title-suffix-size', '100%');
        root.style.setProperty('--identity-title-spacing', '-0.025em');
        root.style.setProperty('--identity-title-suffix-weight', '400');
        root.style.setProperty(
          '--identity-note-spacing',
          `${0.04 + 0.04 * positionProgress}em`,
        );
        root.style.setProperty(
          '--identity-avatar-border',
          `${2 - positionProgress}px`,
        );
        const rawBlend = Math.min(1, Math.max(0, (progress - 0.86) / 0.14));
        // Eliminate sub-pixel alpha residue at the end of the cross-fade.
        const blend = rawBlend > 0.998 ? 1 : rawBlend < 0.002 ? 0 : rawBlend;
        root.style.setProperty('--identity-opacity', String(1 - blend));
        root.style.setProperty(
          '--identity-card-opacity',
          String(cardProgress * (1 - cardReveal) * 0.65),
        );
        root.style.setProperty(
          '--identity-card-width',
          `${profileRect.width}px`,
        );
        root.style.setProperty(
          '--identity-card-height',
          `${profileRect.height}px`,
        );
        root.style.setProperty('--profile-opacity', String(cardReveal));
        root.style.setProperty('--identity-color-progress', String(cardReveal));
        root.style.setProperty('--profile-content-opacity', String(blend));
        root.style.setProperty(
          '--profile-scale',
          String(0.96 + cardReveal * 0.04),
        );
      }
      setHeaderDocked(article || rawProgress > 0.78);
    };
    const update = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener(VISUAL_SCROLL_EVENT, update);
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener(VISUAL_SCROLL_EVENT, update);
      window.removeEventListener('resize', update);
    };
  }, [article, revision, motion, getScrollY, previewRef]);
  return headerDocked;
}
