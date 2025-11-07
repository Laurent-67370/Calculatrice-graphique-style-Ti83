/**
 * Éditeur de MATRIX - Gestion des matrices
 */

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useCalculatorStore } from '../../store/calculatorStore';

interface MatrixEditorProps {
  onClose: () => void;
  onEditMatrix?: (matrixName: string) => void;
}

export interface MatrixEditorHandle {
  navigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
  select: () => void;
}

export const MatrixEditor = forwardRef<MatrixEditorHandle, MatrixEditorProps>(({
  onClose,
  onEditMatrix,
}, ref) => {
  const { matrices, appendInput } = useCalculatorStore();
  const [selectedOption, setSelectedOption] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'NAMES' | 'MATH' | 'EDIT'>('NAMES');

  // Liste des matrices disponibles
  const matrixNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  // Options du menu MATH
  const mathOptions = [
    { name: 'det(', description: 'Déterminant' },
    { name: 'T', description: 'Transposée (^T)' },
    { name: 'dim(', description: 'Dimensions' },
    { name: 'Fill(', description: 'Remplir' },
    { name: 'identity(', description: 'Matrice identité' },
    { name: 'randM(', description: 'Matrice aléatoire' },
    { name: 'augment(', description: 'Augmenter' },
    { name: 'Matr►list(', description: 'Matrice vers liste' },
    { name: 'List►matr(', description: 'Liste vers matrice' },
    { name: 'cumSum(', description: 'Somme cumulative' },
  ];

  // Obtenir les dimensions d'une matrice
  const getMatrixDimensions = (name: string): string => {
    const matrix = matrices[name];
    if (matrix && matrix.rows > 0 && matrix.cols > 0) {
      // Vérifier si la matrice a des valeurs non nulles
      const hasValues = matrix.data.some(row => row.some(val => val !== 0));
      if (hasValues) {
        return `${matrix.rows}×${matrix.cols}`;
      }
    }
    return 'undefined';
  };

  // Exposer les méthodes au parent via ref
  useImperativeHandle(ref, () => ({
    navigate: (direction: 'up' | 'down' | 'left' | 'right') => {
      if (direction === 'left') {
        // Changer d'onglet vers la gauche
        if (selectedTab === 'MATH') setSelectedTab('EDIT');
        else if (selectedTab === 'EDIT') setSelectedTab('NAMES');
        setSelectedOption(0);
      } else if (direction === 'right') {
        // Changer d'onglet vers la droite
        if (selectedTab === 'NAMES') setSelectedTab('EDIT');
        else if (selectedTab === 'EDIT') setSelectedTab('MATH');
        setSelectedOption(0);
      } else {
        // Navigation verticale
        const maxOptions = selectedTab === 'MATH' ? mathOptions.length : matrixNames.length;
        if (direction === 'up') {
          setSelectedOption((prev) => (prev - 1 + maxOptions) % maxOptions);
        } else {
          setSelectedOption((prev) => (prev + 1) % maxOptions);
        }
      }
    },
    select: () => {
      if (selectedTab === 'NAMES') {
        const matrixName = matrixNames[selectedOption];
        // Insérer [A] dans l'input
        if (appendInput) {
          appendInput(`[${matrixName}]`);
          onClose();
        }
      } else if (selectedTab === 'EDIT') {
        const matrixName = matrixNames[selectedOption];
        // Ouvrir l'éditeur de grille
        if (onEditMatrix) {
          onEditMatrix(matrixName);
        }
      } else if (selectedTab === 'MATH') {
        const operation = mathOptions[selectedOption];
        // Insérer l'opération dans l'input
        if (appendInput) {
          appendInput(operation.name);
          onClose();
        }
      }
    },
  }), [selectedOption, selectedTab, matrixNames, mathOptions, onEditMatrix, appendInput, onClose]);

  // Gérer les touches du clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const maxOptions = selectedTab === 'MATH' ? mathOptions.length : matrixNames.length;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setSelectedOption((prev) => (prev - 1 + maxOptions) % maxOptions);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedOption((prev) => (prev + 1) % maxOptions);
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
            const matrixName = matrixNames[selectedOption];
            if (appendInput) {
              appendInput(`[${matrixName}]`);
              onClose();
            }
          } else if (selectedTab === 'EDIT') {
            const matrixName = matrixNames[selectedOption];
            if (onEditMatrix) {
              onEditMatrix(matrixName);
            }
          } else if (selectedTab === 'MATH') {
            const operation = mathOptions[selectedOption];
            if (appendInput) {
              appendInput(operation.name);
              onClose();
            }
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
  }, [selectedOption, selectedTab, matrixNames, mathOptions, onEditMatrix, appendInput, onClose]);

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
        {selectedTab === 'MATH' ? (
          mathOptions.map((item, index) => (
            <div
              key={item.name}
              className={`mode-row menu-item ${index === selectedOption ? 'selected' : ''}`}
            >
              <span className="menu-number">{index + 1}:</span>
              <span className="menu-option">{item.name}</span>
              <span className="menu-description">{item.description}</span>
            </div>
          ))
        ) : (
          matrixNames.map((name, index) => (
            <div
              key={name}
              className={`mode-row menu-item ${index === selectedOption ? 'selected' : ''}`}
            >
              <span className="menu-number">{index + 1}:</span>
              <span className="menu-option">[{name}]</span>
              <span className="matrix-dim">{getMatrixDimensions(name)}</span>
            </div>
          ))
        )}
      </div>

      <div className="editor-footer">
        <div className="footer-hint">
          {selectedTab === 'NAMES'
            ? '↑↓: Navigate | ←→: Change Tab | ENTER: Insert | ESC: Quit'
            : selectedTab === 'EDIT'
            ? '↑↓: Navigate | ←→: Change Tab | ENTER: Edit | ESC: Quit'
            : '↑↓: Navigate | ←→: Change Tab | ENTER: Insert | ESC: Quit'}
        </div>
      </div>
    </div>
  );
});

MatrixEditor.displayName = 'MatrixEditor';
