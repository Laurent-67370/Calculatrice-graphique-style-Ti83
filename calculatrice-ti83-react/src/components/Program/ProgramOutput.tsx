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
  } = useProgramStore();

  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas quand de nouvelles lignes sont ajoutées
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [executionContext?.output]);

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

  return (
    <div className="program-output">
      <div className="output-header">
        <div className="output-title">
          PROGRAMME: {executionContext.programName}
          {executionContext.isPaused && ' [PAUSE]'}
          {executionContext.error && ' [ERREUR]'}
        </div>
        <div className="output-controls">
          {executionContext.isPaused && (
            <button onClick={handleContinue} className="btn-continue">
              Continuer
            </button>
          )}
          <button onClick={handleStop} className="btn-stop">
            Arrêter
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

        {/* Affichage de l'erreur */}
        {executionContext.error && executionContext.error !== 'STOP' && (
          <div className="output-error">
            {executionContext.error}
          </div>
        )}

        {/* Message de pause */}
        {executionContext.isPaused && !executionContext.error && (
          <div className="output-pause">
            Appuyez sur Continuer pour reprendre
          </div>
        )}
      </div>

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
