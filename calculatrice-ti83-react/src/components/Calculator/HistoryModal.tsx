/**
 * Modal pour afficher l'historique complet des calculs
 */

import React, { useState } from 'react';
import './HistoryModal.css';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: string[];
  onUseEntry: (text: string) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onUseEntry,
  onClearHistory,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedType, setCopiedType] = useState<'expr' | 'result' | null>(null);

  if (!isOpen) return null;

  // Parser une entrée d'historique
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

  // Copier dans le presse-papier
  const handleCopy = async (text: string, index: number, type: 'expr' | 'result') => {
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

  // Utiliser une valeur et fermer le modal
  const handleUse = (text: string) => {
    onUseEntry(text);
    onClose();
  };

  // Confirmer et effacer l'historique
  const handleClearHistory = () => {
    if (window.confirm(`Effacer tout l'historique (${history.length} entrées) ?`)) {
      onClearHistory();
      onClose();
    }
  };

  return (
    <div className="history-modal-overlay" onClick={onClose}>
      <div className="history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="history-modal-header">
          <h2>📜 Historique des calculs</h2>
          <button className="modal-close-btn" onClick={onClose} title="Fermer">
            ✕
          </button>
        </div>

        <div className="history-modal-content">
          {history.length === 0 ? (
            <div className="history-empty">
              <p>Aucun calcul dans l'historique</p>
              <p className="history-empty-hint">Les résultats de vos calculs apparaîtront ici</p>
            </div>
          ) : (
            <>
              <div className="history-count">
                {history.length} entrée{history.length > 1 ? 's' : ''}
              </div>

              <div className="history-list">
                {history.map((entry, index) => {
                  const { expression, result } = parseHistoryEntry(entry);

                  return (
                    <div key={index} className="history-modal-entry">
                      <div className="history-modal-number">#{index + 1}</div>

                      <div className="history-modal-content-wrapper">
                        {/* Expression */}
                        <div className="history-modal-row">
                          <span className="history-modal-expression">{expression}</span>
                          <div className="history-modal-actions">
                            <button
                              className="action-button use-expr-btn"
                              onClick={() => handleUse(expression)}
                              title="Utiliser l'expression"
                            >
                              ↺
                            </button>
                            <button
                              className="action-button copy-btn"
                              onClick={() => handleCopy(expression, index, 'expr')}
                              title="Copier l'expression"
                            >
                              {copiedIndex === index && copiedType === 'expr' ? '✓' : '📋'}
                            </button>
                          </div>
                        </div>

                        {/* Résultat */}
                        {result && (
                          <div className="history-modal-row result-row">
                            <span className="history-modal-result">= {result}</span>
                            <div className="history-modal-actions">
                              <button
                                className="action-button use-result-btn"
                                onClick={() => handleUse(result)}
                                title="Utiliser le résultat"
                              >
                                ↓
                              </button>
                              <button
                                className="action-button copy-btn"
                                onClick={() => handleCopy(result, index, 'result')}
                                title="Copier le résultat"
                              >
                                {copiedIndex === index && copiedType === 'result' ? '✓' : '📋'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="history-modal-footer">
          <button
            className="history-clear-btn"
            onClick={handleClearHistory}
            disabled={history.length === 0}
          >
            🗑️ Effacer l'historique
          </button>
          <button className="history-close-btn" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
