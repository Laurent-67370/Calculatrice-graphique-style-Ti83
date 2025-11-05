/**
 * Éditeur WINDOW pour TI-83 Plus
 * Permet de modifier les paramètres de la fenêtre graphique
 */

import React, { useState } from 'react';
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

  const handleNavigate = (direction: 'up' | 'down') => {
    if (!editMode) {
      setCurrentField((prev) =>
        direction === 'down'
          ? (prev + 1) % fields.length
          : (prev - 1 + fields.length) % fields.length
      );
    }
  };

  const handleEdit = () => {
    if (!editMode) {
      const field = fields[currentField];
      setEditValue(localSettings[field.key].toString());
      setEditMode(true);
    }
  };

  const handleSaveField = () => {
    if (editMode) {
      const field = fields[currentField];
      const value = parseFloat(editValue);
      if (!isNaN(value)) {
        setLocalSettings((prev) => ({ ...prev, [field.key]: value }));
      }
      setEditMode(false);
      setEditValue('');
    }
  };

  const handleSaveAll = () => {
    onSave(localSettings);
    onClose();
  };

  const handleInput = (char: string) => {
    if (editMode) {
      setEditValue((prev) => prev + char);
    }
  };

  const handleDelete = () => {
    if (editMode && editValue.length > 0) {
      setEditValue((prev) => prev.slice(0, -1));
    }
  };

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
          <span>ENTER: Valider | DEL: Effacer</span>
        ) : (
          <span>↑↓: Naviguer | ENTER: Modifier | GRAPH: Sauver</span>
        )}
      </div>
    </div>
  );
};
