'use client';

import { ArrowDown, ArrowUpRight, Heart } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { flushSync } from 'react-dom';
import { blogUrl } from '@/config/site';
import type { BlogContent } from '@/models/blog';
import { VISUAL_SCROLL_EVENT } from '@/features/scroll/smoo-scroll';
import { useSmoothScroll } from '@/features/scroll/use-smooth-scroll';
import { useAppearance } from '@/features/theme/use-appearance';
import { Header } from './components/header';
import { Hero, HeroIdentity } from './components/hero';
import { Profile } from './components/profile';
import { Moment } from './components/moment';
import { Journal } from './components/journal';
import { ReadingPage } from './components/reading-page';
import { useBlogScene } from './hooks/use-blog-scene';
import { getHomeLandingTop } from './home-boundary';
import { out, plainClick, type LinkAction } from './links';
import styles from './blog.module.css';

const SCROLL_KEY = 'hielo-glass-home-scroll';

export default function BlogExperience({ content }: { content: BlogContent }) {
  const { recentPost } = content;
  const appearance = useAppearance();
  const {
    rootRef: previewRef,
    viewportRef,
    contentRef,
    spacerRef,
    getScrollY,
    scrollTo,
    cancelScroll,
    exploreTo,
  } = useSmoothScroll(appearance.motion);
  const [{ article, revision }, setPage] = useState({
    article: false,
    revision: 0,
  });
  const motionRef = useRef(appearance.motion);
  const transitionRef = useRef<ViewTransition | null>(null);
  const transitionSequence = useRef(0);
  const articleRef = useRef(false);
  const homeScroll = useRef(0);
  const returnFocus = useRef('recent-updates-title');
  const destinationFocus = useRef<string | null>(null);
  const destination = useRef<number | 'journal'>(0);
  const pendingRestore = useRef<{
    article: boolean;
    target: number | 'journal';
    focus: string | null;
  } | null>({ article: false, target: 0, focus: null });
  const restoring = useRef(true);
  useEffect(() => {
    motionRef.current = appearance.motion;
  }, [appearance.motion]);
  // One restoration per committed page, before the transition takes its snapshot.
  useLayoutEffect(() => {
    const request = pendingRestore.current;
    if (!request || request.article !== article) return;
    pendingRestore.current = null;
    const target =
      request.target === 'journal'
        ? document.getElementById('journal')
        : request.target;
    if (target !== null) scrollTo(target, true);
    if (request.focus)
      document.getElementById(request.focus)?.focus({ preventScroll: true });
    const frame = requestAnimationFrame(() => {
      restoring.current = false;
    });
    return () => cancelAnimationFrame(frame);
  }, [article, revision, scrollTo]);
  const headerDocked = useBlogScene({
    article,
    revision,
    motion: appearance.motion,
    getScrollY,
    previewRef,
  });
  const changeArticle = useCallback(
    (next: boolean, animate = true) => {
      restoring.current = true;
      pendingRestore.current = {
        article: next,
        target: destination.current,
        focus: next ? 'reading-title' : destinationFocus.current,
      };
      cancelScroll();
      const sequence = ++transitionSequence.current;
      transitionRef.current?.skipTransition();
      if (
        !animate ||
        !motionRef.current ||
        !document.startViewTransition ||
        matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        delete document.documentElement.dataset.hieloViewTransition;
        transitionRef.current = null;
        setPage({ article: next, revision: sequence });
        return;
      }
      document.documentElement.dataset.hieloViewTransition = 'page';
      const transition = document.startViewTransition(() => {
        if (sequence !== transitionSequence.current) return;
        flushSync(() => setPage({ article: next, revision: sequence }));
      });
      transitionRef.current = transition;
      void transition.ready.catch(() => {
        /* A skipped snapshot still commits navigation. */
      });
      void transition.finished
        .catch(() => {})
        .finally(() => {
          if (sequence === transitionSequence.current) {
            delete document.documentElement.dataset.hieloViewTransition;
            transitionRef.current = null;
          }
        });
    },
    [cancelScroll],
  );
  useEffect(
    () => () => {
      transitionRef.current?.skipTransition();
      delete document.documentElement.dataset.hieloViewTransition;
    },
    [],
  );
  useEffect(() => {
    if (
      !appearance.motion ||
      !previewRef.current ||
      !('IntersectionObserver' in window)
    )
      return;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        let stagger = 0;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          animations.push(
            entry.target.animate(
              [
                { opacity: 0, transform: 'translateY(16px)' },
                { opacity: 1, transform: 'translateY(0)' },
              ],
              {
                duration: 580,
                delay: Math.min(stagger++ * 65, 195),
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                fill: 'backwards',
              },
            ),
          );
        });
      },
      { threshold: 0.06 },
    );
    previewRef.current
      .querySelectorAll(`.${styles.glass}`)
      .forEach((element) => {
        if (!element.classList.contains(styles.profile))
          observer.observe(element);
      });
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, [article, appearance.motion, previewRef]);
  useEffect(() => {
    const originalRestoration = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    try {
      homeScroll.current = Number(sessionStorage.getItem(SCROLL_KEY)) || 0;
    } catch {
      /* Optional storage. */
    }
    let initialSync = true;
    const sync = () => {
      const next = location.hash === '#/post/recent-updates';
      if (next === articleRef.current) return;
      destination.current = next ? 0 : homeScroll.current;
      destinationFocus.current = next ? null : returnFocus.current;
      articleRef.current = next;
      changeArticle(next, !initialSync);
    };
    if (!location.hash) history.replaceState(null, '', '#/');
    sync();
    initialSync = false;
    const remember = () => {
      if (articleRef.current || restoring.current) return;
      homeScroll.current = getScrollY();
      try {
        sessionStorage.setItem(SCROLL_KEY, String(homeScroll.current));
      } catch {
        /* Optional storage. */
      }
    };
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    window.addEventListener('scroll', remember, { passive: true });
    window.addEventListener(VISUAL_SCROLL_EVENT, remember);
    return () => {
      history.scrollRestoration = originalRestoration;
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
      window.removeEventListener('scroll', remember);
      window.removeEventListener(VISUAL_SCROLL_EVENT, remember);
    };
  }, [changeArticle, getScrollY]);
  useEffect(() => {
    document.title = article
      ? `${recentPost.title} — Hieloのblog`
      : 'Hieloのblog';
  }, [article, recentPost.title]);

  const onOpen: LinkAction = (event) => {
    if (!plainClick(event)) return;
    event.preventDefault();
    returnFocus.current = event.currentTarget.id;
    homeScroll.current = getScrollY();
    try {
      sessionStorage.setItem(SCROLL_KEY, String(homeScroll.current));
    } catch {
      /* Optional storage. */
    }
    destination.current = 0;
    history.pushState({ glassFromHome: true }, '', '#/post/recent-updates');
    articleRef.current = true;
    changeArticle(true);
  };
  const goHome = (target: number | 'journal') => {
    destination.current = target;
    destinationFocus.current =
      target === 'journal'
        ? 'journal'
        : target === 0
          ? 'home-link'
          : returnFocus.current;
    if (!article) {
      const element =
        target === 'journal' ? document.getElementById('journal') : target;
      if (element !== null) scrollTo(element);
      document
        .getElementById(destinationFocus.current)
        ?.focus({ preventScroll: true });
      return;
    }
    history.pushState(null, '', '#/');
    articleRef.current = false;
    changeArticle(false);
  };
  const onHome: LinkAction = (event) => {
    if (plainClick(event)) {
      event.preventDefault();
      goHome(0);
    }
  };
  const onJournal: LinkAction = (event) => {
    if (plainClick(event)) {
      event.preventDefault();
      goHome('journal');
    }
  };
  const onExplore: LinkAction = (event) => {
    if (!plainClick(event)) return;
    event.preventDefault();
    const target = document.getElementById('dashboard-start');
    if (target)
      exploreTo(target, () => getHomeLandingTop(getScrollY()) ?? getScrollY());
  };
  const onReturn: LinkAction = (event) => {
    if (plainClick(event)) {
      event.preventDefault();
      if (history.state?.glassFromHome) history.back();
      else goHome(homeScroll.current);
    }
  };
  return (
    <div className={styles.preview} ref={previewRef} {...appearance.attributes}>
      <div className={styles.backdrop} aria-hidden="true" />
      <a
        className={styles.skipLink}
        href={article ? '#reading-body' : '#journal'}
        onClick={(event) => {
          event.preventDefault();
          const target = document.getElementById(
            article ? 'reading-body' : 'journal',
          );
          if (target) scrollTo(target, true);
          target?.focus({ preventScroll: true });
        }}
      >
        跳转到{article ? '正文' : '文章'}
      </a>
      <Header
        onHome={onHome}
        onJournal={onJournal}
        article={article}
        appearance={appearance}
        docked={article || headerDocked}
      />
      {!article && <HeroIdentity />}
      <div className={styles.smoothViewport} ref={viewportRef}>
        <div className={styles.smoothContent} ref={contentRef}>
          {!article && <Hero onExplore={onExplore} />}
          <div
            className={`${styles.pageShell} ${article ? styles.articleShell : ''}`}
          >
            {article ? (
              <ReadingPage onReturn={onReturn} post={recentPost} />
            ) : (
              <main
                className={styles.dashboard}
                id="dashboard-start"
                tabIndex={-1}
              >
                <aside className={styles.sidebar}>
                  <Profile />
                  <Moment />
                  <a className={styles.originalLink} href={blogUrl} {...out}>
                    <Heart size={14} aria-hidden="true" />
                    我的原博客
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </aside>
                <Journal onOpen={onOpen} content={content} />
              </main>
            )}
            <footer className={styles.footer}>
              <span className={styles.footerIdentity}>
                <strong className={styles.footerWordmark}>
                  Hielo<span>のblog</span>
                </strong>
                <span aria-hidden="true">·</span>
                <em className={styles.footerSignature}>Just a fool</em>
              </span>
              <a href="#journal" onClick={onJournal}>
                回到文章
                <ArrowDown size={14} aria-hidden="true" />
              </a>
            </footer>
          </div>
        </div>
      </div>
      <div className={styles.scrollSpacer} ref={spacerRef} aria-hidden="true" />
    </div>
  );
}
