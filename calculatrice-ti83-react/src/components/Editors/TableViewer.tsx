/**
 * Afficheur TABLE pour TI-83 Plus
 * Affiche les valeurs de X et Y1-Y6 sous forme de tableau
 */

import { useState, useEffect, useMemo, useImperativeHandle, forwardRef } from 'react';
import { create, all } from 'mathjs';
import type { TableSettings } from '../../store/calculatorStore';

const math = create(all);

interface TableViewerProps {
  functions: string[];
  activeFunctions: boolean[];
  settings: TableSettings;
  onClose: () => void;
}

export interface TableViewerHandle {
  navigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export const TableViewer = forwardRef<TableViewerHandle, TableViewerProps>(({
  functions,
  activeFunctions,
  settings,
  onClose
}, ref) => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [selectedColumn, setSelectedColumn] = useState(0);
  const rowsPerPage = 7; // Nombre de lignes visibles

  // Générer les valeurs de X
  const xValues = useMemo(() => {
    const { tblStart, deltaTbl } = settings;
    const values: number[] = [];
    // Générer 50 valeurs pour permettre le scroll
    for (let i = 0; i < 50; i++) {
      values.push(tblStart + i * deltaTbl);
    }
    return values;
  }, [settings]);

  // Évaluer les fonctions pour chaque X
  const tableData = useMemo(() => {
    return xValues.map(x => {
      const row: { x: number; y: (number | string)[] } = { x, y: [] };

      functions.forEach((func, index) => {
        if (!activeFunctions[index] || !func.trim()) {
          row.y.push('');
          return;
        }

        try {
          // Remplacer X par la valeur
          let expression = func
            .replace(/X/g, `(${x})`)
            .replace(/log\(/g, 'log10(')
            .replace(/ln\(/g, 'log(');

          const result = math.evaluate(expression);

          if (typeof result === 'number') {
            // Limiter à 6 décimales pour l'affichage
            row.y.push(Math.abs(result) < 0.000001 ? 0 : Number(result.toFixed(6)));
          } else {
            row.y.push(result.toString());
          }
        } catch (error) {
          row.y.push('ERROR');
        }
      });

      return row;
    });
  }, [xValues, functions, activeFunctions]);

  // Exposer les méthodes au parent via ref
  useImperativeHandle(ref, () => ({
    navigate: (direction: 'up' | 'down' | 'left' | 'right') => {
      switch (direction) {
        case 'up':
          setScrollOffset((prev) => Math.max(0, prev - 1));
          break;
        case 'down':
          setScrollOffset((prev) => Math.min(xValues.length - rowsPerPage, prev + 1));
          break;
        case 'left':
          setSelectedColumn((prev) => Math.max(0, prev - 1));
          break;
        case 'right':
          {
            const maxCol = functions.filter((_, i) => activeFunctions[i]).length;
            setSelectedColumn((prev) => Math.min(maxCol, prev + 1));
          }
          break;
      }
    },
  }), [xValues.length, functions, activeFunctions]);

  // Gérer les touches du clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setScrollOffset((prev) => Math.max(0, prev - 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setScrollOffset((prev) => Math.min(xValues.length - rowsPerPage, prev + 1));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setSelectedColumn((prev) => Math.max(0, prev - 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          {
            const maxCol = functions.filter((_, i) => activeFunctions[i]).length;
            setSelectedColumn((prev) => Math.min(maxCol, prev + 1));
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [xValues.length, functions, activeFunctions, onClose]);

  // Obtenir les fonctions actives
  const activeFuncsIndices = useMemo(() => {
    return functions
      .map((_, index) => index)
      .filter(index => activeFunctions[index] && functions[index].trim());
  }, [functions, activeFunctions]);

  // Lignes visibles
  const visibleRows = tableData.slice(scrollOffset, scrollOffset + rowsPerPage);

  return (
    <div className="editor-container table-viewer">
      <div className="editor-title">TABLE</div>
      <div className="table-content">
        <table className="value-table">
          <thead>
            <tr>
              <th className={selectedColumn === 0 ? 'selected' : ''}>X</th>
              {activeFuncsIndices.map((index, colIndex) => (
                <th key={index} className={selectedColumn === colIndex + 1 ? 'selected' : ''}>
                  Y{index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, rowIndex) => (
              <tr key={scrollOffset + rowIndex}>
                <td className={selectedColumn === 0 ? 'selected' : ''}>
                  {row.x.toFixed(2)}
                </td>
                {activeFuncsIndices.map((funcIndex, colIndex) => (
                  <td key={funcIndex} className={selectedColumn === colIndex + 1 ? 'selected' : ''}>
                    {row.y[funcIndex]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="editor-footer">
        <div className="editor-help">
          ↑↓: Scroll • ←→: Select Column • ESC: Close
        </div>
        <div className="scroll-indicator">
          Row {scrollOffset + 1} of {xValues.length}
        </div>
      </div>
    </div>
  );
});

TableViewer.displayName = 'TableViewer';
