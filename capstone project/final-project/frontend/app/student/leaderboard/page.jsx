'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import ChallengeSelector from '#components/challenge/ChallengeSelector';
import { Button } from '#components/common/Button';
import useChallenge from '#js/useChallenge';
import useRoleGuard from '#js/useRoleGuard';
import { ChallengeStatus } from '#js/constants';
import styles from './page.module.css';

const normalizeChallengeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const normalizeLeaderboardPayload = (payload) => {
  if (payload?.data) return payload.data;
  return payload || {};
};

export default function StudentLeaderboardPage() {
  const { user, isAuthorized } = useRoleGuard({ allowedRoles: ['student'] });
  const { getChallengesForStudent, getChallengeLeaderboard } = useChallenge();
  const studentId = user?.id;

  const [challenges, setChallenges] = useState([]);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState({
    summary: null,
    leaderboard: [],
    personalSummary: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pageSize = 10;

  const loadChallenges = useCallback(async () => {
    if (!studentId) return;
    setError(null);
    try {
      const res = await getChallengesForStudent(studentId);
      if (res?.success === false) {
        setChallenges([]);
        setError(res?.message || 'Unable to load challenges.');
        return;
      }
      const list = normalizeChallengeList(res)
        .filter(
          (item) =>
            item.status === ChallengeStatus.ENDED_PHASE_TWO &&
            item.scoringStatus === 'completed'
        )
        .map((item, index) => ({
          ...item,
          sequence: index + 1,
        }));
      setChallenges(list);
      if (!activeChallenge && list.length > 0) {
        setActiveChallenge(list[0]);
      }
    } catch {
      setChallenges([]);
      setError('Unable to load challenges.');
    }
  }, [activeChallenge, getChallengesForStudent, studentId]);

  const loadLeaderboard = useCallback(
    async (challengeId) => {
      if (!challengeId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await getChallengeLeaderboard(challengeId, studentId);
        if (res?.success === false) {
          setError(res?.message || 'Unable to load leaderboard.');
          setLeaderboardData({
            summary: null,
            leaderboard: [],
            personalSummary: null,
          });
          return;
        }
        const payload = normalizeLeaderboardPayload(res);
        setLeaderboardData({
          summary: payload.summary || null,
          leaderboard: Array.isArray(payload.leaderboard)
            ? payload.leaderboard
            : [],
          personalSummary: payload.personalSummary || null,
        });
        setCurrentPage(1);
      } catch {
        setError('Unable to load leaderboard.');
        setLeaderboardData({
          summary: null,
          leaderboard: [],
          personalSummary: null,
        });
      } finally {
        setLoading(false);
      }
    },
    [getChallengeLeaderboard, studentId]
  );

  useEffect(() => {
    if (!isAuthorized || !studentId) return;
    loadChallenges();
  }, [isAuthorized, loadChallenges, studentId]);

  useEffect(() => {
    if (!isAuthorized || !activeChallenge?.id) return;
    loadLeaderboard(activeChallenge.id);
  }, [activeChallenge?.id, isAuthorized, loadLeaderboard]);

  const summary = useMemo(() => {
    const participants = leaderboardData.summary?.totalParticipants ?? 0;
    const averageScore = leaderboardData.summary?.averageScore ?? 0;
    const yourRank = leaderboardData.summary?.yourRank ?? null;
    const sequence = activeChallenge?.sequence;
    const title = activeChallenge?.title ?? 'Challenge';
    return {
      participants,
      averageScore,
      yourRank,
      challengeTitle: title,
      challengeLabel:
        sequence != null ? `Challenge #${sequence}: ${title}` : title,
    };
  }, [
    activeChallenge?.sequence,
    activeChallenge?.title,
    leaderboardData.summary,
  ]);

  if (!isAuthorized || !studentId) return null;

  const totalRows = leaderboardData.leaderboard.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const pagedRows = leaderboardData.leaderboard.slice(
    startIndex,
    startIndex + pageSize
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  let personalHint = 'No higher rank available yet';
  const personalRank =
    leaderboardData.personalSummary?.rank != null
      ? Number(leaderboardData.personalSummary.rank)
      : null;
  if (personalRank === 1) {
    personalHint = 'You are in the top position.';
  } else if (leaderboardData.personalSummary?.gapToPrevious != null) {
    const targetRank =
      personalRank != null && personalRank > 1 ? personalRank - 1 : null;
    const rankLabel = targetRank != null ? `#${targetRank}` : 'the next rank';
    personalHint = `Gap to ${rankLabel}: You need ${leaderboardData.personalSummary.gapToPrevious} more points to reach the next position`;
  }

  return (
    <div className={styles.page}>
      <ChallengeSelector
        challenges={challenges}
        activeId={activeChallenge?.id}
        onSelect={setActiveChallenge}
        label='Search a challenge'
        searchable
      />

      <section className={styles.summaryCard}>
        <div className={styles.summaryHeader}>
          <div>
            <div className={styles.summaryTitle}>{summary.challengeLabel}</div>
            <div className={styles.summarySubtitle}>
              Rankings updated in real-time
            </div>
          </div>
        </div>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <div className={styles.summaryValue}>{summary.participants}</div>
            <div className={styles.summaryLabel}>Total Participants</div>
          </div>
          <div className={styles.summaryItem}>
            <div className={styles.summaryValue}>{summary.averageScore}</div>
            <div className={styles.summaryLabel}>Average Score</div>
          </div>
          <div className={styles.summaryItem}>
            <div className={styles.summaryValue}>
              {summary.yourRank ? `#${summary.yourRank}` : '-'}
            </div>
            <div className={styles.summaryLabel}>Your Rank</div>
          </div>
        </div>
      </section>

      <section className={styles.tableCard}>
        <div className={styles.table}>
          <div className={styles.tableRowHead}>
            <div>Rank</div>
            <div>Student</div>
            <div>Total</div>
            <div>Coding</div>
            <div>Peer Rev.</div>
            <div>Badges</div>
          </div>
          {pagedRows.map((row) => {
            const isActiveRow =
              studentId != null && Number(row.studentId) === Number(studentId);
            const displayTitle =
              row.skillTitle && row.skillTitle !== 'Student'
                ? row.skillTitle
                : '';
            return (
              <div
                key={row.studentId}
                className={`${styles.tableRow} ${
                  isActiveRow ? styles.tableRowActive : ''
                }`}
              >
                <div className={styles.rankCell}>#{row.rank}</div>
                <div className={styles.studentCell}>
                  <div className={styles.studentName}>{row.username}</div>
                  <div className={styles.studentRole}>{displayTitle}</div>
                </div>
                <div className={styles.scoreCell}>
                  <div className={styles.scoreValue}>{row.totalScore}</div>
                  <div className={styles.scoreMax}>/ 100</div>
                </div>
                <div className={styles.scoreCell}>
                  <div className={styles.scoreValue}>
                    {row.implementationScore}
                  </div>
                  <div className={styles.scoreMax}>/ 50</div>
                </div>
                <div className={styles.scoreCell}>
                  <div className={styles.scoreValue}>{row.codeReviewScore}</div>
                  <div className={styles.scoreMax}>/ 50</div>
                </div>
                <div className={styles.badgesCell}>
                  {Array.isArray(row.badges) && row.badges.length > 0
                    ? row.badges.map((badge) => (
                        <img
                          key={`${row.studentId}-${badge.key ?? badge.name}`}
                          className={styles.badgeIcon}
                          src={`/badge/${badge.iconKey}.png`}
                          alt={badge.name}
                          title={badge.name}
                          loading='lazy'
                        />
                      ))
                    : '-'}
                </div>
              </div>
            );
          })}
          {!loading && leaderboardData.leaderboard.length === 0 && (
            <div className={styles.tableEmpty}>
              No leaderboard data available for this challenge.
            </div>
          )}
        </div>
        {totalPages > 1 && (
          <div className={styles.pagination}>
            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;
              const variant = page === currentPage ? 'primary' : 'outline';
              return (
                <Button
                  key={`page-${page}`}
                  size='sm'
                  variant={variant}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              );
            })}
            <Button
              size='sm'
              variant='outline'
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next →
            </Button>
            <Button
              size='sm'
              variant='outline'
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
          </div>
        )}
      </section>

      <section className={styles.personalCard}>
        <div className={styles.personalHeader}>
          <div className={styles.personalTitle}>Your Position</div>
          <div className={styles.personalHint}>{personalHint}</div>
        </div>
        <div className={styles.personalGrid}>
          <div className={styles.personalItem}>
            <div className={styles.personalLabel}>Current Rank</div>
            <div className={styles.personalValue}>
              {leaderboardData.personalSummary?.rank
                ? `#${leaderboardData.personalSummary.rank}`
                : '-'}
            </div>
          </div>
          <div className={styles.personalItem}>
            <div className={styles.personalLabel}>Total Score</div>
            <div className={styles.personalValue}>
              {leaderboardData.personalSummary?.totalScore != null
                ? `${leaderboardData.personalSummary.totalScore}/100`
                : '-'}
            </div>
          </div>
          <div className={styles.personalItem}>
            <div className={styles.personalLabel}>Coding Phase</div>
            <div className={styles.personalValue}>
              {leaderboardData.personalSummary?.implementationScore != null
                ? `${leaderboardData.personalSummary.implementationScore}/50`
                : '-'}
            </div>
          </div>
          <div className={styles.personalItem}>
            <div className={styles.personalLabel}>Peer Review</div>
            <div className={styles.personalValue}>
              {leaderboardData.personalSummary?.codeReviewScore != null
                ? `${leaderboardData.personalSummary.codeReviewScore}/50`
                : '-'}
            </div>
          </div>
        </div>
        {error && <div className={styles.errorText}>{error}</div>}
      </section>
    </div>
  );
}
