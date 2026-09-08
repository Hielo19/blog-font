import { access } from 'node:fs/promises';
import { resolve } from 'node:path';

process.env.NODE_ENV = 'production';
const { createBuilder } = await import('vite');
const { runPrerender } = await import('vinext/internal/build/run-prerender');
const { loadNextConfig, resolveNextConfig } =
  await import('vinext/internal/config/next-config');

// Use the same build/export steps as the pinned Vinext CLI, but allow Node
// to close native Vite handles naturally. The CLI's forced process.exit(0)
// triggers UV_HANDLE_CLOSING on this Windows / Node 24 environment.
const root = process.cwd();
const nextConfig = await resolveNextConfig(await loadNextConfig(root), root);
if (nextConfig.output !== 'export')
  throw new Error('This preview must use static export.');
const builder = await createBuilder({
  root,
  mode: 'production',
  logLevel: 'warn',
});
await builder.buildApp();
const result = await runPrerender({ root, nextConfig });
if (
  !result?.routes.some(
    (route) => route.route === '/' && route.status === 'rendered',
  )
) {
  throw new Error('The home page was not exported.');
}
await access(resolve(root, 'dist/client/index.html'));
console.log('\nHielo static build ready: dist/client');
