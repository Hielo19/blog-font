import type { MouseEvent } from 'react';

export const out = { target: '_blank', rel: 'noreferrer' };
export type LinkAction = (event: MouseEvent<HTMLAnchorElement>) => void;
export const plainClick = (event: MouseEvent<HTMLAnchorElement>) =>
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.altKey &&
  !event.shiftKey;
