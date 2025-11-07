/**
 * Éditeur de MATRIX - Gestion des matrices
 */

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

interface MatrixEditorProps {
  onClose: () => void;
  onEditMatrix?: (matrixName: string) => void;
}

export interface MatrixEditorHandle {
  navigate: (direction: 'up' | 'down') => void;
  select: () => void;
}

export const MatrixEditor = forwardRef<MatrixEditorHandle, MatrixEditorProps>(({
  onClose,
  onEditMatrix,
}, ref) => {
  const [selectedOption, setSelectedOption] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'NAMES' | 'MATH' | 'EDIT'>('NAMES');

  // Liste des matrices disponibles
  const matrixNames = ['[A]', '[B]', '[C]', '[D]', '[E]', '[F]', '[G]', '[H]', '[I]', '[J]'];

  // Options du menu MATH
  const mathOptions = [
    'det(', 'T', 'dim(', 'Fill(',
    'identity(', 'randM(', 'augment(',
    'Matr►list(', 'List►matr(', 'cumSum('
  ];

  // Exposer les méthodes au parent via ref
  useImperativeHandle(ref, () => ({
    navigate: (direction: 'up' | 'down') => {
      if (selectedTab === 'NAMES' || selectedTab === 'EDIT') {
        if (direction === 'up') {
          setSelectedOption((prev) => (prev - 1 + matrixNames.length) % matrixNames.length);
        } else {
          setSelectedOption((prev) => (prev + 1) % matrixNames.length);
        }
      } else if (selectedTab === 'MATH') {
        if (direction === 'up') {
          setSelectedOption((prev) => (prev - 1 + mathOptions.length) % mathOptions.length);
        } else {
          setSelectedOption((prev) => (prev + 1) % mathOptions.length);
        }
      }
    },
    select: () => {
      if (selectedTab === 'NAMES') {
        const matrix = matrixNames[selectedOption];
        alert(`Selected matrix ${matrix}\n(Matrix operations not yet fully implemented)`);
      } else if (selectedTab === 'EDIT') {
        const matrix = matrixNames[selectedOption];
        if (onEditMatrix) {
          onEditMatrix(matrix);
        } else {
          alert(`Edit matrix ${matrix}\n(Matrix editor not yet fully implemented)`);
        }
      } else if (selectedTab === 'MATH') {
        const operation = mathOptions[selectedOption];
        alert(`Selected operation: ${operation}\n(Matrix math operations not yet fully implemented)`);
      }
    },
  }), [selectedOption, selectedTab, matrixNames, mathOptions, onEditMatrix]);

  // Gérer les touches du clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (selectedTab === 'NAMES' || selectedTab === 'EDIT') {
            setSelectedOption((prev) => (prev - 1 + matrixNames.length) % matrixNames.length);
          } else if (selectedTab === 'MATH') {
            setSelectedOption((prev) => (prev - 1 + mathOptions.length) % mathOptions.length);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (selectedTab === 'NAMES' || selectedTab === 'EDIT') {
            setSelectedOption((prev) => (prev + 1) % matrixNames.length);
          } else if (selectedTab === 'MATH') {
            setSelectedOption((prev) => (prev + 1) % mathOptions.length);
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          // Changer d'onglet vers la gauche
          if (selectedTab === 'MATH') setSelectedTab('EDIT');
          else if (selectedTab === 'EDIT') setSelectedTab('NAMES');
          setSelectedOption(0);
          break;
        case 'ArrowRight':
          e.preventDefault();
          // Changer d'onglet vers la droite
          if (selectedTab === 'NAMES') setSelectedTab('EDIT');
          else if (selectedTab === 'EDIT') setSelectedTab('MATH');
          setSelectedOption(0);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedTab === 'NAMES') {
            const matrix = matrixNames[selectedOption];
            alert(`Selected matrix ${matrix}\n(Matrix operations not yet fully implemented)`);
          } else if (selectedTab === 'EDIT') {
            const matrix = matrixNames[selectedOption];
            if (onEditMatrix) {
              onEditMatrix(matrix);
            } else {
              alert(`Edit matrix ${matrix}\n(Matrix editor not yet fully implemented)`);
            }
          } else if (selectedTab === 'MATH') {
            const operation = mathOptions[selectedOption];
            alert(`Selected operation: ${operation}\n(Matrix math operations not yet fully implemented)`);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOption, selectedTab, matrixNames, mathOptions, onEditMatrix, onClose]);

  const currentList = selectedTab === 'MATH' ? mathOptions : matrixNames;

  return (
    <div className="mode-editor">
      <div className="editor-header">
        <h3>MATRIX</h3>
        <div className="matrix-tabs">
          <span className={`tab ${selectedTab === 'NAMES' ? 'active' : ''}`}>NAMES</span>
          <span className={`tab ${selectedTab === 'MATH' ? 'active' : ''}`}>MATH</span>
          <span className={`tab ${selectedTab === 'EDIT' ? 'active' : ''}`}>EDIT</span>
        </div>
      </div>

      <div className="mode-content">
        {currentList.map((item, index) => (
          <div
            key={item}
            className={`mode-row menu-item ${index === selectedOption ? 'selected' : ''}`}
          >
            <span className="menu-number">{index + 1}:</span>
            <span className="menu-option">{item}</span>
            {selectedTab === 'NAMES' && <span className="matrix-dim">undefined</span>}
          </div>
        ))}
      </div>

      <div className="editor-footer">
        <div className="footer-hint">↑↓: Navigate | ←→: Change Tab | ENTER: Select | ESC: Quit</div>
      </div>
    </div>
  );
});

MatrixEditor.displayName = 'MatrixEditor';
