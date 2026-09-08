'use client';

/* oxlint-disable next/no-img-element -- Original blog images are served locally. */

import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Layers3,
  Pin,
  Rss,
} from 'lucide-react';
import type { BlogContent, Post } from '@/models/blog';
import { displayDate } from '@/lib/date';
import { blogUrl } from '@/config/site';
import { out, type LinkAction } from '../links';
import styles from '../blog.module.css';

function FeaturePost({
  onOpen,
  post: recentPost,
}: {
  onOpen: LinkAction;
  post: Post;
}) {
  return (
    <article className={`${styles.glass} ${styles.feature}`}>
      <a
        className={styles.featureImage}
        id="recent-updates-cover"
        href="#/post/recent-updates"
        onClick={onOpen}
        aria-label={`阅读${recentPost.title}`}
      >
        <img
          src={recentPost.cover.src}
          width={1919}
          height={1079}
          alt={recentPost.cover.alt}
        />
        <span className={styles.imageTag}>
          <span />
          最近更新
        </span>
        <span className={styles.imageCaption}>生活里的一个瞬间</span>
      </a>
      <div className={styles.featureCopy}>
        <div className={styles.meta}>
          <span>生活</span>
          <span>
            <CalendarDays size={14} aria-hidden="true" />
            <time dateTime={recentPost.date}>
              {displayDate(recentPost.date)}
            </time>
          </span>
        </div>
        <a
          className={styles.titleLink}
          id="recent-updates-title"
          href="#/post/recent-updates"
          onClick={onOpen}
        >
          <h3>{recentPost.title}</h3>
        </a>
        <p>{recentPost.excerpt}</p>
        <a
          className={styles.readMore}
          id="recent-updates-read-more"
          href="#/post/recent-updates"
          onClick={onOpen}
        >
          继续阅读
          <ArrowRight size={18} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

function WelcomePost({ post: welcomePost }: { post: Post }) {
  return (
    <article className={`${styles.glass} ${styles.welcome}`}>
      <a
        className={styles.welcomeImage}
        href={welcomePost.originalUrl}
        {...out}
        aria-label="前往 Welcome to My Blog 原文"
      >
        <img
          src={welcomePost.cover.src}
          width={1024}
          height={576}
          alt={welcomePost.cover.alt}
          loading="lazy"
        />
      </a>
      <div className={styles.welcomeCopy}>
        <div className={styles.meta}>
          <span>
            <Pin size={13} aria-hidden="true" />
            置顶
          </span>
          <time dateTime={welcomePost.date}>
            {displayDate(welcomePost.date)}
          </time>
        </div>
        <a className={styles.titleLink} href={welcomePost.originalUrl} {...out}>
          <h3>{welcomePost.title}</h3>
        </a>
        <p>{welcomePost.excerpt}</p>
        <a className={styles.textLink} href={welcomePost.originalUrl} {...out}>
          前往原文
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
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
      <FeaturePost onOpen={onOpen} post={content.recentPost} />
      <WelcomePost post={content.welcomePost} />
      <div className={styles.quickLinks}>
        <a className={styles.glass} href={`${blogUrl}/timeline/`} {...out}>
          <span className={styles.quickIcon}>
            <Layers3 size={22} aria-hidden="true" />
          </span>
          <span>
            <strong>时光归档</strong>
            <small>沿着时间，翻翻以前的记录</small>
          </span>
          <ArrowUpRight size={19} aria-hidden="true" />
        </a>
        <a className={styles.glass} href={`${blogUrl}/feed/`} {...out}>
          <span className={styles.quickIcon}>
            <Rss size={22} aria-hidden="true" />
          </span>
          <span>
            <strong>订阅 RSS</strong>
            <small>在你习惯的地方阅读</small>
          </span>
          <ArrowUpRight size={19} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
