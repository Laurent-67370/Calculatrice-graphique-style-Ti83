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
      // Remplacer X, T et θ par la valeur
      let expr = expression
        .replace(/X/g, `(${xValue})`)
        .replace(/T/g, `(${xValue})`)
        .replace(/θ/g, `(${xValue})`);

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
   * Trace une fonction paramétrique (X(T), Y(T))
   */
  private plotParametric(
    funcX: string,
    funcY: string,
    window: WindowSettings,
    transform: CoordinateTransform,
    color: string,
    _angleMode: 'DEGREE' | 'RADIAN' = 'DEGREE'
  ): void {
    if (!this.ctx || !this.canvas) return;

    const ctx = this.ctx;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    let firstPoint = true;
    const numPoints = Math.ceil((window.tMax - window.tMin) / window.tStep);

    for (let i = 0; i <= numPoints; i++) {
      try {
        const t = window.tMin + i * window.tStep;

        // Évaluer X(T) et Y(T)
        // Pour les équations paramétriques, T est toujours en radians
        // même si le mode est DEGREE (comportement TI-83)
        const x = this.evaluateFunction(funcX, t, 'RADIAN');
        const y = this.evaluateFunction(funcY, t, 'RADIAN');

        const screenPoint = transform.graphToScreen(x, y);

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
        firstPoint = true;
      }
    }

    ctx.stroke();
  }

  /**
   * Trace une fonction polaire r(θ)
   */
  private plotPolar(
    func: string,
    window: WindowSettings,
    transform: CoordinateTransform,
    color: string,
    _angleMode: 'DEGREE' | 'RADIAN' = 'DEGREE'
  ): void {
    if (!this.ctx || !this.canvas) return;

    const ctx = this.ctx;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    let firstPoint = true;
    const numPoints = Math.ceil((window.θMax - window.θMin) / window.θStep);

    for (let i = 0; i <= numPoints; i++) {
      try {
        let θ = window.θMin + i * window.θStep;

        // Pour les équations polaires, θ est toujours en radians
        // même si le mode est DEGREE (comportement TI-83)
        const θRad = θ;

        // Évaluer r(θ) - toujours en mode RADIAN
        const r = this.evaluateFunction(func, θ, 'RADIAN');

        // Convertir coordonnées polaires en cartésiennes
        const x = r * Math.cos(θRad);
        const y = r * Math.sin(θRad);

        const screenPoint = transform.graphToScreen(x, y);

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
        firstPoint = true;
      }
    }

    ctx.stroke();
  }

  /**
   * Trace une fonction de séquence u(n)
   * @param func Expression de la séquence (peut référencer n et u(n-1), u(n-2), etc.)
   * @param window Paramètres de fenêtre
   * @param transform Transformation de coordonnées
   * @param color Couleur de tracé
   * @param initValues Valeurs initiales {0: val0, 1: val1, ...}
   * @param plotMode Mode de tracé (DOT ou CONNECTED)
   */
  private plotSequence(
    func: string,
    window: WindowSettings,
    transform: CoordinateTransform,
    color: string,
    initValues: { [n: string]: number },
    plotMode: 'DOT' | 'CONNECTED' = 'CONNECTED'
  ): void {
    if (!this.ctx || !this.canvas) return;

    const ctx = this.ctx;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.5;

    // Calculer les valeurs de la séquence
    const values: { [n: number]: number } = {};

    // Initialiser avec les valeurs initiales
    Object.keys(initValues).forEach(key => {
      values[parseInt(key)] = initValues[key];
    });

    // Calculer les valeurs de la séquence de nMin à nMax
    for (let n = window.nMin; n <= window.nMax; n++) {
      if (values[n] !== undefined) continue; // Déjà initialisé

      try {
        // Remplacer n et les références aux valeurs précédentes dans l'expression
        let expr = func.replace(/n/g, `(${n})`);

        // Remplacer u(n-1), u(n-2), etc. par leurs valeurs calculées
        // Rechercher tous les u(n-k) dans l'expression
        const matches = expr.match(/u\(n-(\d+)\)/g);
        if (matches) {
          matches.forEach(match => {
            const offsetMatch = match.match(/u\(n-(\d+)\)/);
            if (offsetMatch) {
              const offset = parseInt(offsetMatch[1]);
              const prevN = n - offset;
              if (values[prevN] !== undefined) {
                expr = expr.replace(match, `(${values[prevN]})`);
              } else {
                throw new Error(`Valeur u(${prevN}) non définie`);
              }
            }
          });
        }

        // Également supporter u(n-1) écrit simplement comme u
        expr = expr.replace(/\bu\b/g, values[n-1] !== undefined ? `(${values[n-1]})` : '0');

        // Évaluer l'expression
        const value = this.evaluateSequenceExpression(expr);
        values[n] = value;
      } catch (error) {
        // Si erreur, arrêter le calcul de la séquence
        break;
      }
    }

    // Tracer les points selon plotStart et plotStep
    const points: Point[] = [];
    for (let n = window.plotStart; n <= window.nMax; n += window.plotStep) {
      if (values[n] !== undefined) {
        points.push({ x: n, y: values[n] });
      }
    }

    // Dessiner selon le mode
    if (plotMode === 'DOT') {
      // Mode DOT : dessiner uniquement les points
      points.forEach(point => {
        const screenPoint = transform.graphToScreen(point.x, point.y);
        ctx.beginPath();
        ctx.arc(screenPoint.x, screenPoint.y, 2, 0, 2 * Math.PI);
        ctx.fill();
      });
    } else {
      // Mode CONNECTED : dessiner des lignes entre les points
      ctx.beginPath();
      let firstPoint = true;
      points.forEach(point => {
        const screenPoint = transform.graphToScreen(point.x, point.y);
        if (firstPoint) {
          ctx.moveTo(screenPoint.x, screenPoint.y);
          firstPoint = false;
        } else {
          ctx.lineTo(screenPoint.x, screenPoint.y);
        }
      });
      ctx.stroke();
    }
  }

  /**
   * Évalue une expression de séquence (version simplifiée pour les séquences)
   */
  private evaluateSequenceExpression(expression: string): number {
    try {
      // Remplacer les symboles mathématiques
      let expr = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, Math.PI.toString())
        .replace(/\^/g, '**');

      // Gérer les fonctions mathématiques courantes
      expr = expr
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/abs\(/g, 'Math.abs(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/exp\(/g, 'Math.exp(')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(');

      // Évaluer
      const result = Function('"use strict"; return (' + expr + ')')();

      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Résultat invalide');
      }

      return result;
    } catch (error) {
      throw new Error(`Erreur d'évaluation de séquence: ${error}`);
    }
  }

  /**
   * Dessine le graphique complet
   */
  drawGraph(
    functions: GraphFunction[],
    window: WindowSettings,
    angleMode: 'DEGREE' | 'RADIAN' = 'DEGREE',
    statPlots?: [StatPlot, StatPlot, StatPlot],
    lists?: Record<string, number[]>,
    graphMode: 'FUNC' | 'PAR' | 'POL' | 'SEQ' = 'FUNC',
    parametricFunctions?: { x: string[], y: string[] },
    sequenceFunctions?: { functions: string[], initValues: { [key: string]: { [n: string]: number } } },
    plotMode: 'CONNECTED' | 'DOT' = 'CONNECTED'
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

    // Dessiner les fonctions selon le mode
    if (graphMode === 'FUNC') {
      // Mode fonction Y(X)
      functions.forEach((func) => {
        if (func.active && func.expression) {
          this.plotFunction(func, window, transform, angleMode);
        }
      });
    } else if (graphMode === 'PAR' && parametricFunctions) {
      // Mode paramétrique (X(T), Y(T))
      console.log('📐 Mode PAR détecté:', {
        parametricFunctions,
        functions: functions.map(f => ({ active: f.active, expr: f.expression }))
      });
      for (let i = 0; i < 6; i++) {
        console.log(`Fonction ${i}:`, {
          active: functions[i]?.active,
          hasX: !!parametricFunctions.x[i],
          hasY: !!parametricFunctions.y[i],
          x: parametricFunctions.x[i],
          y: parametricFunctions.y[i]
        });
        if (functions[i]?.active && parametricFunctions.x[i] && parametricFunctions.y[i]) {
          console.log(`🎨 Traçage fonction paramétrique ${i+1}:`, parametricFunctions.x[i], parametricFunctions.y[i]);
          this.plotParametric(
            parametricFunctions.x[i],
            parametricFunctions.y[i],
            window,
            transform,
            this.colors[i],
            angleMode
          );
        }
      }
    } else if (graphMode === 'POL') {
      // Mode polaire r(θ)
      functions.forEach((func) => {
        if (func.active && func.expression) {
          this.plotPolar(func.expression, window, transform, func.color || this.colors[func.index], angleMode);
        }
      });
    } else if (graphMode === 'SEQ' && sequenceFunctions) {
      // Mode séquence u(n), v(n), w(n)
      const seqNames = ['u', 'v', 'w'];
      for (let i = 0; i < 3; i++) {
        if (functions[i]?.active && sequenceFunctions.functions[i]) {
          const seqName = seqNames[i];
          const initValues = sequenceFunctions.initValues[seqName] || { 0: 0, 1: 0 };
          this.plotSequence(
            sequenceFunctions.functions[i],
            window,
            transform,
            this.colors[i],
            initValues,
            plotMode
          );
        }
      }
    }
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
