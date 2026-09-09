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

export type JournalItem =
  | { kind: 'post'; post: Post }
  | {
      kind: 'example';
      slug: string;
      title: string;
      date: string;
      category: string;
      excerpt: string;
      cover?: Post['cover'];
    };

/** Homepage cards and the original article slots used by the reading view. */
export type BlogContent = {
  recentPost: Post;
  welcomePost: Post;
  journalItems: JournalItem[];
};
