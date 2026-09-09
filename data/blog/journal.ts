import type { JournalItem } from '@/models/blog';
import { recentPost, welcomePost } from './posts';

// Preview-only entries stay separate from published articles and have no URLs.
const examples: JournalItem[] = [
  {
    kind: 'example',
    slug: 'example-slow-weekend',
    title: '把周末留给一点小事',
    date: '2026-08-12',
    category: '生活',
    excerpt:
      '收拾桌面，打开窗，再给自己泡一杯茶。没有安排满满的行程，慢一点也很好。',
  },
  {
    kind: 'example',
    slug: 'example-eorzea',
    title: '艾欧泽亚的夜晚，和朋友一起走走',
    date: '2026-08-08',
    category: '游戏',
    excerpt:
      '副本结束后没有立刻下线，和朋友找了个安静的地方，看星空、聊天。比起任务奖励，偶尔更想留下这样的瞬间。',
    cover: recentPost.cover,
  },
  {
    kind: 'example',
    slug: 'example-first-melody',
    title: '从一小段旋律开始',
    date: '2026-08-03',
    category: '音乐',
    excerpt: '先不急着弹完一首曲子。今天的目标，是把喜欢的那几个小节慢慢练熟。',
  },
  {
    kind: 'example',
    slug: 'example-blog-notes',
    title: '给博客换一种记录日常的方式',
    date: '2026-07-28',
    category: '折腾',
    excerpt:
      '想让长文章和零碎的想法都找到合适的位置。\n有些事情值得认真写下来，有些只需要一张照片、几句话。慢慢整理，也慢慢把这里变成自己喜欢的样子。',
  },
  {
    kind: 'example',
    slug: 'example-afternoon',
    title: '收藏一个安静的午后',
    date: '2026-07-21',
    category: '随记',
    excerpt: '暂时放下待办，听完一首歌。',
    cover: welcomePost.cover,
  },
  {
    kind: 'example',
    slug: 'example-small-plans',
    title: '那些想慢慢完成的小计划',
    date: '2026-07-16',
    category: '生活',
    excerpt:
      '多走一点路，学一点音乐，记下游戏里有趣的事。\n不用一口气完成全部，今天往前挪一小步就算数。',
  },
];

export const journalItems: JournalItem[] = [
  { kind: 'post', post: recentPost },
  { kind: 'post', post: welcomePost },
  ...examples,
];
