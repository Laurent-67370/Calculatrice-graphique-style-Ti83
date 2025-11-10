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
  onShowFullHistory?: () => void;
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
  onShowFullHistory,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedType, setCopiedType] = useState<'expr' | 'result' | null>(null);

  // Parser une entrée d'historique pour extraire expression et résultat
  const parseHistoryEntry = (entry: string) => {
    if (entry.includes('=')) {
      const parts = entry.split('=');
      return {
        expression: parts[0].trim(),
        result: parts.slice(1).join('=').trim(),
      };
    }
    return {
      expression: entry,
      result: '',
    };
  };

  // Fonction pour copier dans le presse-papier
  const handleCopy = async (text: string, index: number, type: 'expr' | 'result', e: React.MouseEvent) => {
    e.stopPropagation();

    if (text) {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setCopiedType(type);
        setTimeout(() => {
          setCopiedIndex(null);
          setCopiedType(null);
        }, 1500);
      } catch (err) {
        console.error('Erreur copie:', err);
      }
    }
  };

  // Fonction pour reprendre l'expression
  const handleUseExpression = (entry: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onHistoryClick) {
      const { expression } = parseHistoryEntry(entry);
      if (expression) {
        onHistoryClick(expression);
      }
    }
  };

  // Fonction pour reprendre le résultat
  const handleUseResult = (entry: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onHistoryClick) {
      const { result } = parseHistoryEntry(entry);
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
        {history.slice(-3).map((entry, index) => {
          const { expression, result } = parseHistoryEntry(entry);
          // Calculer l'index global en tenant compte du fait que slice(-3) peut retourner moins de 3 éléments
          const startIndex = Math.max(0, history.length - 3);
          const globalIndex = startIndex + index;

          return (
            <div key={index} className="history-entry">
              {/* Expression */}
              <div className="history-row">
                <span className="history-expression" title="Expression">{expression}</span>
                <div className="history-actions">
                  <button
                    className="action-button use-expr-btn"
                    onClick={(e) => handleUseExpression(entry, e)}
                    title="Reprendre l'expression"
                    aria-label="Reprendre expression"
                  >
                    ↺
                  </button>
                  <button
                    className="action-button copy-btn"
                    onClick={(e) => handleCopy(expression, globalIndex, 'expr', e)}
                    title="Copier l'expression"
                    aria-label="Copier expression"
                  >
                    {copiedIndex === globalIndex && copiedType === 'expr' ? '✓' : '📋'}
                  </button>
                </div>
              </div>

              {/* Résultat */}
              {result && (
                <div className="history-row result-row">
                  <span className="history-result" title="Résultat">= {result}</span>
                  <div className="history-actions">
                    <button
                      className="action-button use-result-btn"
                      onClick={(e) => handleUseResult(entry, e)}
                      title="Reprendre le résultat"
                      aria-label="Reprendre résultat"
                    >
                      ↓
                    </button>
                    <button
                      className="action-button copy-btn"
                      onClick={(e) => handleCopy(result, globalIndex, 'result', e)}
                      title="Copier le résultat"
                      aria-label="Copier résultat"
                    >
                      {copiedIndex === globalIndex && copiedType === 'result' ? '✓' : '📋'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Bouton pour voir tout l'historique */}
        {history.length > 3 && onShowFullHistory && (
          <button
            className="show-full-history-btn"
            onClick={onShowFullHistory}
            title={`Voir les ${history.length} entrées`}
          >
            📜 Voir tout l'historique ({history.length})
          </button>
        )}
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
