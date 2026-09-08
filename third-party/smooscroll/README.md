# SmooScroll

- Author: 孤灯从流 ShuninYu
- Website: https://smooscroll.js.org/
- Source: https://github.com/ShuninYu/SmooScroll
- Adapted source: `src/smooscroll-manual-lite.js`, version 1.2.0
- Revision: `d302ef3c9cbb63b4eb3961f39b5edefcd4f8527f`
- Upstream license: GNU GPL v3; full text in `LICENSE`.

The local adaptation is `lib/smoo-scroll.ts`, integrated by
`app/smooth-scroll.ts` and the page's explicitly rendered viewport/content/spacer.
It retains the upstream manual-lite mechanism (native scrollbar, matching
document height, and translated content with a CSS transition) and the source's
0.8 second / `.35, .73, .5, 1` timing, rather than the older defaults shown in
parts of the website's guide.

Local changes on 2026-09-08:

- React owns the DOM; no DOMContentLoaded handler or moving React nodes into body.
- Explicit cleanup of observers, listeners, animation frames and inline styles.
- A spacer supplies document height without overwriting body styles.
- Visual position events synchronize the hero and reading progress with easing.
- Immediate, height-aware navigation restoration and cancellation of in-flight easing.
- The existing reading aside is translated within article bounds, without a cloned sticky element.
- Native document flow when reduced motion is requested, and keyboard focus handling.

The upstream global script is not loaded alongside this adaptation.
