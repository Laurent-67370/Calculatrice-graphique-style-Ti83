/**
 * Composant Catalog - Liste alphabétique de toutes les fonctions
 */

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

export interface CatalogViewerHandle {
  navigate: (direction: 'up' | 'down') => void;
  select: () => void;
  close: () => void;
}

interface CatalogViewerProps {
  onInsert: (text: string) => void;
  onClose: () => void;
}

// Liste complète de toutes les fonctions disponibles (ordre alphabétique)
const catalogItems = [
  'abs(', 'acos(', 'and', 'angle(', 'Ans', 'asin(', 'atan(',
  'binomcdf(', 'binompdf(',
  'ceil(', 'chi2cdf(', 'chi2pdf(', 'conj(', 'cos(', 'cosh(', 'cumSum(',
  'det(', 'dim(',
  'e', 'e^(', 'exp(', 'expr(',
  'factorial(', 'Fcdf(', 'Fill(', 'floor(', 'fMax(', 'fMin(', 'fnInt(', 'Fpdf(', 'fPart(',
  'gcd(', 'geometcdf(', 'geometpdf(',
  'hypot(',
  'i', 'identity(', 'imag(', 'inString(', 'int(', 'invNorm(', 'iPart(',
  'lcm(', 'length(', 'ln(', 'log(', 'logBASE(',
  'max(', 'mean(', 'median(', 'min(', 'mod(',
  'nCr(', 'nDeriv(', 'not', 'nPr(', 'normalcdf(', 'normalpdf(', 'npv(',
  'or',
  'π', 'Polar(', 'poissonpdf(', 'poissoncdf(',
  'rand', 'randBin(', 'randInt(', 'randNorm(', 'real(', 'Rect(', 'round(',
  'seq(', 'sign(', 'sin(', 'sinh(', 'solve(', 'SortA(', 'SortD(', 'sqrt(', 'stdDev(', 'sub(', 'sum(',
  'tan(', 'tanh(', 'tcdf(', 'tpdf(', 'transpose(', 'trunc(',
  'variance(',
  'xor',
  'R►Pr(', 'R►Pθ(', 'P►Rx(', 'P►Ry(',
  '→DMS', '→Dec', '³√(',
  'ΔList(', 'Σ(',
  '∫(',
  '√(',
  'θ',
  'χ²cdf(', 'χ²pdf(',
];

export const CatalogViewer = forwardRef<CatalogViewerHandle, CatalogViewerProps>(({
  onInsert,
  onClose,
}, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchLetter, setSearchLetter] = useState('');

  // Exposer les méthodes au parent
  useImperativeHandle(ref, () => ({
    navigate: (direction: 'up' | 'down') => {
      if (direction === 'up' && selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
      } else if (direction === 'down' && selectedIndex < catalogItems.length - 1) {
        setSelectedIndex(selectedIndex + 1);
      }
    },
    select: () => {
      onInsert(catalogItems[selectedIndex]);
      onClose();
    },
    close: () => {
      onClose();
    }
  }));

  // Gestion du clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onInsert(catalogItems[selectedIndex]);
        onClose();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (selectedIndex > 0) {
          setSelectedIndex(selectedIndex - 1);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (selectedIndex < catalogItems.length - 1) {
          setSelectedIndex(selectedIndex + 1);
        }
      } else if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
        // Recherche rapide par lettre
        const letter = e.key.toLowerCase();
        setSearchLetter(letter);

        // Trouver la première fonction commençant par cette lettre
        const index = catalogItems.findIndex(item =>
          item.toLowerCase().startsWith(letter)
        );
        if (index !== -1) {
          setSelectedIndex(index);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, onInsert, onClose]);

  // Auto-scroll vers l'élément sélectionné
  useEffect(() => {
    const element = document.querySelector('.catalog-item.selected');
    if (element) {
      element.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  return (
    <div className="catalog-viewer">
      <div className="editor-header">
        <h3>CATALOG</h3>
        {searchLetter && (
          <span style={{ fontSize: '0.8em', marginLeft: '10px' }}>
            Recherche: {searchLetter.toUpperCase()}
          </span>
        )}
      </div>

      <div className="catalog-content">
        <div className="catalog-list">
          {catalogItems.map((item, index) => (
            <div
              key={index}
              className={`catalog-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => {
                setSelectedIndex(index);
                onInsert(item);
                onClose();
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="editor-footer">
        <p style={{ fontSize: '0.85em', margin: '8px 0' }}>
          ↑↓: Naviguer | A-Z: Recherche | ENTER: Insérer | CLEAR: Fermer
        </p>
      </div>
    </div>
  );
});

CatalogViewer.displayName = 'CatalogViewer';
