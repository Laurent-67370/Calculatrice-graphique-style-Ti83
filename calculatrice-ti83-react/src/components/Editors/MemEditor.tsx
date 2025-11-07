/**
 * Éditeur de MEM - Gestion de la mémoire
 */

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

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
  const [selectedOption, setSelectedOption] = useState(0);

  const menuOptions = [
    { name: 'About', description: 'Memory Info' },
    { name: 'Check RAM', description: 'Check RAM Status' },
    { name: 'Reset', description: 'Reset Memory' },
    { name: 'Delete', description: 'Delete Variables' },
    { name: 'Clear Entries', description: 'Clear History' },
  ];

  // Calculer la mémoire utilisée/disponible (simulation)
  const totalMemory = 24 * 1024; // 24 KB approximatif pour TI-83
  const usedMemory = Math.floor(totalMemory * 0.15); // 15% utilisé pour la simulation
  const freeMemory = totalMemory - usedMemory;

  // Exposer les méthodes au parent via ref
  useImperativeHandle(ref, () => ({
    navigate: (direction: 'up' | 'down') => {
      if (direction === 'up') {
        setSelectedOption((prev) => (prev - 1 + menuOptions.length) % menuOptions.length);
      } else {
        setSelectedOption((prev) => (prev + 1) % menuOptions.length);
      }
    },
    select: () => {
      const option = menuOptions[selectedOption];
      switch (option.name) {
        case 'About':
          // Afficher les informations sur la mémoire
          alert(`Memory Information:\n\nTotal: ${totalMemory} bytes\nUsed: ${usedMemory} bytes\nFree: ${freeMemory} bytes`);
          break;
        case 'Check RAM':
          alert(`RAM Status:\n\nFree RAM: ${freeMemory} bytes\n(${((freeMemory / totalMemory) * 100).toFixed(1)}%)`);
          break;
        case 'Reset':
          if (confirm('Reset all memory? This will clear all variables and programs.')) {
            alert('Memory reset (simulation)');
          }
          break;
        case 'Delete':
          alert('Delete variables (not yet implemented)');
          break;
        case 'Clear Entries':
          alert('History cleared (simulation)');
          break;
        default:
          break;
      }
    },
  }), [selectedOption, menuOptions, totalMemory, usedMemory, freeMemory]);

  // Gérer les touches du clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setSelectedOption((prev) => (prev - 1 + menuOptions.length) % menuOptions.length);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedOption((prev) => (prev + 1) % menuOptions.length);
          break;
        case 'Enter':
          e.preventDefault();
          // Sélectionner l'option
          const option = menuOptions[selectedOption];
          switch (option.name) {
            case 'About':
              alert(`Memory Information:\n\nTotal: ${totalMemory} bytes\nUsed: ${usedMemory} bytes\nFree: ${freeMemory} bytes`);
              break;
            case 'Check RAM':
              alert(`RAM Status:\n\nFree RAM: ${freeMemory} bytes\n(${((freeMemory / totalMemory) * 100).toFixed(1)}%)`);
              break;
            case 'Reset':
              if (confirm('Reset all memory? This will clear all variables and programs.')) {
                alert('Memory reset (simulation)');
              }
              break;
            case 'Delete':
              alert('Delete variables (not yet implemented)');
              break;
            case 'Clear Entries':
              alert('History cleared (simulation)');
              break;
            default:
              break;
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
  }, [selectedOption, menuOptions, totalMemory, usedMemory, freeMemory, onClose]);

  return (
    <div className="mode-editor">
      <div className="editor-header">
        <h3>MEMORY</h3>
      </div>

      <div className="mode-content">
        <div className="mem-info">
          <div className="mem-row">
            <span className="mem-label">RAM Free:</span>
            <span className="mem-value">{freeMemory} bytes</span>
          </div>
          <div className="mem-row">
            <span className="mem-label">RAM Used:</span>
            <span className="mem-value">{usedMemory} bytes</span>
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
      </div>

      <div className="editor-footer">
        <div className="footer-hint">↑↓: Navigate | ENTER: Select | ESC: Quit</div>
      </div>
    </div>
  );
});

MemEditor.displayName = 'MemEditor';
