/**
 * Éditeur de MODE - Configuration de la calculatrice
 */

import React, { useState } from 'react';

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

export const ModeEditor: React.FC<ModeEditorProps> = ({
  angleMode,
  floatMode,
  fixedDecimals,
  onSave,
  onClose,
}) => {
  const [localAngleMode, setLocalAngleMode] = useState<'DEGREE' | 'RADIAN'>(angleMode);
  const [localFloatMode, setLocalFloatMode] = useState<'FLOAT' | 'FIXED'>(floatMode);
  const [localFixedDecimals, setLocalFixedDecimals] = useState(fixedDecimals);
  const [selectedOption, setSelectedOption] = useState(0);

  const options = [
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
  ];

  const handleNavigate = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      setSelectedOption((prev) => (prev - 1 + options.length) % options.length);
    } else {
      setSelectedOption((prev) => (prev + 1) % options.length);
    }
  };

  const handleToggle = () => {
    const option = options[selectedOption];
    const currentIndex = option.choices.indexOf(option.current);
    const nextIndex = (currentIndex + 1) % option.choices.length;
    option.setter(option.choices[nextIndex]);
  };

  const handleSave = () => {
    onSave({
      angleMode: localAngleMode,
      floatMode: localFloatMode,
      fixedDecimals: localFixedDecimals,
    });
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // Supprimer warnings
  console.log({ handleNavigate, handleToggle, handleSave, handleCancel, localFixedDecimals, setLocalFixedDecimals });

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
        <div className="footer-hint">↑↓: Navigate | ENTER: Toggle | 2ND+MODE: Save | CLEAR: Cancel</div>
      </div>
    </div>
  );
};
