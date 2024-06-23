import React, { useState } from 'react';
import styles from './StrikeAndBowlerSelection.module.css';

interface StrikeAndBowlerSelectionProps {
  battingTeam: string[];
  bowlingTeam: string[];
  onSelectionComplete: (striker: string, nonStriker: string, bowler: string) => void;
}

const StrikeAndBowlerSelection: React.FC<StrikeAndBowlerSelectionProps> = ({ battingTeam, bowlingTeam, onSelectionComplete }) => {
  const [striker, setStriker] = useState<string | null>(null);
  const [nonStriker, setNonStriker] = useState<string | null>(null);
  const [bowler, setBowler] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (striker === nonStriker) {
      setError('Striker and Non-Striker cannot be the same. Please choose different players.');
      return;
    }

    if (striker && nonStriker && bowler) {
      onSelectionComplete(striker, nonStriker, bowler);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Select Striker, Non-Striker, and Bowler</h2>
      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            Striker:
            <select
              className={styles.select}
              value={striker || ''}
              onChange={(e) => setStriker(e.target.value)}
            >
              <option value="">Select Striker</option>
              {battingTeam.map((player) => (
                <option key={player} value={player}>
                  {player}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            Non-Striker:
            <select
              className={styles.select}
              value={nonStriker || ''}
              onChange={(e) => setNonStriker(e.target.value)}
            >
              <option value="">Select Non-Striker</option>
              {battingTeam.map((player) => (
                <option key={player} value={player}>
                  {player}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            Bowler:
            <select
              className={styles.select}
              value={bowler || ''}
              onChange={(e) => setBowler(e.target.value)}
            >
              <option value="">Select Bowler</option>
              {bowlingTeam.map((player) => (
                <option key={player} value={player}>
                  {player}
                </option>
              ))}
            </select>
          </label>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.button} onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default StrikeAndBowlerSelection;