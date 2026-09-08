'use client';

import { useCallback, useLayoutEffect, useRef } from 'react';
import { createSmooScroll } from '@/lib/smoo-scroll';

export function useSmoothScroll(motion: boolean) {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const instance = useRef<ReturnType<typeof createSmooScroll> | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const viewport = viewportRef.current;
    const content = contentRef.current;
    const spacer = spacerRef.current;
    if (!motion || !root || !viewport || !content || !spacer) return;
    const scroller = createSmooScroll(root, viewport, content, spacer);
    instance.current = scroller;
    return () => {
      scroller.destroy();
      instance.current = null;
    };
  }, [motion]);

  const getScrollY = useCallback(
    () => instance.current?.getScrollY() ?? window.scrollY,
    [],
  );
  const cancelScroll = useCallback(() => instance.current?.cancelScroll(), []);
  const scrollTo = useCallback(
    (target: number | HTMLElement, immediate = false) => {
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
    [getScrollY],
  );

  return {
    rootRef,
    viewportRef,
    contentRef,
    spacerRef,
    getScrollY,
    scrollTo,
    cancelScroll,
  };
}
