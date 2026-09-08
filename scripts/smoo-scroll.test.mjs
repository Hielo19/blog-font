import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createSmooScroll, VISUAL_SCROLL_EVENT } from '../lib/smoo-scroll.ts';

// A deterministic DOM boundary: CSS easing is supplied as an in-flight visual
// position, allowing navigation and cleanup to be tested without timing races.
function setup(t) {
  const names = [
    'window',
    'document',
    'HTMLElement',
    'DOMMatrixReadOnly',
    'ResizeObserver',
    'getComputedStyle',
    'requestAnimationFrame',
    'cancelAnimationFrame',
  ];
  const previous = names.map((name) => [
    name,
    Object.getOwnPropertyDescriptor(globalThis, name),
  ]);
  const frames = new Map();
  let serial = 0;
  let visual = null;
  let disconnected = false;
  class Element extends EventTarget {
    dataset = {};
    offsetHeight = 0;
    scrollTop = 0;
    style = {
      removeProperty(key) {
        delete this[key];
      },
    };
    querySelector() {
      return null;
    }
    querySelectorAll() {
      return [];
    }
    contains(element) {
      return element === this;
    }
  }
  const root = new Element();
  const viewport = new Element();
  const content = new Element();
  const spacer = new Element();
  const aside = new Element();
  const main = new Element();
  const html = new Element();
  content.offsetHeight = 2400;
  aside.offsetHeight = 120;
  const translate = () =>
    Number.parseFloat(
      content.style.transform?.match(/translateY\(([-\d.]+)px\)/)?.[1] || '0',
    );
  const currentY = () =>
    content.style.transition === 'none' || visual === null
      ? -translate()
      : visual;
  aside.getBoundingClientRect = () => {
    const top =
      100 -
      currentY() +
      Number.parseFloat(aside.style.translate?.split(' ')[1] || '0');
    return { top, bottom: top + aside.offsetHeight };
  };
  main.getBoundingClientRect = () => ({
    top: 100 - currentY(),
    bottom: 1900 - currentY(),
  });
  content.querySelectorAll = () => [aside];
  aside.closest = () => main;
  const win = new EventTarget();
  win.scrollY = 0;
  win.innerHeight = 600;
  win.scrollTo = ({ top }) => {
    const height = Number.parseFloat(
      spacer.style.height || String(content.offsetHeight),
    );
    win.scrollY = Math.min(
      Math.max(0, top),
      Math.max(0, height - win.innerHeight),
    );
  };
  Object.assign(globalThis, {
    window: win,
    document: { documentElement: html },
    HTMLElement: Element,
    DOMMatrixReadOnly: class {
      constructor(value) {
        this.m42 = Number.parseFloat(
          value.match(/translateY\(([-\d.]+)px\)/)[1],
        );
      }
    },
    ResizeObserver: class {
      observe() {}
      disconnect() {
        disconnected = true;
      }
    },
    getComputedStyle: (element) =>
      element === html
        ? { scrollPaddingTop: '92px', getPropertyValue: () => '80px' }
        : { transform: `translateY(${-currentY()}px)` },
    requestAnimationFrame: (callback) => {
      frames.set(++serial, callback);
      return serial;
    },
    cancelAnimationFrame: (id) => frames.delete(id),
  });
  const scroller = createSmooScroll(root, viewport, content, spacer);
  t.after(() => {
    scroller.destroy();
    previous.forEach(([name, descriptor]) => {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    });
  });
  return {
    root,
    content,
    spacer,
    aside,
    main,
    win,
    scroller,
    frames,
    setVisual: (value) => {
      visual = value;
    },
    disconnected: () => disconnected,
    frame() {
      const callbacks = [...frames.values()];
      frames.clear();
      callbacks.forEach((callback) => callback());
    },
  };
}

await test('native scroll targets stay distinct from the visible position; cancellation preserves what was visible', (t) => {
  const f = setup(t);
  f.scroller.scrollTo(900);
  f.setVisual(300);
  let reported = 0;
  f.win.addEventListener(VISUAL_SCROLL_EVENT, () => {
    reported = f.scroller.getScrollY();
  });
  f.frame();
  assert.equal(f.win.scrollY, 900);
  assert.equal(reported, 300);
  f.scroller.cancelScroll();
  assert.equal(f.win.scrollY, 300);
  assert.equal(f.content.style.transform, 'translateY(-300px)');
});

await test('route restoration measures the new content height and clamps the destination before committing', (t) => {
  const f = setup(t);
  f.scroller.scrollTo(1400, true);
  f.content.offsetHeight = 1100;
  f.scroller.scrollTo(900, true);
  assert.equal(f.spacer.style.height, '1100px');
  assert.equal(f.win.scrollY, 500);
  assert.equal(f.scroller.getScrollY(), 500);
  assert.equal(f.content.style.transform, 'translateY(-500px)');
  f.content.offsetHeight = 2400;
  f.scroller.scrollTo(1400, true);
  assert.equal(f.scroller.getScrollY(), 1400);
});

await test('reading controls stay below the header and stop at the article boundary', (t) => {
  const f = setup(t);
  f.scroller.scrollTo(500, true);
  assert.equal(f.aside.getBoundingClientRect().top, 96);
  f.scroller.scrollTo(1800, true);
  assert.equal(
    f.aside.getBoundingClientRect().bottom,
    f.main.getBoundingClientRect().bottom,
  );
});

await test('turning smoothing off clears observers, animation frames and styles while preserving position', (t) => {
  const f = setup(t);
  f.scroller.scrollTo(500, true);
  f.scroller.destroy();
  assert.equal(f.win.scrollY, 500);
  assert.equal(f.root.dataset.smooScroll, undefined);
  assert.equal(f.spacer.style.height, undefined);
  assert.equal(f.content.style.transform, undefined);
  assert.equal(f.aside.style.translate, undefined);
  assert.equal(f.frames.size, 0);
  assert.equal(f.disconnected(), true);
  f.win.dispatchEvent(new Event('scroll'));
  assert.equal(f.content.style.transform, undefined);
});

