'use client';

/* oxlint-disable next/no-img-element -- This local concept uses the original blog images. */

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Feather,
  Heart,
  Home,
  Layers3,
  MessageCircle,
  Pin,
  Rss,
  Sparkles,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from 'react';
import { flushSync } from 'react-dom';
import { Progress } from '@/components/ui/progress';
import { blogUrl, displayDate, recentPost, welcomePost } from '@/lib/posts';
import { VISUAL_SCROLL_EVENT } from '@/lib/smoo-scroll';
import {
  AppearanceControls,
  useAppearance,
  type Appearance,
} from './appearance';
import styles from './preview.module.css';
import { useSmoothScroll } from './smooth-scroll';

const out = { target: '_blank', rel: 'noreferrer' };
type LinkAction = (event: MouseEvent<HTMLAnchorElement>) => void;
const plainClick = (event: MouseEvent<HTMLAnchorElement>) =>
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.altKey &&
  !event.shiftKey;
const SCROLL_KEY = 'hielo-glass-home-scroll';

function Header({
  onHome,
  onJournal,
  article,
  appearance,
  docked,
}: {
  onHome: LinkAction;
  onJournal: LinkAction;
  article: boolean;
  appearance: Appearance;
  docked: boolean;
}) {
  const headerRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const measure = () => {
      document.documentElement.style.setProperty(
        '--hielo-header-height',
        `${header.getBoundingClientRect().height}px`,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--hielo-header-height');
    };
  }, []);
  return (
    <header
      ref={headerRef}
      data-smoo-header
      className={`${styles.header} ${docked ? styles.headerDocked : styles.headerFloating}`}
    >
      <a
        className={styles.brand}
        id="home-link"
        href="#/"
        onClick={onHome}
        aria-label="Hielo 首页"
      >
        <span className={styles.brandIcon}>
          <Feather size={21} aria-hidden="true" />
        </span>
        Hielo<span className={styles.brandSuffix}>のblog</span>
      </a>
      <nav className={styles.nav} aria-label="主导航">
        <a
          className={!article && !docked ? styles.navActive : undefined}
          href="#/"
          onClick={onHome}
        >
          <Home size={16} aria-hidden="true" />
          首页
        </a>
        <a
          className={article || docked ? styles.navActive : undefined}
          href="#journal"
          onClick={onJournal}
        >
          <BookOpen size={16} aria-hidden="true" />
          文章
        </a>
        <a href={`${blogUrl}/timeline/`} {...out}>
          归档
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
        <a href={`${blogUrl}/me/`} {...out}>
          关于
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </nav>
      <AppearanceControls appearance={appearance} />
    </header>
  );
}

function HeroIdentity() {
  return (
    <div className={styles.heroIdentity} id="hero-identity">
      <div className={styles.heroAvatar}>
        <img
          src="/assets/hielo-avatar.png"
          width={132}
          height={132}
          alt="Hielo 的头像"
        />
      </div>
      <h1 id="hero-title">
        Hielo<span>のblog</span>
      </h1>
      <p className={styles.heroSignature}>Just a fool</p>
      <div className={styles.heroLine} aria-hidden="true" />
      <p className={styles.heroNote}>
        疯狂造句中<span aria-hidden="true">......</span>
      </p>
    </div>
  );
}

function Hero({ onExplore }: { onExplore: LinkAction }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <a className={styles.heroExplore} href="#journal" onClick={onExplore}>
        <span>向下浏览</span>
        <ArrowDown size={27} aria-hidden="true" />
      </a>
    </section>
  );
}

function Profile() {
  return (
    <section
      className={`${styles.glass} ${styles.profile}`}
      id="profile-card"
      aria-labelledby="profile-title"
    >
      <div className={styles.profileTop}>
        <span className={styles.miniLabel}>关于我</span>
        <Sparkles size={18} aria-hidden="true" />
      </div>
      <div className={styles.profileCore} id="profile-core">
        <div className={styles.avatarRing}>
          <img
            src="/assets/hielo-avatar.png"
            width={104}
            height={104}
            alt="Hielo 的头像"
          />
        </div>
        <h2 className={styles.profileTitle} id="profile-title" tabIndex={-1}>
          Hielo
        </h2>
        <p className={styles.signature}>Just a fool</p>
        <div className={styles.profileLine} />
        <p className={styles.profileNote}>
          疯狂造句中<span aria-hidden="true">...</span>
        </p>
      </div>
      <a className={styles.profileLink} href={`${blogUrl}/me/`} {...out}>
        再多了解一点
        <ArrowUpRight size={17} aria-hidden="true" />
      </a>
    </section>
  );
}

function Moment() {
  return (
    <section
      className={`${styles.glass} ${styles.moment}`}
      aria-labelledby="moment-title"
    >
      <div className={styles.tileHeading}>
        <span>
          <MessageCircle size={16} aria-hidden="true" />
          说说
        </span>
        <time dateTime="2023-11-20">2023.11.20</time>
      </div>
      <p id="moment-title">
        长久的寂静
        <br />
        与片刻的喧嚣
      </p>
      <a href={`${blogUrl}/shuoshuo/test/`} {...out}>
        做个选择
        <ArrowUpRight size={16} aria-hidden="true" />
      </a>
      <span className={styles.quoteMark} aria-hidden="true">
        “
      </span>
    </section>
  );
}

function FeaturePost({ onOpen }: { onOpen: LinkAction }) {
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

function WelcomePost() {
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

function Journal({ onOpen }: { onOpen: LinkAction }) {
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
      <FeaturePost onOpen={onOpen} />
      <WelcomePost />
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

function ReadingPage({ onReturn }: { onReturn: LinkAction }) {
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

export default function BlogPage() {
  const appearance = useAppearance();
  const {
    rootRef: previewRef,
    viewportRef,
    contentRef,
    spacerRef,
    getScrollY,
    scrollTo,
    cancelScroll,
  } = useSmoothScroll(appearance.motion);
  const [{ article, revision }, setPage] = useState({
    article: false,
    revision: 0,
  });
  const [headerDocked, setHeaderDocked] = useState(false);
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
  useLayoutEffect(() => {
    let frame = 0;
    const dashboard = document.getElementById('dashboard-start');
    const profile = document.getElementById('profile-card');
    const profileCore = document.getElementById('profile-core');
    const identity = document.getElementById('hero-identity');
    const measure = () => {
      frame = 0;
      const root = previewRef.current;
      if (!root) return;
      const visualY = getScrollY();
      const viewportWidth = document.documentElement.clientWidth;
      const narrow = viewportWidth <= 700;
      const compact = viewportWidth <= 1050;
      const scrollPadding = Number.parseFloat(
        getComputedStyle(document.documentElement).scrollPaddingTop,
      );
      const scrollMargin = dashboard
        ? Number.parseFloat(getComputedStyle(dashboard).scrollMarginTop)
        : 92;
      const dashboardTop = dashboard
        ? dashboard.getBoundingClientRect().top + visualY
        : window.innerHeight;
      const travel = Math.max(
        1,
        dashboardTop -
          (Number.isFinite(scrollPadding) ? scrollPadding : 74) -
          (Number.isFinite(scrollMargin) ? scrollMargin : 92),
      );
      const rawProgress = article
        ? 1
        : visualY >= travel - 1
          ? 1
          : Math.min(1, Math.max(0, visualY / travel));
      const progress = appearance.motion
        ? rawProgress * rawProgress * (3 - 2 * rawProgress)
        : article || rawProgress > 0.78
          ? 1
          : 0;
      // Read all moving geometry before writing this frame's styles.
      const profileRect = profile?.getBoundingClientRect();
      const profileCoreRect = profileCore?.getBoundingClientRect();
      const startInset = narrow ? 16 : Math.max(34, (viewportWidth - 1180) / 2);
      const startTop = narrow ? 16 : 30;
      const startPadding = narrow ? 14 : 22;
      const endPadding = narrow
        ? 14
        : Math.max(22, (viewportWidth - 1180) / 2 + 22);
      root.style.setProperty(
        '--header-inset',
        `${startInset * (1 - progress)}px`,
      );
      root.style.setProperty('--header-top', `${startTop * (1 - progress)}px`);
      root.style.setProperty('--header-radius', `${22 * (1 - progress)}px`);
      root.style.setProperty(
        '--header-padding-x',
        `${startPadding + (endPadding - startPadding) * progress}px`,
      );
      root.style.setProperty(
        '--header-min-height',
        `${(narrow ? 66 : 76) - (narrow ? 0 : 6) * progress}px`,
      );
      root.style.setProperty(
        '--hero-explore-opacity',
        String(1 - Math.min(1, progress / 0.32)),
      );

      if (profileRect && profileCoreRect && identity && appearance.motion) {
        const targetScale = 1;
        const targetX = profileCoreRect.left + profileCoreRect.width / 2;
        const targetY = profileCoreRect.top + profileCoreRect.height / 2;
        const positionProgress = Math.min(1, progress / 0.86);
        const moveX = (targetX - viewportWidth / 2) * positionProgress;
        const moveY = (targetY - window.innerHeight / 2) * positionProgress;
        const scale = 1 + (targetScale - 1) * positionProgress;
        const startAvatar = narrow
          ? 108
          : Math.min(140, Math.max(108, viewportWidth * 0.09));
        const startTitle = narrow
          ? Math.min(58.4, Math.max(44, viewportWidth * 0.13))
          : Math.min(107.2, Math.max(56, viewportWidth * 0.078));
        const targetTitle = compact ? 29.6 : 32;
        const startSignature = narrow ? 20 : 26.4;
        const cardProgress = Math.min(1, Math.max(0, (progress - 0.16) / 0.72));
        const cardReveal = Math.min(1, Math.max(0, (progress - 0.25) / 0.55));
        root.style.setProperty('--identity-x', `${moveX}px`);
        root.style.setProperty('--identity-y', `${moveY}px`);
        root.style.setProperty('--identity-scale', String(scale));
        root.style.setProperty(
          '--identity-core-width',
          `${profileCoreRect.width}px`,
        );
        root.style.setProperty(
          '--identity-avatar-size',
          `${startAvatar + (112 - startAvatar) * positionProgress}px`,
        );
        root.style.setProperty(
          '--identity-title-size',
          `${startTitle + (targetTitle - startTitle) * positionProgress}px`,
        );
        root.style.setProperty(
          '--identity-signature-size',
          `${startSignature + (16.8 - startSignature) * positionProgress}px`,
        );
        root.style.setProperty(
          '--identity-avatar-margin-top',
          `${25 * positionProgress}px`,
        );
        root.style.setProperty(
          '--identity-signature-margin-top',
          `${17 + (5 - 17) * positionProgress}px`,
        );
        root.style.setProperty(
          '--identity-signature-margin-bottom',
          `${20 * positionProgress}px`,
        );
        root.style.setProperty(
          '--identity-note-padding-y',
          `${7 * (1 - positionProgress)}px`,
        );
        root.style.setProperty(
          '--identity-note-padding-x',
          `${14 * (1 - positionProgress)}px`,
        );
        root.style.setProperty(
          '--identity-note-radius',
          `${10 * (1 - positionProgress)}px`,
        );
        root.style.setProperty(
          '--identity-note-alpha',
          String(0.26 * (1 - positionProgress)),
        );
        root.style.setProperty(
          '--identity-line-opacity',
          String(positionProgress),
        );
        root.style.setProperty(
          '--identity-title-line-height',
          String(1 + 0.25 * positionProgress),
        );
        root.style.setProperty('--identity-title-suffix-size', '100%');
        root.style.setProperty('--identity-title-spacing', '-0.025em');
        root.style.setProperty('--identity-title-suffix-weight', '400');
        root.style.setProperty(
          '--identity-note-spacing',
          `${0.04 + 0.04 * positionProgress}em`,
        );
        root.style.setProperty(
          '--identity-avatar-border',
          `${2 - positionProgress}px`,
        );
        const rawBlend = Math.min(1, Math.max(0, (progress - 0.86) / 0.14));
        // Eliminate sub-pixel alpha residue at the end of the cross-fade.
        const blend = rawBlend > 0.998 ? 1 : rawBlend < 0.002 ? 0 : rawBlend;
        root.style.setProperty('--identity-opacity', String(1 - blend));
        root.style.setProperty(
          '--identity-card-opacity',
          String(cardProgress * (1 - cardReveal) * 0.65),
        );
        root.style.setProperty(
          '--identity-card-width',
          `${profileRect.width}px`,
        );
        root.style.setProperty(
          '--identity-card-height',
          `${profileRect.height}px`,
        );
        root.style.setProperty('--profile-opacity', String(cardReveal));
        root.style.setProperty('--identity-color-progress', String(cardReveal));
        root.style.setProperty('--profile-content-opacity', String(blend));
        root.style.setProperty(
          '--profile-scale',
          String(0.96 + cardReveal * 0.04),
        );
      }
      setHeaderDocked(article || rawProgress > 0.78);
    };
    const update = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener(VISUAL_SCROLL_EVENT, update);
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener(VISUAL_SCROLL_EVENT, update);
      window.removeEventListener('resize', update);
    };
  }, [article, revision, appearance.motion, getScrollY, previewRef]);
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
  }, [article]);

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
    if (target) scrollTo(target);
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
              <ReadingPage onReturn={onReturn} />
            ) : (
              <main className={styles.dashboard} id="dashboard-start">
                <aside className={styles.sidebar}>
                  <Profile />
                  <Moment />
                  <a className={styles.originalLink} href={blogUrl} {...out}>
                    <Heart size={14} aria-hidden="true" />
                    我的原博客
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </aside>
                <Journal onOpen={onOpen} />
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
