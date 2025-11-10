/**
 * Menu PRGM pour gérer les programmes TI-BASIC
 * Compatible TI-83 Plus
 */

import React, { useState, useRef } from 'react';
import { useProgramStore } from '../../store/programStore';
import {
  exportProgramAsJSON,
  exportAllProgramsAsJSON,
  exportProgramAs8xp,
  importProgramFromJSON,
  importProgramFrom8xp,
  downloadFile,
  readFile,
  detectFileFormat,
  generateExportFilename,
} from '../../utils/programExportImport';
import type { Program } from '../../utils/programExportImport';
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
    saveProgram,
    setCurrentProgram,
    runProgram,
  } = useProgramStore();

  const [activeTab, setActiveTab] = useState<MenuTab>('EXEC');
  const [newProgramName, setNewProgramName] = useState<string>('');
  const [showNewInput, setShowNewInput] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const programList = Object.keys(programs).sort();

  // Fonction helper pour convertir un programme du store au format d'export
  const convertProgramForExport = (name: string): Program => {
    const prog = programs[name];
    return {
      name: prog.name,
      code: prog.lines.join('\n'),
    };
  };

  // Afficher un toast notification
  const displayToast = (type: 'success' | 'error', message: string) => {
    setShowToast({ type, message });
    setTimeout(() => setShowToast(null), 3000);
  };

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

  // Exporter un programme individuel
  const handleExportSingleProgram = (name: string, format: 'json' | '8xp') => {
    try {
      const program = convertProgramForExport(name);
      const blob = format === 'json'
        ? exportProgramAsJSON(program)
        : exportProgramAs8xp(program);

      const filename = generateExportFilename(name, format);
      downloadFile(blob, filename);
      displayToast('success', `${name} exporté en ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Erreur export:', error);
      displayToast('error', 'Erreur lors de l\'export');
    }
  };

  // Exporter tous les programmes
  const handleExportAllPrograms = () => {
    try {
      if (programList.length === 0) {
        displayToast('error', 'Aucun programme à exporter');
        return;
      }

      const programsToExport = programList.map(name => convertProgramForExport(name));
      const blob = exportAllProgramsAsJSON(programsToExport);
      const filename = `TI83-ALL-PROGRAMS-${new Date().toISOString().split('T')[0]}.json`;
      downloadFile(blob, filename);
      displayToast('success', `${programList.length} programme(s) exporté(s)`);
    } catch (error) {
      console.error('Erreur export:', error);
      displayToast('error', 'Erreur lors de l\'export');
    }
  };

  // Importer des programmes depuis un fichier
  const handleImportPrograms = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const format = detectFileFormat(file.name, '');

      if (format === '8xp') {
        // Import .8xp (binaire)
        const arrayBuffer = await file.arrayBuffer();
        const result = importProgramFrom8xp(arrayBuffer);

        if (result) {
          // Créer le programme dans le store
          createProgram(result.name);
          saveProgram(result.name, result.code.split('\n'));
          displayToast('success', `Programme ${result.name} importé depuis .8xp`);
        } else {
          displayToast('error', 'Format .8xp invalide');
        }
      } else if (format === 'json') {
        // Import JSON
        const content = await readFile(file);
        const result = importProgramFromJSON(content);

        if (!result) {
          displayToast('error', 'Format JSON invalide');
          return;
        }

        // Vérifier si c'est un seul programme ou une collection
        if (Array.isArray(result)) {
          // Collection de programmes
          let imported = 0;
          for (const prog of result) {
            createProgram(prog.name);
            saveProgram(prog.name, prog.code.split('\n'));
            imported++;
          }
          displayToast('success', `${imported} programme(s) importé(s)`);
        } else {
          // Un seul programme
          createProgram(result.name);
          saveProgram(result.name, result.code.split('\n'));
          displayToast('success', `Programme ${result.name} importé`);
        }
      } else {
        displayToast('error', 'Format de fichier non reconnu');
      }
    } catch (error) {
      console.error('Erreur import:', error);
      displayToast('error', 'Erreur lors de l\'import');
    } finally {
      // Réinitialiser l'input pour permettre de réimporter le même fichier
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
                          title="Éditer le programme"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleExportSingleProgram(name, 'json')}
                          className="btn-action btn-export-json"
                          title="Exporter en JSON"
                        >
                          📄
                        </button>
                        <button
                          onClick={() => handleExportSingleProgram(name, '8xp')}
                          className="btn-action btn-export-8xp"
                          title="Exporter en .8xp (TI-83)"
                        >
                          💾
                        </button>
                        <button
                          onClick={() => handleDeleteProgram(name)}
                          className="btn-action btn-delete"
                          title="Supprimer"
                        >
                          🗑️
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
                  <h4>📥 Exporter tous les programmes</h4>
                  <p>Sauvegardez tous vos programmes dans un fichier JSON de collection</p>
                  <button
                    onClick={handleExportAllPrograms}
                    className="btn-io btn-export-all"
                    disabled={programList.length === 0}
                  >
                    💾 Exporter tout ({programList.length} programme{programList.length !== 1 ? 's' : ''})
                  </button>
                  <div className="format-note">
                    Format JSON compatible avec tous les navigateurs
                  </div>
                </div>

                <div className="io-card">
                  <h4>📤 Importer des programmes</h4>
                  <p>Chargez des programmes depuis JSON ou .8xp (TI-83 Plus)</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".json,.8xp"
                    onChange={handleImportPrograms}
                    style={{ display: 'none' }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-io btn-import"
                  >
                    📂 Choisir un fichier
                  </button>
                  <div className="format-note">
                    <strong>Formats supportés:</strong>
                    <ul>
                      <li><strong>.json</strong> - Un ou plusieurs programmes</li>
                      <li><strong>.8xp</strong> - Programme TI-83 Plus natif</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="io-info">
                <p>
                  <strong>💡 Export individuel:</strong> Utilisez les boutons 📄 (JSON) et 💾 (.8xp)
                  dans l'onglet EDIT pour exporter un programme spécifique.
                </p>
                <p>
                  <strong>💾 Format .8xp:</strong> Compatible avec les vraies calculatrices TI-83 Plus
                  et émulateurs (TilEm, Wabbitemu).
                </p>
                <p>
                  <strong>🔒 Sauvegarde automatique:</strong> Vos programmes sont automatiquement
                  sauvegardés dans le navigateur (localStorage). L'export permet de créer des copies
                  de sauvegarde ou de partager vos programmes.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Toast notification */}
        {showToast && (
          <div className={`toast-notification toast-${showToast.type}`}>
            {showToast.type === 'success' ? '✓' : '⚠️'} {showToast.message}
          </div>
        )}
      </div>
    </div>
  );
};
