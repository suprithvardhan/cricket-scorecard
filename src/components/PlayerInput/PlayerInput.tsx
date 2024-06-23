import React, { useState } from 'react';
import styles from './PlayerInput.module.css';

interface PlayerInputProps {
  teamA: string;
  teamB: string;
  onPlayersSubmit: (playersA: string[], playersB: string[]) => void;
  onProceed: () => void;
}

const suggestions = [
  'suprith', 'suhas', 'charan', 'pranay', 'atif', 'ankit', 'avinash', 'arvind', 
  'dinesh', 'vamshi', 'varshith', 'prakash', 'dev', 'sofiyan'
];

export default function PlayerInput({ teamA, teamB, onPlayersSubmit, onProceed }: PlayerInputProps) {
  const [numPlayers, setNumPlayers] = useState(2);
  const [currentTeam, setCurrentTeam] = useState('A');
  const [playersA, setPlayersA] = useState<string[]>(Array(numPlayers).fill(''));
  const [playersB, setPlayersB] = useState<string[]>(Array(numPlayers).fill(''));
  const [showModal, setShowModal] = useState(false);
  const [suggestedNames, setSuggestedNames] = useState<string[]>([]);
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);

  const handlePlayerChange = (index: number, name: string) => {
    if (currentTeam === 'A') {
      const newPlayersA = [...playersA];
      newPlayersA[index] = name;
      setPlayersA(newPlayersA);
    } else {
      const newPlayersB = [...playersB];
      newPlayersB[index] = name;
      setPlayersB(newPlayersB);
    }
    setActiveInputIndex(index);
    setSuggestedNames(name ? suggestions.filter(n => n.toLowerCase().startsWith(name.toLowerCase())) : []);
  };

  const handleSuggestionClick = (index: number, suggestion: string) => {
    if (currentTeam === 'A') {
      const newPlayersA = [...playersA];
      newPlayersA[index] = suggestion;
      setPlayersA(newPlayersA);
    } else {
      const newPlayersB = [...playersB];
      newPlayersB[index] = suggestion;
      setPlayersB(newPlayersB);
    }
    setSuggestedNames([]);
    setActiveInputIndex(null);
  };

  const handleNumPlayersChange = (num: number) => {
    setNumPlayers(num);
    setPlayersA(Array(num).fill(''));
    setPlayersB(Array(num).fill(''));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTeam === 'A') {
      if (playersA.some(player => player === '')) {
        alert('Please enter all players for Team A.');
        return;
      }
      setCurrentTeam('B');
    } else {
      if (playersB.some(player => player === '')) {
        alert('Please enter all players for Team B.');
        return;
      }
      setShowModal(true);
    }
  };

  const handleModalProceed = () => {
    setShowModal(false);
    onPlayersSubmit(playersA, playersB);
    onProceed();
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Enter Players for {currentTeam === 'A' ? teamA : teamB}
      </h2>
      <div className={styles.buttonGrid}>
        {[...Array(9).keys()].map(num => (
          <button
            key={num}
            className={`${styles.button} ${num + 2 === numPlayers ? styles.activeButton : ''}`}
            onClick={() => handleNumPlayersChange(num + 2)}
          >
            {num + 2} Players
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        {[...Array(numPlayers).keys()].map(index => (
          <div key={index} className={styles.inputGroup}>
            <input
              type="text"
              placeholder={`Player ${index + 1}`}
              value={currentTeam === 'A' ? playersA[index] : playersB[index]}
              onChange={(e) => handlePlayerChange(index, e.target.value)}
              className={styles.input}
              required
            />
            {activeInputIndex === index && suggestedNames.length > 0 && (
              <ul className={styles.suggestions}>
                {suggestedNames.map((suggestion, i) => (
                  <li key={i} onClick={() => handleSuggestionClick(index, suggestion)}>
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <button type="submit" className={styles.button}>
          Next
        </button>
      </form>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Players Entered:</h2>
            <div className={styles.modalTeam}>
              <p className={styles.modalTeamName}>{teamA}:</p>
              <ul className={styles.modalPlayerList}>
                {playersA.map((player, index) => (
                  <li key={index}>{player}</li>
                ))}
              </ul>
            </div>
            <div className={styles.modalTeam}>
              <p className={styles.modalTeamName}>{teamB}:</p>
              <ul className={styles.modalPlayerList}>
                {playersB.map((player, index) => (
                  <li key={index}>{player}</li>
                ))}
              </ul>
            </div>
            <div className={styles.modalButtons}>
              <button onClick={handleModalProceed} className={`${styles.button} ${styles.proceedButton}`}>
                Proceed
              </button>
              <button onClick={handleModalCancel} className={`${styles.button} ${styles.cancelButton}`}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
