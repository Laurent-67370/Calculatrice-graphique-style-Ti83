/**
 * Modal d'affichage des erreurs améliorées
 */

import React from 'react';
import type { ErrorInfo } from '../../utils/errorMessages';

interface ErrorModalProps {
  error: ErrorInfo | null;
  onClose: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className="error-modal-overlay" onClick={onClose}>
      <div className="error-modal" onClick={(e) => e.stopPropagation()}>
        <div className="error-modal-header">
          <h3>{error.title}</h3>
          <button className="error-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="error-modal-body">
          <p className="error-explanation">{error.explanation}</p>

          {error.suggestions.length > 0 && (
            <div className="error-suggestions">
              <h4>💡 Suggestions:</h4>
              <ul>
                {error.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          {error.example && (
            <div className="error-example">
              <h4>📚 Exemple:</h4>
              <pre>{error.example}</pre>
            </div>
          )}
        </div>

        <div className="error-modal-footer">
          <button className="error-modal-button" onClick={onClose}>
            Fermer
          </button>
          <button
            className="error-modal-button help-button"
            onClick={() => {
              onClose();
              // Ouvrir l'aide (sera géré par le parent)
              const helpButton = document.querySelector('.calculator-help-button') as HTMLButtonElement;
              helpButton?.click();
            }}
          >
            Ouvrir l'aide (F1)
          </button>
        </div>
      </div>
    </div>
  );
};
