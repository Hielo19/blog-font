'use client';

/* oxlint-disable next/no-img-element -- Original blog images are served locally. */

import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import type { Post } from '@/models/blog';
import { displayDate } from '@/lib/date';
import { VISUAL_SCROLL_EVENT } from '@/features/scroll/smoo-scroll';
import { out, type LinkAction } from '../links';
import styles from '../blog.module.css';

export function ReadingPage({
  onReturn,
  post: recentPost,
}: {
  onReturn: LinkAction;
  post: Post;
}) {
  const [progress, setProgress] = useState(0);
  const readingRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      const rect = readingRef.current?.getBoundingClientRect();
      if (!rect) return;
      const distance = Math.max(1, rect.height - window.innerHeight * 0.55);
      setProgress(
        Math.round(
          Math.min(
            100,
            Math.max(
              0,
              ((window.innerHeight * 0.45 - rect.top) / distance) * 100,
            ),
          ),
        ),
      );
    };
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener(VISUAL_SCROLL_EVENT, update);
    window.addEventListener('resize', update);
    const observer = new ResizeObserver(update);
    if (readingRef.current) observer.observe(readingRef.current);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener(VISUAL_SCROLL_EVENT, update);
      window.removeEventListener('resize', update);
    };
  }, []);
  return (
    <main className={styles.readingLayout}>
      <aside className={styles.readingAside} data-smoo-sticky>
        <div className={`${styles.glass} ${styles.readingInfo}`}>
          <a className={styles.backLink} href="#/" onClick={onReturn}>
            <ArrowLeft size={18} aria-hidden="true" />
            返回文章列表
          </a>
          <div className={styles.readingAuthor}>
            <img
              src="/assets/hielo-avatar.png"
              width={46}
              height={46}
              alt="Hielo 的头像"
            />
            <span>
              <strong>
                Hielo<span className={styles.readingBrandSuffix}>のblog</span>
              </strong>
              <small>Just a fool</small>
            </span>
          </div>
          <p>{recentPost.title}</p>
          <span className={styles.readingDate}>
            {displayDate(recentPost.date)} 更新
          </span>
          <div className={styles.progressLabel}>
            <span>阅读进度</span>
            <span aria-hidden="true">{progress}%</span>
          </div>
          <Progress
            className={styles.progress}
            value={progress}
            aria-label="文章阅读进度"
          />
        </div>
        <a
          className={styles.originalLink}
          href={recentPost.originalUrl}
          {...out}
        >
          在原博客阅读
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </aside>
      <article className={`${styles.glass} ${styles.readingPaper}`}>
        <header className={styles.readingHero}>
          <img
            src={recentPost.cover.src}
            width={1919}
            height={1079}
            alt={recentPost.cover.alt}
          />
          <div>
            <span>生活</span>
            <h1 id="reading-title" tabIndex={-1}>
              {recentPost.title}
            </h1>
            <p>
              Hielo <span>·</span> {displayDate(recentPost.date)} 更新
            </p>
          </div>
        </header>
        <div
          className={styles.prose}
          ref={readingRef}
          id="reading-body"
          tabIndex={-1}
        >
          {recentPost.paragraphs?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <figure>
            <img
              src={recentPost.cover.src}
              width={1919}
              height={1079}
              alt={recentPost.cover.alt}
            />
            <figcaption>和朋友在 FF14 里的合影</figcaption>
          </figure>
          <p>{recentPost.closing}</p>
          <div className={styles.source}>
            <span>
              文 / Hielo
              <br />
              <a
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh_CN"
                {...out}
              >
                CC BY-NC-SA 4.0
              </a>
            </span>
            <a href={recentPost.originalUrl} {...out}>
              查看原文
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
          <a className={styles.backLink} href="#/" onClick={onReturn}>
            <ArrowLeft size={18} aria-hidden="true" />
            返回文章列表
          </a>
        </div>
      </article>
    </main>
  );
}
