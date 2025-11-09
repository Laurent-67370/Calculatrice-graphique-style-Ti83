/**
 * Service pour les outils de dessin (DRAW)
 * Compatible TI-83 Plus
 */

import { create, all } from 'mathjs';
import type { DrawElement, DrawLine, DrawHorizontal, DrawVertical, DrawCircle, DrawText, DrawFunction, DrawShade, DrawPoint, DrawTangent, DrawInverse } from '../types/draw.types';
import type { WindowSettings } from '../types/calculator.types';

const math = create(all);

export class DrawingService {
  /**
   * Convertir une coordonnée graphique X en coordonnée pixel
   */
  static graphToPixelX(x: number, windowSettings: WindowSettings, canvasWidth: number): number {
    const { xMin, xMax } = windowSettings;
    return ((x - xMin) / (xMax - xMin)) * canvasWidth;
  }

  /**
   * Convertir une coordonnée graphique Y en coordonnée pixel
   */
  static graphToPixelY(y: number, windowSettings: WindowSettings, canvasHeight: number): number {
    const { yMin, yMax } = windowSettings;
    // Inverser Y car le canvas a l'origine en haut
    return canvasHeight - ((y - yMin) / (yMax - yMin)) * canvasHeight;
  }

  /**
   * Convertir une coordonnée pixel X en coordonnée graphique
   */
  static pixelToGraphX(px: number, windowSettings: WindowSettings, canvasWidth: number): number {
    const { xMin, xMax } = windowSettings;
    return xMin + (px / canvasWidth) * (xMax - xMin);
  }

  /**
   * Convertir une coordonnée pixel Y en coordonnée graphique
   */
  static pixelToGraphY(py: number, windowSettings: WindowSettings, canvasHeight: number): number {
    const { yMin, yMax } = windowSettings;
    return yMin + ((canvasHeight - py) / canvasHeight) * (yMax - yMin);
  }

  /**
   * Dessiner une ligne
   */
  static drawLine(
    ctx: CanvasRenderingContext2D,
    element: DrawLine,
    windowSettings: WindowSettings,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    const x1Px = this.graphToPixelX(element.x1, windowSettings, canvasWidth);
    const y1Px = this.graphToPixelY(element.y1, windowSettings, canvasHeight);
    const x2Px = this.graphToPixelX(element.x2, windowSettings, canvasWidth);
    const y2Px = this.graphToPixelY(element.y2, windowSettings, canvasHeight);

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1Px, y1Px);
    ctx.lineTo(x2Px, y2Px);
    ctx.stroke();
  }

  /**
   * Dessiner une ligne horizontale
   */
  static drawHorizontal(
    ctx: CanvasRenderingContext2D,
    element: DrawHorizontal,
    windowSettings: WindowSettings,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    const yPx = this.graphToPixelY(element.y, windowSettings, canvasHeight);

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, yPx);
    ctx.lineTo(canvasWidth, yPx);
    ctx.stroke();
  }

  /**
   * Dessiner une ligne verticale
   */
  static drawVertical(
    ctx: CanvasRenderingContext2D,
    element: DrawVertical,
    windowSettings: WindowSettings,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    const xPx = this.graphToPixelX(element.x, windowSettings, canvasWidth);

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(xPx, 0);
    ctx.lineTo(xPx, canvasHeight);
    ctx.stroke();
  }

  /**
   * Dessiner un cercle
   */
  static drawCircle(
    ctx: CanvasRenderingContext2D,
    element: DrawCircle,
    windowSettings: WindowSettings,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    const xPx = this.graphToPixelX(element.x, windowSettings, canvasWidth);
    const yPx = this.graphToPixelY(element.y, windowSettings, canvasHeight);

    // Convertir le rayon en pixels (utiliser la moyenne des échelles X et Y)
    const scaleX = canvasWidth / (windowSettings.xMax - windowSettings.xMin);
    const scaleY = canvasHeight / (windowSettings.yMax - windowSettings.yMin);
    const rPx = element.r * Math.sqrt(scaleX * scaleY);

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(xPx, yPx, rPx, 0, 2 * Math.PI);
    ctx.stroke();
  }

  /**
   * Dessiner du texte
   */
  static drawText(
    ctx: CanvasRenderingContext2D,
    element: DrawText,
    windowSettings: WindowSettings,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    const xPx = this.graphToPixelX(element.x, windowSettings, canvasWidth);
    const yPx = this.graphToPixelY(element.y, windowSettings, canvasHeight);

    ctx.fillStyle = '#000000';
    ctx.font = '10px monospace';
    ctx.fillText(element.text, xPx, yPx);
  }

  /**
   * Dessiner une fonction
   */
  static drawFunction(
    ctx: CanvasRenderingContext2D,
    element: DrawFunction,
    windowSettings: WindowSettings,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    try {
      const compiled = math.compile(element.expr);
      const { xMin, xMax } = windowSettings;
      const step = (xMax - xMin) / canvasWidth;

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.beginPath();

      let firstPoint = true;
      for (let x = xMin; x <= xMax; x += step) {
        try {
          const y = compiled.evaluate({ x, X: x });
          if (typeof y === 'number' && !isNaN(y) && isFinite(y)) {
            const xPx = this.graphToPixelX(x, windowSettings, canvasWidth);
            const yPx = this.graphToPixelY(y, windowSettings, canvasHeight);

            if (firstPoint) {
              ctx.moveTo(xPx, yPx);
              firstPoint = false;
            } else {
              ctx.lineTo(xPx, yPx);
            }
          } else {
            firstPoint = true;
          }
        } catch {
          firstPoint = true;
        }
      }

      ctx.stroke();
    } catch (error) {
      console.error('Erreur DrawF:', error);
    }
  }

  /**
   * Dessiner un ombrage entre deux courbes
   */
  static drawShade(
    ctx: CanvasRenderingContext2D,
    element: DrawShade,
    windowSettings: WindowSettings,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    try {
      const compiled1 = math.compile(element.f1);
      const compiled2 = math.compile(element.f2);
      const { xMin: globalXMin, xMax: globalXMax } = windowSettings;

      // Utiliser les limites spécifiées ou les limites globales
      const xMin = Math.max(element.xMin, globalXMin);
      const xMax = Math.min(element.xMax, globalXMax);
      const step = (xMax - xMin) / canvasWidth;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();

      // Dessiner le contour de la zone à ombrer
      let started = false;
      for (let x = xMin; x <= xMax; x += step) {
        try {
          const y1 = compiled1.evaluate({ x, X: x });
          if (typeof y1 === 'number' && !isNaN(y1) && isFinite(y1)) {
            const xPx = this.graphToPixelX(x, windowSettings, canvasWidth);
            const yPx = this.graphToPixelY(y1, windowSettings, canvasHeight);

            if (!started) {
              ctx.moveTo(xPx, yPx);
              started = true;
            } else {
              ctx.lineTo(xPx, yPx);
            }
          }
        } catch {
          // Ignorer les erreurs d'évaluation
        }
      }

      // Revenir en arrière pour la deuxième courbe
      for (let x = xMax; x >= xMin; x -= step) {
        try {
          const y2 = compiled2.evaluate({ x, X: x });
          if (typeof y2 === 'number' && !isNaN(y2) && isFinite(y2)) {
            const xPx = this.graphToPixelX(x, windowSettings, canvasWidth);
            const yPx = this.graphToPixelY(y2, windowSettings, canvasHeight);
            ctx.lineTo(xPx, yPx);
          }
        } catch {
          // Ignorer les erreurs d'évaluation
        }
      }

      ctx.closePath();
      ctx.fill();
    } catch (error) {
      console.error('Erreur Shade:', error);
    }
  }

  /**
   * Dessiner un point
   */
  static drawPoint(
    ctx: CanvasRenderingContext2D,
    element: DrawPoint,
    windowSettings: WindowSettings,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    if (!element.on) return; // Ne dessiner que si le point est activé

    const xPx = this.graphToPixelX(element.x, windowSettings, canvasWidth);
    const yPx = this.graphToPixelY(element.y, windowSettings, canvasHeight);

    ctx.fillStyle = '#000000';
    ctx.fillRect(xPx - 1, yPx - 1, 3, 3); // Point de 3x3 pixels
  }

  /**
   * Dessiner la tangente à une fonction en un point
   */
  static drawTangent(
    ctx: CanvasRenderingContext2D,
    element: DrawTangent,
    windowSettings: WindowSettings,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    try {
      const compiled = math.compile(element.expr);
      const x0 = element.x;
      const h = 0.0001; // Petit incrément pour la dérivée numérique

      // Calculer f(x0)
      const y0 = compiled.evaluate({ x: x0, X: x0 });
      if (typeof y0 !== 'number' || isNaN(y0) || !isFinite(y0)) {
        console.error('Erreur Tangent: point invalide');
        return;
      }

      // Calculer la dérivée f'(x0) par approximation numérique
      const yPlus = compiled.evaluate({ x: x0 + h, X: x0 + h });
      const yMinus = compiled.evaluate({ x: x0 - h, X: x0 - h });
      const slope = (yPlus - yMinus) / (2 * h);

      // Équation de la tangente: y = f(x0) + f'(x0) * (x - x0)
      const { xMin, xMax } = windowSettings;
      const y1 = y0 + slope * (xMin - x0);
      const y2 = y0 + slope * (xMax - x0);

      // Dessiner la ligne tangente
      const x1Px = this.graphToPixelX(xMin, windowSettings, canvasWidth);
      const y1Px = this.graphToPixelY(y1, windowSettings, canvasHeight);
      const x2Px = this.graphToPixelX(xMax, windowSettings, canvasWidth);
      const y2Px = this.graphToPixelY(y2, windowSettings, canvasHeight);

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x1Px, y1Px);
      ctx.lineTo(x2Px, y2Px);
      ctx.stroke();
    } catch (error) {
      console.error('Erreur Tangent:', error);
    }
  }

  /**
   * Dessiner l'inverse d'une fonction (symétrie par rapport à y=x)
   */
  static drawInverse(
    ctx: CanvasRenderingContext2D,
    element: DrawInverse,
    windowSettings: WindowSettings,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    try {
      const compiled = math.compile(element.expr);
      const { yMin, yMax } = windowSettings;
      const step = (yMax - yMin) / canvasWidth;

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.beginPath();

      let firstPoint = true;
      // Pour l'inverse, on parcourt Y et on calcule X
      for (let y = yMin; y <= yMax; y += step) {
        try {
          // On utilise y comme variable d'entrée pour obtenir x
          const x = compiled.evaluate({ x: y, X: y });
          if (typeof x === 'number' && !isNaN(x) && isFinite(x)) {
            const xPx = this.graphToPixelX(x, windowSettings, canvasWidth);
            const yPx = this.graphToPixelY(y, windowSettings, canvasHeight);

            if (firstPoint) {
              ctx.moveTo(xPx, yPx);
              firstPoint = false;
            } else {
              ctx.lineTo(xPx, yPx);
            }
          } else {
            firstPoint = true;
          }
        } catch {
          firstPoint = true;
        }
      }

      ctx.stroke();
    } catch (error) {
      console.error('Erreur DrawInv:', error);
    }
  }

  /**
   * Dessiner tous les éléments
   */
  static drawAll(
    ctx: CanvasRenderingContext2D,
    elements: DrawElement[],
    windowSettings: WindowSettings,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    for (const element of elements) {
      switch (element.type) {
        case 'line':
          this.drawLine(ctx, element, windowSettings, canvasWidth, canvasHeight);
          break;
        case 'horizontal':
          this.drawHorizontal(ctx, element, windowSettings, canvasWidth, canvasHeight);
          break;
        case 'vertical':
          this.drawVertical(ctx, element, windowSettings, canvasWidth, canvasHeight);
          break;
        case 'circle':
          this.drawCircle(ctx, element, windowSettings, canvasWidth, canvasHeight);
          break;
        case 'text':
          this.drawText(ctx, element, windowSettings, canvasWidth, canvasHeight);
          break;
        case 'function':
          this.drawFunction(ctx, element, windowSettings, canvasWidth, canvasHeight);
          break;
        case 'shade':
          this.drawShade(ctx, element, windowSettings, canvasWidth, canvasHeight);
          break;
        case 'point':
          this.drawPoint(ctx, element, windowSettings, canvasWidth, canvasHeight);
          break;
        case 'tangent':
          this.drawTangent(ctx, element, windowSettings, canvasWidth, canvasHeight);
          break;
        case 'inverse':
          this.drawInverse(ctx, element, windowSettings, canvasWidth, canvasHeight);
          break;
      }
    }
  }
}
