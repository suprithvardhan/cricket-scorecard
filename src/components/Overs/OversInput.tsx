import React, { useState } from 'react';
import styles from './OversInput.module.css';

interface OversInputProps {
  onOversSubmit: (overs: number) => void;
}

export default function OversInput({ onOversSubmit }: OversInputProps) {
  const [overs, setOvers] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const oversNumber = parseInt(overs);
    if (oversNumber > 0) {
      onOversSubmit(oversNumber);
    } else {
      alert('Please enter a valid number of overs.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Enter Number of Overs</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="number"
            placeholder="Overs"
            value={overs}
            onChange={(e) => setOvers(e.target.value)}
            className={styles.input}
            min="1"
            required
          />
        </div>
        <button type="submit" className={styles.button}>
          Start Match
        </button>
      </form>
    </div>
  );
}