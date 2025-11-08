/**
 * Éditeur TBLSET pour TI-83 Plus
 * Permet de configurer les paramètres de la table (TblStart, ΔTbl, Indpnt, Depend)
 */

import { useState, useEffect, useMemo, useImperativeHandle, forwardRef } from 'react';
import type { TableSettings } from '../../store/calculatorStore';

interface TableSetEditorProps {
  settings: TableSettings;
  onSave: (settings: TableSettings) => void;
  onClose: () => void;
}

export interface TableSetEditorHandle {
  navigate: (direction: 'up' | 'down') => void;
  handleEnter: () => void;
  handleInput: (char: string) => void;
  handleDelete: () => void;
  save: () => void;
}

export const TableSetEditor = forwardRef<TableSetEditorHandle, TableSetEditorProps>(({
  settings,
  onSave,
  onClose
}, ref) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [currentField, setCurrentField] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState('');

  // Définir les champs
  const fields = useMemo(() => [
    { name: 'TblStart', key: 'tblStart' as keyof TableSettings, type: 'number' },
    { name: 'ΔTbl', key: 'deltaTbl' as keyof TableSettings, type: 'number' },
    { name: 'Indpnt', key: 'indpnt' as keyof TableSettings, type: 'select', options: ['AUTO', 'ASK'] },
    { name: 'Depend', key: 'depend' as keyof TableSettings, type: 'select', options: ['AUTO', 'ASK'] },
  ], []);

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
      const field = fields[currentField];

      if (!editMode) {
        // Entrer en mode édition
        if (field.type === 'number') {
          setEditValue(localSettings[field.key].toString());
          setEditMode(true);
        } else if (field.type === 'select') {
          // Basculer entre les options
          const currentValue = localSettings[field.key] as string;
          const options = field.options!;
          const currentIndex = options.indexOf(currentValue);
          const nextIndex = (currentIndex + 1) % options.length;
          setLocalSettings((prev) => ({ ...prev, [field.key]: options[nextIndex] }));
        }
      } else {
        // Sauvegarder la valeur
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
            const field = fields[currentField];
            if (field.type === 'number') {
              setEditValue(localSettings[field.key].toString());
              setEditMode(true);
            } else if (field.type === 'select') {
              const currentValue = localSettings[field.key] as string;
              const options = field.options!;
              const currentIndex = options.indexOf(currentValue);
              const nextIndex = (currentIndex + 1) % options.length;
              setLocalSettings((prev) => ({ ...prev, [field.key]: options[nextIndex] }));
            }
            break;
          case 'Escape':
            e.preventDefault();
            onClose();
            break;
        }
      } else {
        // Mode édition
        if (e.key === 'Enter') {
          e.preventDefault();
          const field = fields[currentField];
          const value = parseFloat(editValue);
          if (!isNaN(value)) {
            setLocalSettings((prev) => ({ ...prev, [field.key]: value }));
          }
          setEditMode(false);
          setEditValue('');
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setEditMode(false);
          setEditValue('');
        } else if (e.key === 'Backspace') {
          e.preventDefault();
          setEditValue((prev) => prev.slice(0, -1));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editMode, currentField, editValue, localSettings, fields, onClose]);

  return (
    <div className="editor-container">
      <div className="editor-title">TABLE SETUP</div>
      <div className="editor-content">
        {fields.map((field, index) => {
          const value = localSettings[field.key];
          const isSelected = index === currentField;
          const isEditing = isSelected && editMode && field.type === 'number';

          return (
            <div
              key={field.key}
              className={`editor-row ${isSelected ? 'selected' : ''}`}
            >
              <span className="editor-label">{field.name}=</span>
              <span className="editor-value">
                {isEditing ? (
                  <>{editValue}<span className="cursor">█</span></>
                ) : (
                  value
                )}
              </span>
            </div>
          );
        })}
      </div>
      <div className="editor-footer">
        <div className="editor-help">
          {!editMode ? '↑↓: Navigate • ENTER: Edit/Toggle • ESC: Close' : 'ENTER: Save • ESC: Cancel'}
        </div>
      </div>
    </div>
  );
});

TableSetEditor.displayName = 'TableSetEditor';
