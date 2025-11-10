/**
 * Éditeur de programmes TI-BASIC
 * Compatible TI-83 Plus
 */

import React, { useState, useEffect } from 'react';
import { useProgramStore } from '../../store/programStore';
import './ProgramEditor.css';

interface ProgramEditorProps {
  onClose?: () => void;
}

export const ProgramEditor: React.FC<ProgramEditorProps> = ({ onClose }) => {
  const {
    programs,
    currentProgram,
    saveProgram,
  } = useProgramStore();

  const [lines, setLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [editingLine, setEditingLine] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Charger les lignes du programme courant
  useEffect(() => {
    if (currentProgram && programs[currentProgram]) {
      const programLines = programs[currentProgram].lines;
      setLines(programLines);
      // Ne réinitialiser currentLineIndex que si on change de programme
      // ou si l'index actuel dépasse la longueur du programme
      setCurrentLineIndex((prev) => {
        if (prev > programLines.length) {
          return programLines.length;
        }
        return prev;
      });
    } else {
      setLines([]);
      setCurrentLineIndex(0);
      setIsEditing(false);
    }
  }, [currentProgram, programs]);

  // Sauvegarder les modifications
  const handleSave = () => {
    if (currentProgram) {
      saveProgram(currentProgram, lines);
    }
  };

  // Ajouter une nouvelle ligne
  const handleAddLine = () => {
    setCurrentLineIndex(lines.length); // Positionner à la fin pour ajouter
    setIsEditing(true);
    setEditingLine('');
  };

  // Valider la ligne en cours d'édition
  const handleConfirmLine = () => {
    if (isEditing) {
      const newLines = [...lines];
      if (currentLineIndex < lines.length) {
        // Modifier une ligne existante
        newLines[currentLineIndex] = editingLine;
      } else {
        // Ajouter une nouvelle ligne
        newLines.push(editingLine);
      }
      setLines(newLines);
      setCurrentLineIndex(newLines.length);
      setIsEditing(false);
      setEditingLine('');

      // Sauvegarder automatiquement
      if (currentProgram) {
        saveProgram(currentProgram, newLines);
      }
    }
  };

  // Éditer une ligne existante
  const handleEditLine = (index: number) => {
    setCurrentLineIndex(index);
    setEditingLine(lines[index]);
    setIsEditing(true);
  };

  // Supprimer une ligne
  const handleDeleteLine = (index: number) => {
    const newLines = lines.filter((_, i) => i !== index);
    setLines(newLines);
    setCurrentLineIndex(Math.min(currentLineIndex, newLines.length - 1));

    // Sauvegarder automatiquement
    if (currentProgram) {
      saveProgram(currentProgram, newLines);
    }
  };

  // Annuler l'édition
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingLine('');
  };

  if (!currentProgram) {
    return (
      <div className="program-editor">
        <div className="editor-message">
          Aucun programme sélectionné.<br />
          Utilisez le menu PRGM pour créer ou ouvrir un programme.
        </div>
      </div>
    );
  }

  return (
    <div className="program-editor">
      <div className="editor-header">
        <div className="program-name">PROGRAM: {currentProgram}</div>
        <div className="editor-controls">
          <button onClick={handleAddLine} className="btn-add">
            Nouvelle ligne
          </button>
          <button onClick={handleSave} className="btn-save">
            Sauvegarder
          </button>
          {onClose && (
            <button onClick={onClose} className="btn-close">
              Quitter
            </button>
          )}
        </div>
      </div>

      <div className="editor-content">
        {lines.map((line, index) => (
          <div
            key={index}
            className={`editor-line ${currentLineIndex === index ? 'active' : ''}`}
          >
            <span className="line-number">{index + 1}:</span>
            <span className="line-content">{line}</span>
            <div className="line-actions">
              <button
                onClick={() => handleEditLine(index)}
                className="btn-icon"
                title="Éditer"
              >
                ✎
              </button>
              <button
                onClick={() => handleDeleteLine(index)}
                className="btn-icon btn-delete"
                title="Supprimer"
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        {isEditing && (
          <div className="editor-line editing">
            <span className="line-number">{currentLineIndex + 1}:</span>
            <input
              type="text"
              value={editingLine}
              onChange={(e) => setEditingLine(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleConfirmLine();
                } else if (e.key === 'Escape') {
                  handleCancelEdit();
                }
              }}
              className="line-input"
              autoFocus
              placeholder="Entrez une commande TI-BASIC..."
            />
            <div className="line-actions">
              <button onClick={handleConfirmLine} className="btn-icon btn-confirm">
                ✓
              </button>
              <button onClick={handleCancelEdit} className="btn-icon btn-cancel">
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="editor-footer">
        <div className="editor-help">
          <strong>Raccourcis:</strong> Enter = Valider | Esc = Annuler
        </div>
        <div className="editor-stats">
          {lines.length} ligne{lines.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};
