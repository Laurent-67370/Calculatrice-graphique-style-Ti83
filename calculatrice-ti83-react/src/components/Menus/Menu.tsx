/**
 * Composant Menu générique pour TI-83 Plus
 */

import React from 'react';

export interface MenuItem {
  id: string;
  label: string;
  action: () => void;
  submenu?: MenuItem[];
}

interface MenuProps {
  title: string;
  items: MenuItem[];
  selectedIndex: number;
  onNavigate: (direction: 'up' | 'down', maxIndex: number) => void;
  onSelect: () => void;
  onClose: () => void;
}

export const Menu: React.FC<MenuProps> = ({
  title,
  items,
  selectedIndex,
  onNavigate,
  onSelect,
  onClose
}) => {
  // Supprimer le warning TypeScript - onClose sera utilisé pour le bouton fermer
  console.log({ onClose });

  return (
    <div className="ti83-menu">
      <div className="menu-header">
        {title}
      </div>
      <div className="menu-items">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`menu-item ${index === selectedIndex ? 'selected' : ''}`}
            onClick={() => {
              if (index === selectedIndex) {
                onSelect();
              } else {
                // Naviguer jusqu'à cet item
                const direction: 'up' | 'down' = index < selectedIndex ? 'up' : 'down';
                const steps = Math.abs(index - selectedIndex);
                for (let i = 0; i < steps; i++) {
                  onNavigate(direction, items.length);
                }
              }
            }}
          >
            <span className="menu-number">{index + 1}:</span>
            <span className="menu-label">{item.label}</span>
            {item.submenu && item.submenu.length > 0 && (
              <span className="menu-arrow">▶</span>
            )}
          </div>
        ))}
      </div>
      <div className="menu-footer">
        ↑↓: Naviguer | ENTER: Sélectionner | CLEAR: Fermer
      </div>
    </div>
  );
};
