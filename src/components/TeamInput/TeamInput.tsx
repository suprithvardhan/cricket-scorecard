import React, { useState } from 'react';
import styles from './TeamInput.module.css';

interface TeamInputProps {
  onTeamsSubmit: (teamA: string, teamB: string) => void;
}

export default function TeamInput({ onTeamsSubmit }: TeamInputProps) {
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamA && teamB) {
      setSubmitted(true);
      onTeamsSubmit(teamA, teamB);
    } else {
      alert('Please enter both Team A and Team B names.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Enter Team Names</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="teamA" className={styles.label}>Team A</label>
          <input
            id="teamA"
            type="text"
            value={teamA}
            onChange={(e) => setTeamA(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="teamB" className={styles.label}>Team B</label>
          <input
            id="teamB"
            type="text"
            value={teamB}
            onChange={(e) => setTeamB(e.target.value)}
            className={styles.input}
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