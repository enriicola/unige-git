'use client';

import { formatDateTime } from '#js/date';
import styles from './SubmissionScoreCard.module.css';

export default function SubmissionScoreCard({ scoreData }) {
  const {
    totalScore,
    codeReviewScore,
    implementationScore,
    updatedAt,
    // Backend provides detailed score stats for each phase.
    stats = {},
  } = scoreData || {};

  const formattedDate = updatedAt ? formatDateTime(updatedAt) : '—';

  // --- PEER REVIEW STATS ---
  const { E = 0, C = 0, W = 0, totalReviewed = 0 } = stats.codeReview || {};

  const weightE = 2;
  const weightC = 1;
  const weightW = 0.5;

  const earnedCR = E * weightE + C * weightC - W * weightW;

  // --- CODING PHASE STATS ---
  const {
    teacherPassed = 0,
    teacherTotal = 0,
    peerPenalties = 0,
    peerTotal = 0,
  } = stats.implementation || {};

  const baseScoreCalc =
    teacherTotal > 0 ? (teacherPassed / teacherTotal) * 50 : 0;

  // Cap penalty at 16.67 (50/3)
  const penaltyCalc =
    peerTotal > 0 ? Math.min((peerPenalties / peerTotal) * 50, 16.67) : 0;

  return (
    <div className={styles.container}>
      {/* 1. HERO SECTION */}
      <div className={styles.heroCard}>
        <h1 className={styles.totalScoreValue}>
          {totalScore !== undefined ? totalScore : '-'}
        </h1>
        <div className={styles.heroDivider}>
          <span className={styles.totalLabel}>Total Score out of 100</span>
        </div>

        <div className={styles.heroSubScores}>
          <div className={styles.subScoreItem}>
            <span className={styles.subValue}>
              {implementationScore !== undefined ? implementationScore : '-'}
            </span>
            <span className={styles.subLabel}>Coding Phase Score</span>
          </div>
          <div className={styles.verticalSeparator} />
          <div className={styles.subScoreItem}>
            <span className={styles.subValue}>
              {codeReviewScore !== undefined ? codeReviewScore : '-'}
            </span>
            <span className={styles.subLabel}>Peer Review Score</span>
          </div>
        </div>

        <div className={styles.timestamp}>
          <span className={styles.clockIcon}>🕒</span> Scored on {formattedDate}
        </div>
      </div>

      {/* 2. BREAKDOWN SECTION */}
      <div className={styles.breakdownGrid}>
        {/* --- LEFT: CODING PHASE CARD --- */}
        <div className={styles.detailCard}>
          <div className={styles.cardHeader}>
            <div className={`${styles.iconBox} ${styles.iconImpl}`}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
              </svg>
            </div>
            <div className={styles.headerInfo}>
              <h3>Coding Phase</h3>
              <span>Solution Correctness</span>
            </div>
            <div className={styles.headerScore}>
              {implementationScore !== undefined ? implementationScore : 0}
              <span className={styles.headerMax}>/50</span>
            </div>
          </div>

          <div className={styles.statsRow}>
            <div className={`${styles.statBox} ${styles.statGreen}`}>
              <span className={styles.statBig}>
                {teacherPassed}/{teacherTotal}
              </span>
              <span className={styles.statLabel}>
                TEACHER TESTS
                <br />
                PASSED
              </span>
            </div>
            <div className={`${styles.statBox} ${styles.statRed}`}>
              <span className={styles.statBig}>
                {peerPenalties}/{peerTotal}
              </span>
              <span className={styles.statLabel}>
                PEER REVIEW TESTS
                <br />
                EXPOSED ERRORS
              </span>
            </div>
          </div>

          <div className={styles.infoBox}>
            <span className={styles.infoIcon}>ⓘ</span>
            <p>
              <strong>Peer review test evaluation:</strong> Only test cases that
              exposed real bugs in your solution are counted in the penalty
              calculation.
            </p>
          </div>

          <div className={styles.subCalcRow}>
            <span>Base Score (Teacher Tests)</span>
            <span className={styles.subCalcValueGreen}>
              ({teacherPassed}/{teacherTotal}) × 50 = +
              {baseScoreCalc.toFixed(2)}
            </span>
          </div>

          <div className={styles.subCalcRow}>
            <span>Penalty (Failed Peer Review Tests)</span>
            <span className={styles.subCalcValueRed}>
              -{penaltyCalc.toFixed(1)}
            </span>
          </div>
          <div className={styles.subCalcNote}>
            min(({peerPenalties}/{peerTotal}) × 50, 16.67) <br /> Capped at 50/3
            points
          </div>

          <div className={`${styles.calcBox} ${styles.calcBoxPurple}`}>
            <h4>FINAL CALCULATION</h4>
            <div className={styles.calcRow}>
              <span>
                Base = ({teacherPassed}/{teacherTotal}) × 50 ={' '}
                <strong>{baseScoreCalc.toFixed(0)} points</strong>
              </span>
            </div>
            <div className={styles.calcRow}>
              <span>
                Penalty = min(
                {Math.round((peerPenalties / peerTotal) * 50) || 0}, 16.67) ={' '}
                <strong>{penaltyCalc.toFixed(1)} points</strong>
              </span>
            </div>
            <div className={styles.calcRow}>
              <span>
                Final = {baseScoreCalc.toFixed(0)} - {penaltyCalc.toFixed(1)} ={' '}
                <strong>{implementationScore}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* --- RIGHT: PEER REVIEW CARD --- */}
        <div className={styles.detailCard}>
          <div className={styles.cardHeader}>
            <div className={`${styles.iconBox} ${styles.iconReview}`}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' />
                <circle cx='9' cy='7' r='4' />
                <path d='M23 21v-2a4 4 0 0 0-3-3.87' />
                <path d='M16 3.13a4 4 0 0 1 0 7.75' />
              </svg>
            </div>
            <div className={styles.headerInfo}>
              <h3>Peer Review</h3>
              <span>Peer Review Accuracy</span>
            </div>
            <div className={styles.headerScore}>
              {codeReviewScore !== undefined ? codeReviewScore : 0}
              <span className={styles.headerMax}>/50</span>
            </div>
          </div>

          <div className={styles.reviewCountBadge}>
            <span className={styles.userIcon}>👤</span> You reviewed{' '}
            <strong>{totalReviewed} peer solutions</strong>
          </div>

          <div className={styles.checklist}>
            <div className={styles.checkItem}>
              <span className={styles.checkIcon}>✓</span>
              <span className={styles.checkLabel}>Correct Error-Spotting</span>
              <span className={styles.checkCount}>x{E}</span>
              <span className={styles.checkResultSuccess}>
                {E} × {weightE} = +{E * weightE}
              </span>
            </div>
            <div className={styles.checkItem}>
              <span className={styles.checkIcon}>✓</span>
              <span className={styles.checkLabel}>Correct Endorsement</span>
              <span className={styles.checkCount}>x{C}</span>
              <span className={styles.checkResultSuccess}>
                {C} × {weightC} = +{C * weightC}
              </span>
            </div>
            <div className={styles.checkItem}>
              <span className={styles.crossIcon}>✕</span>
              <span className={styles.checkLabel}>Incorrect Votes</span>
              <span className={styles.checkCount}>x{W}</span>
              <span className={styles.checkResultFail}>
                {W} × -{weightW} = -{W * weightW}
              </span>
            </div>
          </div>

          <div className={styles.calcBox}>
            <h4>CALCULATION</h4>
            <div className={styles.calcRow}>
              <span>
                Earned = {E}×2 + {C}×1 - {W}×0.5 ={' '}
                <strong>{earnedCR} points</strong>
              </span>
            </div>
            <div className={styles.calcRow}>
              <span>Final Score = {codeReviewScore}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
