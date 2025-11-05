/**
 * Éditeur de listes pour STAT
 */

import React, { useState, useEffect } from 'react';
import { statisticsService } from '../../services/StatisticsService';

interface ListEditorProps {
  onClose: () => void;
}

export const ListEditor: React.FC<ListEditorProps> = ({ onClose }) => {
  const [currentList, setCurrentList] = useState<'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6'>('L1');
  const [values, setValues] = useState<number[]>([]);
  const [selectedRow, setSelectedRow] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState('');

  // Charger les valeurs de la liste actuelle
  useEffect(() => {
    const listValues = statisticsService.getList(currentList);
    setValues(listValues.length > 0 ? listValues : [0, 0, 0, 0, 0]); // Au moins 5 lignes vides
  }, [currentList]);

  const handleNavigate = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (direction === 'up' && selectedRow > 0) {
      setSelectedRow(selectedRow - 1);
    } else if (direction === 'down' && selectedRow < values.length - 1) {
      setSelectedRow(selectedRow + 1);
    } else if (direction === 'left') {
      // Changer de liste vers la gauche
      const lists: ('L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6')[] = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'];
      const currentIndex = lists.indexOf(currentList);
      if (currentIndex > 0) {
        setCurrentList(lists[currentIndex - 1]);
        setSelectedRow(0);
      }
    } else if (direction === 'right') {
      // Changer de liste vers la droite
      const lists: ('L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6')[] = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'];
      const currentIndex = lists.indexOf(currentList);
      if (currentIndex < lists.length - 1) {
        setCurrentList(lists[currentIndex + 1]);
        setSelectedRow(0);
      }
    }
  };

  const handleEdit = () => {
    if (!editMode) {
      setEditValue(values[selectedRow]?.toString() || '0');
      setEditMode(true);
    }
  };

  const handleSave = () => {
    if (editMode) {
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

  const handleClearList = () => {
    statisticsService.clearList(currentList);
    setValues([0, 0, 0, 0, 0]);
    setSelectedRow(0);
  };

  // Supprimer warnings
  console.log({ onClose, handleNavigate, handleEdit, handleSave, handleInput, handleDelete, handleClearList });

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
          <span>ENTER: Sauver | DEL: Effacer</span>
        ) : (
          <span>↑↓: Naviguer | ←→: Changer liste | ENTER: Éditer | CLEAR: Fermer</span>
        )}
      </div>
    </div>
  );
};
