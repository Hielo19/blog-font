'use client';

/* oxlint-disable next/no-img-element -- Original blog images are served locally. */

import { ArrowDown } from 'lucide-react';
import type { LinkAction } from '../links';
import styles from '../blog.module.css';

export function HeroIdentity() {
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

export function Hero({ onExplore }: { onExplore: LinkAction }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <a className={styles.heroExplore} href="#journal" onClick={onExplore}>
        <span>向下浏览</span>
        <ArrowDown size={27} aria-hidden="true" />
      </a>
    </section>
  );
}
