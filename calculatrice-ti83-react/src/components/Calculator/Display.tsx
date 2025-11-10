/**
 * Composant d'affichage LCD de la calculatrice
 */

import React, { useState } from 'react';
import type { CalculatorMode, GraphMode } from '../../types';

interface DisplayProps {
  input: string;
  history: string[];
  mode: CalculatorMode;
  secondActive: boolean;
  alphaActive: boolean;
  cursorPosition: number;
  graphMode?: GraphMode;
  onHistoryClick?: (entry: string) => void;
}

export const Display: React.FC<DisplayProps> = ({
  input,
  history,
  mode,
  secondActive,
  alphaActive,
  cursorPosition,
  graphMode,
  onHistoryClick,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Fonction pour copier un résultat dans le presse-papier
  const handleCopyResult = async (entry: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();

    // Extraire uniquement le résultat (après le =)
    const result = entry.includes('=') ? entry.split('=').pop()?.trim() : entry;

    if (result) {
      try {
        await navigator.clipboard.writeText(result);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 1500);
      } catch (err) {
        console.error('Erreur copie:', err);
      }
    }
  };

  // Fonction pour insérer un résultat dans l'input
  const handleHistoryEntryClick = (entry: string) => {
    if (onHistoryClick) {
      // Extraire le résultat pour réutilisation
      const result = entry.includes('=') ? entry.split('=').pop()?.trim() : entry;
      if (result) {
        onHistoryClick(result);
      }
    }
  };

  // Diviser le texte en deux parties: avant et après le curseur
  const textBeforeCursor = input.slice(0, cursorPosition);
  const textAfterCursor = input.slice(cursorPosition);

  return (
    <div className="ti83-display">
      {/* Indicateurs de statut */}
      <div className="status-bar">
        {secondActive && <span className="indicator second-indicator">2ND</span>}
        {alphaActive && <span className="indicator alpha-indicator">ALPHA</span>}
        {graphMode && graphMode !== 'FUNC' && <span className="indicator graph-mode-indicator">{graphMode}</span>}
        {mode !== 'NORMAL' && <span className="mode-indicator">{mode}</span>}
      </div>

      {/* Zone d'historique */}
      <div className="history-area">
        {history.slice(-3).map((entry, index) => (
          <div
            key={index}
            className="history-entry"
            onClick={() => handleHistoryEntryClick(entry)}
            title="Cliquer pour réutiliser"
          >
            <span className="history-text">{entry}</span>
            <button
              className="copy-button"
              onClick={(e) => handleCopyResult(entry, index, e)}
              title="Copier le résultat"
              aria-label="Copier"
            >
              {copiedIndex === index ? '✓' : '📋'}
            </button>
          </div>
        ))}
      </div>

      {/* Ligne d'entrée actuelle */}
      <div className="input-line">
        <span className="input-text">{textBeforeCursor}</span>
        <span className="cursor">█</span>
        <span className="input-text">{textAfterCursor}</span>
      </div>
    </div>
  );
};
