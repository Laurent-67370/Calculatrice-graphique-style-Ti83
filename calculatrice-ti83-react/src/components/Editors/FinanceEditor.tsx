/**
 * Composant Finance - TVM Solver (Time Value of Money)
 */

import { useState, forwardRef, useImperativeHandle } from 'react';
import { financeService, type TVMResult } from '../../services/FinanceService';

export interface FinanceEditorHandle {
  navigate: (direction: 'up' | 'down') => void;
  handleEnter: () => void;
  handleInput: (input: string) => void;
  handleDelete: () => void;
  solve: () => void;
  close: () => void;
}

interface FinanceEditorProps {
  onClose: () => void;
}

export const FinanceEditor = forwardRef<FinanceEditorHandle, FinanceEditorProps>(({
  onClose,
}, ref) => {
  // Variables TVM
  const [N, setN] = useState('');
  const [I, setI] = useState('');
  const [PV, setPV] = useState('');
  const [PMT, setPMT] = useState('');
  const [FV, setFV] = useState('');
  const [PY, setPY] = useState('12');  // 12 paiements par an par défaut
  const [CY, setCY] = useState('12');  // 12 compositions par an par défaut
  const [PMTEnd, setPMTEnd] = useState(true); // END mode par défaut

  const [selectedField, setSelectedField] = useState(0);
  const [editingField, setEditingField] = useState<number | null>(null);
  const [result, setResult] = useState<TVMResult | null>(null);
  const [isComputing, setIsComputing] = useState(false);

  const fields = [
    { name: 'N', label: 'N', value: N, setter: setN, description: 'Nombre de périodes' },
    { name: 'I', label: 'I%', value: I, setter: setI, description: 'Taux annuel (%)' },
    { name: 'PV', label: 'PV', value: PV, setter: setPV, description: 'Valeur actuelle' },
    { name: 'PMT', label: 'PMT', value: PMT, setter: setPMT, description: 'Paiement' },
    { name: 'FV', label: 'FV', value: FV, setter: setFV, description: 'Valeur future' },
    { name: 'PY', label: 'P/Y', value: PY, setter: setPY, description: 'Paiements/an' },
    { name: 'CY', label: 'C/Y', value: CY, setter: setCY, description: 'Compositions/an' },
  ];

  // Exposer les méthodes au parent
  useImperativeHandle(ref, () => ({
    navigate: (direction: 'up' | 'down') => {
      if (editingField !== null) return;

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
        setEditingField(null);
      } else {
        setEditingField(selectedField);
      }
    },
    handleInput: (input: string) => {
      if (editingField !== null) {
        const field = fields[editingField];

        // Accepter les nombres, le point décimal et le signe négatif
        if (/^[-0-9.]$/.test(input) || input === 'X' || input === 'x') {
          // Remplacer X par multiplication si nécessaire, ou ignorer
          if (input === 'X' || input === 'x') return;

          field.setter(field.value + input);
          setResult(null);
        }
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
    setIsComputing(true);
    setResult(null);

    setTimeout(() => {
      try {
        const currentField = fields[selectedField].name;

        // Valider les entrées
        const py = parseFloat(PY) || 12;
        const cy = parseFloat(CY) || 12;

        if (py <= 0 || cy <= 0) {
          setResult({
            success: false,
            error: 'P/Y et C/Y doivent être > 0',
          });
          setIsComputing(false);
          return;
        }

        let solveResult: TVMResult;

        // Résoudre la variable sélectionnée
        switch (currentField) {
          case 'N':
            solveResult = financeService.solveN(
              parseFloat(I) || 0,
              parseFloat(PV) || 0,
              parseFloat(PMT) || 0,
              parseFloat(FV) || 0,
              py,
              cy,
              PMTEnd
            );
            if (solveResult.success && solveResult.value !== undefined) {
              setN(solveResult.value.toFixed(6));
            }
            break;

          case 'I':
            solveResult = financeService.solveI(
              parseFloat(N) || 0,
              parseFloat(PV) || 0,
              parseFloat(PMT) || 0,
              parseFloat(FV) || 0,
              py,
              cy,
              PMTEnd
            );
            if (solveResult.success && solveResult.value !== undefined) {
              setI(solveResult.value.toFixed(6));
            }
            break;

          case 'PV':
            solveResult = financeService.solvePV(
              parseFloat(N) || 0,
              parseFloat(I) || 0,
              parseFloat(PMT) || 0,
              parseFloat(FV) || 0,
              py,
              cy,
              PMTEnd
            );
            if (solveResult.success && solveResult.value !== undefined) {
              setPV(solveResult.value.toFixed(2));
            }
            break;

          case 'PMT':
            solveResult = financeService.solvePMT(
              parseFloat(N) || 0,
              parseFloat(I) || 0,
              parseFloat(PV) || 0,
              parseFloat(FV) || 0,
              py,
              cy,
              PMTEnd
            );
            if (solveResult.success && solveResult.value !== undefined) {
              setPMT(solveResult.value.toFixed(2));
            }
            break;

          case 'FV':
            solveResult = financeService.solveFV(
              parseFloat(N) || 0,
              parseFloat(I) || 0,
              parseFloat(PV) || 0,
              parseFloat(PMT) || 0,
              py,
              cy,
              PMTEnd
            );
            if (solveResult.success && solveResult.value !== undefined) {
              setFV(solveResult.value.toFixed(2));
            }
            break;

          case 'PY':
          case 'CY':
            solveResult = {
              success: false,
              error: 'P/Y et C/Y ne peuvent pas être résolus',
            };
            break;

          default:
            solveResult = {
              success: false,
              error: 'Variable inconnue',
            };
        }

        setResult(solveResult);
      } catch (error) {
        setResult({
          success: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue',
        });
      } finally {
        setIsComputing(false);
      }
    }, 50);
  };

  return (
    <div className="ti83-solver" style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#9DB4A5',
      padding: '10px',
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#000',
      overflow: 'auto'
    }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '5px' }}>
        TVM SOLVER
      </div>

      {/* Liste des champs */}
      <div style={{ marginBottom: '10px' }}>
        {fields.map((field, index) => (
          <div
            key={field.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '3px 5px',
              backgroundColor: index === selectedField ? '#7A9B88' : 'transparent',
              border: index === selectedField ? '1px solid #000' : '1px solid transparent',
              marginBottom: '2px'
            }}
          >
            <span style={{ width: '50px', fontWeight: 'bold' }}>{field.label}=</span>
            <span style={{
              flex: 1,
              borderBottom: editingField === index ? '2px solid #000' : '1px solid #555',
              paddingLeft: '5px',
              minHeight: '18px'
            }}>
              {field.value || (editingField === index ? '▊' : '')}
            </span>
          </div>
        ))}
      </div>

      {/* Mode de paiement */}
      <div style={{ marginBottom: '10px', padding: '5px', backgroundColor: '#8AA696' }}>
        <button
          onClick={() => setPMTEnd(!PMTEnd)}
          style={{
            padding: '2px 8px',
            backgroundColor: '#7A9B88',
            border: '1px solid #000',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          {PMTEnd ? 'END' : 'BEGIN'}
        </button>
        <span style={{ marginLeft: '10px', fontSize: '11px' }}>
          Paiement en {PMTEnd ? 'fin' : 'début'} de période
        </span>
      </div>

      {/* Zone de résultat */}
      {isComputing && (
        <div style={{ padding: '10px', backgroundColor: '#7A9B88', border: '1px solid #000' }}>
          Calcul en cours...
        </div>
      )}

      {result && !isComputing && (
        <div style={{
          padding: '10px',
          backgroundColor: result.success ? '#8AA696' : '#C9A690',
          border: '1px solid #000',
          marginTop: '10px'
        }}>
          {result.success ? (
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                ✓ {fields[selectedField].label} calculé
              </div>
              {result.iterations && (
                <div style={{ fontSize: '11px' }}>
                  ({result.iterations} itération{result.iterations > 1 ? 's' : ''})
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: 'bold', color: '#8B0000' }}>✗ Erreur</div>
              <div style={{ fontSize: '12px', marginTop: '3px' }}>{result.error}</div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div style={{
        marginTop: '15px',
        padding: '8px',
        backgroundColor: '#8AA696',
        border: '1px solid #000',
        fontSize: '11px'
      }}>
        <div>↑↓: Changer de champ</div>
        <div>ENTER: Éditer | GRAPH: Calculer</div>
        <div>CLEAR: Fermer</div>
      </div>
    </div>
  );
});

FinanceEditor.displayName = 'FinanceEditor';
