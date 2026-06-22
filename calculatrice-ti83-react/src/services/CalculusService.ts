/**
 * Service de calcul numérique - TI-83 Plus
 * Implémente nDeriv( (dérivée numérique) et fnInt( (intégrale numérique)
 * du menu MATH (MATH>8 nDeriv, MATH>9 fnInt).
 *
 * Sur TI-83, ces fonctions reçoivent une expression NON évaluée et la variable
 * par rapport à laquelle dériver/intégrer. On reproduit ce comportement en
 * évaluant l'expression en plusieurs points via mathjs.
 */

import { create, all } from 'mathjs';

const math = create(all);

/**
 * Normalise les tokens Unicode/TEX de la TI-83 vers la syntaxe mathjs.
 * Reprend le jeu de remplacements de l'évaluateur home screen
 * (Calculator.tsx) afin que les mêmes expressions fonctionnent partout.
 */
function normalize(expr: string): string {
  return expr
    .replace(/−/g, '-')   // moins Unicode U+2212
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'pi')
    .replace(/√\(/g, 'sqrt(')
    .replace(/³√\(/g, 'cbrt(')
    .replace(/²/g, '^2')  // postfix carré
    .replace(/³/g, '^3')  // postfix cube (hors ³√ déjà géré ci-dessus)
    .replace(/log\(/g, 'log10(')   // log() TI = base 10
    .replace(/ln\(/g, 'log(');     // ln() TI = log naturel mathjs
}

export class CalculusService {
  /**
   * Évalue une expression en un point pour une variable donnée.
   * @param exprStr  Expression TI-83 (ex. "X^2", "sin(X)")
   * @param varName  Nom de la variable (ex. "X")
   * @param x        Valeur à laquelle évaluer
   */
  evalAt(exprStr: string, varName: string, x: number): number {
    const scope: Record<string, number> = { [varName]: x };
    const result = math.evaluate(normalize(exprStr), scope);
    if (typeof result === 'number') return result;
    return Number(result);
  }

  /**
   * nDeriv — dérivée numérique par différence symétrique.
   * TI-83: nDeriv(f, var, value[, ε])  avec ε = 1e-3 par défaut.
   * Calcule (f(x+ε) - f(x-ε)) / (2ε).
   */
  nDeriv(exprStr: string, varName: string, value: number, eps: number = 1e-3): number {
    const fPlus = this.evalAt(exprStr, varName, value + eps);
    const fMinus = this.evalAt(exprStr, varName, value - eps);
    return (fPlus - fMinus) / (2 * eps);
  }

  /**
   * fnInt — intégrale numérique par la méthode de Simpson composée.
   * TI-83: fnInt(f, var, lower, upper).
   * N = 1000 intervalles (comme DistributionService.integrateSimpson).
   */
  fnInt(exprStr: string, varName: string, lower: number, upper: number): number {
    const n = 1000;
    const h = (upper - lower) / n;
    let sum = this.evalAt(exprStr, varName, lower) + this.evalAt(exprStr, varName, upper);
    for (let i = 1; i < n; i++) {
      const x = lower + i * h;
      sum += this.evalAt(exprStr, varName, x) * (i % 2 === 0 ? 2 : 4);
    }
    return (h / 3) * sum;
  }
}

export const calculusService = new CalculusService();