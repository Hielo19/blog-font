'use client';

/* oxlint-disable next/no-img-element -- Original blog images are served locally. */

import { ArrowUpRight, Sparkles } from 'lucide-react';
import { blogUrl } from '@/config/site';
import { out } from '../links';
import styles from '../blog.module.css';

export function Profile() {
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
