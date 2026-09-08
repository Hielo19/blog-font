/** Align the scrim's lower edge with the live navigation border box. */
export function getHomeLandingTop(visualY: number): number | null {
  const boundary = document.getElementById('home-boundary');
  const header = document.querySelector('[data-smoo-header]');
  if (!boundary || !header) return null;
  return Math.max(
    0,
    boundary.getBoundingClientRect().bottom +
      visualY -
      header.getBoundingClientRect().bottom,
  );
}
