import { describe, it, expect, beforeEach } from 'vitest';
import { hypothesisTestService } from '../src/services/HypothesisTestService';
import { statisticsService } from '../src/services/StatisticsService';

const approx = (actual: number, expected: number, tol: number) =>
  Math.abs(actual - expected) <= tol ||
  Math.abs((actual - expected) / (expected || 1)) <= tol;

const L1 = [1, 2, 3, 4, 5, 6, 7];
const L2 = [2, 4, 5, 7, 9, 12, 14];
const L3 = [3, 5, 6, 8, 10, 11, 14];

describe('HypothesisTestService — STAT TESTS (15 tests)', () => {
  beforeEach(() => {
    statisticsService.setList('L1', L1);
    statisticsService.setList('L2', L2);
    statisticsService.setList('L3', L3);
  });

  describe('GARDE — ANOVA p-value n\'est pas NaN (bug Fpdf(0) v3.7.0)', () => {
    it('renvoie une p-value finie', () => {
      const r = hypothesisTestService.anova(['L1', 'L2', 'L3']);
      expect(Number.isFinite(r.statValue)).toBe(true);
      expect(r.pValue).not.toBeNaN();           // ← la régression donnait NaN
      expect(Number.isFinite(r.pValue!)).toBe(true);
      expect(r.df).toBe(2);
      expect(r.df2).toBe(18);
    });

    it('F ≈ 2.779, p ≈ 0.090', () => {
      const r = hypothesisTestService.anova(['L1', 'L2', 'L3']);
      expect(approx(r.statValue, 2.77875, 1e-3)).toBe(true);
      expect(approx(r.pValue!, 0.0897, 1e-2)).toBe(true);
    });
  });

  describe('GARDE — LinRegTTest teste la PENTE (bug a/b inversés v3.7.0)', () => {
    it('extras "b" = pente (≈ 2.0), pas l\'ordonnée', () => {
      const r = hypothesisTestService.linRegTTest('L1', 'L2', 0);
      const slope = r.extras.find(e => e.label === 'b')!.value as number;
      expect(approx(slope, 2.0, 1e-6)).toBe(true);          // pente, pas l'ordonnée
    });

    it('t grand et positif (≈ 18) — pas l\'ordonnée à l\'origine', () => {
      const r = hypothesisTestService.linRegTTest('L1', 'L2', 0);
      expect(r.statValue).toBeGreaterThan(10);              // pente très significative
      expect(approx(r.statValue, 18.07, 0.5)).toBe(true);
      expect(approx(r.df!, 5, 1e-9)).toBe(true);
    });

    it('r² ≈ 0.985 (ajustement quasi parfait)', () => {
      const r = hypothesisTestService.linRegTTest('L1', 'L2', 0);
      const r2 = r.extras.find(e => e.label === 'r²')!.value as number;
      expect(approx(r2, 0.9849, 1e-3)).toBe(true);
    });
  });

  describe('Tests Z / T à 1 échantillon', () => {
    it('Z-Test (≠) : z = 5, p ≈ 5.73e-7', () => {
      const r = hypothesisTestService.zTest(0, 1, 0.5, 100, 0);
      expect(approx(r.statValue, 5, 1e-6)).toBe(true);
      expect(approx(r.pValue!, 5.733e-7, 5e-4)).toBe(true);
    });

    it('Z-Test unilatéral (>) : p ≈ 2.87e-7', () => {
      const r = hypothesisTestService.zTest(0, 1, 0.5, 100, 1);
      expect(approx(r.pValue!, 2.867e-7, 5e-4)).toBe(true);
    });

    it('T-Test (≠) : t ≈ 2.108, df = 9', () => {
      const r = hypothesisTestService.tTest(0, 2, 3, 10, 0);
      expect(approx(r.statValue, 2.1082, 1e-3)).toBe(true);
      expect(approx(r.df!, 9, 1e-9)).toBe(true);
    });
  });

  describe('Tests 2 échantillons & proportions', () => {
    it('2-SampZTest : z ≈ 2.121', () => {
      const r = hypothesisTestService.twoSampleZTest(5, 5, 78, 25, 75, 25, 0);
      expect(approx(r.statValue, 3 / Math.sqrt(2), 1e-6)).toBe(true);
    });

    it('2-SampTTest pooled : renvoie t fini et df = 48', () => {
      const r = hypothesisTestService.twoSampleTTest(78, 5, 25, 75, 6, 25, 0, true);
      expect(Number.isFinite(r.statValue)).toBe(true);
      expect(approx(r.df!, 48, 1e-9)).toBe(true);
    });

    it('1-PropZTest (≠) : z = 2, p ≈ 0.0455', () => {
      const r = hypothesisTestService.onePropZTest(0.5, 60, 100, 0);
      expect(approx(r.statValue, 2, 1e-6)).toBe(true);
      expect(approx(r.pValue!, 0.0455, 1e-3)).toBe(true);
    });

    it('2-PropZTest : p ≈ 0.0047', () => {
      const r = hypothesisTestService.twoPropZTest(60, 100, 40, 100, 0);
      expect(approx(r.pValue!, 0.0047, 1e-3)).toBe(true);
    });
  });

  describe('χ²-Test (goodness-of-fit)', () => {
    it('χ² = 10, df = 2 (attendu uniforme)', () => {
      const r = hypothesisTestService.chi2GofTest([10, 20, 30]);
      expect(approx(r.statValue, 10, 1e-6)).toBe(true);
      expect(approx(r.df!, 2, 1e-9)).toBe(true);
      expect(r.pValue).not.toBeNaN();
    });
  });

  describe('Intervalles de confiance', () => {
    it('ZInterval 95% : CI = (±0.196)', () => {
      const r = hypothesisTestService.zInterval(1, 0, 100, 0.95);
      expect(approx(r.ci![0], -0.196, 1e-3)).toBe(true);
      expect(approx(r.ci![1], 0.196, 1e-3)).toBe(true);
    });

    it('TInterval 95% : CI = (±0.715), df = 9', () => {
      const r = hypothesisTestService.tInterval(0, 1, 10, 0.95);
      expect(approx(r.ci![0], -0.7154, 2e-3)).toBe(true);
      expect(approx(r.df!, 9, 1e-9)).toBe(true);
    });

    it('1-PropZInt : CI autour de p̂ = 0.6', () => {
      const r = hypothesisTestService.onePropZInterval(60, 100, 0.95);
      const phat = r.extras.find(e => e.label === 'p̂')!.value as number;
      expect(approx(phat, 0.6, 1e-9)).toBe(true);
      expect(r.ci![0]).toBeLessThan(0.6);
      expect(r.ci![1]).toBeGreaterThan(0.6);
    });

    it('2-PropZInt : contient la différence p̂1-p̂2 = 0.2', () => {
      const r = hypothesisTestService.twoPropZInterval(60, 100, 40, 100, 0.95);
      expect(r.ci![0]).toBeLessThan(0.2);
      expect(r.ci![1]).toBeGreaterThan(0.2);
    });
  });

  describe('Cohérence globale', () => {
    it('les 15 tests renvoient une statistique finie', () => {
      const results = [
        hypothesisTestService.zTest(0, 1, 0.5, 100, 0),
        hypothesisTestService.tTest(0, 2, 3, 10, 0),
        hypothesisTestService.twoSampleZTest(5, 5, 78, 25, 75, 25, 0),
        hypothesisTestService.twoSampleTTest(78, 5, 25, 75, 6, 25, 0, false),
        hypothesisTestService.onePropZTest(0.5, 60, 100, 0),
        hypothesisTestService.twoPropZTest(60, 100, 40, 100, 0),
        hypothesisTestService.chi2GofTest([10, 20, 30]),
        hypothesisTestService.zInterval(1, 0, 100, 0.95),
        hypothesisTestService.tInterval(0, 1, 10, 0.95),
        hypothesisTestService.twoSampleZInterval(5, 5, 78, 25, 75, 25, 0.95),
        hypothesisTestService.twoSampleTInterval(78, 5, 25, 75, 6, 25, 0.95, false),
        hypothesisTestService.onePropZInterval(60, 100, 0.95),
        hypothesisTestService.twoPropZInterval(60, 100, 40, 100, 0.95),
        hypothesisTestService.linRegTTest('L1', 'L2', 0),
        hypothesisTestService.anova(['L1', 'L2', 'L3']),
      ];
      for (const r of results) {
        expect(Number.isFinite(r.statValue)).toBe(true);
      }
    });
  });
});
