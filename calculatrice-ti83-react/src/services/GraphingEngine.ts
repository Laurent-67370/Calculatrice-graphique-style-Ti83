/**
 * Moteur de graphiques optimisé pour TI-83 Plus
 */

import type {
  WindowSettings,
  GraphFunction,
  Point,
  ZoomPreset,
  FunctionEvaluation,
  CoordinateTransform,
} from '../types';

export class GraphingEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  // Couleurs pour les 6 fonctions
  private readonly colors = [
    '#000000', // Y1 - Noir
    '#0000FF', // Y2 - Bleu
    '#FF0000', // Y3 - Rouge
    '#00FF00', // Y4 - Vert
    '#FF00FF', // Y5 - Magenta
    '#00FFFF', // Y6 - Cyan
  ];

  // Presets de zoom
  private readonly zoomPresets: Record<string, ZoomPreset> = {
    standard: {
      name: 'Standard',
      xMin: -10,
      xMax: 10,
      xScale: 1,
      yMin: -10,
      yMax: 10,
      yScale: 1,
    },
    decimal: {
      name: 'Decimal',
      xMin: -4.7,
      xMax: 4.7,
      xScale: 1,
      yMin: -3.1,
      yMax: 3.1,
      yScale: 1,
    },
    trig: {
      name: 'Trigonométrique',
      xMin: -2 * Math.PI,
      xMax: 2 * Math.PI,
      xScale: Math.PI / 2,
      yMin: -4,
      yMax: 4,
      yScale: 1,
    },
    square: {
      name: 'Carré',
      xMin: -7.5,
      xMax: 7.5,
      xScale: 1,
      yMin: -5,
      yMax: 5,
      yScale: 1,
    },
  };

  constructor() {}

  /**
   * Initialise le canvas
   */
  setCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  /**
   * Évalue une expression mathématique pour une valeur de X donnée
   */
  evaluateFunction(expression: string, xValue: number, angleMode: 'DEGREE' | 'RADIAN' = 'DEGREE'): number {
    if (!expression || expression.trim() === '') {
      throw new Error('Expression vide');
    }

    try {
      // Remplacer X par la valeur
      let expr = expression.replace(/X/g, `(${xValue})`);

      // Remplacer les symboles
      expr = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, Math.PI.toString())
        .replace(/\^/g, '**');

      // Gérer les fonctions trigonométriques
      if (angleMode === 'DEGREE') {
        expr = expr.replace(/sin\(/g, `Math.sin((Math.PI/180)*`);
        expr = expr.replace(/cos\(/g, `Math.cos((Math.PI/180)*`);
        expr = expr.replace(/tan\(/g, `Math.tan((Math.PI/180)*`);
      } else {
        expr = expr.replace(/sin\(/g, 'Math.sin(');
        expr = expr.replace(/cos\(/g, 'Math.cos(');
        expr = expr.replace(/tan\(/g, 'Math.tan(');
      }

      // Gérer les autres fonctions
      expr = expr
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/abs\(/g, 'Math.abs(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/exp\(/g, 'Math.exp(');

      // Évaluer l'expression
      const result = Function('"use strict"; return (' + expr + ')')();

      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Résultat invalide');
      }

      return result;
    } catch (error) {
      throw new Error(`Erreur d'évaluation: ${error}`);
    }
  }

  /**
   * Convertit les coordonnées écran en coordonnées graphiques
   */
  createCoordinateTransform(
    window: WindowSettings,
    canvasWidth: number,
    canvasHeight: number
  ): CoordinateTransform {
    const xRange = window.xMax - window.xMin;
    const yRange = window.yMax - window.yMin;

    return {
      screenToGraph: (screenX: number, screenY: number): Point => ({
        x: window.xMin + (screenX / canvasWidth) * xRange,
        y: window.yMax - (screenY / canvasHeight) * yRange,
      }),

      graphToScreen: (graphX: number, graphY: number): Point => ({
        x: ((graphX - window.xMin) / xRange) * canvasWidth,
        y: ((window.yMax - graphY) / yRange) * canvasHeight,
      }),
    };
  }

  /**
   * Dessine la grille et les axes
   */
  private drawGrid(window: WindowSettings, transform: CoordinateTransform): void {
    if (!this.ctx || !this.canvas) return;

    const { width, height } = this.canvas;
    const ctx = this.ctx;

    // Effacer le canvas
    ctx.fillStyle = '#9ca99c';
    ctx.fillRect(0, 0, width, height);

    // Dessiner la grille
    ctx.strokeStyle = '#7a877a';
    ctx.lineWidth = 0.5;

    // Lignes verticales
    for (let x = Math.ceil(window.xMin / window.xScale) * window.xScale; x <= window.xMax; x += window.xScale) {
      const screenPoint = transform.graphToScreen(x, 0);
      ctx.beginPath();
      ctx.moveTo(screenPoint.x, 0);
      ctx.lineTo(screenPoint.x, height);
      ctx.stroke();
    }

    // Lignes horizontales
    for (let y = Math.ceil(window.yMin / window.yScale) * window.yScale; y <= window.yMax; y += window.yScale) {
      const screenPoint = transform.graphToScreen(0, y);
      ctx.beginPath();
      ctx.moveTo(0, screenPoint.y);
      ctx.lineTo(width, screenPoint.y);
      ctx.stroke();
    }

    // Dessiner les axes
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;

    // Axe X
    const xAxisY = transform.graphToScreen(0, 0).y;
    if (xAxisY >= 0 && xAxisY <= height) {
      ctx.beginPath();
      ctx.moveTo(0, xAxisY);
      ctx.lineTo(width, xAxisY);
      ctx.stroke();
    }

    // Axe Y
    const yAxisX = transform.graphToScreen(0, 0).x;
    if (yAxisX >= 0 && yAxisX <= width) {
      ctx.beginPath();
      ctx.moveTo(yAxisX, 0);
      ctx.lineTo(yAxisX, height);
      ctx.stroke();
    }
  }

  /**
   * Trace une fonction
   */
  private plotFunction(
    func: GraphFunction,
    _window: WindowSettings,
    transform: CoordinateTransform,
    angleMode: 'DEGREE' | 'RADIAN' = 'DEGREE'
  ): void {
    if (!this.ctx || !this.canvas || !func.active || !func.expression) return;

    const ctx = this.ctx;
    const { width } = this.canvas;
    const pixelStep = 1;

    ctx.strokeStyle = func.color || this.colors[func.index];
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    let firstPoint = true;

    for (let screenX = 0; screenX <= width; screenX += pixelStep) {
      try {
        const graphPoint = transform.screenToGraph(screenX, 0);
        const y = this.evaluateFunction(func.expression, graphPoint.x, angleMode);
        const screenPoint = transform.graphToScreen(graphPoint.x, y);

        if (screenPoint.y >= -100 && screenPoint.y <= this.canvas.height + 100) {
          if (firstPoint) {
            ctx.moveTo(screenPoint.x, screenPoint.y);
            firstPoint = false;
          } else {
            ctx.lineTo(screenPoint.x, screenPoint.y);
          }
        } else {
          firstPoint = true;
        }
      } catch (error) {
        // Discontinuité - commencer un nouveau segment
        firstPoint = true;
      }
    }

    ctx.stroke();
  }

  /**
   * Dessine le graphique complet
   */
  drawGraph(
    functions: GraphFunction[],
    window: WindowSettings,
    angleMode: 'DEGREE' | 'RADIAN' = 'DEGREE'
  ): void {
    if (!this.ctx || !this.canvas) {
      console.warn('Canvas non initialisé');
      return;
    }

    const transform = this.createCoordinateTransform(
      window,
      this.canvas.width,
      this.canvas.height
    );

    // Dessiner la grille et les axes
    this.drawGrid(window, transform);

    // Tracer chaque fonction active
    functions.forEach((func) => {
      if (func.active && func.expression) {
        this.plotFunction(func, window, transform, angleMode);
      }
    });
  }

  /**
   * Calcule un point sur une fonction
   */
  calculateValue(
    expression: string,
    x: number,
    angleMode: 'DEGREE' | 'RADIAN' = 'DEGREE'
  ): FunctionEvaluation {
    try {
      const y = this.evaluateFunction(expression, x, angleMode);
      return { x, y };
    } catch (error) {
      return {
        x,
        y: null,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Trouve un zéro de la fonction (méthode de Newton-Raphson)
   */
  findZero(
    expression: string,
    xStart: number,
    angleMode: 'DEGREE' | 'RADIAN' = 'DEGREE',
    maxIterations = 50,
    tolerance = 1e-6
  ): Point | null {
    let x = xStart;
    const h = 1e-6;

    for (let i = 0; i < maxIterations; i++) {
      try {
        const y = this.evaluateFunction(expression, x, angleMode);

        if (Math.abs(y) < tolerance) {
          return { x, y };
        }

        // Dérivée numérique
        const yPlus = this.evaluateFunction(expression, x + h, angleMode);
        const derivative = (yPlus - y) / h;

        if (Math.abs(derivative) < 1e-10) {
          break;
        }

        x = x - y / derivative;
      } catch (error) {
        return null;
      }
    }

    return null;
  }

  /**
   * Trouve un minimum local
   */
  findMinimum(
    expression: string,
    xMin: number,
    xMax: number,
    angleMode: 'DEGREE' | 'RADIAN' = 'DEGREE'
  ): Point | null {
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const tolerance = 1e-5;
    let a = xMin;
    let b = xMax;

    try {
      while (Math.abs(b - a) > tolerance) {
        const c = b - (b - a) / goldenRatio;
        const d = a + (b - a) / goldenRatio;

        const yc = this.evaluateFunction(expression, c, angleMode);
        const yd = this.evaluateFunction(expression, d, angleMode);

        if (yc < yd) {
          b = d;
        } else {
          a = c;
        }
      }

      const x = (a + b) / 2;
      const y = this.evaluateFunction(expression, x, angleMode);
      return { x, y };
    } catch (error) {
      return null;
    }
  }

  /**
   * Trouve un maximum local
   */
  findMaximum(
    expression: string,
    xMin: number,
    xMax: number,
    angleMode: 'DEGREE' | 'RADIAN' = 'DEGREE'
  ): Point | null {
    // Inverser la fonction pour trouver le maximum
    const negExpression = `-(${expression})`;
    const min = this.findMinimum(negExpression, xMin, xMax, angleMode);

    if (min) {
      return { x: min.x, y: -min.y };
    }

    return null;
  }

  /**
   * Calcule l'intégrale définie (règle de Simpson)
   */
  integrate(
    expression: string,
    a: number,
    b: number,
    angleMode: 'DEGREE' | 'RADIAN' = 'DEGREE',
    n = 1000
  ): number {
    if (n % 2 !== 0) n++; // n doit être pair pour Simpson

    const h = (b - a) / n;
    let sum = this.evaluateFunction(expression, a, angleMode) +
              this.evaluateFunction(expression, b, angleMode);

    for (let i = 1; i < n; i++) {
      const x = a + i * h;
      const y = this.evaluateFunction(expression, x, angleMode);
      sum += i % 2 === 0 ? 2 * y : 4 * y;
    }

    return (h / 3) * sum;
  }

  /**
   * Obtient un preset de zoom
   */
  getZoomPreset(name: string): ZoomPreset | undefined {
    return this.zoomPresets[name];
  }

  /**
   * Liste tous les presets de zoom
   */
  getAllZoomPresets(): ZoomPreset[] {
    return Object.values(this.zoomPresets);
  }

  /**
   * Calcule un zoom in
   */
  calculateZoomIn(window: WindowSettings, factor = 2): WindowSettings {
    const xRange = window.xMax - window.xMin;
    const yRange = window.yMax - window.yMin;
    const xCenter = (window.xMax + window.xMin) / 2;
    const yCenter = (window.yMax + window.yMin) / 2;

    return {
      xMin: xCenter - xRange / (2 * factor),
      xMax: xCenter + xRange / (2 * factor),
      xScale: window.xScale / factor,
      yMin: yCenter - yRange / (2 * factor),
      yMax: yCenter + yRange / (2 * factor),
      yScale: window.yScale / factor,
    };
  }

  /**
   * Calcule un zoom out
   */
  calculateZoomOut(window: WindowSettings, factor = 2): WindowSettings {
    const xRange = window.xMax - window.xMin;
    const yRange = window.yMax - window.yMin;
    const xCenter = (window.xMax + window.xMin) / 2;
    const yCenter = (window.yMax + window.yMin) / 2;

    return {
      xMin: xCenter - (xRange * factor) / 2,
      xMax: xCenter + (xRange * factor) / 2,
      xScale: window.xScale * factor,
      yMin: yCenter - (yRange * factor) / 2,
      yMax: yCenter + (yRange * factor) / 2,
      yScale: window.yScale * factor,
    };
  }
}

// Export singleton
export const graphingEngine = new GraphingEngine();
