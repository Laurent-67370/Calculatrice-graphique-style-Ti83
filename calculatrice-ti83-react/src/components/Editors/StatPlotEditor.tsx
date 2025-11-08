/**
 * Éditeur STAT PLOT pour TI-83 Plus
 * Permet de configurer les 3 graphiques statistiques (Plot1, Plot2, Plot3)
 */

import { useState, useEffect, useMemo, useImperativeHandle, forwardRef } from 'react';
import type { StatPlot } from '../../store/calculatorStore';

interface StatPlotEditorProps {
  plots: [StatPlot, StatPlot, StatPlot];
  onSave: (plotIndex: 0 | 1 | 2, plot: StatPlot) => void;
  onClose: () => void;
}

export interface StatPlotEditorHandle {
  navigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
  handleEnter: () => void;
  save: () => void;
}

export const StatPlotEditor = forwardRef<StatPlotEditorHandle, StatPlotEditorProps>(({
  plots,
  onSave,
  onClose
}, ref) => {
  const [currentPlot, setCurrentPlot] = useState<0 | 1 | 2>(0);
  const [localPlot, setLocalPlot] = useState<StatPlot>(plots[0]);
  const [currentField, setCurrentField] = useState(0);

  // Mettre à jour le plot local quand on change de plot
  useEffect(() => {
    setLocalPlot(plots[currentPlot]);
    setCurrentField(0);
  }, [currentPlot, plots]);

  // Définir les champs disponibles selon le type de plot
  const fields = useMemo(() => {
    const baseFields = [
      { name: 'On', key: 'on', type: 'toggle' },
      { name: 'Type', key: 'type', type: 'select', options: [
        { value: 'scatter', label: 'Scatter' },
        { value: 'xyLine', label: 'xyLine' },
        { value: 'histogram', label: 'Histogram' },
        { value: 'modBoxPlot', label: 'ModBox' },
        { value: 'normBoxPlot', label: 'NormBox' },
      ]},
      { name: 'Xlist', key: 'xList', type: 'select', options: [
        { value: 'L1', label: 'L1' },
        { value: 'L2', label: 'L2' },
        { value: 'L3', label: 'L3' },
        { value: 'L4', label: 'L4' },
        { value: 'L5', label: 'L5' },
        { value: 'L6', label: 'L6' },
      ]},
    ];

    // Ajouter Ylist seulement pour scatter et xyLine
    if (localPlot.type === 'scatter' || localPlot.type === 'xyLine') {
      baseFields.push({
        name: 'Ylist', key: 'yList', type: 'select', options: [
          { value: 'L1', label: 'L1' },
          { value: 'L2', label: 'L2' },
          { value: 'L3', label: 'L3' },
          { value: 'L4', label: 'L4' },
          { value: 'L5', label: 'L5' },
          { value: 'L6', label: 'L6' },
        ]
      });
    }

    // Ajouter Mark pour les plots qui en ont besoin
    if (localPlot.type === 'scatter' || localPlot.type === 'xyLine') {
      baseFields.push({
        name: 'Mark', key: 'mark', type: 'select', options: [
          { value: 'square', label: '□' },
          { value: 'plus', label: '+' },
          { value: 'dot', label: '•' },
        ]
      });
    }

    return baseFields;
  }, [localPlot.type]);

  // Exposer les méthodes au parent via ref
  useImperativeHandle(ref, () => ({
    navigate: (direction: 'up' | 'down' | 'left' | 'right') => {
      if (direction === 'up') {
        setCurrentField((prev) => Math.max(0, prev - 1));
      } else if (direction === 'down') {
        setCurrentField((prev) => Math.min(fields.length - 1, prev + 1));
      } else if (direction === 'left') {
        setCurrentPlot((prev) => (prev === 0 ? 2 : (prev - 1) as 0 | 1 | 2));
      } else if (direction === 'right') {
        setCurrentPlot((prev) => (prev === 2 ? 0 : (prev + 1) as 0 | 1 | 2));
      }
    },
    handleEnter: () => {
      const field = fields[currentField];

      if (field.type === 'toggle') {
        setLocalPlot((prev) => ({ ...prev, [field.key]: !prev[field.key as keyof StatPlot] }));
      } else if (field.type === 'select' && field.options) {
        // Basculer entre les options
        const currentValue = localPlot[field.key as keyof StatPlot];
        const currentIndex = field.options.findIndex(opt => opt.value === currentValue);
        const nextIndex = (currentIndex + 1) % field.options.length;
        setLocalPlot((prev) => ({ ...prev, [field.key]: field.options![nextIndex].value }));
      }
    },
    save: () => {
      onSave(currentPlot, localPlot);
    },
  }), [currentField, currentPlot, localPlot, fields, onSave]);

  // Gérer les touches du clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setCurrentField((prev) => Math.max(0, prev - 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setCurrentField((prev) => Math.min(fields.length - 1, prev + 1));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentPlot((prev) => (prev === 0 ? 2 : (prev - 1) as 0 | 1 | 2));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setCurrentPlot((prev) => (prev === 2 ? 0 : (prev + 1) as 0 | 1 | 2));
          break;
        case 'Enter':
          e.preventDefault();
          {
            const field = fields[currentField];
            if (field.type === 'toggle') {
              setLocalPlot((prev) => ({ ...prev, [field.key]: !prev[field.key as keyof StatPlot] }));
            } else if (field.type === 'select' && field.options) {
              const currentValue = localPlot[field.key as keyof StatPlot];
              const currentIndex = field.options.findIndex(opt => opt.value === currentValue);
              const nextIndex = (currentIndex + 1) % field.options.length;
              setLocalPlot((prev) => ({ ...prev, [field.key]: field.options![nextIndex].value }));
            }
          }
          break;
        case 'Escape':
          e.preventDefault();
          onSave(currentPlot, localPlot);
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentField, currentPlot, localPlot, fields, onSave, onClose]);

  // Obtenir le label d'une valeur
  const getValueLabel = (field: any, value: any) => {
    if (field.type === 'toggle') {
      return value ? 'On' : 'Off';
    } else if (field.type === 'select' && field.options) {
      const option = field.options.find((opt: any) => opt.value === value);
      return option?.label || value;
    }
    return value;
  };

  return (
    <div className="editor-container">
      <div className="editor-title">
        <span className={currentPlot === 0 ? 'plot-active' : ''}>Plot1</span>
        <span className={currentPlot === 1 ? 'plot-active' : ''}>Plot2</span>
        <span className={currentPlot === 2 ? 'plot-active' : ''}>Plot3</span>
      </div>
      <div className="editor-content">
        {fields.map((field, index) => {
          const isSelected = index === currentField;
          const value = localPlot[field.key as keyof StatPlot];

          return (
            <div
              key={field.key}
              className={`editor-row ${isSelected ? 'selected' : ''}`}
            >
              <span className="editor-label">{field.name}:</span>
              <span className="editor-value">
                {getValueLabel(field, value)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="editor-footer">
        <div className="editor-help">
          ↑↓: Navigate • ←→: Change Plot • ENTER: Toggle • ESC: Save & Close
        </div>
      </div>
    </div>
  );
});

StatPlotEditor.displayName = 'StatPlotEditor';
