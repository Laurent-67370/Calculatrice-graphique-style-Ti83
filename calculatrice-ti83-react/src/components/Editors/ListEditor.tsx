/**
 * Éditeur de listes pour STAT
 */

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { statisticsService } from '../../services/StatisticsService';

interface ListEditorProps {
  onClose: () => void;
}

export interface ListEditorHandle {
  navigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
  handleEnter: () => void;
  handleInput: (char: string) => void;
  handleDelete: () => void;
  clearList: () => void;
}

export const ListEditor = forwardRef<ListEditorHandle, ListEditorProps>(({ onClose }, ref) => {
  const [currentList, setCurrentList] = useState<'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6'>('L1');
  const [values, setValues] = useState<number[]>([]);
  const [selectedRow, setSelectedRow] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState('');

  const lists: ('L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6')[] = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'];

  // Exposer les méthodes au parent via ref
  useImperativeHandle(ref, () => ({
    navigate: (direction: 'up' | 'down' | 'left' | 'right') => {
      if (!editMode) {
        switch (direction) {
          case 'up':
            if (selectedRow > 0) {
              setSelectedRow(selectedRow - 1);
            }
            break;
          case 'down':
            if (selectedRow < values.length - 1) {
              setSelectedRow(selectedRow + 1);
            }
            break;
          case 'left':
            // Changer de liste vers la gauche
            const currentIndexLeft = lists.indexOf(currentList);
            if (currentIndexLeft > 0) {
              setCurrentList(lists[currentIndexLeft - 1]);
              setSelectedRow(0);
            }
            break;
          case 'right':
            // Changer de liste vers la droite
            const currentIndexRight = lists.indexOf(currentList);
            if (currentIndexRight < lists.length - 1) {
              setCurrentList(lists[currentIndexRight + 1]);
              setSelectedRow(0);
            }
            break;
        }
      }
    },
    handleEnter: () => {
      if (!editMode) {
        // Commencer l'édition
        setEditValue(values[selectedRow]?.toString() || '0');
        setEditMode(true);
      } else {
        // Sauvegarder la valeur
        const newValue = parseFloat(editValue);
        if (!isNaN(newValue)) {
          const newValues = [...values];
          newValues[selectedRow] = newValue;
          setValues(newValues);
          statisticsService.setList(currentList, newValues.filter(v => v !== 0 || selectedRow < newValues.length - 1));
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
    clearList: () => {
      if (!editMode) {
        statisticsService.clearList(currentList);
        setValues([0, 0, 0, 0, 0]);
        setSelectedRow(0);
      }
    },
  }), [editMode, selectedRow, values, currentList, editValue, lists]);

  // Charger les valeurs de la liste actuelle
  useEffect(() => {
    const listValues = statisticsService.getList(currentList);
    setValues(listValues.length > 0 ? listValues : [0, 0, 0, 0, 0]); // Au moins 5 lignes vides
  }, [currentList]);

  // Gérer les touches du clavier physique (événements natifs du navigateur uniquement)
  // Note: Les touches du clavier virtuel TI-83 sont gérées par Calculator.tsx via ref
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editMode) {
        // Mode navigation
        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            if (selectedRow > 0) {
              setSelectedRow(selectedRow - 1);
            }
            break;
          case 'ArrowDown':
            e.preventDefault();
            if (selectedRow < values.length - 1) {
              setSelectedRow(selectedRow + 1);
            }
            break;
          case 'ArrowLeft':
            e.preventDefault();
            // Changer de liste vers la gauche
            const currentIndexLeft = lists.indexOf(currentList);
            if (currentIndexLeft > 0) {
              setCurrentList(lists[currentIndexLeft - 1]);
              setSelectedRow(0);
            }
            break;
          case 'ArrowRight':
            e.preventDefault();
            // Changer de liste vers la droite
            const currentIndexRight = lists.indexOf(currentList);
            if (currentIndexRight < lists.length - 1) {
              setCurrentList(lists[currentIndexRight + 1]);
              setSelectedRow(0);
            }
            break;
          case 'Enter':
            e.preventDefault();
            // Commencer l'édition
            setEditValue(values[selectedRow]?.toString() || '0');
            setEditMode(true);
            break;
          case 'Escape':
            e.preventDefault();
            onClose();
            break;
          case 'c': // Clear list
            e.preventDefault();
            statisticsService.clearList(currentList);
            setValues([0, 0, 0, 0, 0]);
            setSelectedRow(0);
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
            const newValue = parseFloat(editValue);
            if (!isNaN(newValue)) {
              const newValues = [...values];
              newValues[selectedRow] = newValue;
              setValues(newValues);
              statisticsService.setList(currentList, newValues.filter(v => v !== 0 || selectedRow < newValues.length - 1));
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
  }, [editMode, selectedRow, values, currentList, editValue, onClose, lists]);

  return (
    <div className="list-editor">
      <div className="editor-header">
        <span>{currentList}</span>
        <span className="list-tabs">
          {['L1', 'L2', 'L3', 'L4', 'L5', 'L6'].map((list) => (
            <span
              key={list}
              className={list === currentList ? 'active' : ''}
              style={{ margin: '0 4px', cursor: 'pointer' }}
            >
              {list}
            </span>
          ))}
        </span>
      </div>

      <div className="list-values">
        {values.map((value, index) => (
          <div
            key={index}
            className={`list-row ${index === selectedRow ? 'selected' : ''} ${
              index === selectedRow && editMode ? 'editing' : ''
            }`}
          >
            <span className="row-number">{index + 1}:</span>
            <span className="row-value">
              {index === selectedRow && editMode ? editValue + '█' : value}
            </span>
          </div>
        ))}
      </div>

      <div className="editor-footer">
        {editMode ? (
          <span>ENTER: Sauver | DEL: Effacer | ESC: Annuler</span>
        ) : (
          <span>↑↓: Naviguer | ←→: Changer liste | ENTER: Éditer | C: Clear | ESC: Fermer</span>
        )}
      </div>
    </div>
  );
});

ListEditor.displayName = 'ListEditor';
