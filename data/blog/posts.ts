import type { Post } from '@/models/blog';
import { blogUrl } from '@/config/site';

export const recentPost: Post = {
  slug: 'recent-updates',
  title: '一些近况分享',
  date: '2026-08-16',
  dateKind: 'updated',
  category: '生活 / ABOUT ME',
  excerpt:
    '很久没有更新博客了，讲真我都快忘了这一茬……\n毕业、工作，还有一些想慢慢完成的计划。',
  originalUrl: `${blogUrl}/一些近况分享/`,
  cover: {
    src: '/assets/ff14-friends.png',
    alt: 'Hielo 和朋友在最终幻想 XIV 中的合影',
    width: 1919,
    height: 1079,
  },
  paragraphs: [
    '很久没有更新博客了，讲真我都快忘了这一茬……',
    '首先是，我已经毕业且工作了，目前是在做Agent的软件测试。我们单位是比较轻松的那种，朝九晚五固定双休，非特殊情况不加班，这种工作环境使得我将有比较充足的时间去做些我喜欢的事情。',
    '首先是这个博客，这个博客是用了开源的现成框架，所以目前的第一个计划是准备重构我的博客。',
    '其次是在大学时我就很想学习音乐，这也是我接下来比较重要的一项计划。',
    '然后博主确实是个大懒虫，日常休息更想宅家玩游戏。这一习惯导致大学我肥了蛮多，虽然人长得高外表看着没有实际体重那么重，但是体脂率已经有点高了，目前正在减肥中。然后说到游戏，想来我其实可以把一些游戏时的乐趣也分享到博客上。',
    '先分享一张最近和朋友在FF14里拍的照片吧。',
  ],
  closing: '最后，希望自己能做到这些计划吧！',
};
export const welcomePost: Post = {
  slug: 'welcome-to-my-blog',
  title: 'Welcome to My Blog',
  date: '2023-11-07',
  dateKind: 'published',
  category: '生活 / ABOUT ME',
  pinned: true,
  excerpt:
    '经过了一段时间的折腾，终于是让 blog 上线了。\n如你所见，这是我的 blog。',
  originalUrl: `${blogUrl}/welcome-to-my-blog/`,
  cover: {
    src: '/assets/welcome-koishi.jpg',
    alt: 'Welcome to My Blog 原文封面',
    width: 1024,
    height: 576,
  },
};
export const posts = [recentPost, welcomePost];
