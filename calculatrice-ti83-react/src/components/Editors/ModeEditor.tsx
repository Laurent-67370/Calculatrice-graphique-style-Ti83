/**
 * Éditeur de MODE - Configuration de la calculatrice
 */

import { useState, useEffect, useMemo, useImperativeHandle, forwardRef } from 'react';

interface ModeEditorProps {
  angleMode: 'DEGREE' | 'RADIAN';
  floatMode: 'FLOAT' | 'FIXED';
  fixedDecimals: number;
  onSave: (config: ModeConfig) => void;
  onClose: () => void;
}

export interface ModeConfig {
  angleMode: 'DEGREE' | 'RADIAN';
  floatMode: 'FLOAT' | 'FIXED';
  fixedDecimals: number;
}

export interface ModeEditorHandle {
  navigate: (direction: 'up' | 'down') => void;
  toggle: () => void;
}

export const ModeEditor = forwardRef<ModeEditorHandle, ModeEditorProps>(({
  angleMode,
  floatMode,
  fixedDecimals,
  onSave,
  onClose,
}, ref) => {
  const [localAngleMode, setLocalAngleMode] = useState<'DEGREE' | 'RADIAN'>(angleMode);
  const [localFloatMode, setLocalFloatMode] = useState<'FLOAT' | 'FIXED'>(floatMode);
  const [localFixedDecimals] = useState(fixedDecimals);
  const [selectedOption, setSelectedOption] = useState(0);

  const options = useMemo(() => [
    {
      name: 'Angle',
      choices: ['RADIAN', 'DEGREE'],
      current: localAngleMode,
      setter: (value: string) => setLocalAngleMode(value as 'DEGREE' | 'RADIAN'),
    },
    {
      name: 'Float',
      choices: ['FLOAT', 'FIXED'],
      current: localFloatMode,
      setter: (value: string) => setLocalFloatMode(value as 'FLOAT' | 'FIXED'),
    },
  ], [localAngleMode, localFloatMode]);

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
  }), [selectedOption, options]);

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
            angleMode: localAngleMode,
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
  }, [selectedOption, localAngleMode, localFloatMode, localFixedDecimals, options, onSave, onClose]);

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
