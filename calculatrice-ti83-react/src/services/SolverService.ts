/**
 * Service de résolution d'équations numériques
 * Méthode de Newton-Raphson avec fallback sur la bisection
 */

import { create, all } from 'mathjs';

const math = create(all);

export interface SolverResult {
  success: boolean;
  root?: number;
  iterations?: number;
  error?: string;
}

export class SolverService {
  private readonly MAX_ITERATIONS = 100;
  private readonly TOLERANCE = 1e-10;
  private readonly DERIVATIVE_H = 1e-8;

  /**
   * Évalue une fonction à un point donné
   */
  private evaluateFunction(expression: string, x: number): number {
    try {
      // Remplacer X par la valeur numérique
      const expr = expression.replace(/X/g, `(${x})`);
      return math.evaluate(expr) as number;
    } catch (error) {
      throw new Error('Erreur d\'évaluation de la fonction');
    }
  }

  /**
   * Calcule la dérivée numérique par différences finies
   */
  private derivative(expression: string, x: number): number {
    const f_x = this.evaluateFunction(expression, x);
    const f_x_h = this.evaluateFunction(expression, x + this.DERIVATIVE_H);
    return (f_x_h - f_x) / this.DERIVATIVE_H;
  }

  /**
   * Méthode de Newton-Raphson pour trouver une racine
   */
  private newtonRaphson(expression: string, initialGuess: number): SolverResult {
    let x = initialGuess;

    for (let i = 0; i < this.MAX_ITERATIONS; i++) {
      const fx = this.evaluateFunction(expression, x);

      // Si on est suffisamment proche de zéro
      if (Math.abs(fx) < this.TOLERANCE) {
        return {
          success: true,
          root: x,
          iterations: i + 1,
        };
      }

      const dfx = this.derivative(expression, x);

      // Éviter la division par zéro
      if (Math.abs(dfx) < this.TOLERANCE) {
        // Fallback sur bisection si la dérivée est nulle
        return this.bisection(expression, x - 1, x + 1);
      }

      // Itération de Newton-Raphson: x_{n+1} = x_n - f(x_n) / f'(x_n)
      const xNew = x - fx / dfx;

      // Vérifier la convergence
      if (Math.abs(xNew - x) < this.TOLERANCE) {
        return {
          success: true,
          root: xNew,
          iterations: i + 1,
        };
      }

      x = xNew;
    }

    return {
      success: false,
      error: 'Pas de convergence après ' + this.MAX_ITERATIONS + ' itérations',
    };
  }

  /**
   * Méthode de bisection pour trouver une racine
   */
  private bisection(expression: string, a: number, b: number): SolverResult {
    let fa = this.evaluateFunction(expression, a);
    let fb = this.evaluateFunction(expression, b);

    // Vérifier que f(a) et f(b) ont des signes opposés
    if (fa * fb > 0) {
      return {
        success: false,
        error: 'Pas de changement de signe dans l\'intervalle',
      };
    }

    for (let i = 0; i < this.MAX_ITERATIONS; i++) {
      const c = (a + b) / 2;
      const fc = this.evaluateFunction(expression, c);

      if (Math.abs(fc) < this.TOLERANCE || (b - a) / 2 < this.TOLERANCE) {
        return {
          success: true,
          root: c,
          iterations: i + 1,
        };
      }

      if (fa * fc < 0) {
        b = c;
        fb = fc;
      } else {
        a = c;
        fa = fc;
      }
    }

    return {
      success: false,
      error: 'Pas de convergence après ' + this.MAX_ITERATIONS + ' itérations',
    };
  }

  /**
   * Résout une équation f(X) = 0
   */
  solve(expression: string, initialGuess: number = 0, useBisection: boolean = false): SolverResult {
    try {
      // Validation de l'expression
      if (!expression || expression.trim() === '') {
        return {
          success: false,
          error: 'Expression vide',
        };
      }

      // Essayer d'évaluer l'expression pour vérifier sa validité
      this.evaluateFunction(expression, 0);

      if (useBisection) {
        // Utiliser la bisection avec un intervalle autour de l'estimation
        const delta = Math.max(Math.abs(initialGuess), 1);
        return this.bisection(expression, initialGuess - delta, initialGuess + delta);
      } else {
        // Utiliser Newton-Raphson par défaut
        return this.newtonRaphson(expression, initialGuess);
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Trouve toutes les racines dans un intervalle (scan)
   */
  findRootsInInterval(expression: string, start: number, end: number, samples: number = 20): number[] {
    const roots: number[] = [];
    const step = (end - start) / samples;

    for (let i = 0; i < samples; i++) {
      const x1 = start + i * step;
      const x2 = start + (i + 1) * step;

      try {
        const f1 = this.evaluateFunction(expression, x1);
        const f2 = this.evaluateFunction(expression, x2);

        // Si changement de signe, il y a probablement une racine
        if (f1 * f2 < 0) {
          const result = this.bisection(expression, x1, x2);
          if (result.success && result.root !== undefined) {
            // Vérifier que cette racine n'est pas déjà trouvée
            const isDuplicate = roots.some(r => Math.abs(r - result.root!) < this.TOLERANCE * 10);
            if (!isDuplicate) {
              roots.push(result.root);
            }
          }
        }
      } catch (error) {
        // Ignorer les erreurs d'évaluation (domaine invalide)
        continue;
      }
    }

    return roots;
  }
}

export const solverService = new SolverService();
