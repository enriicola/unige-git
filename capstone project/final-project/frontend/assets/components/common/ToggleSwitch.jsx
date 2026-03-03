'use client';

import React from 'react';
import styles from './ToggleSwitch.module.css';

export default function ToggleSwitch({ checked, onChange, label }) {
  const id = React.useId();

  return (
    <div className={styles.switchWrapper}>
      <div className={styles.switch}>
        <input
          id={id}
          type='checkbox'
          checked={checked}
          onChange={onChange}
          className={styles.input}
        />
        <span className={styles.slider} />
      </div>
      <label htmlFor={id} className={styles.labelText}>
        {label}
      </label>
    </div>
  );
}
