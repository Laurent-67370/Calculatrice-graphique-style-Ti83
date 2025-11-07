/**
 * Éditeur de grille pour matrices - Composant d'édition en grille
 */

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useCalculatorStore, type Matrix } from '../../store/calculatorStore';

interface MatrixGridEditorProps {
  matrixName: string;
  onClose: () => void;
}

export interface MatrixGridEditorHandle {
  navigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
  handleEnter: () => void;
  handleInput: (char: string) => void;
  handleDelete: () => void;
}

export const MatrixGridEditor = forwardRef<MatrixGridEditorHandle, MatrixGridEditorProps>(({
  matrixName,
  onClose: _onClose,
}, ref) => {
  console.log('[MatrixGridEditor] Component mounted for matrix:', matrixName);
  const { getMatrix, setMatrix } = useCalculatorStore();
  const [matrix, setLocalMatrix] = useState<Matrix>(() => {
    const m = getMatrix(matrixName);
    console.log('[MatrixGridEditor] Initial matrix:', m);
    return m;
  });
  const [selectedRow, setSelectedRow] = useState(0);
  const [selectedCol, setSelectedCol] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [dimensionMode, setDimensionMode] = useState(false);
  const [dimensionField, setDimensionField] = useState<'rows' | 'cols'>('rows');

  // Sauvegarder automatiquement la matrice
  useEffect(() => {
    setMatrix(matrixName, matrix);
  }, [matrix, matrixName, setMatrix]);

  // Redimensionner la matrice si nécessaire
  const resizeMatrix = (newRows: number, newCols: number) => {
    const newData: number[][] = [];
    for (let i = 0; i < newRows; i++) {
      newData[i] = [];
      for (let j = 0; j < newCols; j++) {
        newData[i][j] = (matrix.data[i] && matrix.data[i][j]) || 0;
      }
    }
    setLocalMatrix({ rows: newRows, cols: newCols, data: newData });
  };

  // Exposer les méthodes au parent via ref
  useImperativeHandle(ref, () => ({
    navigate: (direction: 'up' | 'down' | 'left' | 'right') => {
      if (!editMode && !dimensionMode) {
        switch (direction) {
          case 'up':
            if (selectedRow > 0) {
              setSelectedRow(selectedRow - 1);
            }
            break;
          case 'down':
            if (selectedRow < matrix.rows - 1) {
              setSelectedRow(selectedRow + 1);
            }
            break;
          case 'left':
            if (selectedCol > 0) {
              setSelectedCol(selectedCol - 1);
            }
            break;
          case 'right':
            if (selectedCol < matrix.cols - 1) {
              setSelectedCol(selectedCol + 1);
            }
            break;
        }
      } else if (dimensionMode && !editMode) {
        // Navigation entre les dimensions
        if (direction === 'left' || direction === 'right') {
          setDimensionField(dimensionField === 'rows' ? 'cols' : 'rows');
        }
      }
    },
    handleEnter: () => {
      console.log('[MatrixGridEditor] handleEnter called, editMode:', editMode, 'dimensionMode:', dimensionMode);
      if (dimensionMode) {
        if (!editMode) {
          // Commencer l'édition de la dimension
          console.log('[MatrixGridEditor] Starting dimension edit');
          setEditValue(dimensionField === 'rows' ? matrix.rows.toString() : matrix.cols.toString());
          setEditMode(true);
        } else {
          // Sauvegarder la dimension
          console.log('[MatrixGridEditor] Saving dimension:', editValue);
          const newValue = parseInt(editValue);
          if (!isNaN(newValue) && newValue > 0 && newValue <= 10) {
            const newRows = dimensionField === 'rows' ? newValue : matrix.rows;
            const newCols = dimensionField === 'cols' ? newValue : matrix.cols;
            resizeMatrix(newRows, newCols);
          }
          setEditMode(false);
          setEditValue('');
        }
      } else {
        if (!editMode) {
          // Commencer l'édition de la cellule
          console.log('[MatrixGridEditor] Starting cell edit at [', selectedRow, ',', selectedCol, ']');
          // Vérifier que la cellule existe
          if (matrix.data[selectedRow] && matrix.data[selectedRow][selectedCol] !== undefined) {
            setEditValue(matrix.data[selectedRow][selectedCol].toString());
            setEditMode(true);
          } else {
            // Cellule n'existe pas, initialiser à 0
            console.log('[MatrixGridEditor] Cell does not exist, initializing to 0');
            setEditValue('0');
            setEditMode(true);
          }
        } else {
          // Sauvegarder la valeur
          console.log('[MatrixGridEditor] Saving cell value:', editValue);
          const newValue = parseFloat(editValue);
          if (!isNaN(newValue)) {
            const newData = matrix.data.map(row => [...row]);
            newData[selectedRow][selectedCol] = newValue;
            setLocalMatrix({ ...matrix, data: newData });
          }
          setEditMode(false);
          setEditValue('');
        }
      }
    },
    handleInput: (char: string) => {
      console.log('[MatrixGridEditor] handleInput called with char:', char, 'editMode:', editMode);
      if (editMode) {
        if (char === '.') {
          if (!editValue.includes('.')) {
            setEditValue((prev) => prev + char);
          }
        } else if (char === '-') {
          if (editValue.length === 0) {
            setEditValue('-');
          }
        } else {
          setEditValue((prev) => prev + char);
        }
        console.log('[MatrixGridEditor] New editValue will be:', editValue + char);
      } else {
        console.log('[MatrixGridEditor] handleInput ignored because editMode is false');
      }
    },
    handleDelete: () => {
      if (editMode && editValue.length > 0) {
        setEditValue((prev) => prev.slice(0, -1));
      }
    },
  }), [editMode, dimensionMode, selectedRow, selectedCol, matrix, editValue, dimensionField]);

  // Gérer les touches du clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' && !editMode) {
        // Touche 'd' pour changer les dimensions
        setDimensionMode(!dimensionMode);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editMode, dimensionMode]);

  return (
    <div className="mode-editor matrix-grid-editor">
      <div className="editor-header">
        <h3>MATRIX [{matrixName}] EDIT</h3>
        <div className="matrix-dimensions">
          {dimensionMode ? (
            <>
              <span className={dimensionField === 'rows' ? 'dimension-active' : ''}>
                Rows: {matrix.rows}
              </span>
              {' × '}
              <span className={dimensionField === 'cols' ? 'dimension-active' : ''}>
                Cols: {matrix.cols}
              </span>
            </>
          ) : (
            <span>{matrix.rows} × {matrix.cols}</span>
          )}
        </div>
      </div>

      <div className="matrix-grid-content">
        <table className="matrix-table">
          <tbody>
            {matrix.data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className={`matrix-cell ${
                      rowIndex === selectedRow && colIndex === selectedCol && !dimensionMode
                        ? editMode
                          ? 'editing'
                          : 'selected'
                        : ''
                    }`}
                  >
                    {rowIndex === selectedRow &&
                     colIndex === selectedCol &&
                     editMode &&
                     !dimensionMode
                      ? editValue || '0'
                      : (cell !== undefined ? cell : 0)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="editor-footer">
        <div className="footer-hint">
          {dimensionMode ? (
            editMode ? (
              '0-9: Edit | ENTER: Save | DEL: Delete'
            ) : (
              '←→: Navigate | ENTER: Edit | D: Exit Dimension'
            )
          ) : editMode ? (
            '0-9.-: Edit | ENTER: Save | DEL: Delete'
          ) : (
            '↑↓←→: Navigate | ENTER: Edit | D: Dimensions | ESC: Quit'
          )}
        </div>
      </div>
    </div>
  );
});

MatrixGridEditor.displayName = 'MatrixGridEditor';
