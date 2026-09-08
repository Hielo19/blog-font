import type { BlogContent } from '@/models/blog';

/** Implement this boundary when the CMS can provide the current homepage content. */
export interface BlogRepository {
  getContent(): Promise<BlogContent>;
}
