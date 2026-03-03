'use client';

import AlertDialog from '#components/common/AlertDialog';
import styles from './PeerReviewSummaryDialog.module.css';

export default function PeerReviewSummaryDialog({ open, summary, onClose }) {
  if (!summary) return null;
  return (
    <AlertDialog
      open={open}
      title='Thanks for your participation.'
      description={
        <div className={styles.summary}>
          <div className={styles.row}>
            <span className={styles.label}>Correct</span>
            <span className={`${styles.value} ${styles.correct}`}>
              {summary.correct}
            </span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Incorrect</span>
            <span className={`${styles.value} ${styles.incorrect}`}>
              {summary.incorrect}
            </span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Abstain</span>
            <span className={`${styles.value} ${styles.abstain}`}>
              {summary.abstain}
            </span>
          </div>
        </div>
      }
      confirmLabel='OK'
      onConfirm={onClose}
      onCancel={null}
    />
  );
}
