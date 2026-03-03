'use client';

import { useRouter } from 'next/navigation';
import { formatDateTime } from '#js/date';
import { getChallengeStatusLabel } from '#js/constants';
import styles from './ChallengeCard.module.css';

export default function ChallengeCard({
  challenge,
  actions,
  href,
  onAllowedNumberChange,
  allowedNumberError,
  extraInfo,
}) {
  const router = useRouter();
  const {
    title,
    duration,
    startDatetime,
    status,
    participants,
    allowedNumberOfReview,
  } = challenge;

  const readableDate = startDatetime ? formatDateTime(startDatetime) : 'TBD';

  const handleNavigate = () => {
    if (href) router.push(href);
  };

  const handleKeyDown = (event) => {
    if (!href) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      router.push(href);
    }
  };

  const allowedNumberValue =
    allowedNumberOfReview === '' || allowedNumberOfReview === null
      ? ''
      : (allowedNumberOfReview ?? 5);

  const handleAllowedNumberChange = (event) => {
    onAllowedNumberChange?.(challenge.id, event.target.value);
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <article
      className={`${styles.card} ${href ? styles.clickable : ''}`}
      role={href ? 'link' : undefined}
      /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
      tabIndex={href ? 0 : undefined}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
    >
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {status && (
          <span className={`${styles.status} ${styles[`status-${status}`]}`}>
            {getChallengeStatusLabel(status)}
          </span>
        )}
      </header>
      <dl className={styles.meta}>
        <div>
          <dt>Duration</dt>
          <dd>{duration ? `${duration} min` : '—'}</dd>
        </div>
        <div>
          <dt>Start</dt>
          <dd>{readableDate}</dd>
        </div>
        {typeof participants === 'number' && (
          <div>
            <dt>Students</dt>
            <dd>{participants}</dd>
          </div>
        )}
        <div>
          <dt>Expected reviews / submission</dt>
          <dd>
            <input
              type='number'
              className={`${styles.numberInput} ${
                allowedNumberError ? styles.numberInputError : ''
              }`}
              disabled={!onAllowedNumberChange}
              value={allowedNumberValue}
              min={2}
              onChange={handleAllowedNumberChange}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            />
            {allowedNumberError ? (
              <p className={styles.numberError}>{allowedNumberError}</p>
            ) : null}
          </dd>
        </div>
      </dl>
      {extraInfo ? <div className={styles.extraInfo}>{extraInfo}</div> : null}
      {actions ? (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
          {actions}
        </div>
      ) : null}
    </article>
  );
}
