'use client';

/* oxlint-disable next/no-img-element -- Original blog images are served locally. */

import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { blogUrl } from '@/config/site';
import { out } from '../links';
import styles from '../blog.module.css';

export function Moment() {
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
