/**
 * Éditeur de MEM - Gestion de la mémoire
 */

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useCalculatorStore } from '../../store/calculatorStore';

interface MemEditorProps {
  onClose: () => void;
}

export interface MemEditorHandle {
  navigate: (direction: 'up' | 'down') => void;
  select: () => void;
}

export const MemEditor = forwardRef<MemEditorHandle, MemEditorProps>(({
  onClose,
}, ref) => {
  const {
    history,
    matrices,
    clearHistory,
    resetMemory,
    deleteVariable,
    getAllVariables,
  } = useCalculatorStore();

  const [selectedOption, setSelectedOption] = useState(0);
  const [showVariables, setShowVariables] = useState(false);
  const [variablesList, setVariablesList] = useState<string[]>([]);
  const [selectedVariable, setSelectedVariable] = useState(0);

  const menuOptions = [
    { name: 'About', description: 'Memory Info' },
    { name: 'Check RAM', description: 'Check RAM Status' },
    { name: 'Reset', description: 'Reset Memory' },
    { name: 'Delete', description: 'Delete Variables' },
    { name: 'Clear Entries', description: 'Clear History' },
  ];

  // Calculer la mémoire utilisée/disponible
  const totalMemory = 24 * 1024; // 24 KB approximatif pour TI-83

  // Calculer la mémoire utilisée basée sur le contenu réel
  const calculateUsedMemory = () => {
    let used = 0;

    // Mémoire des variables
    const vars = getAllVariables();
    used += Object.keys(vars).length * 8; // 8 bytes par variable approximativement

    // Mémoire des matrices
    Object.values(matrices).forEach(matrix => {
      if (matrix.rows > 0 && matrix.cols > 0) {
        used += matrix.rows * matrix.cols * 8; // 8 bytes par valeur
      }
    });

    // Mémoire de l'historique
    used += history.length * 50; // 50 bytes par entrée d'historique approximativement

    return Math.min(used, totalMemory);
  };

  const usedMemory = calculateUsedMemory();
  const freeMemory = totalMemory - usedMemory;

  // Mettre à jour la liste des variables
  useEffect(() => {
    if (showVariables) {
      const vars = getAllVariables();
      setVariablesList(Object.keys(vars));
      setSelectedVariable(0);
    }
  }, [showVariables, getAllVariables]);

  // Exposer les méthodes au parent via ref
  useImperativeHandle(ref, () => ({
    navigate: (direction: 'up' | 'down') => {
      if (showVariables) {
        // Navigation dans la liste des variables
        if (direction === 'up') {
          setSelectedVariable((prev) => (prev - 1 + variablesList.length) % variablesList.length);
        } else {
          setSelectedVariable((prev) => (prev + 1) % variablesList.length);
        }
      } else {
        // Navigation dans le menu principal
        if (direction === 'up') {
          setSelectedOption((prev) => (prev - 1 + menuOptions.length) % menuOptions.length);
        } else {
          setSelectedOption((prev) => (prev + 1) % menuOptions.length);
        }
      }
    },
    select: () => {
      if (showVariables) {
        // Supprimer la variable sélectionnée
        if (variablesList.length > 0) {
          const varToDelete = variablesList[selectedVariable];
          deleteVariable(varToDelete);
          setShowVariables(false);
        }
        return;
      }

      const option = menuOptions[selectedOption];
      switch (option.name) {
        case 'About':
          // Afficher les informations détaillées sur la mémoire
          const vars = getAllVariables();
          const numVars = Object.keys(vars).length;
          const numMatrices = Object.values(matrices).filter(m => m.rows > 0 && m.cols > 0).length;
          const numHistoryEntries = history.length;

          alert(
            `Memory Information:\n\n` +
            `Total: ${totalMemory} bytes (24 KB)\n` +
            `Used: ${usedMemory} bytes (${((usedMemory / totalMemory) * 100).toFixed(1)}%)\n` +
            `Free: ${freeMemory} bytes (${((freeMemory / totalMemory) * 100).toFixed(1)}%)\n\n` +
            `Variables: ${numVars}\n` +
            `Matrices: ${numMatrices}\n` +
            `History entries: ${numHistoryEntries}`
          );
          break;

        case 'Check RAM':
          alert(
            `RAM Status:\n\n` +
            `Free RAM: ${freeMemory} bytes\n` +
            `(${((freeMemory / totalMemory) * 100).toFixed(1)}% available)\n\n` +
            `Used RAM: ${usedMemory} bytes\n` +
            `(${((usedMemory / totalMemory) * 100).toFixed(1)}% used)`
          );
          break;

        case 'Reset':
          if (confirm('Reset all memory?\n\nThis will clear:\n- All variables\n- All matrices\n- History\n\nContinue?')) {
            resetMemory();
            alert('Memory has been reset.');
            onClose();
          }
          break;

        case 'Delete':
          // Afficher la liste des variables
          const varsToDelete = getAllVariables();
          if (Object.keys(varsToDelete).length === 0) {
            alert('No variables to delete.');
          } else {
            setShowVariables(true);
          }
          break;

        case 'Clear Entries':
          if (confirm(`Clear ${history.length} history entries?`)) {
            clearHistory();
            alert('History cleared.');
          }
          break;

        default:
          break;
      }
    },
  }), [
    selectedOption,
    showVariables,
    selectedVariable,
    variablesList,
    menuOptions,
    totalMemory,
    usedMemory,
    freeMemory,
    history,
    matrices,
    clearHistory,
    resetMemory,
    deleteVariable,
    getAllVariables,
    onClose,
  ]);

  // Gérer les touches du clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (showVariables) {
            setSelectedVariable((prev) => (prev - 1 + variablesList.length) % variablesList.length);
          } else {
            setSelectedOption((prev) => (prev - 1 + menuOptions.length) % menuOptions.length);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (showVariables) {
            setSelectedVariable((prev) => (prev + 1) % variablesList.length);
          } else {
            setSelectedOption((prev) => (prev + 1) % menuOptions.length);
          }
          break;
        case 'Escape':
          e.preventDefault();
          if (showVariables) {
            setShowVariables(false);
          } else {
            onClose();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOption, showVariables, selectedVariable, variablesList, menuOptions, onClose]);

  return (
    <div className="mode-editor">
      <div className="editor-header">
        <h3>{showVariables ? 'DELETE VARIABLES' : 'MEMORY'}</h3>
      </div>

      <div className="mode-content">
        {!showVariables ? (
          <>
            <div className="mem-info">
              <div className="mem-row">
                <span className="mem-label">RAM Free:</span>
                <span className="mem-value">{freeMemory} bytes</span>
              </div>
              <div className="mem-row">
                <span className="mem-label">RAM Used:</span>
                <span className="mem-value">{usedMemory} bytes</span>
              </div>
              <div className="mem-row">
                <span className="mem-label">Total:</span>
                <span className="mem-value">{totalMemory} bytes</span>
              </div>
            </div>

            <div className="menu-separator"></div>

            {menuOptions.map((option, index) => (
              <div
                key={option.name}
                className={`mode-row menu-item ${index === selectedOption ? 'selected' : ''}`}
              >
                <span className="menu-number">{index + 1}:</span>
                <span className="menu-option">{option.name}</span>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="variables-list">
              {variablesList.length > 0 ? (
                variablesList.map((varName, index) => (
                  <div
                    key={varName}
                    className={`mode-row menu-item ${index === selectedVariable ? 'selected' : ''}`}
                  >
                    <span className="menu-option">{varName}</span>
                  </div>
                ))
              ) : (
                <div className="mode-row">
                  <span>No variables to delete</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="editor-footer">
        <div className="footer-hint">
          {showVariables
            ? '↑↓: Navigate | ENTER: Delete | ESC: Back'
            : '↑↓: Navigate | ENTER: Select | ESC: Quit'}
        </div>
      </div>
    </div>
  );
});

MemEditor.displayName = 'MemEditor';
