import React, { useState, useEffect } from 'react';
import styles from './Toss.module.css';

interface TossProps {
  teamA: string;
  teamB: string;
  onTossComplete: (winner: string, decision: 'bat' | 'bowl' | null, overs: number | null) => void;
}

export default function Toss({ teamA, teamB, onTossComplete }: TossProps) {
  const [call, setCall] = useState<'Heads' | 'Tails' | null>(null);
  const [result, setResult] = useState<'Heads' | 'Tails' | null>(null);
  const [showDecision, setShowDecision] = useState(false);
  const [isTossing, setIsTossing] = useState(false);
  const [callingTeam, setCallingTeam] = useState<string | null>(null);

  useEffect(() => {
    setCallingTeam(Math.random() < 0.5 ? teamA : teamB);
  }, [teamA, teamB]);

  const handleToss = (call: 'Heads' | 'Tails') => {
    setCall(call);
    setResult(null);
    setIsTossing(true);

    setTimeout(() => {
      setIsTossing(false);
      const tossResult = Math.random() < 0.5 ? 'Heads' : 'Tails';
      setResult(tossResult);
      const winner = tossResult === call ? callingTeam : callingTeam === teamA ? teamB : teamA;
      onTossComplete(winner!, null, null);
    }, 2000);
  };

  const handleDecision = (decision: 'bat' | 'bowl') => {
    const winner = result === call ? callingTeam! : callingTeam === teamA ? teamB : teamA;
    onTossComplete(winner, decision, null);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Toss</h2>
      {callingTeam && (
        <>
          <p className={styles.subtitle}>Call the Toss for {callingTeam}</p>
          <div className={styles.buttonGroup}>
            <button className={styles.button} onClick={() => handleToss('Heads')}>
              Heads
            </button>
            <button className={styles.button} onClick={() => handleToss('Tails')}>
              Tails
            </button>
          </div>
        </>
      )}
      {isTossing && (
        <div className={styles.tossingContainer}>
          <img
            src="https://media1.tenor.com/m/P_A926hrdDoAAAAC/bhibatsam-svp.gif"
            alt="Tossing Coin"
            className={styles.tossingImage}
          />
          <p className={styles.tossingText}>Tossing...</p>
        </div>
      )}
      {!isTossing && result !== null && (
        <div className={styles.resultContainer}>
          <p className={styles.resultText}>Toss Result: {result}</p>
          <div className={styles.resultImageContainer}>
            <img
              src={
                result === 'Heads'
                  ? "https://th.bing.com/th/id/OIP.HR0KmkTdGqAe0fGZTyTcqQHaHa?pid=ImgDet&w=161&h=161&c=7"
                  : "https://cdn.shopclues.com/images1/thumbnails/109425/320/320/150628361-109425664-1598871870.jpg"
              }
              alt={result}
              className={styles.resultImage}
            />
          </div>
          <p className={styles.winnerText}>
            {result === call ? `${callingTeam} won the toss!` : `${callingTeam === teamA ? teamB : teamA} won the toss!`}
          </p>
          {!showDecision && (
            <button className={styles.button} onClick={() => setShowDecision(true)}>
              Choose to Bat / Bowl
            </button>
          )}
          {showDecision && (
            <div className={styles.buttonGroup}>
              <button className={styles.button} onClick={() => handleDecision('bat')}>
                Bat
              </button>
              <button className={styles.button} onClick={() => handleDecision('bowl')}>
                Bowl
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}