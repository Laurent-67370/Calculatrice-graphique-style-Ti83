/**
 * Composant Solver - Résolveur d'équations f(X)=0
 */

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { solverService, type SolverResult } from '../../services/SolverService';

export interface SolverEditorHandle {
  navigate: (direction: 'up' | 'down') => void;
  handleEnter: () => void;
  handleInput: (input: string) => void;
  handleDelete: () => void;
  solve: () => void;
  close: () => void;
}

interface SolverEditorProps {
  onClose: () => void;
}

export const SolverEditor = forwardRef<SolverEditorHandle, SolverEditorProps>(({
  onClose,
}, ref) => {
  const [equation, setEquation] = useState('');
  const [guess, setGuess] = useState('0');
  const [selectedField, setSelectedField] = useState(0); // 0=equation, 1=guess
  const [editingField, setEditingField] = useState<number | null>(null);
  const [result, setResult] = useState<SolverResult | null>(null);
  const [isComputing, setIsComputing] = useState(false);

  const fields = [
    { name: 'eqn', label: 'Équation', value: equation, setter: setEquation },
    { name: 'guess', label: 'Estimation', value: guess, setter: setGuess },
  ];

  // Exposer les méthodes au parent
  useImperativeHandle(ref, () => ({
    navigate: (direction: 'up' | 'down') => {
      if (editingField !== null) return; // Ne pas naviguer en mode édition

      if (direction === 'up' && selectedField > 0) {
        setSelectedField(selectedField - 1);
        setResult(null);
      } else if (direction === 'down' && selectedField < fields.length - 1) {
        setSelectedField(selectedField + 1);
        setResult(null);
      }
    },
    handleEnter: () => {
      if (editingField !== null) {
        // Sortir du mode édition
        setEditingField(null);
      } else {
        // Entrer en mode édition
        setEditingField(selectedField);
      }
    },
    handleInput: (input: string) => {
      if (editingField !== null) {
        const field = fields[editingField];
        field.setter(field.value + input);
        setResult(null);
      }
    },
    handleDelete: () => {
      if (editingField !== null) {
        const field = fields[editingField];
        field.setter(field.value.slice(0, -1));
        setResult(null);
      }
    },
    solve: () => {
      performSolve();
    },
    close: () => {
      onClose();
    }
  }));

  const performSolve = () => {
    if (!equation.trim()) {
      setResult({
        success: false,
        error: 'Entrez une équation',
      });
      return;
    }

    setIsComputing(true);
    setResult(null);

    // Utiliser setTimeout pour ne pas bloquer l'UI
    setTimeout(() => {
      try {
        const guessValue = parseFloat(guess) || 0;
        const solveResult = solverService.solve(equation, guessValue);
        setResult(solveResult);
      } catch (error) {
        setResult({
          success: false,
          error: error instanceof Error ? error.message : 'Erreur',
        });
      } finally {
        setIsComputing(false);
      }
    }, 50);
  };

  // Gestion du clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (editingField !== null) {
          setEditingField(null);
        } else if (selectedField === 0 || selectedField === 1) {
          setEditingField(selectedField);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (editingField === null && selectedField > 0) {
          setSelectedField(selectedField - 1);
          setResult(null);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (editingField === null && selectedField < fields.length - 1) {
          setSelectedField(selectedField + 1);
          setResult(null);
        }
      } else if (e.key === 'F5' || (e.key === 'Enter' && e.shiftKey)) {
        // F5 ou Shift+Enter pour résoudre
        e.preventDefault();
        performSolve();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingField, selectedField, onClose, equation, guess]);

  return (
    <div className="solver-editor">
      <div className="editor-header">
        <h3>EQUATION SOLVER</h3>
      </div>

      <div className="solver-fields">
        {fields.map((field, index) => (
          <div
            key={field.name}
            className={`solver-field ${index === selectedField ? 'selected' : ''} ${index === editingField ? 'editing' : ''}`}
          >
            <span className="field-label">{field.label}:</span>
            <span className="field-value">
              {field.value || '_'}
              {index === editingField && <span className="cursor">█</span>}
            </span>
          </div>
        ))}

        {/* Bouton Solve */}
        <div
          className={`solver-button ${selectedField === 2 ? 'selected' : ''}`}
          onClick={performSolve}
        >
          {isComputing ? 'Calcul en cours...' : 'SOLVE (GRAPH)'}
        </div>

        {/* Résultat */}
        {result && (
          <div className="solver-result">
            {result.success ? (
              <>
                <div className="result-label">Racine trouvée:</div>
                <div className="result-value">X = {result.root?.toFixed(10)}</div>
                {result.iterations && (
                  <div className="result-info">{result.iterations} itérations</div>
                )}
                <div className="result-help">
                  ENTER: Copier dans X • CLEAR: Fermer
                </div>
              </>
            ) : (
              <>
                <div className="result-label error">Erreur:</div>
                <div className="result-error">{result.error}</div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="editor-footer">
        <p style={{ fontSize: '0.85em', margin: '8px 0' }}>
          ↑↓: Naviguer | ENTER: Éditer | GRAPH: Résoudre | CLEAR: Fermer
        </p>
        <p style={{ fontSize: '0.75em', margin: '4px 0', color: '#666' }}>
          Résout f(X)=0 avec la méthode de Newton-Raphson
        </p>
      </div>
    </div>
  );
});

SolverEditor.displayName = 'SolverEditor';
