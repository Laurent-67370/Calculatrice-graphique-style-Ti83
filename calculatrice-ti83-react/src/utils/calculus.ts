/**
 * Utilitaire d'extraction des appels nDeriv(...) / fnInt(...) d'une expression
 * home-screen et de leur remplacement par la valeur numérique calculée.
 *
 * Ces fonctions TI-83 reçoivent une expression NON évaluée (ex. nDeriv(X^2,X,3))
 * et la variable par rapport à laquelle dériver/intégrer. La substitution
 * X→0 et mathjs ne sauraient pas les traiter directement : il faut les
 * extraire avant l'évaluation principale.
 */

import { create, all } from 'mathjs';
import { calculusService } from '../services/CalculusService';

const math = create(all);

export function extractCalculusCalls(expr: string): string {
  const evaluateNumericArg = (arg: string): number => {
    const v = math.evaluate(arg);
    return typeof v === 'number' ? v : Number(v);
  };

  const processOne = (name: 'nDeriv' | 'fnInt' | 'fMin' | 'fMax'): boolean => {
    const token = name + '(';
    const start = expr.indexOf(token);
    if (start < 0) return false;
    let i = start + token.length;
    let depth = 1;
    const args: string[] = [];
    let cur = '';
    while (i < expr.length && depth > 0) {
      const ch = expr[i];
      if (ch === '(') { depth++; cur += ch; }
      else if (ch === ')') {
        depth--;
        if (depth === 0) args.push(cur);
        else cur += ch;
      } else if (ch === ',' && depth === 1) { args.push(cur); cur = ''; }
      else cur += ch;
      i++;
    }
    if (depth !== 0) return false;
    const end = i;

    try {
      let value: number;
      if (name === 'nDeriv') {
        // nDeriv(expr, var, value[, ε])
        const [fStr, varName, valStr, epsStr] = args;
        const val = evaluateNumericArg(valStr);
        const eps = epsStr !== undefined && epsStr !== '' ? evaluateNumericArg(epsStr) : 1e-3;
        value = calculusService.nDeriv(fStr, varName, val, eps);
      } else if (name === 'fnInt') {
        // fnInt(expr, var, lower, upper)
        const [fStr, varName, loStr, upStr] = args;
        value = calculusService.fnInt(fStr, varName, evaluateNumericArg(loStr), evaluateNumericArg(upStr));
      } else {
        // fMin(expr, var, lower, upper) / fMax(expr, var, lower, upper)
        const [fStr, varName, loStr, upStr] = args;
        value = name === 'fMin'
          ? calculusService.fMin(fStr, varName, evaluateNumericArg(loStr), evaluateNumericArg(upStr))
          : calculusService.fMax(fStr, varName, evaluateNumericArg(loStr), evaluateNumericArg(upStr));
      }
      const rounded = Math.round(value * 1e10) / 1e10;
      expr = expr.slice(0, start) + '(' + rounded + ')' + expr.slice(end);
      return true;
    } catch {
      // Laisser l'expression telle quelle → mathjs signalera l'erreur
      return false;
    }
  };

  // Traiter tous les appels présents (plusieurs possibles).
  let guard = 0;
  while (guard++ < 50 && (processOne('nDeriv') || processOne('fnInt') || processOne('fMin') || processOne('fMax'))) {
    /* boucle */
  }
  return expr;
}