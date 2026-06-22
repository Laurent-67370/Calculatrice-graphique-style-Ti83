import { describe, it, expect } from 'vitest';
import { calculusService } from '../src/services/CalculusService';

const approx = (a: number, e: number, t: number) =>
  Math.abs(a - e) <= t || Math.abs((a - e) / (e || 1)) <= t;

describe('CalculusService — calcul numérique (MATH)', () => {
  describe('nDeriv — dérivée numérique (différence symétrique)', () => {
    it('nDeriv(X^2, X, 3) ≈ 6', () => {
      expect(approx(calculusService.nDeriv('X^2', 'X', 3), 6, 1e-2)).toBe(true);
    });
    it('nDeriv(sin(X), X, 0) ≈ 1', () => {
      expect(approx(calculusService.nDeriv('sin(X)', 'X', 0), 1, 1e-2)).toBe(true);
    });
    it('nDeriv(cos(X), X, 0) ≈ 0', () => {
      expect(approx(calculusService.nDeriv('cos(X)', 'X', 0), 0, 1e-2)).toBe(true);
    });
  });

  describe('fnInt — intégrale numérique (Simpson)', () => {
    it('fnInt(X^2, X, 0, 2) ≈ 8/3 = 2.6667', () => {
      expect(approx(calculusService.fnInt('X^2', 'X', 0, 2), 8 / 3, 1e-3)).toBe(true);
    });
    it('fnInt(sin(X), X, 0, π) ≈ 2', () => {
      expect(approx(calculusService.fnInt('sin(X)', 'X', 0, Math.PI), 2, 1e-3)).toBe(true);
    });
    it('fnInt(constante 5, X, 0, 10) = 50', () => {
      expect(approx(calculusService.fnInt('5', 'X', 0, 10), 50, 1e-6)).toBe(true);
    });
  });

  describe('fMin / fMax — optimisation numérique', () => {
    it('fMin(X^2, X, -2, 2) ≈ 0', () => {
      expect(approx(calculusService.fMin('X^2', 'X', -2, 2), 0, 1e-2)).toBe(true);
    });
    it('fMax(-X^2+2X, X, -2, 3) ≈ 1 (sommet -b/2a)', () => {
      expect(approx(calculusService.fMax('-X^2+2*X', 'X', -2, 3), 1, 1e-2)).toBe(true);
    });
    it('fMin(sin(X), X, 0, 6) ≈ 3π/2 ≈ 4.712', () => {
      expect(approx(calculusService.fMin('sin(X)', 'X', 0, 6), 3 * Math.PI / 2, 1e-2)).toBe(true);
    });
  });
});
