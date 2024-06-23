import React from 'react';

interface ConfirmationModalProps {
  teamAName: string;
  teamBName: string;
  numPlayers: number;
  onProceed: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  teamAName,
  teamBName,
  numPlayers,
  onProceed,
  onCancel
}) => {
  return (
    <div className="overlay">
      <div className="overlay-content">
        <h2>Confirm Players</h2>
        <div className="overlay-team">
          <h3>{teamAName}</h3>
          <p>Number of Players: {numPlayers}</p>
        </div>
        <div className="overlay-team">
          <h3>{teamBName}</h3>
          <p>Number of Players: {numPlayers}</p>
        </div>
        <button className="btn btn-primary btn-block" onClick={onProceed}>Proceed</button>
        <button className="btn btn-secondary btn-block" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
