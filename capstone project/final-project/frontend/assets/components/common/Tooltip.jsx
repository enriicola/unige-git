'use client';

import { useState } from 'react';
import styles from './Tooltip.module.css';

export default function Tooltip({ children, text, position = 'top' }) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}

      {visible && (
        <div className={`${styles.tooltip} ${styles[position]}`}>{text}</div>
      )}
    </div>
  );
}
