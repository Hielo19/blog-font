export type Post = {
  slug: string;
  title: string;
  date: string;
  dateKind: 'published' | 'updated';
  category: string;
  excerpt: string;
  originalUrl: string;
  cover: { src: string; alt: string; width: number; height: number };
  pinned?: boolean;
  paragraphs?: string[];
  closing?: string;
};

/** The two editorial slots currently rendered by the preview. */
export type BlogContent = {
  recentPost: Post;
  welcomePost: Post;
};
