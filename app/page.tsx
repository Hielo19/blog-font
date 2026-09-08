import BlogExperience from '@/features/blog/blog-experience';
import { getBlogContent } from '@/services/blog';

export default async function BlogPage() {
  const content = await getBlogContent();
  return <BlogExperience content={content} />;
}
