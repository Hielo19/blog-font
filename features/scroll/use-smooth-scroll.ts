'use client';

import { useCallback, useLayoutEffect, useRef } from 'react';
import { createSmooScroll } from './smoo-scroll';
import { alignNativeScroll } from './align-native-scroll';

export function useSmoothScroll(motion: boolean) {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const instance = useRef<ReturnType<typeof createSmooScroll> | null>(null);
  const alignmentFrame = useRef(0);
  const cancelAlignment = useCallback(() => {
    cancelAnimationFrame(alignmentFrame.current);
    alignmentFrame.current = 0;
  }, []);

  useLayoutEffect(() => {
    const events = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const;
    events.forEach((event) =>
      window.addEventListener(event, cancelAlignment, { passive: true }),
    );
    return () => {
      cancelAlignment();
      events.forEach((event) =>
        window.removeEventListener(event, cancelAlignment),
      );
    };
  }, [cancelAlignment]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const viewport = viewportRef.current;
    const content = contentRef.current;
    const spacer = spacerRef.current;
    if (!motion || !root || !viewport || !content || !spacer) return;
    const scroller = createSmooScroll(root, viewport, content, spacer);
    instance.current = scroller;
    return () => {
      cancelAlignment();
      scroller.destroy();
      instance.current = null;
    };
  }, [motion, cancelAlignment]);

  const getScrollY = useCallback(
    () => instance.current?.getScrollY() ?? window.scrollY,
    [],
  );
  const cancelScroll = useCallback(() => {
    cancelAlignment();
    instance.current?.cancelScroll();
  }, [cancelAlignment]);
  const exploreTo = useCallback(
    (target: HTMLElement, resolveTarget?: () => number) => {
      cancelAlignment();
      const resolveTop =
        resolveTarget ??
        (() => {
          const padding =
            Number.parseFloat(
              getComputedStyle(document.documentElement).scrollPaddingTop,
            ) || 0;
          const margin =
            Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
          return Math.max(
            0,
            target.getBoundingClientRect().top +
              getScrollY() -
              padding -
              margin,
          );
        });
      const focus = () => target.focus({ preventScroll: true });
      if (instance.current) instance.current.exploreTo(resolveTop, focus);
      else alignNativeScroll(resolveTop, focus, alignmentFrame);
    },
    [getScrollY, cancelAlignment],
  );
  const scrollTo = useCallback(
    (target: number | HTMLElement, immediate = false) => {
      cancelAlignment();
      instance.current?.resize();
      const padding =
        Number.parseFloat(
          getComputedStyle(document.documentElement).scrollPaddingTop,
        ) || 0;
      const top =
        typeof target === 'number'
          ? target
          : target.getBoundingClientRect().top +
            getScrollY() -
            padding -
            (Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0);
      if (instance.current)
        instance.current.scrollTo(Math.max(0, top), immediate);
      else window.scrollTo({ top: Math.max(0, top), behavior: 'instant' });
    },
    [getScrollY, cancelAlignment],
  );

  return {
    rootRef,
    viewportRef,
    contentRef,
    spacerRef,
    getScrollY,
    scrollTo,
    cancelScroll,
    exploreTo,
  };
}
