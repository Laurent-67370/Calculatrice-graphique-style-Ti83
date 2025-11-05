/**
 * Composant d'affichage LCD de la calculatrice
 */

import React from 'react';
import type { CalculatorMode } from '../../types';

interface DisplayProps {
  input: string;
  history: string[];
  mode: CalculatorMode;
  secondActive: boolean;
  alphaActive: boolean;
}

export const Display: React.FC<DisplayProps> = ({
  input,
  history,
  mode,
  secondActive,
  alphaActive,
}) => {
  return (
    <div className="ti83-display">
      {/* Indicateurs de statut */}
      <div className="status-bar">
        {secondActive && <span className="indicator">2ND</span>}
        {alphaActive && <span className="indicator">ALPHA</span>}
        {mode !== 'NORMAL' && <span className="mode-indicator">{mode}</span>}
      </div>

      {/* Zone d'historique */}
      <div className="history-area">
        {history.slice(-3).map((entry, index) => (
          <div key={index} className="history-entry">
            {entry}
          </div>
        ))}
      </div>

      {/* Ligne d'entrée actuelle */}
      <div className="input-line">
        <span className="input-text">{input}</span>
        <span className="cursor">█</span>
      </div>
    </div>
  );
};
