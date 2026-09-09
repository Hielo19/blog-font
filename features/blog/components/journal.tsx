'use client';

/* oxlint-disable next/no-img-element -- Original blog images are served locally. */

import { ArrowUpRight, BookOpen, CalendarDays, Pin } from 'lucide-react';
import type { BlogContent, JournalItem } from '@/models/blog';
import { displayDate } from '@/lib/date';
import { blogUrl } from '@/config/site';
import { out, type LinkAction } from '../links';
import styles from '../blog.module.css';

function JournalCard({
  item,
  onOpen,
  recentSlug,
}: {
  item: JournalItem;
  onOpen: LinkAction;
  recentSlug: string;
}) {
  const entry = item.kind === 'post' ? item.post : item;
  const isRecent = item.kind === 'post' && entry.slug === recentSlug;
  const pinned = item.kind === 'post' && item.post.pinned;
  const titleId = `${entry.slug}-title`;
  const link =
    item.kind === 'post'
      ? isRecent
        ? { href: '#/post/recent-updates', onClick: onOpen }
        : { href: item.post.originalUrl, ...out }
      : null;

  const cover = entry.cover && (
    <img
      src={entry.cover.src}
      width={entry.cover.width}
      height={entry.cover.height}
      alt={entry.cover.alt}
      loading="lazy"
    />
  );

  return (
    <article
      className={`${styles.glass} ${styles.journalCard}`}
      aria-labelledby={titleId}
    >
      <div className={styles.cardMeta}>
        <span className={styles.cardCategory}>
          {entry.category.split(' / ')[0]}
        </span>
        <span className={styles.cardDate}>
          <CalendarDays size={14} aria-hidden="true" />
          <time dateTime={entry.date}>{displayDate(entry.date)}</time>
        </span>
        {isRecent && <span className={styles.cardBadge}>最近更新</span>}
        {pinned && (
          <span className={styles.cardBadge}>
            <Pin size={12} aria-hidden="true" />
            置顶
          </span>
        )}
        {item.kind === 'example' && (
          <span className={styles.exampleBadge}>示例</span>
        )}
      </div>
      <h3 className={styles.cardTitle}>
        {link ? (
          <a id={titleId} {...link}>
            {entry.title}
          </a>
        ) : (
          <span id={titleId}>{entry.title}</span>
        )}
      </h3>
      <div
        className={`${styles.cardExcerpt} ${cover ? styles.cardWithImage : ''}`}
      >
        {cover &&
          (link ? (
            <a
              className={styles.cardThumbnail}
              id={`${entry.slug}-cover`}
              {...link}
              aria-label={`阅读 ${entry.title}`}
            >
              {cover}
            </a>
          ) : (
            <div className={styles.cardThumbnail}>{cover}</div>
          ))}
        <p>{entry.excerpt}</p>
      </div>
      {link && (
        <a
          className={styles.cardReadLink}
          id={`${entry.slug}-read-more`}
          {...link}
        >
          {isRecent ? '继续阅读' : '前往原文'}
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      )}
    </article>
  );
}

export function Journal({
  onOpen,
  content,
}: {
  onOpen: LinkAction;
  content: BlogContent;
}) {
  return (
    <section
      className={styles.journal}
      id="journal"
      aria-labelledby="journal-title"
      tabIndex={-1}
    >
      <div className={styles.sectionHeading}>
        <h2 id="journal-title">
          <BookOpen size={21} aria-hidden="true" />
          最近的记录
        </h2>
        <a href={`${blogUrl}/timeline/`} {...out}>
          全部文章
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
      <div className={styles.journalCards}>
        {content.journalItems.map((item) => (
          <JournalCard
            key={item.kind === 'post' ? item.post.slug : item.slug}
            item={item}
            onOpen={onOpen}
            recentSlug={content.recentPost.slug}
          />
        ))}
      </div>
    </section>
  );
}
