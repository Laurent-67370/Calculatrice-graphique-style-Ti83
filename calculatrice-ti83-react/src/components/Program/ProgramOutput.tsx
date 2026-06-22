/**
 * Affichage de sortie pour les programmes TI-BASIC en cours d'exécution
 * Compatible TI-83 Plus
 */

import React, { useEffect, useRef } from 'react';
import { useProgramStore } from '../../store/programStore';
import './ProgramOutput.css';

interface ProgramOutputProps {
  onClose: () => void;
}

export const ProgramOutput: React.FC<ProgramOutputProps> = ({ onClose }) => {
  const {
    executionContext,
    stopProgram,
    resumeProgram,
    provideInput,
    provideMenuSelection,
    updateInputValue,
    programInputValue,
  } = useProgramStore();

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll vers le bas quand de nouvelles lignes sont ajoutées
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [executionContext?.output]);

  // Forcer le focus sur le champ input quand le programme attend une entrée
  useEffect(() => {
    if (executionContext?.isWaitingInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [executionContext?.isWaitingInput]);

  if (!executionContext) {
    return (
      <div className="program-output">
        <div className="output-header">
          <div className="output-title">Programme non démarré</div>
          <button onClick={onClose} className="btn-close-output">
            Fermer
          </button>
        </div>
      </div>
    );
  }

  const handleStop = () => {
    stopProgram();
    onClose();
  };

  const handleContinue = () => {
    resumeProgram();
  };

  const handleSubmitInput = () => {
    const targetVar = executionContext?.inputVariable;
    if (targetVar && /^Str[1-9]$/.test(targetVar)) {
      // Input StrN : saisie d'une chaîne (texte brut)
      provideInput(programInputValue);
    } else {
      const value = parseFloat(programInputValue);
      if (!isNaN(value)) {
        provideInput(value);
      }
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmitInput();
    }
  };

  return (
    <div className="program-output">
      <div className="output-header">
        <div className="output-title">
          PROGRAMME: {executionContext.programName}
          {executionContext.isPaused && ' [PAUSE]'}
          {executionContext.isCompleted && ' [TERMINÉ]'}
          {executionContext.error && ' [ERREUR]'}
        </div>
        <div className="output-controls">
          {executionContext.isPaused && !executionContext.isCompleted && (
            <button onClick={handleContinue} className="btn-continue">
              Continuer
            </button>
          )}
          <button onClick={handleStop} className="btn-stop">
            {executionContext.isCompleted ? 'Fermer' : 'Arrêter'}
          </button>
        </div>
      </div>

      <div className="output-screen" ref={outputRef}>
        {/* Grille de sortie style TI-83 (8 lignes x 16 colonnes) */}
        <div className="output-grid">
          {executionContext.output.map((line, index) => {
            if (line.type === 'text') {
              return (
                <div key={index} className="output-line">
                  {line.content}
                </div>
              );
            } else if (line.type === 'positioned') {
              return (
                <div
                  key={index}
                  className="output-positioned"
                  style={{
                    gridRow: line.row,
                    gridColumn: line.col,
                  }}
                >
                  {line.content}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* Zone interactive (hors zone défilante pour rester toujours visible) */}
      {/* Affichage de l'erreur */}
      {executionContext.error && executionContext.error !== 'STOP' && (
        <div className="output-error">
          {executionContext.error}
        </div>
      )}

      {/* Message de pause */}
      {executionContext.isPaused && !executionContext.error && !executionContext.isWaitingInput && (
        <div className="output-pause">
          Appuyez sur Continuer pour reprendre
        </div>
      )}

      {/* Input utilisateur */}
      {executionContext.isWaitingInput && (
        <div className="output-input">
          <div className="input-prompt">{executionContext.inputPrompt}</div>
          <div className="input-field">
            <input
              ref={inputRef}
              type="text"
              inputMode="none"
              readOnly
              value={programInputValue}
              onChange={(e) => updateInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onClick={() => inputRef.current?.focus()}
              placeholder="Entrez un nombre..."
              className="input-value"
              style={{ fontSize: '16px' }} // Évite le zoom sur iOS
            />
            <button onClick={handleSubmitInput} className="btn-submit-input">
              OK
            </button>
          </div>
        </div>
      )}

      {/* Menu interactif */}
      {executionContext.isWaitingMenu && executionContext.menuOptions && (
        <div className="output-menu">
          <div className="menu-prompt">Sélectionnez une option :</div>
          <div className="menu-options">
            {executionContext.menuOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => provideMenuSelection(index)}
                className="btn-menu-option"
              >
                {index + 1}: {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="output-footer">
        <div className="output-info">
          Ligne {executionContext.currentLine + 1}
          {' • '}
          {Object.keys(executionContext.variables).length} variable(s)
        </div>
      </div>
    </div>
  );
};
