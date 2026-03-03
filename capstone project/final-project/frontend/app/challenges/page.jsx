'use client';

import ChallengeList from '#modules/challenge/list';
import useRoleGuard from '#js/useRoleGuard';
import { Button } from '#components/common/Button';
import Link from 'next/link';
import styles from './page.module.css';

export default function ChallengesPage() {
  const { isAuthorized } = useRoleGuard({
    allowedRoles: ['teacher', 'admin'],
  });

  if (!isAuthorized) return null;

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <div className={styles.headerText}>
            <h1>Challenges</h1>
            <p>
              This page lists all challenges coming from the backend. It uses{' '}
              <code>useChallenge</code> and <code>useFetchData</code> to keep
              the data logic separated from the UI.
            </p>
          </div>
          <div className={styles.headerActions}>
            <Button variant='outline' asChild>
              <Link href='/match-settings'>Match Settings</Link>
            </Button>
            <Button variant='secondary' asChild>
              <Link href='/challenges/private'>Private challenges</Link>
            </Button>
          </div>
        </div>
      </header>

      <ChallengeList />
    </section>
  );
}
