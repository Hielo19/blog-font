/*
 * SmooScroll 1.2.0 manual-lite, React lifecycle adaptation.
 * Original: 孤灯从流 ShuninYu, https://github.com/ShuninYu/SmooScroll
 * Upstream revision: d302ef3c9cbb63b4eb3961f39b5edefcd4f8527f
 * SPDX-License-Identifier: GPL-3.0-only
 * Changes: explicit mounting/cleanup, instant route restoration, visual scroll
 * events, focus handling, and bounded sticky positioning without cloned links.
 */

export const VISUAL_SCROLL_EVENT = 'hielo-visual-scroll';
export const SMOO_TRANSITION = 'transform 0.8s cubic-bezier(.35, .73, .5, 1)';

export function createSmooScroll(
  root: HTMLElement,
  viewport: HTMLElement,
  content: HTMLElement,
  spacer: HTMLElement,
) {
  let frame = 0;
  let focusFrame = 0;
  let disposed = false;
  let ignoreFocus = false;
  let journeyFrame = 0;
  let journeyActive = false;
  const shifts = new WeakMap<HTMLElement, number>();
  const initialY = window.scrollY;

  function getScrollY() {
    const transform = getComputedStyle(content).transform;
    return transform === 'none' ? 0 : -new DOMMatrixReadOnly(transform).m42;
  }

  function updateSticky(visualY: number) {
    const headerHeight =
      Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--hielo-header-height',
        ),
      ) || 76;
    content
      .querySelectorAll<HTMLElement>('[data-smoo-sticky]')
      .forEach((element) => {
        const container = element.closest('main');
        if (!container) return;
        const naturalTop =
          element.getBoundingClientRect().top +
          visualY -
          (shifts.get(element) || 0);
        const bottom = container.getBoundingClientRect().bottom + visualY;
        const limit = Math.max(0, bottom - naturalTop - element.offsetHeight);
        const shift = Math.min(
          limit,
          Math.max(0, visualY + headerHeight + 16 - naturalTop),
        );
        element.style.translate = `0 ${shift}px`;
        shifts.set(element, shift);
      });
  }

  function notify() {
    const visualY = getScrollY();
    updateSticky(visualY);
    window.dispatchEvent(new Event(VISUAL_SCROLL_EVENT));
    return visualY;
  }

  function tick() {
    frame = 0;
    if (disposed) return;
    if (!journeyActive) ignoreFocus = false;
    if (Math.abs(notify() - window.scrollY) > 0.05)
      frame = requestAnimationFrame(tick);
  }

  function startFrames() {
    if (!frame && !disposed) frame = requestAnimationFrame(tick);
  }

  function resize() {
    spacer.style.height = `${content.offsetHeight}px`;
    startFrames();
  }

  function followScroll() {
    content.style.transform = `translateY(${-window.scrollY}px)`;
    startFrames();
  }

  function scrollTo(top: number, immediate = false) {
    stopJourney();
    resize();
    if (immediate) {
      ignoreFocus = true;
      content.style.transition = 'none';
    }
    window.scrollTo({ top, behavior: 'instant' });
    followScroll();
    if (immediate) {
      // Commit the restored transform before reinstating the CSS transition.
      notify();
      content.style.transition = SMOO_TRANSITION;
    }
  }

  function cancelScroll() {
    scrollTo(getScrollY(), true);
  }

  function stopJourney() {
    if (!journeyActive) return;
    cancelAnimationFrame(journeyFrame);
    journeyFrame = 0;
    journeyActive = false;
    delete root.dataset.smooJourney;
    content.style.transition = SMOO_TRANSITION;
  }

  // A guided click moves both the native position and the visible content.
  // Ordinary scrolling continues to use the upstream CSS follow behaviour.
  function exploreTo(resolveTop: () => number, onComplete: () => void) {
    cancelScroll();
    cancelAnimationFrame(focusFrame);
    const from = getScrollY();
    const distance = Math.abs(resolveTop() - from);
    if (distance < 1) {
      onComplete();
      return;
    }
    const duration = Math.min(1250, Math.max(700, distance * 0.6 + 650));
    let started: number | null = null;
    journeyActive = true;
    ignoreFocus = true;
    root.dataset.smooJourney = 'on';
    content.style.transition = 'none';
    const advance = (time: number) => {
      if (!journeyActive || disposed) return;
      started ??= time;
      const t = Math.min(1, Math.max(0, (time - started) / duration));
      // Zero velocity and acceleration at both ends avoids a kick or hard stop.
      const eased = t * t * t * (10 + t * (-15 + 6 * t));
      const top = resolveTop();
      window.scrollTo({
        top: from + (top - from) * eased,
        behavior: 'instant',
      });
      followScroll();
      notify();
      if (t < 1) journeyFrame = requestAnimationFrame(advance);
      else {
        stopJourney();
        onComplete();
      }
    };
    journeyFrame = requestAnimationFrame(advance);
  }

  function onInput(event: Event) {
    if (
      event.type === 'keydown' &&
      ![
        'ArrowUp',
        'ArrowDown',
        'PageUp',
        'PageDown',
        'Home',
        'End',
        ' ',
        'Escape',
        'Tab',
      ].includes((event as KeyboardEvent).key)
    )
      return;
    stopJourney();
  }

  function onFocus(event: FocusEvent) {
    const target = event.target;
    if (
      ignoreFocus ||
      !(target instanceof HTMLElement) ||
      !content.contains(target)
    )
      return;
    cancelAnimationFrame(focusFrame);
    focusFrame = requestAnimationFrame(() => {
      if (disposed || !content.contains(target)) return;
      viewport.scrollTop = 0;
      const rect = target.getBoundingClientRect();
      const padding =
        Number.parseFloat(
          getComputedStyle(document.documentElement).scrollPaddingTop,
        ) || 88;
      if (rect.top < padding || rect.bottom > window.innerHeight)
        scrollTo(getScrollY() + rect.top - padding, true);
    });
  }

  root.dataset.smooScroll = 'on';
  content.style.transition = SMOO_TRANSITION;
  resize();
  scrollTo(initialY, true);
  const observer = new ResizeObserver(resize);
  observer.observe(content);
  const header = root.querySelector('[data-smoo-header]');
  if (header) observer.observe(header);
  window.addEventListener('scroll', followScroll, { passive: true });
  window.addEventListener('resize', resize);
  window.addEventListener('wheel', onInput, { passive: true });
  window.addEventListener('touchstart', onInput, { passive: true });
  window.addEventListener('pointerdown', onInput, { passive: true });
  window.addEventListener('keydown', onInput);
  content.addEventListener('focusin', onFocus);

  return {
    getScrollY,
    scrollTo,
    cancelScroll,
    exploreTo,
    resize,
    destroy() {
      if (disposed) return;
      const visualY = getScrollY();
      stopJourney();
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(focusFrame);
      window.removeEventListener('scroll', followScroll);
      window.removeEventListener('resize', resize);
      window.removeEventListener('wheel', onInput);
      window.removeEventListener('touchstart', onInput);
      window.removeEventListener('pointerdown', onInput);
      window.removeEventListener('keydown', onInput);
      content.removeEventListener('focusin', onFocus);
      content
        .querySelectorAll<HTMLElement>('[data-smoo-sticky]')
        .forEach((element) => {
          element.style.removeProperty('translate');
        });
      content.style.removeProperty('transition');
      content.style.removeProperty('transform');
      spacer.style.removeProperty('height');
      delete root.dataset.smooScroll;
      window.scrollTo({ top: visualY, behavior: 'instant' });
    },
  };
}
