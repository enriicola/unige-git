'use client';

import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        CodyMatch ·{' '}
        <span className={styles.muted}>built for the capstone project</span>
      </p>
    </footer>
  );
}
