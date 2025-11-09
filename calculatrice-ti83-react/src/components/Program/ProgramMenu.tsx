/**
 * Menu PRGM pour gérer les programmes TI-BASIC
 * Compatible TI-83 Plus
 */

import React, { useState } from 'react';
import { useProgramStore } from '../../store/programStore';
import './ProgramMenu.css';

interface ProgramMenuProps {
  onClose: () => void;
  onEdit?: () => void; // Callback quand l'utilisateur veut éditer
}

type MenuTab = 'NEW' | 'EDIT' | 'EXEC';

export const ProgramMenu: React.FC<ProgramMenuProps> = ({ onClose, onEdit }) => {
  const {
    programs,
    createProgram,
    deleteProgram,
    setCurrentProgram,
    runProgram,
  } = useProgramStore();

  const [activeTab, setActiveTab] = useState<MenuTab>('EXEC');
  const [newProgramName, setNewProgramName] = useState<string>('');
  const [showNewInput, setShowNewInput] = useState<boolean>(false);

  const programList = Object.keys(programs).sort();

  // Créer un nouveau programme
  const handleCreateProgram = () => {
    if (newProgramName.trim()) {
      const validName = newProgramName.trim().slice(0, 8).toUpperCase();
      createProgram(validName);
      setNewProgramName('');
      setShowNewInput(false);
      onClose();
      // Passer en mode édition
      if (onEdit) onEdit();
    }
  };

  // Éditer un programme
  const handleEditProgram = (name: string) => {
    setCurrentProgram(name);
    onClose();
    // Passer en mode édition
    if (onEdit) onEdit();
  };

  // Supprimer un programme
  const handleDeleteProgram = (name: string) => {
    if (window.confirm(`Supprimer le programme ${name} ?`)) {
      deleteProgram(name);
    }
  };

  // Exécuter un programme
  const handleRunProgram = (name: string) => {
    runProgram(name);
    onClose();
  };

  return (
    <div className="program-menu-overlay" onClick={onClose}>
      <div className="program-menu" onClick={(e) => e.stopPropagation()}>
        <div className="menu-header">
          <div className="menu-title">PRGM</div>
          <button onClick={onClose} className="btn-close">✕</button>
        </div>

        <div className="menu-tabs">
          <button
            className={`tab ${activeTab === 'NEW' ? 'active' : ''}`}
            onClick={() => setActiveTab('NEW')}
          >
            NEW
          </button>
          <button
            className={`tab ${activeTab === 'EDIT' ? 'active' : ''}`}
            onClick={() => setActiveTab('EDIT')}
          >
            EDIT
          </button>
          <button
            className={`tab ${activeTab === 'EXEC' ? 'active' : ''}`}
            onClick={() => setActiveTab('EXEC')}
          >
            EXEC
          </button>
        </div>

        <div className="menu-content">
          {activeTab === 'NEW' && (
            <div className="tab-content">
              <div className="tab-header">
                <h3>Créer un nouveau programme</h3>
              </div>

              {!showNewInput ? (
                <button
                  onClick={() => setShowNewInput(true)}
                  className="btn-create"
                >
                  + Nouveau programme
                </button>
              ) : (
                <div className="new-program-form">
                  <label>Nom du programme (max 8 caractères):</label>
                  <input
                    type="text"
                    value={newProgramName}
                    onChange={(e) => setNewProgramName(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCreateProgram();
                      } else if (e.key === 'Escape') {
                        setShowNewInput(false);
                        setNewProgramName('');
                      }
                    }}
                    maxLength={8}
                    placeholder="PROG1"
                    autoFocus
                    className="input-program-name"
                  />
                  <div className="form-actions">
                    <button onClick={handleCreateProgram} className="btn-confirm">
                      Créer
                    </button>
                    <button
                      onClick={() => {
                        setShowNewInput(false);
                        setNewProgramName('');
                      }}
                      className="btn-cancel"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              {programList.length > 0 && (
                <div className="program-list-info">
                  <p>Programmes existants: {programList.length}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'EDIT' && (
            <div className="tab-content">
              <div className="tab-header">
                <h3>Éditer un programme</h3>
              </div>

              {programList.length === 0 ? (
                <div className="empty-message">
                  Aucun programme disponible.<br />
                  Créez-en un dans l'onglet NEW.
                </div>
              ) : (
                <div className="program-list">
                  {programList.map((name) => (
                    <div key={name} className="program-item">
                      <div className="program-info">
                        <span className="program-name">{name}</span>
                        <span className="program-lines">
                          {programs[name].lines.length} ligne{programs[name].lines.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="program-actions">
                        <button
                          onClick={() => handleEditProgram(name)}
                          className="btn-action btn-edit"
                        >
                          Éditer
                        </button>
                        <button
                          onClick={() => handleDeleteProgram(name)}
                          className="btn-action btn-delete"
                        >
                          Suppr.
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'EXEC' && (
            <div className="tab-content">
              <div className="tab-header">
                <h3>Exécuter un programme</h3>
              </div>

              {programList.length === 0 ? (
                <div className="empty-message">
                  Aucun programme disponible.<br />
                  Créez-en un dans l'onglet NEW.
                </div>
              ) : (
                <div className="program-list">
                  {programList.map((name) => (
                    <div key={name} className="program-item">
                      <div className="program-info">
                        <span className="program-name">{name}</span>
                        <span className="program-lines">
                          {programs[name].lines.length} ligne{programs[name].lines.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="program-actions">
                        <button
                          onClick={() => handleRunProgram(name)}
                          className="btn-action btn-run"
                        >
                          Exécuter
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
