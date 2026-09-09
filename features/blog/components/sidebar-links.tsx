import { ArrowUpRight, Layers3, Rss } from 'lucide-react';
import { blogUrl } from '@/config/site';
import { out } from '../links';
import styles from '../blog.module.css';

export function SidebarLinks() {
  return (
    <nav className={styles.quickLinks} aria-label="归档与订阅">
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
    </nav>
  );
}
