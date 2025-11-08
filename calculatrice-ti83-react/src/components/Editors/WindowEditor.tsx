/**
 * Éditeur WINDOW pour TI-83 Plus
 * Permet de modifier les paramètres de la fenêtre graphique
 */

import { useState, useEffect, useMemo, useImperativeHandle, forwardRef } from 'react';
import type { WindowSettings, GraphMode } from '../../types';

interface WindowEditorProps {
  settings: WindowSettings;
  graphMode: GraphMode;
  onSave: (settings: WindowSettings) => void;
  onClose: () => void;
}

export interface WindowEditorHandle {
  navigate: (direction: 'up' | 'down') => void;
  handleEnter: () => void;
  handleInput: (char: string) => void;
  handleDelete: () => void;
  save: () => void;
}

export const WindowEditor = forwardRef<WindowEditorHandle, WindowEditorProps>(({
  settings,
  graphMode,
  onSave,
  onClose
}, ref) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [currentField, setCurrentField] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState('');

  // Mémoriser les champs selon le mode graphique
  const fields = useMemo(() => {
    const baseFields = [
      { name: 'Xmin', key: 'xMin' as keyof WindowSettings },
      { name: 'Xmax', key: 'xMax' as keyof WindowSettings },
      { name: 'Xscl', key: 'xScale' as keyof WindowSettings },
      { name: 'Ymin', key: 'yMin' as keyof WindowSettings },
      { name: 'Ymax', key: 'yMax' as keyof WindowSettings },
      { name: 'Yscl', key: 'yScale' as keyof WindowSettings },
    ];

    if (graphMode === 'PAR') {
      // Mode paramétrique : ajouter tMin, tMax, tStep
      return [
        ...baseFields,
        { name: 'Tmin', key: 'tMin' as keyof WindowSettings },
        { name: 'Tmax', key: 'tMax' as keyof WindowSettings },
        { name: 'Tstep', key: 'tStep' as keyof WindowSettings },
      ];
    } else if (graphMode === 'POL') {
      // Mode polaire : ajouter θMin, θMax, θStep
      return [
        ...baseFields,
        { name: 'θmin', key: 'θMin' as keyof WindowSettings },
        { name: 'θmax', key: 'θMax' as keyof WindowSettings },
        { name: 'θstep', key: 'θStep' as keyof WindowSettings },
      ];
    } else if (graphMode === 'SEQ') {
      // Mode séquence : ajouter nMin, nMax, etc.
      return [
        ...baseFields,
        { name: 'nMin', key: 'nMin' as keyof WindowSettings },
        { name: 'nMax', key: 'nMax' as keyof WindowSettings },
        { name: 'PlotStart', key: 'plotStart' as keyof WindowSettings },
        { name: 'PlotStep', key: 'plotStep' as keyof WindowSettings },
      ];
    }

    return baseFields;
  }, [graphMode]);

  // Exposer les méthodes au parent via ref
  useImperativeHandle(ref, () => ({
    navigate: (direction: 'up' | 'down') => {
      if (!editMode) {
        if (direction === 'up') {
          setCurrentField((prev) => (prev - 1 + fields.length) % fields.length);
        } else {
          setCurrentField((prev) => (prev + 1) % fields.length);
        }
      }
    },
    handleEnter: () => {
      if (!editMode) {
        const field = fields[currentField];
        setEditValue(localSettings[field.key].toString());
        setEditMode(true);
      } else {
        // Sauvegarder la valeur
        const field = fields[currentField];
        const value = parseFloat(editValue);
        if (!isNaN(value)) {
          setLocalSettings((prev) => ({ ...prev, [field.key]: value }));
        }
        setEditMode(false);
        setEditValue('');
      }
    },
    handleInput: (char: string) => {
      if (editMode) {
        setEditValue((prev) => prev + char);
      }
    },
    handleDelete: () => {
      if (editMode && editValue.length > 0) {
        setEditValue((prev) => prev.slice(0, -1));
      }
    },
    save: () => {
      onSave(localSettings);
    },
  }), [editMode, currentField, editValue, localSettings, fields, onSave]);

  // Gérer les touches du clavier (événements natifs du navigateur uniquement)
  // Note: Les touches du clavier virtuel TI-83 sont gérées par Calculator.tsx
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
});

WindowEditor.displayName = 'WindowEditor';
