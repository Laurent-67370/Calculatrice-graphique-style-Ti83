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
import type { StatPlot } from '../store/calculatorStore';

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
   * Dessine un scatter plot (nuage de points)
   */
  private drawScatterPlot(
    plot: StatPlot,
    lists: Record<string, number[]>,
    transform: CoordinateTransform,
    plotIndex: number
  ): void {
    if (!this.ctx || !plot.on) return;

    const xList = lists[plot.xList] || [];
    const yList = lists[plot.yList] || [];
    const minLength = Math.min(xList.length, yList.length);

    if (minLength === 0) return;

    this.ctx.fillStyle = this.colors[plotIndex];
    this.ctx.strokeStyle = this.colors[plotIndex];

    for (let i = 0; i < minLength; i++) {
      const x = xList[i];
      const y = yList[i];

      if (isNaN(x) || isNaN(y)) continue;

      const screenPoint = transform.graphToScreen(x, y);

      // Dessiner le marqueur selon le type
      if (plot.mark === 'square') {
        this.ctx.fillRect(screenPoint.x - 3, screenPoint.y - 3, 6, 6);
      } else if (plot.mark === 'plus') {
        this.ctx.beginPath();
        this.ctx.moveTo(screenPoint.x - 4, screenPoint.y);
        this.ctx.lineTo(screenPoint.x + 4, screenPoint.y);
        this.ctx.moveTo(screenPoint.x, screenPoint.y - 4);
        this.ctx.lineTo(screenPoint.x, screenPoint.y + 4);
        this.ctx.stroke();
      } else {
        // dot
        this.ctx.beginPath();
        this.ctx.arc(screenPoint.x, screenPoint.y, 2, 0, 2 * Math.PI);
        this.ctx.fill();
      }
    }
  }

  /**
   * Dessine un histogramme
   */
  private drawHistogram(
    plot: StatPlot,
    lists: Record<string, number[]>,
    window: WindowSettings,
    transform: CoordinateTransform,
    plotIndex: number
  ): void {
    if (!this.ctx || !plot.on) return;

    const xList = lists[plot.xList] || [];
    if (xList.length === 0) return;

    const data = xList.filter(v => !isNaN(v));
    if (data.length === 0) return;

    // Calculer les bins selon xScale
    const binWidth = window.xScale;
    const minData = Math.min(...data);
    const maxData = Math.max(...data);
    const numBins = Math.ceil((maxData - minData) / binWidth) + 1;

    // Compter les valeurs dans chaque bin
    const bins = new Array(numBins).fill(0);
    data.forEach(value => {
      const binIndex = Math.floor((value - minData) / binWidth);
      if (binIndex >= 0 && binIndex < numBins) {
        bins[binIndex]++;
      }
    });

    // Dessiner les barres
    const ctx = this.ctx;
    ctx.fillStyle = this.colors[plotIndex];
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;

    bins.forEach((count, i) => {
      if (count === 0 || !ctx) return;

      const x = minData + i * binWidth;
      const bottomLeft = transform.graphToScreen(x, 0);
      const topRight = transform.graphToScreen(x + binWidth, count);

      const barX = bottomLeft.x;
      const barY = topRight.y;
      const barWidth = topRight.x - bottomLeft.x;
      const barHeight = bottomLeft.y - topRight.y;

      ctx.fillRect(barX, barY, barWidth, barHeight);
      ctx.strokeRect(barX, barY, barWidth, barHeight);
    });
  }

  /**
   * Dessine un box plot (boîte à moustaches)
   */
  private drawBoxPlot(
    plot: StatPlot,
    lists: Record<string, number[]>,
    window: WindowSettings,
    transform: CoordinateTransform,
    plotIndex: number
  ): void {
    if (!this.ctx || !this.canvas || !plot.on) return;

    const xList = lists[plot.xList] || [];
    const data = xList.filter(v => !isNaN(v)).sort((a, b) => a - b);

    if (data.length === 0) return;

    // Calculer les quartiles
    const n = data.length;
    const min = data[0];
    const max = data[n - 1];
    const Q1 = data[Math.floor(n * 0.25)];
    const median = data[Math.floor(n * 0.5)];
    const Q3 = data[Math.floor(n * 0.75)];

    // Position verticale (au milieu de l'écran)
    const yPos = (window.yMin + window.yMax) / 2 + plotIndex * 0.5;
    const boxHeight = window.yScale * 2;

    this.ctx.strokeStyle = this.colors[plotIndex];
    this.ctx.fillStyle = this.colors[plotIndex];
    this.ctx.lineWidth = 2;

    // Tracer le box plot
    const minPt = transform.graphToScreen(min, yPos);
    const Q1Pt = transform.graphToScreen(Q1, yPos);
    const medianPt = transform.graphToScreen(median, yPos);
    const Q3Pt = transform.graphToScreen(Q3, yPos);
    const maxPt = transform.graphToScreen(max, yPos);

    const boxTop = transform.graphToScreen(0, yPos + boxHeight / 2).y;
    const boxBottom = transform.graphToScreen(0, yPos - boxHeight / 2).y;
    const boxMid = transform.graphToScreen(0, yPos).y;

    // Moustache gauche
    this.ctx.beginPath();
    this.ctx.moveTo(minPt.x, boxMid);
    this.ctx.lineTo(Q1Pt.x, boxMid);
    this.ctx.stroke();

    // Trait min
    this.ctx.beginPath();
    this.ctx.moveTo(minPt.x, boxTop);
    this.ctx.lineTo(minPt.x, boxBottom);
    this.ctx.stroke();

    // Boîte
    this.ctx.strokeRect(Q1Pt.x, boxTop, Q3Pt.x - Q1Pt.x, boxBottom - boxTop);

    // Médiane
    this.ctx.beginPath();
    this.ctx.moveTo(medianPt.x, boxTop);
    this.ctx.lineTo(medianPt.x, boxBottom);
    this.ctx.stroke();

    // Moustache droite
    this.ctx.beginPath();
    this.ctx.moveTo(Q3Pt.x, boxMid);
    this.ctx.lineTo(maxPt.x, boxMid);
    this.ctx.stroke();

    // Trait max
    this.ctx.beginPath();
    this.ctx.moveTo(maxPt.x, boxTop);
    this.ctx.lineTo(maxPt.x, boxBottom);
    this.ctx.stroke();
  }

  /**
   * Dessine le graphique complet
   */
  drawGraph(
    functions: GraphFunction[],
    window: WindowSettings,
    angleMode: 'DEGREE' | 'RADIAN' = 'DEGREE',
    statPlots?: [StatPlot, StatPlot, StatPlot],
    lists?: Record<string, number[]>
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

    // Dessiner les stat plots d'abord (en dessous des fonctions)
    if (statPlots && lists) {
      statPlots.forEach((plot, index) => {
        if (!plot.on) return;

        if (plot.type === 'scatter' || plot.type === 'xyLine') {
          this.drawScatterPlot(plot, lists, transform, index);
        } else if (plot.type === 'histogram') {
          this.drawHistogram(plot, lists, window, transform, index);
        } else if (plot.type === 'modBoxPlot' || plot.type === 'normBoxPlot') {
          this.drawBoxPlot(plot, lists, window, transform, index);
        }
      });
    }

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
      tMin: window.tMin,
      tMax: window.tMax,
      tStep: window.tStep,
      θMin: window.θMin,
      θMax: window.θMax,
      θStep: window.θStep,
      nMin: window.nMin,
      nMax: window.nMax,
      plotStart: window.plotStart,
      plotStep: window.plotStep,
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
      tMin: window.tMin,
      tMax: window.tMax,
      tStep: window.tStep,
      θMin: window.θMin,
      θMax: window.θMax,
      θStep: window.θStep,
      nMin: window.nMin,
      nMax: window.nMax,
      plotStart: window.plotStart,
      plotStep: window.plotStep,
    };
  }

  /**
   * Calcule la dérivée numérique en un point (dy/dx)
   * Utilise la méthode des différences centrées
   */
  derivative(
    expression: string,
    x: number,
    angleMode: 'DEGREE' | 'RADIAN' = 'DEGREE',
    h = 1e-6
  ): number {
    try {
      const yPlus = this.evaluateFunction(expression, x + h, angleMode);
      const yMinus = this.evaluateFunction(expression, x - h, angleMode);
      return (yPlus - yMinus) / (2 * h);
    } catch (error) {
      throw new Error('Erreur lors du calcul de la dérivée');
    }
  }

  /**
   * Trouve l'intersection de deux fonctions
   * Utilise la méthode de Newton-Raphson sur f(x) - g(x) = 0
   */
  findIntersection(
    expression1: string,
    expression2: string,
    xMin: number,
    xMax: number,
    angleMode: 'DEGREE' | 'RADIAN' = 'DEGREE',
    maxIterations = 100
  ): FunctionEvaluation | null {
    // Créer la fonction différence h(x) = f(x) - g(x)
    const differenceFunc = (x: number): number => {
      const y1 = this.evaluateFunction(expression1, x, angleMode);
      const y2 = this.evaluateFunction(expression2, x, angleMode);
      return y1 - y2;
    };

    // Chercher plusieurs points de départ
    const numStarts = 5;
    const step = (xMax - xMin) / numStarts;

    for (let i = 0; i < numStarts; i++) {
      let x = xMin + i * step + step / 2;

      try {
        // Méthode de Newton-Raphson
        for (let iter = 0; iter < maxIterations; iter++) {
          const h = 1e-6;
          const y = differenceFunc(x);

          if (Math.abs(y) < 1e-6) {
            // Vérifier que c'est dans l'intervalle
            if (x >= xMin && x <= xMax) {
              const y1 = this.evaluateFunction(expression1, x, angleMode);
              return { x, y: y1 };
            }
            break;
          }

          // Calculer la dérivée numériquement
          const yPlus = differenceFunc(x + h);
          const derivative = (yPlus - y) / h;

          if (Math.abs(derivative) < 1e-10) {
            break; // Dérivée trop petite
          }

          const xNew = x - y / derivative;

          // Vérifier la convergence
          if (Math.abs(xNew - x) < 1e-8) {
            if (xNew >= xMin && xNew <= xMax && Math.abs(differenceFunc(xNew)) < 1e-6) {
              const y1 = this.evaluateFunction(expression1, xNew, angleMode);
              return { x: xNew, y: y1 };
            }
            break;
          }

          x = xNew;

          // Arrêter si on sort de l'intervalle
          if (x < xMin || x > xMax) {
            break;
          }
        }
      } catch (error) {
        // Essayer le prochain point de départ
        continue;
      }
    }

    return null; // Aucune intersection trouvée
  }
}

// Export singleton
export const graphingEngine = new GraphingEngine();
