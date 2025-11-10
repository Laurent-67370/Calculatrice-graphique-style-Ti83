/**
 * Menu PRGM pour gérer les programmes TI-BASIC
 * Compatible TI-83 Plus
 */

import React, { useState, useRef } from 'react';
import { useProgramStore } from '../../store/programStore';
import './ProgramMenu.css';

interface ProgramMenuProps {
  onClose: () => void;
  onEdit?: () => void; // Callback quand l'utilisateur veut éditer
}

type MenuTab = 'NEW' | 'EDIT' | 'EXEC' | 'IO';

export const ProgramMenu: React.FC<ProgramMenuProps> = ({ onClose, onEdit }) => {
  const {
    programs,
    createProgram,
    deleteProgram,
    setCurrentProgram,
    runProgram,
    exportPrograms,
    importPrograms,
  } = useProgramStore();

  const [activeTab, setActiveTab] = useState<MenuTab>('EXEC');
  const [newProgramName, setNewProgramName] = useState<string>('');
  const [showNewInput, setShowNewInput] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Exporter les programmes vers un fichier JSON
  const handleExportPrograms = () => {
    try {
      const jsonData = exportPrograms();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ti83-programs-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('Programmes exportés avec succès!');
    } catch (error) {
      alert('Erreur lors de l\'export');
      console.error(error);
    }
  };

  // Importer des programmes depuis un fichier JSON
  const handleImportPrograms = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const success = importPrograms(content);
        if (success) {
          alert('Programmes importés avec succès!');
        } else {
          alert('Erreur: format de fichier invalide');
        }
      } catch (error) {
        alert('Erreur lors de l\'import');
        console.error(error);
      }
    };
    reader.readAsText(file);

    // Réinitialiser l'input pour permettre de réimporter le même fichier
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
          <button
            className={`tab ${activeTab === 'IO' ? 'active' : ''}`}
            onClick={() => setActiveTab('IO')}
          >
            I/O
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

          {activeTab === 'IO' && (
            <div className="tab-content">
              <div className="tab-header">
                <h3>Import/Export de programmes</h3>
              </div>

              <div className="io-section">
                <div className="io-card">
                  <h4>💾 Exporter</h4>
                  <p>Sauvegardez tous vos programmes dans un fichier JSON</p>
                  <button
                    onClick={handleExportPrograms}
                    className="btn-io btn-export"
                    disabled={programList.length === 0}
                  >
                    📥 Exporter ({programList.length} programme{programList.length !== 1 ? 's' : ''})
                  </button>
                </div>

                <div className="io-card">
                  <h4>📂 Importer</h4>
                  <p>Chargez des programmes depuis un fichier JSON</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".json"
                    onChange={handleImportPrograms}
                    style={{ display: 'none' }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-io btn-import"
                  >
                    📤 Importer depuis un fichier
                  </button>
                </div>
              </div>

              <div className="io-info">
                <p>
                  <strong>💡 Note:</strong> Les programmes sont automatiquement
                  sauvegardés dans le navigateur (localStorage).
                  Utilisez l'export pour créer une copie de sauvegarde.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
