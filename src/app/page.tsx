'use client';
import { useState } from 'react';
import TeamInput from '../components/TeamInput/TeamInput';
import PlayerInput from '../components/PlayerInput/PlayerInput';
import Toss from '../components/Toss/Toss';
import MatchScorecard from '../components/MatchScorecard/MatchScorecard';
import OversInput from '../components/Overs/OversInput';
import StrikeAndBowlerSelection from '../components/StrikerAndBowler/StrikeAndBowlerSelection';

export default function Page() {
  const [teamA, setTeamA] = useState<string | null>(null);
  const [teamB, setTeamB] = useState<string | null>(null);
  const [playersA, setPlayersA] = useState<string[]>([]);
  const [playersB, setPlayersB] = useState<string[]>([]);
  const [tossCompleted, setTossCompleted] = useState(false);
  const [tossWinner, setTossWinner] = useState<string | null>(null);
  const [tossDecision, setTossDecision] = useState<'bat' | 'bowl' | null>(null);
  const [overs, setOvers] = useState<number | null>(null);
  const [striker, setStriker] = useState<string | null>(null);
  const [nonStriker, setNonStriker] = useState<string | null>(null);
  const [bowler, setBowler] = useState<string | null>(null);
  const [activeNavItem, setActiveNavItem] = useState<'update' | 'live' | 'scorecard'>('scorecard');
  const [showMatchScorecard, setShowMatchScorecard] = useState(false);

  const handleTeamsSubmit = (teamA: string, teamB: string) => {
    console.log('Teams submitted:', teamA, teamB);
    setTeamA(teamA);
    setTeamB(teamB);
  };

  const handlePlayersSubmit = (playersA: string[], playersB: string[]) => {
    console.log('Players submitted for Team A:', playersA);
    console.log('Players submitted for Team B:', playersB);
    setPlayersA(playersA);
    setPlayersB(playersB);
  };

  const handleProceed = () => {
    console.log('Proceeding to toss...');
    setTossCompleted(false);
  };

  const handleTossComplete = (winner: string, decision: 'bat' | 'bowl' | null, overs: number | null) => {
    console.log('Toss complete. Winner:', winner, 'Decision:', decision, 'Overs:', overs);
    setTossWinner(winner);
    setTossDecision(decision);
    setOvers(overs);
    if (decision !== null) {
      setTossCompleted(true);
    }
  };

  const handleOversSubmit = (overs: number) => {
    console.log('Overs submitted:', overs);
    setOvers(overs);
  };

  const handleSelectionComplete = (striker: string, nonStriker: string, bowler: string) => {
    console.log('Selection completed. Striker:', striker, 'Non-Striker:', nonStriker, 'Bowler:', bowler);
    setStriker(striker);
    setNonStriker(nonStriker);
    setBowler(bowler);
    setShowMatchScorecard(true);
  };

  const getBattingTeam = () => {
    if (tossWinner === teamA && tossDecision === 'bat') return playersA;
    if (tossWinner === teamB && tossDecision === 'bat') return playersB;
    if (tossWinner === teamA && tossDecision === 'bowl') return playersB;
    if (tossWinner === teamB && tossDecision === 'bowl') return playersA;
    return [];
  };

  const getBowlingTeam = () => {
    if (tossWinner === teamA && tossDecision === 'bat') return playersB;
    if (tossWinner === teamB && tossDecision === 'bat') return playersA;
    if (tossWinner === teamA && tossDecision === 'bowl') return playersA;
    if (tossWinner === teamB && tossDecision === 'bowl') return playersB;
    return [];
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-transparent to-gray-200">
      {!teamA || !teamB ? (
        <TeamInput onTeamsSubmit={handleTeamsSubmit} />
      ) : playersA.length === 0 || playersB.length === 0 ? (
        <PlayerInput teamA={teamA} teamB={teamB} onPlayersSubmit={handlePlayersSubmit} onProceed={handleProceed} />
      ) : !tossCompleted ? (
        <Toss teamA={teamA} teamB={teamB} onTossComplete={handleTossComplete} />
      ) : overs === null ? (
        <OversInput onOversSubmit={handleOversSubmit} />
      ) : striker === null || nonStriker === null || bowler === null ? (
        <StrikeAndBowlerSelection
          battingTeam={getBattingTeam()}
          bowlingTeam={getBowlingTeam()}
          onSelectionComplete={handleSelectionComplete}
        />
      ) : (
        tossWinner && tossDecision && (
          <MatchScorecard
            teamA={teamA}
            teamB={teamB}
            playersA={playersA}
            playersB={playersB}
            tossWinner={tossWinner}
            tossDecision={tossDecision}
            overs={overs}
            striker={striker}
            nonStriker={nonStriker}
            bowler={bowler}
            activeNavItem={activeNavItem}
            setActiveNavItem={setActiveNavItem}
          />
        )
      )}
    </main>
  );
}