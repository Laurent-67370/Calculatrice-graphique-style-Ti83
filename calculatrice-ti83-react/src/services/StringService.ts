/**
 * Service de fonctions chaîne - TI-83 Plus
 * Implémente length(, sub(, inString(, expr( du TI-BASIC
 * (accessibles via CATALOG sur une vraie TI-83).
 *
 * V1 : les arguments chaîne sont des littéraux "..." (les variables Str1-Str9
 * ne sont pas encore supportées par le store, qui est numérique).
 */

import { create, all } from 'mathjs';

const math = create(all);

function normalize(expr: string): string {
  return expr
    .replace(/−/g, '-')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'pi')
    .replace(/√\(/g, 'sqrt(')
    .replace(/³√\(/g, 'cbrt(')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/log\(/g, 'log10(')
    .replace(/ln\(/g, 'log(');
}

export class StringService {
  /**
   * length("str") → nombre de caractères de la chaîne.
   */
  length(s: string): number {
    return String(s).length;
  }

  /**
   * sub("str", start, length) → sous-chaîne de `length` caractères
   * à partir de la position `start` (1-based, comme TI-83).
   */
  sub(s: string, start: number, length: number): string {
    const str = String(s);
    const begin = Math.max(0, Math.floor(start) - 1);
    const len = Math.max(0, Math.floor(length));
    return str.substr(begin, len);
  }

  /**
   * inString("haystack", "needle"[, start]) → index (1-based) du premier
   * match à partir de `start` (défaut 1), ou 0 si absent.
   */
  inString(haystack: string, needle: string, start: number = 1): number {
    const hay = String(haystack);
    const ndl = String(needle);
    const begin = Math.max(0, Math.floor(start) - 1);
    const idx = hay.indexOf(ndl, begin);
    return idx < 0 ? 0 : idx + 1;
  }

  /**
   * expr("2+3*4") → évalue la chaîne comme une expression TI-83 et renvoie
   * le résultat numérique.
   */
  expr(s: string): number {
    const result = math.evaluate(normalize(String(s)));
    if (typeof result === 'number') return result;
    return Number(result);
  }
}

export const stringService = new StringService();