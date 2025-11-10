/**
 * Composant Canvas pour afficher les graphiques
 */

import React, { useEffect, useRef } from 'react';
import { graphingEngine } from '../../services/GraphingEngine';
import type { GraphFunction, WindowSettings, GraphMode } from '../../types';
import type { StatPlot } from '../../store/calculatorStore';
import type { DrawElement } from '../../types/draw.types';
import { DrawingService } from '../../services/DrawingService';

interface GraphCanvasProps {
  functions: GraphFunction[];
  window: WindowSettings;
  angleMode: 'DEGREE' | 'RADIAN';
  graphMode?: GraphMode;
  statPlots?: [StatPlot, StatPlot, StatPlot];
  lists?: Record<string, number[]>;
  parametricFunctions?: { x: string[], y: string[] };
  sequenceFunctions?: { functions: string[], initValues: { [key: string]: { [n: string]: number } } };
  plotMode?: 'CONNECTED' | 'DOT';
  drawElements?: DrawElement[];
  width?: number;
  height?: number;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = React.memo(
  ({ functions, window, angleMode, graphMode = 'FUNC', statPlots, lists, parametricFunctions, sequenceFunctions, plotMode = 'CONNECTED', drawElements = [], width = 384, height = 256 }) => {
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
          graphMode,
          parametricFunctions,
          sequenceFunctions,
          plotMode,
          statPlots,
          window,
          angleMode,
          drawElements: drawElements.length
        });
        graphingEngine.drawGraph(functions, window, angleMode, statPlots, lists, graphMode, parametricFunctions, sequenceFunctions, plotMode);

        // Dessiner les éléments DRAW par-dessus
        if (drawElements.length > 0) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            DrawingService.drawAll(ctx, drawElements, window, width, height);
          }
        }
      }
    }, [functions, window, angleMode, graphMode, statPlots, lists, parametricFunctions, sequenceFunctions, plotMode, drawElements, width, height]);

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
