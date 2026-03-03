'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '#components/common/Badge';
import { Button } from '#components/common/Button';
import Spinner from '#components/common/Spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#components/common/Table';
import useMatchSettings from '#js/useMatchSetting';
import useRoleGuard from '#js/useRoleGuard';
import { MatchSettingStatus } from '#js/constants';
import { getApiErrorMessage } from '#js/apiError';
import styles from './page.module.css';

const getStatusLabel = (status) => {
  if (status === MatchSettingStatus.READY) return 'Ready for use';
  return 'Draft';
};

const getStatusVariant = (status) => {
  if (status === MatchSettingStatus.READY) return 'secondary';
  return 'outline';
};

export default function MatchSettingsPage() {
  const { isAuthorized } = useRoleGuard({
    allowedRoles: ['teacher', 'admin'],
  });
  const { loading, getMatchSettings, duplicateMatchSetting } =
    useMatchSettings();
  const [matchSettings, setMatchSettings] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [duplicatingId, setDuplicatingId] = useState(null);

  const loadMatchSettings = useCallback(async () => {
    setError(null);
    const result = await getMatchSettings();
    if (result?.success === false) {
      setError(getApiErrorMessage(result, 'Unable to load match settings.'));
      setMatchSettings([]);
      return;
    }
    const data = Array.isArray(result?.data) ? result.data : result;
    setMatchSettings(Array.isArray(data) ? data : []);
  }, [getMatchSettings]);

  useEffect(() => {
    loadMatchSettings();
  }, [loadMatchSettings]);

  const handleDuplicate = async (matchSettingId) => {
    setDuplicatingId(matchSettingId);
    setError(null);
    setSuccessMessage(null);
    const result = await duplicateMatchSetting(matchSettingId);
    if (result?.success === false) {
      setError(
        getApiErrorMessage(result, 'Unable to duplicate match setting.')
      );
      setDuplicatingId(null);
      return;
    }
    setSuccessMessage('Match setting duplicated.');
    setDuplicatingId(null);
    await loadMatchSettings();
  };

  if (!isAuthorized) return null;

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Match Settings</h1>
            <p className={styles.subtitle}>
              Review, edit, or duplicate match settings for upcoming challenges.
            </p>
          </div>
          <Button asChild>
            <Link href='/match-settings/new'>Create match setting</Link>
          </Button>
        </div>
        {error ? (
          <div className={`${styles.feedback} ${styles.error}`}>{error}</div>
        ) : null}
        {!error && successMessage ? (
          <div className={`${styles.feedback} ${styles.success}`}>
            {successMessage}
          </div>
        ) : null}
      </header>

      <div className={styles.card}>
        {loading ? <Spinner label='Loading match settings…' /> : null}
        {!loading && matchSettings.length === 0 && !error ? (
          <div className={styles.emptyState}>No match settings available</div>
        ) : null}
        {!loading && matchSettings.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matchSettings.map((matchSetting) => {
                const { id, problemTitle, status } = matchSetting;
                return (
                  <TableRow key={id}>
                    <TableCell>
                      {problemTitle || 'Untitled match setting'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(status)}>
                        {getStatusLabel(status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={styles.actions}>
                        <Button variant='outline' size='sm' asChild>
                          <Link href={`/match-settings/${id}`}>
                            View / Edit
                          </Link>
                        </Button>
                        <Button
                          variant='secondary'
                          size='sm'
                          onClick={() => handleDuplicate(id)}
                          disabled={duplicatingId === id}
                        >
                          {duplicatingId === id ? 'Duplicating…' : 'Duplicate'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : null}
      </div>
    </section>
  );
}
