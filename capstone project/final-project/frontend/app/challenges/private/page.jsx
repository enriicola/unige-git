'use client';

import ChallengeList from '#modules/challenge/list';
import useRoleGuard from '#js/useRoleGuard';
import { Button } from '#components/common/Button';
import Link from 'next/link';
import styles from '../page.module.css';

export default function PrivateChallengesPage() {
  const { isAuthorized } = useRoleGuard({
    allowedRoles: ['teacher', 'admin'],
  });

  if (!isAuthorized) return null;

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <div className={styles.headerText}>
            <h1>Private challenges</h1>
            <p>Only teachers and admins can see these challenges.</p>
          </div>
          <div className={styles.headerActions}>
            <Button variant='outline' asChild>
              <Link href='/match-settings'>Match Settings</Link>
            </Button>
            <Button variant='secondary' asChild>
              <Link href='/challenges'>All challenges</Link>
            </Button>
          </div>
        </div>
      </header>

      <ChallengeList scope='private' />
    </section>
  );
}
