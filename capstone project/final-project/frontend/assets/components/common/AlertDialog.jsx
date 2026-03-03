'use client';

import { useEffect, useId } from 'react';
import { Button } from '#components/common/Button';
import { createPortal } from 'react-dom';
import styles from './AlertDialog.module.css';

export default function AlertDialog({
  open,
  title = 'Confirm',
  description = '',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  cancelVariant = 'outline',
  confirmDisabled = false,
  cancelDisabled = false,
  onConfirm,
  onCancel,
}) {
  const titleId = useId();
  const descriptionId = useId();
  const hasDescription = Boolean(description);

  useEffect(() => {
    if (!open) return undefined;
    const { style } = document.body;
    const previousOverflow = style.overflow;
    style.overflow = 'hidden';
    return () => {
      style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      if (onCancel) onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onCancel]);

  if (!open) return null;

  const handleOverlayClick = (event) => {
    if (event.target !== event.currentTarget) return;
    if (onCancel) onCancel();
  };

  const handleOverlayKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    if (onCancel) onCancel();
  };

  const dialogProps = {
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': titleId,
  };
  if (hasDescription) {
    dialogProps['aria-describedby'] = descriptionId;
  }

  return createPortal(
    <div
      className={styles.overlay}
      role='button'
      tabIndex={0}
      onClick={handleOverlayClick}
      onKeyDown={handleOverlayKeyDown}
      aria-label='Close dialog'
    >
      <div className={styles.dialog} {...dialogProps}>
        <div className={styles.header}>
          <h3 id={titleId} className={styles.title}>
            {title}
          </h3>
        </div>
        {hasDescription && (
          <div id={descriptionId} className={styles.description}>
            {description}
          </div>
        )}
        <div className={styles.actions}>
          {onCancel && (
            <Button
              type='button'
              variant={cancelVariant}
              onClick={onCancel}
              disabled={cancelDisabled}
            >
              {cancelLabel}
            </Button>
          )}
          <Button
            type='button'
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={confirmDisabled}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
