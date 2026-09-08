/** Recheck after layout when reduced motion docks the header without easing. */
export function alignNativeScroll(
  resolveTop: () => number,
  onComplete: () => void,
  frame: { current: number },
) {
  window.scrollTo({ top: resolveTop(), behavior: 'instant' });
  let checks = 0;
  function align() {
    frame.current = 0;
    const top = resolveTop();
    const error = Math.abs(top - window.scrollY);
    window.scrollTo({ top, behavior: 'instant' });
    if (++checks < 4 && (checks < 2 || error > 0.5))
      frame.current = requestAnimationFrame(align);
    else onComplete();
  }
  frame.current = requestAnimationFrame(align);
}
