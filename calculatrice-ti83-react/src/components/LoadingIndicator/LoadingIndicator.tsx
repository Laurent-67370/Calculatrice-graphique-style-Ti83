/**
 * Composant indicateur de chargement
 */

import React from 'react';

interface LoadingIndicatorProps {
  message?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message = 'Calcul en cours...' }) => {
  return (
    <div className="loading-indicator">
      <div className="spinner"></div>
      <div className="loading-text">{message}</div>
    </div>
  );
};
