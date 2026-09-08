import { localBlogRepository } from './local-repository';
import type { BlogRepository } from './repository';

// The current static build reads local content; no browser API request is made.
const repository: BlogRepository = localBlogRepository;

export function getBlogContent() {
  return repository.getContent();
}
