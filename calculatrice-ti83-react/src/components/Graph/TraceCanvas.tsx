/**
 * Composant Canvas pour le mode TRACE
 * Affiche le graphique avec un curseur qui suit une fonction
 */

import React, { useEffect, useRef } from 'react';
import { graphingEngine } from '../../services/GraphingEngine';
import type { GraphFunction, WindowSettings } from '../../types';

interface TraceCanvasProps {
  functions: GraphFunction[];
  window: WindowSettings;
  angleMode: 'DEGREE' | 'RADIAN';
  traceX: number;
  traceFunctionIndex: number;
  width?: number;
  height?: number;
}

export const TraceCanvas: React.FC<TraceCanvasProps> = React.memo(
  ({ functions, window, angleMode, traceX, traceFunctionIndex, width = 384, height = 256 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Initialiser le canvas dans le moteur graphique
    useEffect(() => {
      if (canvasRef.current) {
        graphingEngine.setCanvas(canvasRef.current);
      }
    }, []);

    // Dessiner le graphique avec le curseur de trace
    useEffect(() => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Dessiner le graphique de base
        graphingEngine.drawGraph(functions, window, angleMode);

        // Trouver la fonction active à tracer
        const traceFunction = functions[traceFunctionIndex];
        if (!traceFunction || !traceFunction.active) return;

        // Calculer Y pour le X actuel
        let y: number;
        try {
          y = graphingEngine.evaluateFunction(
            traceFunction.expression,
            traceX,
            angleMode
          );
        } catch (error) {
          // Si l'évaluation échoue, ne pas afficher le curseur
          return;
        }

        if (isNaN(y) || !isFinite(y)) return;

        // Convertir les coordonnées du graphique en coordonnées pixel
        const pixelX = ((traceX - window.xMin) / (window.xMax - window.xMin)) * width;
        const pixelY = height - ((y - window.yMin) / (window.yMax - window.yMin)) * height;

        // Dessiner le curseur de trace
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;

        // Croix au point
        const crossSize = 8;
        ctx.beginPath();
        ctx.moveTo(pixelX - crossSize, pixelY);
        ctx.lineTo(pixelX + crossSize, pixelY);
        ctx.moveTo(pixelX, pixelY - crossSize);
        ctx.lineTo(pixelX, pixelY + crossSize);
        ctx.stroke();

        // Cercle autour du point
        ctx.beginPath();
        ctx.arc(pixelX, pixelY, 4, 0, 2 * Math.PI);
        ctx.stroke();

        // Afficher les coordonnées en haut de l'écran
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, 20);
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`X=${traceX.toFixed(4)}  Y=${y.toFixed(4)}`, width / 2, 14);
      }
    }, [functions, window, angleMode, traceX, traceFunctionIndex, width, height]);

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

TraceCanvas.displayName = 'TraceCanvas';
