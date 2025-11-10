/**
 * Éditeur de MODE - Configuration de la calculatrice
 */

import { useState, useEffect, useMemo, useImperativeHandle, forwardRef } from 'react';
import type { GraphMode } from '../../types';

interface ModeEditorProps {
  angleMode: 'DEGREE' | 'RADIAN';
  floatMode: 'FLOAT' | 'FIXED';
  fixedDecimals: number;
  graphMode: GraphMode;
  plotMode: 'CONNECTED' | 'DOT';
  sequentialMode: 'SEQUENTIAL' | 'SIMUL';
  onSave: (config: ModeConfig) => void;
  onClose: () => void;
}

export interface ModeConfig {
  angleMode: 'DEGREE' | 'RADIAN';
  floatMode: 'FLOAT' | 'FIXED';
  fixedDecimals: number;
  graphMode: GraphMode;
  plotMode: 'CONNECTED' | 'DOT';
  sequentialMode: 'SEQUENTIAL' | 'SIMUL';
}

export interface ModeEditorHandle {
  navigate: (direction: 'up' | 'down') => void;
  toggle: () => void;
  save: () => void;
}

export const ModeEditor = forwardRef<ModeEditorHandle, ModeEditorProps>(({
  angleMode,
  floatMode,
  fixedDecimals,
  graphMode,
  plotMode,
  sequentialMode,
  onSave,
  onClose,
}, ref) => {
  const [localAngleMode, setLocalAngleMode] = useState<'DEGREE' | 'RADIAN'>(angleMode);
  const [localFloatMode, setLocalFloatMode] = useState<'FLOAT' | 'FIXED'>(floatMode);
  const [localGraphMode, setLocalGraphMode] = useState<GraphMode>(graphMode);
  const [localPlotMode, setLocalPlotMode] = useState<'CONNECTED' | 'DOT'>(plotMode);
  const [localSequentialMode, setLocalSequentialMode] = useState<'SEQUENTIAL' | 'SIMUL'>(sequentialMode);
  const [localFixedDecimals] = useState(fixedDecimals);
  const [selectedOption, setSelectedOption] = useState(0);

  const options = useMemo(() => [
    {
      name: 'Graph',
      choices: ['FUNC', 'PAR', 'POL', 'SEQ'],
      current: localGraphMode,
      setter: (value: string) => setLocalGraphMode(value as GraphMode),
    },
    {
      name: 'Angle',
      choices: ['RADIAN', 'DEGREE'],
      current: localAngleMode,
      setter: (value: string) => setLocalAngleMode(value as 'DEGREE' | 'RADIAN'),
    },
    {
      name: 'Plot',
      choices: ['CONNECTED', 'DOT'],
      current: localPlotMode,
      setter: (value: string) => setLocalPlotMode(value as 'CONNECTED' | 'DOT'),
    },
    {
      name: 'Sequential',
      choices: ['SEQUENTIAL', 'SIMUL'],
      current: localSequentialMode,
      setter: (value: string) => setLocalSequentialMode(value as 'SEQUENTIAL' | 'SIMUL'),
    },
    {
      name: 'Float',
      choices: ['FLOAT', 'FIXED'],
      current: localFloatMode,
      setter: (value: string) => setLocalFloatMode(value as 'FLOAT' | 'FIXED'),
    },
  ], [localGraphMode, localAngleMode, localPlotMode, localSequentialMode, localFloatMode]);

  // Exposer les méthodes au parent via ref
  useImperativeHandle(ref, () => ({
    navigate: (direction: 'up' | 'down') => {
      if (direction === 'up') {
        setSelectedOption((prev) => (prev - 1 + options.length) % options.length);
      } else {
        setSelectedOption((prev) => (prev + 1) % options.length);
      }
    },
    toggle: () => {
      const option = options[selectedOption];
      const currentIndex = option.choices.indexOf(option.current);
      const nextIndex = (currentIndex + 1) % option.choices.length;
      option.setter(option.choices[nextIndex]);
    },
    save: () => {
      onSave({
        graphMode: localGraphMode,
        angleMode: localAngleMode,
        plotMode: localPlotMode,
        sequentialMode: localSequentialMode,
        floatMode: localFloatMode,
        fixedDecimals: localFixedDecimals,
      });
    },
  }), [selectedOption, options, localGraphMode, localAngleMode, localPlotMode, localSequentialMode, localFloatMode, localFixedDecimals, onSave]);

  // Gérer les touches du clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setSelectedOption((prev) => (prev - 1 + options.length) % options.length);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedOption((prev) => (prev + 1) % options.length);
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'Enter':
          e.preventDefault();
          // Toggle l'option sélectionnée
          const option = options[selectedOption];
          const currentIndex = option.choices.indexOf(option.current);
          const nextIndex = (currentIndex + 1) % option.choices.length;
          option.setter(option.choices[nextIndex]);
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'g': // GRAPH key (pour sauvegarder)
        case 's': // Ou 's' pour save
          e.preventDefault();
          onSave({
            graphMode: localGraphMode,
            angleMode: localAngleMode,
            plotMode: localPlotMode,
            sequentialMode: localSequentialMode,
            floatMode: localFloatMode,
            fixedDecimals: localFixedDecimals,
          });
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOption, localGraphMode, localAngleMode, localPlotMode, localSequentialMode, localFloatMode, localFixedDecimals, options, onSave, onClose]);

  return (
    <div className="mode-editor">
      <div className="editor-header">
        <h3>MODE</h3>
      </div>

      <div className="mode-content">
        {options.map((option, index) => (
          <div
            key={option.name}
            className={`mode-row ${index === selectedOption ? 'selected' : ''}`}
          >
            <span className="mode-label">{option.name}:</span>
            <div className="mode-choices">
              {option.choices.map((choice) => (
                <span
                  key={choice}
                  className={`mode-choice ${choice === option.current ? 'active' : ''}`}
                >
                  {choice}
                </span>
              ))}
            </div>
          </div>
        ))}

        {localFloatMode === 'FIXED' && (
          <div className="mode-row">
            <span className="mode-label">Decimals:</span>
            <span className="mode-value">{localFixedDecimals}</span>
          </div>
        )}
      </div>

      <div className="editor-footer">
        <div className="footer-hint">↑↓: Navigate | ENTER: Toggle | G/S: Save | ESC: Cancel</div>
      </div>
    </div>
  );
});

ModeEditor.displayName = 'ModeEditor';
