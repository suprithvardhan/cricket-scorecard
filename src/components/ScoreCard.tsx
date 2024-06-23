"use client";

import { useState } from 'react';

interface ScoreCardProps {
  teamA: string;
  teamB: string;
  playersA: string[];
  playersB: string[];
}

export default function ScoreCard({ teamA, teamB, playersA, playersB }: ScoreCardProps) {
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [wicketsA, setWicketsA] = useState(0);
  const [wicketsB, setWicketsB] = useState(0);
  const [overs, setOvers] = useState(0);

  const handleScoreUpdate = (team: 'A' | 'B', runs: number) => {
    if (team === 'A') setScoreA(scoreA + runs);
    else setScoreB(scoreB + runs);
  };

  const handleWicketUpdate = (team: 'A' | 'B') => {
    if (team === 'A') setWicketsA(wicketsA + 1);
    else setWicketsB(wicketsB + 1);
  };

  const handleOverUpdate = () => {
    setOvers(overs + 1);
  };

  return (
    <div className="container mt-10">
      <h1 className="text-2xl text-center font-bold mb-6">ScoreCard</h1>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <h2 className="text-xl font-semibold">{teamA}</h2>
          <p>Score: {scoreA}/{wicketsA}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">{teamB}</h2>
          <p>Score: {scoreB}/{wicketsB}</p>
        </div>
      </div>
      <div className="mt-6 text-center">
        <h2 className="text-xl font-semibold">Overs: {overs}</h2>
        <div className="space-x-2 mt-4">
          <button className="button" onClick={() => handleScoreUpdate('A', 1)}>1 Run (Team A)</button>
          <button className="button" onClick={() => handleScoreUpdate('B', 1)}>1 Run (Team B)</button>
          <button className="button" onClick={() => handleWicketUpdate('A')}>Wicket (Team A)</button>
          <button className="button" onClick={() => handleWicketUpdate('B')}>Wicket (Team B)</button>
          <button className="button" onClick={handleOverUpdate}>Next Over</button>
        </div>
      </div>
    </div>
  );
}
