/**
 * Composant TestsEditor - éditeur config-driven pour STAT > TESTS.
 * Piloté par le registre STAT_TESTS (src/data/statTests.ts).
 *
 * Interaction clavier (fidèle aux autres éditeurs) :
 *  ↑↓ : naviguer entre les champs / le bouton Calculate
 *  ENTER : éditer un champ nombre / cycle un sélecteur / Calculate sur le bouton
 *  chiffres/ops : saisie d'un nombre (en mode édition)
 *  DEL : effacer le dernier caractère (édition nombre)
 *  GRAPH : Calculate
 *  CLEAR : fermer
 */

import { useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import { getTestSpec, type FieldSpec } from '../../data/statTests';
import type { TestResult } from '../../services/HypothesisTestService';
import { useCalculatorStore } from '../../store/calculatorStore';

export interface TestsEditorHandle {
  navigate: (direction: 'up' | 'down') => void;
  handleEnter: () => void;
  handleInput: (input: string) => void;
  handleDelete: () => void;
  calculate: () => void;
  close: () => void;
}

interface TestsEditorProps {
  test: string;
  onClose: () => void;
}

const LIST_OPTIONS = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'];
const MATRIX_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const ALT_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: '≠' }, { value: -1, label: '<' }, { value: 1, label: '>' },
];
const INPT_OPTIONS: { value: string; label: string }[] = [
  { value: 'data', label: 'Data' }, { value: 'stats', label: 'Stats' },
];
const POOLED_OPTIONS: { value: boolean; label: string }[] = [
  { value: false, label: 'No' }, { value: true, label: 'Yes' },
];

function fieldDisplay(field: FieldSpec, value: unknown): string {
  switch (field.type) {
    case 'list': return String(value);
    case 'matrix': return '[' + value + ']';
    case 'alt': return ALT_OPTIONS.find(o => o.value === value)?.label ?? '≠';
    case 'inpt': return INPT_OPTIONS.find(o => o.value === value)?.label ?? 'Stats';
    case 'pooled': return POOLED_OPTIONS.find(o => o.value === value)?.label ?? 'No';
    default: return value === '' || value === undefined || value === null ? '_' : String(value);
  }
}

function cycleValue(field: FieldSpec, value: unknown): unknown {
  switch (field.type) {
    case 'list': { const i = LIST_OPTIONS.indexOf(String(value)); return LIST_OPTIONS[(i + 1) % LIST_OPTIONS.length]; }
    case 'matrix': { const i = MATRIX_OPTIONS.indexOf(String(value)); return MATRIX_OPTIONS[(i + 1) % MATRIX_OPTIONS.length]; }
    case 'alt': { const i = ALT_OPTIONS.findIndex(o => o.value === value); return ALT_OPTIONS[(i + 1) % ALT_OPTIONS.length].value; }
    case 'inpt': { const i = INPT_OPTIONS.findIndex(o => o.value === value); return INPT_OPTIONS[(i + 1) % INPT_OPTIONS.length].value; }
    case 'pooled': { const i = POOLED_OPTIONS.findIndex(o => o.value === value); return POOLED_OPTIONS[(i + 1) % POOLED_OPTIONS.length].value; }
    default: return value;
  }
}

const fmt = (x: number | string): string => {
  if (typeof x !== 'number') return String(x);
  if (!isFinite(x)) return String(x);
  const rounded = Math.round(x * 1e8) / 1e8;
  return String(rounded);
};

export const TestsEditor = forwardRef<TestsEditorHandle, TestsEditorProps>(({ test, onClose }, ref) => {
  const spec = getTestSpec(test);
  const getMatrix = useCalculatorStore(s => s.getMatrix);

  // Valeurs initiales depuis les defaults
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const init: Record<string, unknown> = {};
    spec?.fields.forEach(f => { init[f.key] = f.default; });
    return init;
  });
  const [selectedField, setSelectedField] = useState(0);
  const [editingField, setEditingField] = useState<number | null>(null);
  const [result, setResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Champs visibles (selon showIf, ex: toggle Data/Stats)
  const visibleFields = useMemo<FieldSpec[]>(() => {
    if (!spec) return [];
    return spec.fields.filter(f => !f.showIf || f.showIf(values));
  }, [spec, values]);

  // Indice du bouton Calculate = visibleFields.length (dernier "champ" virtuel)
  const calcIndex = visibleFields.length;
  const maxIndex = calcIndex; // 0..calcIndex

  useImperativeHandle(ref, () => ({
    navigate: (direction) => {
      if (editingField !== null) return;
      setResult(null); setError(null);
      if (direction === 'up' && selectedField > 0) setSelectedField(selectedField - 1);
      else if (direction === 'down' && selectedField < maxIndex) setSelectedField(selectedField + 1);
    },
    handleEnter: () => {
      if (!spec) return;
      // Bouton Calculate
      if (selectedField === calcIndex) { performCalculate(); return; }
      const field = visibleFields[selectedField];
      if (!field) return;
      if (field.type === 'number') {
        // Toggle édition
        setEditingField(editingField === selectedField ? null : selectedField);
      } else {
        // Sélecteur : cycle la valeur
        setValues(v => ({ ...v, [field.key]: cycleValue(field, v[field.key]) }));
      }
      setResult(null); setError(null);
    },
    handleInput: (input: string) => {
      if (editingField === null) return;
      const field = visibleFields[editingField];
      if (!field || field.type !== 'number') return;
      setValues(v => {
        const cur = String(v[field.key] ?? '');
        // Éviter plusieurs '-' ou '.' mal placés (validation légère)
        return { ...v, [field.key]: cur + input };
      });
    },
    handleDelete: () => {
      if (editingField === null) return;
      const field = visibleFields[editingField];
      if (!field || field.type !== 'number') return;
      setValues(v => {
        const cur = String(v[field.key] ?? '');
        return { ...v, [field.key]: cur.slice(0, -1) };
      });
    },
    calculate: () => { performCalculate(); },
    close: () => { onClose(); },
  }));

  const performCalculate = () => {
    if (!spec) return;
    try {
      // Résoudre les champs : 'matrix' → donnée aplatie, autres → valeur brute
      const resolved: Record<string, unknown> = {};
      for (const f of spec.fields) {
        const val = values[f.key];
        if (f.type === 'matrix') {
          const m = getMatrix(String(val));
          resolved[f.key] = (m.data || []).flat();
        } else {
          resolved[f.key] = val;
        }
      }
      const res = spec.compute(resolved);
      setResult(res); setError(null);
    } catch (e: any) {
      setError(e?.message || 'Erreur de calcul');
      setResult(null);
    }
  };

  if (!spec) {
    return (
      <div className="solver-editor">
        <div className="editor-header"><h3>STAT TESTS</h3></div>
        <div className="solver-fields"><div className="result-error">Test inconnu: {test}</div></div>
        <div className="editor-footer"><p>CLEAR: Fermer</p></div>
      </div>
    );
  }

  return (
    <div className="solver-editor">
      <div className="editor-header">
        <h3>{spec.label.replace('...', '')}</h3>
      </div>

      <div className="solver-fields">
        {visibleFields.map((field, index) => (
          <div
            key={field.key}
            className={`solver-field ${index === selectedField ? 'selected' : ''} ${index === editingField ? 'editing' : ''}`}
          >
            <span className="field-label">{field.label}:</span>
            <span className="field-value">
              {fieldDisplay(field, values[field.key])}
              {index === editingField && <span className="cursor">█</span>}
            </span>
          </div>
        ))}

        {/* Bouton Calculate */}
        <div
          className={`solver-button ${selectedField === calcIndex ? 'selected' : ''}`}
        >
          CALCULATE (GRAPH)
        </div>

        {/* Résultat */}
        {error && (
          <div className="solver-result">
            <div className="result-label error">Erreur:</div>
            <div className="result-error">{error}</div>
          </div>
        )}
        {result && (
          <div className="solver-result">
            <div className="result-value">{result.statName} = {fmt(result.statValue)}</div>
            {result.pValue !== undefined && <div className="result-info">p = {fmt(result.pValue)}</div>}
            {result.df !== undefined && <div className="result-info">df = {fmt(result.df)}{result.df2 !== undefined ? `, ${fmt(result.df2)}` : ''}</div>}
            {result.ci && <div className="result-info">CI = ({fmt(result.ci[0])}, {fmt(result.ci[1])})</div>}
            {result.extras.map((ex, i) => (
              <div key={i} className="result-info">{ex.label} = {fmt(ex.value)}</div>
            ))}
            <div className="result-help">CLEAR: Fermer</div>
          </div>
        )}
      </div>

      <div className="editor-footer">
        <p style={{ fontSize: '0.85em', margin: '8px 0' }}>
          ↑↓: Naviguer | ENTER: Éditer/cycler | GRAPH: Calculer | CLEAR: Fermer
        </p>
      </div>
    </div>
  );
});

TestsEditor.displayName = 'TestsEditor';