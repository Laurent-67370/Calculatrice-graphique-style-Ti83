/**
 * Éditeur WINDOW pour TI-83 Plus
 * Permet de modifier les paramètres de la fenêtre graphique
 */

import React, { useState, useEffect } from 'react';
import type { WindowSettings } from '../../types';

interface WindowEditorProps {
  settings: WindowSettings;
  onSave: (settings: WindowSettings) => void;
  onClose: () => void;
}

export const WindowEditor: React.FC<WindowEditorProps> = ({
  settings,
  onSave,
  onClose
}) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [currentField, setCurrentField] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState('');

  const fields = [
    { name: 'Xmin', key: 'xMin' as keyof WindowSettings },
    { name: 'Xmax', key: 'xMax' as keyof WindowSettings },
    { name: 'Xscl', key: 'xScale' as keyof WindowSettings },
    { name: 'Ymin', key: 'yMin' as keyof WindowSettings },
    { name: 'Ymax', key: 'yMax' as keyof WindowSettings },
    { name: 'Yscl', key: 'yScale' as keyof WindowSettings },
  ];

  // Gérer les touches du clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editMode) {
        // Mode navigation
        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            setCurrentField((prev) => (prev - 1 + fields.length) % fields.length);
            break;
          case 'ArrowDown':
            e.preventDefault();
            setCurrentField((prev) => (prev + 1) % fields.length);
            break;
          case 'Enter':
            e.preventDefault();
            // Commencer l'édition
            const field = fields[currentField];
            setEditValue(localSettings[field.key].toString());
            setEditMode(true);
            break;
          case 'g': // GRAPH key pour sauvegarder
          case 's': // Ou 's' pour save
            e.preventDefault();
            onSave(localSettings);
            onClose();
            break;
          case 'Escape':
            e.preventDefault();
            onClose();
            break;
          default:
            break;
        }
      } else {
        // Mode édition
        switch (e.key) {
          case 'Enter':
            e.preventDefault();
            // Sauvegarder la valeur
            const field = fields[currentField];
            const value = parseFloat(editValue);
            if (!isNaN(value)) {
              setLocalSettings((prev) => ({ ...prev, [field.key]: value }));
            }
            setEditMode(false);
            setEditValue('');
            break;
          case 'Backspace':
          case 'Delete':
            e.preventDefault();
            if (editValue.length > 0) {
              setEditValue((prev) => prev.slice(0, -1));
            }
            break;
          case 'Escape':
            e.preventDefault();
            setEditMode(false);
            setEditValue('');
            break;
          default:
            // Accepter les chiffres, point décimal, et signe moins
            if (e.key.match(/^[0-9.\-]$/)) {
              e.preventDefault();
              setEditValue((prev) => prev + e.key);
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editMode, currentField, editValue, localSettings, fields, onSave, onClose]);

  return (
    <div className="window-editor">
      <div className="editor-header">WINDOW</div>

      <div className="editor-fields">
        {fields.map((field, index) => (
          <div
            key={field.key}
            className={`editor-field ${index === currentField ? 'selected' : ''} ${
              index === currentField && editMode ? 'editing' : ''
            }`}
          >
            <span className="field-name">{field.name}=</span>
            <span className="field-value">
              {index === currentField && editMode
                ? editValue + '█'
                : localSettings[field.key]}
            </span>
          </div>
        ))}
      </div>

      <div className="editor-footer">
        {editMode ? (
          <span>ENTER: Valider | DEL: Effacer | ESC: Annuler</span>
        ) : (
          <span>↑↓: Naviguer | ENTER: Modifier | G/S: Sauver | ESC: Fermer</span>
        )}
      </div>
    </div>
  );
};
