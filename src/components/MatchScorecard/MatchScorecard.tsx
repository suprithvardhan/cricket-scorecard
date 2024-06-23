import React, { useState, useEffect } from 'react';
import styles from './MatchScorecard.module.css';
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

interface MatchScorecardProps {
  teamA: string;
  teamB: string;
  playersA: string[];
  playersB: string[];
  tossWinner: string;
  tossDecision: 'bat' | 'bowl';
  overs: number;
  striker: string;
  nonStriker: string;
  bowler: string;
  activeNavItem: 'update' | 'live' | 'scorecard';
  setActiveNavItem: React.Dispatch<React.SetStateAction<'update' | 'live' | 'scorecard'>>;
}

interface BatsmanStats {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  status: 'striker' | 'non-striker' | 'out' | 'not-batted';
}

interface BowlerStats {
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

interface Extras {
  wides: number;
  noballs: number;
  byes: number;
  legbyes: number;
}

interface CommentaryEntry {
  ball: string;
  text: string;
}

interface InningsScore {
  runs: number;
  wickets: number;
  overs: number;
}

const MatchScorecard: React.FC<MatchScorecardProps> = ({
  teamA,
  teamB,
  playersA,
  playersB,
  tossWinner,
  tossDecision,
  overs,
  striker,
  nonStriker,
  bowler: initialBowler,
  activeNavItem,
  setActiveNavItem,
}) => {
  const [innings, setInnings] = useState<1 | 2>(1);
  const [battingTeam, setBattingTeam] = useState<string>(
    tossWinner === teamA && tossDecision === 'bat' ? teamA : teamB
  );
  const [bowlingTeam, setBowlingTeam] = useState<string>(
    tossWinner === teamA && tossDecision === 'bat' ? teamB : teamA
  );
  const [battingPlayers, setBattingPlayers] = useState<string[]>(
    tossWinner === teamA && tossDecision === 'bat' ? playersA : playersB
  );
  const [bowlingPlayers, setBowlingPlayers] = useState<string[]>(
    tossWinner === teamA && tossDecision === 'bat' ? playersB : playersA
  );
  const [score, setScore] = useState<number>(0);
  const [wickets, setWickets] = useState<number>(0);
  const [currentOver, setCurrentOver] = useState<Array<number | string>>([]);
  const [oversCompleted, setOversCompleted] = useState<number>(0);
  const [legalBallsInOver, setLegalBallsInOver] = useState<number>(0);
  const [batsmen, setBatsmen] = useState<BatsmanStats[]>([
    { name: striker, runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, status: 'striker' },
    { name: nonStriker, runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, status: 'non-striker' },
  ]);
  const [bowler, setBowler] = useState<string>(initialBowler);
  const [bowlerStats, setBowlerStats] = useState<BowlerStats[]>([]);
  const [extras, setExtras] = useState<Extras>({ wides: 0, noballs: 0, byes: 0, legbyes: 0 });
  const [showBowlerOverlay, setShowBowlerOverlay] = useState<boolean>(false);
  const [inningsCompleted, setInningsCompleted] = useState<boolean>(false);
  const [secondInningsStarted, setSecondInningsStarted] = useState<boolean>(false);
  const [target, setTarget] = useState<number>(0);
  const [matchResult, setMatchResult] = useState<string>('');
  const [showRestartButton, setShowRestartButton] = useState<boolean>(false);
  const [selectingStriker, setSelectingStriker] = useState<boolean>(false);
  const [selectingNonStriker, setSelectingNonStriker] = useState<boolean>(false);
  const [availableBatsmen, setAvailableBatsmen] = useState<string[]>([]);
  const [lastWinner, setLastWinner] = useState<string>('');
  const [commentary, setCommentary] = useState<CommentaryEntry[]>([]);
  const [firstInningsScore, setFirstInningsScore] = useState<InningsScore>({ runs: 0, wickets: 0, overs: 0 });

  useEffect(() => {
    if (inningsCompleted && !secondInningsStarted) {
      setTarget(score + 1);
      setFirstInningsScore({ runs: score, wickets: wickets, overs: oversCompleted });
    }
    updateAvailableBatsmen();
  }, [inningsCompleted, secondInningsStarted, score, battingPlayers, batsmen]);

  const updateAvailableBatsmen = () => {
    const availablePlayers = battingPlayers.filter(player => 
      !batsmen.some(b => b.name === player && (b.status === 'out' || b.status === 'striker' || b.status === 'non-striker'))
    );
    setAvailableBatsmen(availablePlayers);
  };

  const getBowlerStats = (bowlerName: string): string => {
    const bowler = bowlerStats.find((b) => b.name === bowlerName);
    if (!bowler) return '0-0-0-0';
    return `${bowler.overs}-${bowler.maidens}-${bowler.runs}-${bowler.wickets}`;
  };

  const updateBatsmanStats = (index: number, runs: number) => {
    setBatsmen((prevBatsmen) => {
      const updatedBatsmen = [...prevBatsmen];
      if (updatedBatsmen[index]) {
        updatedBatsmen[index] = {
          ...updatedBatsmen[index],
          runs: updatedBatsmen[index].runs + runs,
          balls: updatedBatsmen[index].balls + 1,
          fours: runs === 4 ? updatedBatsmen[index].fours + 1 : updatedBatsmen[index].fours,
          sixes: runs === 6 ? updatedBatsmen[index].sixes + 1 : updatedBatsmen[index].sixes,
        };
        updatedBatsmen[index].strikeRate = (updatedBatsmen[index].runs / updatedBatsmen[index].balls) * 100;
      }
      return updatedBatsmen;
    });
  };

  const updateBowlerStats = (runs: number, isWicket: boolean = false, isExtra: boolean = false) => {
    setBowlerStats((prevStats) => {
      const currentBowlerIndex = prevStats.findIndex((stat) => stat.name === bowler);
      if (currentBowlerIndex === -1) {
        return [
          ...prevStats,
          {
            name: bowler,
            overs: isExtra ? 0 : 0.1,
            maidens: 0,
            runs,
            wickets: isWicket ? 1 : 0,
            economy: runs * 6,
          },
        ];
      } else {
        const updatedStats = [...prevStats];
        updatedStats[currentBowlerIndex] = {
          ...updatedStats[currentBowlerIndex],
          overs: isExtra ? updatedStats[currentBowlerIndex].overs : Number((updatedStats[currentBowlerIndex].overs + 0.1).toFixed(1)),
          runs: updatedStats[currentBowlerIndex].runs + runs,
          wickets: isWicket ? updatedStats[currentBowlerIndex].wickets + 1 : updatedStats[currentBowlerIndex].wickets,
        };
        if (updatedStats[currentBowlerIndex].overs.toString().endsWith('.6')) {
          updatedStats[currentBowlerIndex].overs = Math.floor(updatedStats[currentBowlerIndex].overs) + 1;
        }
        updatedStats[currentBowlerIndex].economy =
          (updatedStats[currentBowlerIndex].runs / updatedStats[currentBowlerIndex].overs);
        return updatedStats;
      }
    });
  };

  const addCommentary = (ball: string, text: string) => {
    setCommentary(prevCommentary => [...prevCommentary, { ball, text }]);
  };

  const generateCommentary = (value: number | string) => {
    const striker = batsmen.find(b => b.status === 'striker')?.name || '';
    const currentBall = `${Math.floor(oversCompleted)}.${legalBallsInOver + 1}`;

    switch (value) {
      case 0:
        return `${bowler} to ${striker}, no run`;
      case 1:
        return `${bowler} to ${striker}, 1 run`;
      case 2:
        return `${bowler} to ${striker}, 2 runs`;
      case 3:
        return `${bowler} to ${striker}, 3 runs`;
      case 4:
        return `${bowler} to ${striker}, FOUR runs`;
      case 6:
        return `${bowler} to ${striker}, SIX runs`;
      case 'W':
        return `${bowler} to ${striker}, OUT!`;
      case 'wd':
        return `${bowler} to ${striker}, Wide`;
      case 'nb':
        return `${bowler} to ${striker}, No ball`;
      case 'lb':
        return `${bowler} to ${striker}, Leg bye`;
      case 'b':
        return `${bowler} to ${striker}, Bye`;
      default:
        return `${bowler} to ${striker}`;
    }
  };

  const handleButtonClick = (value: number | string) => {
    if (activeNavItem !== 'update' || showBowlerOverlay) return;
    if (inningsCompleted) return;

    const commentaryText = generateCommentary(value);
    const currentBall = `${Math.floor(oversCompleted)}.${legalBallsInOver + 1}`;
    addCommentary(currentBall, commentaryText);

    if (typeof value === 'number') {
      setScore((prevScore) => {
        const newScore = prevScore + value;
        if (innings === 2 && newScore >= target) {
          setTimeout(() => endInnings(newScore), 0);
        }
        return newScore;
      });
      updateBatsmanStats(0, value);
      updateBowlerStats(value);
      setCurrentOver((prevOver) => [...prevOver, value]);
      setLegalBallsInOver((prev) => prev + 1);

      if (value % 2 !== 0) {
        rotateStrike();
      }
    } else if (value === 'W') {
      setWickets((prevWickets) => {
        const newWickets = prevWickets + 1;
        if (newWickets === battingPlayers.length - 1) {
          setTimeout(() => endInnings(score), 0);
        }
        return newWickets;
      });
      updateBowlerStats(0, true);
      setCurrentOver((prevOver) => [...prevOver, 'W']);
      setLegalBallsInOver((prev) => prev + 1);
      setBatsmen((prevBatsmen) => {
        const updatedBatsmen = [...prevBatsmen];
        if (updatedBatsmen[0]) {
          updatedBatsmen[0] = { ...updatedBatsmen[0], status: 'out' };
        }
        return updatedBatsmen;
      });
      setSelectingStriker(true);
    } else if (value === 'wd' || value === 'nb') {
      setScore((prevScore) => prevScore + 1);
      setExtras((prevExtras) => ({
        ...prevExtras,
        [value === 'wd' ? 'wides' : 'noballs']: prevExtras[value === 'wd' ? 'wides' : 'noballs'] + 1,
      }));
      updateBowlerStats(1, false, true);
      setCurrentOver((prevOver) => [...prevOver, value]);
    } else if (value === 'lb' || value === 'b') {
      setScore((prevScore) => prevScore + 1);
      setExtras((prevExtras) => ({
        ...prevExtras,
        [value === 'lb' ? 'legbyes' : 'byes']: prevExtras[value === 'lb' ? 'legbyes' : 'byes'] + 1,
      }));
      setCurrentOver((prevOver) => [...prevOver, value]);
      setLegalBallsInOver((prev) => prev + 1);
    }

    if (legalBallsInOver === 5 && value !== 'wd' && value !== 'nb') {
      const overSummary = `End of over ${oversCompleted + 1}: ${battingTeam} ${score}/${wickets}`;
      addCommentary(`${oversCompleted + 1}.0`, overSummary);

      setOversCompleted((prevOvers) => {
        const newOvers = prevOvers + 1;
        if (newOvers === overs) {
          setTimeout(() => endInnings(score), 0);
        }
        return newOvers;
      });
      setLegalBallsInOver(0);
      setShowBowlerOverlay(true);
      rotateStrike();
    }
  };

  const endInnings = (finalScore: number) => {
    setInningsCompleted(true);
    if (innings === 2) {
      const chasingTeamWon = finalScore >= target;
      const winner = chasingTeamWon ? battingTeam : bowlingTeam;
      let resultText = '';
      if (chasingTeamWon) {
        const wicketsRemaining = 10 - wickets;
        resultText = `${winner} won by ${wicketsRemaining} wicket${wicketsRemaining !== 1 ? 's' : ''}`;
      } else {
        const runsDifference = target - finalScore - 1;
        resultText = `${winner} won by ${runsDifference} run${runsDifference !== 1 ? 's' : ''}`;
      }
      setMatchResult(resultText);
      setShowRestartButton(true);
      setLastWinner(winner);
    }
  };

  const rotateStrike = () => {
    setBatsmen((prevBatsmen) => [
      { ...prevBatsmen[1], status: 'striker' },
      { ...prevBatsmen[0], status: 'non-striker' },
    ]);
  };

  const handleStrikerSelection = (newStriker: string) => {
    setBatsmen((prevBatsmen) => [
      { name: newStriker, runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, status: 'striker' },
      prevBatsmen[1] || { name: '', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, status: 'non-striker' },
    ]);
    setSelectingStriker(false);
    if (innings === 2 && !secondInningsStarted) {
      setSelectingNonStriker(true);
    }
    updateAvailableBatsmen();
  };

  const handleNonStrikerSelection = (newNonStriker: string) => {
    setBatsmen((prevBatsmen) => [
      prevBatsmen[0] || { name: '', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, status: 'striker' },
      { name: newNonStriker, runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, status: 'non-striker' },
    ]);
    setSelectingNonStriker(false);
    if (innings === 2) {
      setSecondInningsStarted(true);
    }
    setShowBowlerOverlay(true);
    updateAvailableBatsmen();
  };

  const handleNewBowlerSubmit = (newBowler: string) => {
    setBowler(newBowler);
    setCurrentOver([]);
    setShowBowlerOverlay(false);
  };

  const startSecondInnings = () => {
    setFirstInningsScore({ runs: score, wickets: wickets, overs: oversCompleted });
    setTarget(score + 1);
    setInnings(2);
    setBattingTeam(bowlingTeam);
    setBowlingTeam(battingTeam);
    setBattingPlayers(bowlingPlayers);
    setBowlingPlayers(battingPlayers);
    setScore(0);
    setWickets(0);
    setOversCompleted(0);
    setLegalBallsInOver(0);
    setCurrentOver([]);
    setBowlerStats([]);
    setExtras({ wides: 0, noballs: 0, byes: 0, legbyes: 0 });
    setInningsCompleted(false);
    setSelectingStriker(true);
    setBatsmen([]);
    setCommentary([]);
    updateAvailableBatsmen();
  };

  const restartMatch = () => {
    setInnings(1);
    setBattingTeam(lastWinner);
    setBowlingTeam(lastWinner === teamA ? teamB : teamA);
    setBattingPlayers(lastWinner === teamA ? playersA : playersB);
    setBowlingPlayers(lastWinner === teamA ? playersB : playersA);
    setScore(0);
    setWickets(0);
    setCurrentOver([]);
    setOversCompleted(0);
    setLegalBallsInOver(0);
    setBatsmen([]);
    setBowler('');
    setBowlerStats([]);
    setExtras({ wides: 0, noballs: 0, byes: 0, legbyes: 0 });
    setInningsCompleted(false);
    setSecondInningsStarted(false);
    setTarget(0);
    setMatchResult('');
    setShowRestartButton(false);
    setSelectingStriker(true);
    setCommentary([]);
    setFirstInningsScore({ runs: 0, wickets: 0, overs: 0 });
    updateAvailableBatsmen();
  };

  const restartCompletely = () => {
    setInnings(1);
    setBattingTeam(tossWinner === teamA && tossDecision === 'bat' ? teamA : teamB);
    setBowlingTeam(tossWinner === teamA && tossDecision === 'bat' ? teamB : teamA);
    setBattingPlayers(tossWinner === teamA && tossDecision === 'bat' ? playersA : playersB);
    setBowlingPlayers(tossWinner === teamA && tossDecision === 'bat' ? playersB : playersA);
    setScore(0);
    setWickets(0);
    setCurrentOver([]);
    setOversCompleted(0);
    setLegalBallsInOver(0);
    setBatsmen([]);
    setBowler('');
    setBowlerStats([]);
    setExtras({ wides: 0, noballs: 0, byes: 0, legbyes: 0 });
    setInningsCompleted(false);
    setSecondInningsStarted(false);
    setTarget(0);
    setMatchResult('');
    setShowRestartButton(false);
    setSelectingStriker(true);
    setSelectingNonStriker(false);
    setLastWinner('');
    setCommentary([]);
    setFirstInningsScore({ runs: 0, wickets: 0, overs: 0 });
    updateAvailableBatsmen();
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        {['update', 'live', 'scorecard'].map((item) => (
          <button
            key={item}
            className={`${styles.navItem} ${activeNavItem === item ? styles.activeNavItem : ''}`}
            onClick={() => setActiveNavItem(item as 'update' | 'live' | 'scorecard')}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </nav>

      {activeNavItem === 'update' && (
        <div className={styles.liveUpdateContainer}>
          {inningsCompleted && !secondInningsStarted ? (
            <div className={styles.inningsBreak}>
              <h2>{innings}st Innings Completed</h2>
              <p>{battingTeam} scored {score}/{wickets} in {oversCompleted} overs</p>
              <button className={styles.button} onClick={startSecondInnings}>Start 2nd Innings</button>
            </div>
          ) : matchResult ? (
            <div className={styles.matchResult}>
              <h2>Match Result</h2>
              <p>{matchResult}</p>
              {showRestartButton && (
                <>
                  <button onClick={restartMatch} className={styles.button}>
                    <RefreshCw size={16} className={styles.buttonIcon} />
                    Restart Match
                  </button>
                  <button onClick={restartCompletely} className={styles.button}>
                    <RefreshCw size={16} className={styles.buttonIcon} />
                    Restart Completely
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              <div className={styles.scoreHeader}>
                <h2>{battingTeam} Innings</h2>
                <p className={styles.score}>
                  {score}/{wickets} <span className={styles.overs}>({Math.floor(oversCompleted)}.{legalBallsInOver})</span>
                </p>
                {innings === 2 && (
                  <p className={styles.target}>
                    Need {Math.max(0, target - score)} runs in {Math.max(0, (overs - oversCompleted) * 6 - legalBallsInOver)} balls
                  </p>
                )}
              </div>
              <div className={styles.infoContainer}>
                <div className={styles.batsmenInfo}>
                  {batsmen.map((batsman, index) => (
                    batsman && (
                      <div key={index} className={styles.batsman}>
                        <span>{batsman.name} {batsman.status === 'striker' ? '*' : ''}</span>
                        <span>{batsman.runs} ({batsman.balls})</span>
                      </div>
                    )
                  ))}
                </div>
                <div className={styles.bowlerInfo}>
                  <div className={styles.bowler}>
                    <span>{bowler}</span>
                    <span>{getBowlerStats(bowler)}</span>
                  </div>
                </div>
              </div>
              <div className={styles.currentOver}>
                <h3>This Over</h3>
                <div className={styles.ballsContainer}>
                  {currentOver.map((ball, index) => (
                    <span key={index} className={`${styles.ball} ${ball === 'W' ? styles.wicketBall : ''}`}>
                      {ball}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.scoringButtons}>
                {[0, 1, 2, 3, 4, 6, 'W', 'wd', 'nb', 'lb', 'b'].map((value, index) => (
                  <button
                    key={value}
                    className={`${styles.scoringButton} ${value === 'W' ? styles.wicketButton : ''}`}
                    onClick={() => handleButtonClick(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
              {selectingStriker && (
                <div className={styles.overlay}>
                  <div className={styles.overlayContent}>
                    <h3>Select Striker</h3>
                    <ul>
                      {availableBatsmen.map((player, index) => (
                        <li key={index} onClick={() => handleStrikerSelection(player)}>
                          {player}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {selectingNonStriker && (
                <div className={styles.overlay}>
                  <div className={styles.overlayContent}>
                    <h3>Select Non-Striker</h3>
                    <ul>
                      {availableBatsmen
                        .filter((player) => player !== batsmen[0]?.name)
                        .map((player, index) => (
                          <li key={index} onClick={() => handleNonStrikerSelection(player)}>
                            {player}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}
              {showBowlerOverlay && (
                <div className={styles.overlay}>
                  <div className={styles.overlayContent}>
                    <h3>Select Next Bowler</h3>
                    <ul>
                      {bowlingPlayers.map((player, index) => (
                        <li key={index} onClick={() => handleNewBowlerSubmit(player)}>
                          {player}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeNavItem === 'live' && (
        <div className={styles.liveCommentary}>
          <h2>Live Commentary</h2>
          <div className={styles.commentaryContainer}>
            {commentary.map((entry, index) => (
              <div key={index} className={styles.commentaryEntry}>
                <span className={styles.commentaryBall}>{entry.ball}</span>
                <span className={styles.commentaryText}>{entry.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeNavItem === 'scorecard' && (
        <div className={styles.scorecard}>
          <h2>{battingTeam} Innings</h2>
          <div className={styles.scoreSummary}>
            <p>
              {score}/{wickets} ({Math.floor(oversCompleted)}.{legalBallsInOver} Overs)
            </p>
            {innings === 2 && (
              <p className={styles.target}>
                Need {Math.max(0, target - score)} runs in {Math.max(0, (overs - oversCompleted) * 6 - legalBallsInOver)} balls
              </p>
            )}
          </div>
          <div className={styles.batsmenTable}>
            <h3>Batsmen</h3>
            <table>
              <thead>
                <tr>
                  <th>Batsman</th>
                  <th>Runs</th>
                  <th>Balls</th>
                  <th>4s</th>
                  <th>6s</th>
                  <th>SR</th>
                </tr>
              </thead>
              <tbody>
                {batsmen.map((batsman, index) => (
                  batsman && (
                    <tr key={index}>
                      <td>{batsman.name} {batsman.status === 'striker' ? '*' : ''}</td>
                      <td>{batsman.runs}</td>
                      <td>{batsman.balls}</td>
                      <td>{batsman.fours}</td>
                      <td>{batsman.sixes}</td>
                      <td>{batsman.strikeRate.toFixed(2)}</td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.bowlersTable}>
            <h3>Bowlers</h3>
            <table>
              <thead>
                <tr>
                  <th>Bowler</th>
                  <th>O</th>
                  <th>M</th>
                  <th>R</th>
                  <th>W</th>
                  <th>Econ</th>
                </tr>
              </thead>
              <tbody>
                {bowlerStats.map((bowler, index) => (
                  <tr key={index}>
                    <td>{bowler.name}</td>
                    <td>{bowler.overs}</td>
                    <td>{bowler.maidens}</td>
                    <td>{bowler.runs}</td>
                    <td>{bowler.wickets}</td>
                    <td>{bowler.economy.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.extrasInfo}>
            <h3>Extras</h3>
            <p>
              Total: {extras.wides + extras.noballs + extras.byes + extras.legbyes} 
              (W {extras.wides}, NB {extras.noballs}, B {extras.byes}, LB {extras.legbyes})
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchScorecard;