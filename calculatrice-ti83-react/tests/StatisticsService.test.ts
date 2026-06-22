import { describe, it, expect, beforeEach } from 'vitest';
import { statisticsService } from '../src/services/StatisticsService';

const approx = (actual: number, expected: number, tol: number) =>
  Math.abs(actual - expected) <= tol ||
  Math.abs((actual - expected) / (expected || 1)) <= tol;

const L1 = [1, 2, 3, 4, 5, 6, 7];
const L2 = [2, 4, 5, 7, 9, 12, 14];

describe('StatisticsService', () => {
  beforeEach(() => {
    statisticsService.setList('L1', L1);
    statisticsService.setList('L2', L2);
  });

  describe('GARDE — linearRegression : a = pente, b = ordonnée (convention interne)', () => {
    // statisticsService utilise y = a·x + b (a=pente, b=ordonnée) — INVERSE de la TI-83
    // qui affiche y = a + b·x. LinRegTTest dépend de cette convention. Ce test la verrouille.
    it('a ≈ 2.0 (pente), b ≈ -0.43 (ordonnée à l\'origine)', () => {
      const reg = statisticsService.linearRegression('L1', 'L2');
      expect(approx(reg.a, 2.0, 1e-6)).toBe(true);     // pente
      expect(approx(reg.b, -0.428571, 1e-5)).toBe(true); // ordonnée
    });

    it('l\'équation est au format "y=a·x+b" (pente devant x)', () => {
      const reg = statisticsService.linearRegression('L1', 'L2');
      expect(reg.equation).toMatch(/^y=2\.0000x\+-0\.4286$/);
    });

    it('a = Σ(xi-mx)(yi-my) / Σ(xi-mx)² (recalcul indépendant)', () => {
      const xs = statisticsService.getList('L1');
      const ys = statisticsService.getList('L2');
      const n = xs.length;
      const mx = xs.reduce((s, x) => s + x, 0) / n;
      const my = ys.reduce((s, y) => s + y, 0) / n;
      let sxy = 0, sxx = 0;
      for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
      const reg = statisticsService.linearRegression('L1', 'L2');
      expect(approx(reg.a, sxy / sxx, 1e-9)).toBe(true);
    });

    it('r et r² cohérents (r² = r·r, r > 0)', () => {
      const reg = statisticsService.linearRegression('L1', 'L2');
      expect(approx(reg.r2!, reg.r! * reg.r!, 1e-9)).toBe(true);
      expect(reg.r).toBeGreaterThan(0.98);
    });
  });

  describe('Gestion des listes', () => {
    it('setList / getList round-trip', () => {
      statisticsService.setList('L4', [10, 20, 30]);
      expect(statisticsService.getList('L4')).toEqual([10, 20, 30]);
    });

    it('getList sur liste inconnue → []', () => {
      expect(statisticsService.getList('LNOPE')).toEqual([]);
    });
  });

  describe('Stats 1 variable', () => {
    it('calculate1VarStats : n, mean, sumX', () => {
      const s = statisticsService.calculate1VarStats('L1');
      expect(s.n).toBe(7);
      expect(approx(s.mean, 4, 1e-9)).toBe(true);
      expect(approx(s.sumX, 28, 1e-9)).toBe(true);
    });
  });
});
