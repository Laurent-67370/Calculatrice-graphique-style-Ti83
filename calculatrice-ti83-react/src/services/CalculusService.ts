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

  /**
   * fMin / fMax — recherche numérique de l'extremum d'une expression sur
   * [lower, upper]. TI-83: fMin(expr, var, lower, upper) / fMax(...).
   * Retourne la VALEUR DE VAR qui minimise/maximise (pas la valeur de f).
   * Échantillonnage dense (1000 pts) pour localiser la zone, puis raffinement
   * par section dorée autour du meilleur point.
   */
  private optimize(
    exprStr: string,
    varName: string,
    lower: number,
    upper: number,
    maximize: boolean
  ): number {
    const n = 1000;
    const h = (upper - lower) / n;
    let bestX = lower;
    let bestF = this.evalAt(exprStr, varName, lower);
    for (let i = 1; i <= n; i++) {
      const x = lower + i * h;
      const f = this.evalAt(exprStr, varName, x);
      if ((maximize && f > bestF) || (!maximize && f < bestF)) {
        bestF = f;
        bestX = x;
      }
    }
    // Raffinement section dorée autour du meilleur point (±un pas d'échantillonnage)
    const span = Math.max(Math.abs(h), 1e-6);
    let a = Math.max(lower, bestX - span);
    let b = Math.min(upper, bestX + span);
    const phi = (Math.sqrt(5) - 1) / 2;
    let c = b - phi * (b - a);
    let d = a + phi * (b - a);
    let fc = this.evalAt(exprStr, varName, c);
    let fd = this.evalAt(exprStr, varName, d);
    for (let k = 0; k < 60 && Math.abs(b - a) > 1e-9; k++) {
      if ((maximize && fc < fd) || (!maximize && fc > fd)) {
        a = c;
        c = d;
        fc = fd;
        d = a + phi * (b - a);
        fd = this.evalAt(exprStr, varName, d);
      } else {
        b = d;
        d = c;
        fd = fc;
        c = b - phi * (b - a);
        fc = this.evalAt(exprStr, varName, c);
      }
    }
    return (a + b) / 2;
  }

  fMin(exprStr: string, varName: string, lower: number, upper: number): number {
    return this.optimize(exprStr, varName, lower, upper, false);
  }

  fMax(exprStr: string, varName: string, lower: number, upper: number): number {
    return this.optimize(exprStr, varName, lower, upper, true);
  }
}

export const calculusService = new CalculusService();