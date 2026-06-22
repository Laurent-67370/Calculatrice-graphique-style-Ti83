import { describe, it, expect } from 'vitest';
import { distributionService } from '../src/services/DistributionService';

const approx = (actual: number, expected: number, tol: number) =>
  Math.abs(actual - expected) <= tol ||
  Math.abs((actual - expected) / (expected || 1)) <= tol;

describe('DistributionService', () => {
  describe('GARDE — Fpdf(0) n\'est pas NaN (bug v3.7.0 → ANOVA)', () => {
    it('Fpdf(0, df1, df2) === 0 (pas NaN)', () => {
      // Avant le fix `x <= 0`, Fpdf(0) faisait 0/0 → NaN → empoisonnait Fcdf.
      expect(distributionService.Fpdf(0, 2, 18)).toBe(0);
      expect(distributionService.Fpdf(0, 1, 5)).toBe(0);
      expect(distributionService.Fpdf(0, 4, 10)).toBe(0);
    });

    it('Fpdf(x < 0) === 0', () => {
      expect(distributionService.Fpdf(-1, 2, 18)).toBe(0);
    });

    it('Fpdf(x > 0) fini et positif', () => {
      const v = distributionService.Fpdf(1.125, 2, 18);
      expect(Number.isFinite(v)).toBe(true);
      expect(v).toBeGreaterThan(0);
    });
  });

  describe('GARDE — Fcdf fini depuis lower=0 (pas NaN)', () => {
    it('Fcdf(0, F, 2, 18) est fini dans ]0,1[', () => {
      const v = distributionService.Fcdf(0, 2.77875, 2, 18);
      expect(Number.isFinite(v)).toBe(true);
      expect(v).toBeGreaterThan(0);
      expect(v).toBeLessThan(1);
    });

    it('Fcdf est croissante (corps de la distribution, plage précise)', () => {
      // Simpson est précis dans le corps (pas fin) ; on vérifie la croissance
      // plutôt qu'une asymptote à 1 (inexacte en queue avec 1000 intervalles).
      const a = distributionService.Fcdf(0, 1, 2, 18);
      const b = distributionService.Fcdf(0, 2, 2, 18);
      const c = distributionService.Fcdf(0, 3, 2, 18);
      expect(a).toBeLessThan(b);
      expect(b).toBeLessThan(c);
    });
  });

  describe('Loi normale', () => {
    it('normalcdf(-∞, 0) ≈ 0.5', () => {
      expect(approx(distributionService.normalcdf(-1e6, 0, 0, 1), 0.5, 1e-9)).toBe(true);
    });

    it('normalcdf(-1, 1) ≈ 0.6827', () => {
      expect(approx(distributionService.normalcdf(-1, 1, 0, 1), 0.682689, 1e-4)).toBe(true);
    });

    it('invNorm(0.975) ≈ 1.96', () => {
      expect(approx(distributionService.invNorm(0.975, 0, 1), 1.96, 1e-3)).toBe(true);
    });

    it('invNorm puis normalcdf round-trip', () => {
      const q = distributionService.invNorm(0.9, 0, 1);
      expect(approx(distributionService.normalcdf(-1e6, q, 0, 1), 0.9, 1e-4)).toBe(true);
    });
  });

  describe('Loi t de Student', () => {
    it('tcdf symétrique : P(-2 < T < 2, df=9) ≈ 0.9234', () => {
      const v = distributionService.tcdf(-2, 2, 9);
      expect(approx(v, 0.9234, 1e-3)).toBe(true);
    });

    it('invT(0.975, 9) ≈ 2.2622', () => {
      expect(approx(distributionService.invT(0.975, 9), 2.2622, 1e-3)).toBe(true);
    });

    it('invT(0.5, df) ≈ 0 (symétrie)', () => {
      expect(approx(distributionService.invT(0.5, 10), 0, 1e-3)).toBe(true);
    });

    it('invT jette sur df ≤ 0', () => {
      expect(() => distributionService.invT(0.5, 0)).toThrow();
      expect(() => distributionService.invT(0.5, -1)).toThrow();
    });

    it('invT jette sur area hors ]0,1[', () => {
      expect(() => distributionService.invT(0, 9)).toThrow();
      expect(() => distributionService.invT(1, 9)).toThrow();
      expect(() => distributionService.invT(1.5, 9)).toThrow();
    });
  });

  describe('χ² et F', () => {
    it('chi2cdf(0, 10, 2) ≈ 0.9933 (p ≈ 0.0067)', () => {
      expect(approx(distributionService.chi2cdf(0, 10, 2), 0.993262, 1e-4)).toBe(true);
    });

    it('chi2pdf(0, df≥3) === 0 ; chi2pdf(0, 2) fini (pas NaN)', () => {
      // df=4 : 0^(k-1)=0 ; df=2 : 0^0=1 → 0.5 (fini). Aucun NaN pour empoisonner chi2cdf.
      expect(distributionService.chi2pdf(0, 4)).toBe(0);
      expect(Number.isFinite(distributionService.chi2pdf(0, 2))).toBe(true);
    });
  });
});
