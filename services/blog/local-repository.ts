import { recentPost, welcomePost } from '@/data/blog/posts';
import type { BlogRepository } from './repository';

export const localBlogRepository: BlogRepository = {
  async getContent() {
    return { recentPost, welcomePost };
  },
};
