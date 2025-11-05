/**
 * Types pour le moteur de graphiques
 */

import type { WindowSettings } from './calculator.types';

// Type de fonction graphique
export interface GraphFunction {
  index: number;
  expression: string;
  active: boolean;
  color?: string;
}

// Point sur le graphique
export interface Point {
  x: number;
  y: number;
}

// Ligne à tracer
export interface Line {
  start: Point;
  end: Point;
  color: string;
}

// Configuration du Canvas
export interface CanvasConfig {
  width: number;
  height: number;
  backgroundColor: string;
  gridColor: string;
  axisColor: string;
  showGrid: boolean;
  showAxes: boolean;
}

// État du graphique
export interface GraphState {
  functions: GraphFunction[];
  window: WindowSettings;
  traceMode: boolean;
  traceX?: number;
  traceFunctionIndex?: number;
}

// Options de tracé
export interface PlotOptions {
  resolution: number;
  lineWidth: number;
  antiAlias: boolean;
}

// Résultat de calcul sur courbe
export interface CurveCalculation {
  type: 'VALUE' | 'ZERO' | 'MINIMUM' | 'MAXIMUM' | 'INTERSECTION' | 'DERIVATIVE' | 'INTEGRAL';
  x: number;
  y: number;
  functionIndex?: number;
  additionalInfo?: Record<string, number>;
}

// Options de zoom prédéfinies
export interface ZoomPreset {
  name: string;
  xMin: number;
  xMax: number;
  xScale: number;
  yMin: number;
  yMax: number;
  yScale: number;
}

// Props des composants graphiques
export interface GraphCanvasProps {
  functions: GraphFunction[];
  window: WindowSettings;
  width?: number;
  height?: number;
  onPointClick?: (point: Point) => void;
}

export interface GraphControlsProps {
  onZoom: (preset: ZoomPreset) => void;
  onTrace: () => void;
  onCalculate: (type: CurveCalculation['type']) => void;
}

// Transformation de coordonnées
export interface CoordinateTransform {
  screenToGraph: (screenX: number, screenY: number) => Point;
  graphToScreen: (graphX: number, graphY: number) => Point;
}

// Résultat d'évaluation de fonction
export interface FunctionEvaluation {
  x: number;
  y: number | null;
  error?: string;
}

// Table de valeurs
export interface ValueTable {
  x: number[];
  values: (number | null)[][];
  functionIndices: number[];
}
