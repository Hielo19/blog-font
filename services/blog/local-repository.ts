import { recentPost, welcomePost } from '@/data/blog/posts';
import { journalItems } from '@/data/blog/journal';
import type { BlogRepository } from './repository';

export const localBlogRepository: BlogRepository = {
  async getContent() {
    return { recentPost, welcomePost, journalItems };
  },
};
