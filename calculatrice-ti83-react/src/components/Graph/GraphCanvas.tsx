/**
 * Composant Canvas pour afficher les graphiques
 */

import React, { useEffect, useRef } from 'react';
import { graphingEngine } from '../../services/GraphingEngine';
import type { GraphFunction, WindowSettings } from '../../types';

interface GraphCanvasProps {
  functions: GraphFunction[];
  window: WindowSettings;
  angleMode: 'DEGREE' | 'RADIAN';
  width?: number;
  height?: number;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = React.memo(
  ({ functions, window, angleMode, width = 384, height = 256 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Initialiser le canvas dans le moteur graphique
    useEffect(() => {
      if (canvasRef.current) {
        graphingEngine.setCanvas(canvasRef.current);
      }
    }, []);

    // Redessiner quand les paramètres changent
    useEffect(() => {
      if (canvasRef.current) {
        console.log('🎨 Dessin du graphique:', {
          functions: functions.map(f => ({ index: f.index, expr: f.expression, active: f.active })),
          window,
          angleMode
        });
        graphingEngine.drawGraph(functions, window, angleMode);
      }
    }, [functions, window, angleMode]);

    return (
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="graph-canvas"
      />
    );
  }
);

GraphCanvas.displayName = 'GraphCanvas';
