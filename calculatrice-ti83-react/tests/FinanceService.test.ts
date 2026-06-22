import { describe, it, expect } from 'vitest';
import { financeService } from '../src/services/FinanceService';

const approx = (a: number, e: number, t: number) =>
  Math.abs(a - e) <= t || Math.abs((a - e) / (e || 1)) <= t;

// Scénario de référence : prêt immobilier 100 000 € à 6 %/an sur 30 ans (mensuel).
// Mensualité connue ≈ 599,55 € (versée → PMT négatif). PV>0 (capital reçu), FV=0.
const N = 360, I = 6, PV = 100000, FV = 0, PY = 12, CY = 12;
const PMT = -599.55;

describe('FinanceService — TVM (Time Value of Money)', () => {
  describe('GARDE — solvePMT (forme fermée)', () => {
    it('mensualité du prêt de référence ≈ -599.55', () => {
      const r = financeService.solvePMT(N, I, PV, FV, PY, CY, true);
      expect(r.success).toBe(true);
      expect(approx(r.value!, PMT, 0.05)).toBe(true);
    });
  });

  describe('GARDE — solveN (fix v3.2.1 : ratio inversé)', () => {
    it('nombre de périodes retrouvé ≈ 360', () => {
      const r = financeService.solveN(I, PV, PMT, FV, PY, CY, true);
      expect(r.success).toBe(true);
      expect(approx(r.value!, 360, 0.5)).toBe(true);
    });
  });

  describe('GARDE — solveI (fix v3.2.1 : dérivée de mauvais signe)', () => {
    it('taux retrouvé ≈ 6 %', () => {
      const r = financeService.solveI(N, PV, PMT, FV, PY, CY, true);
      expect(r.success).toBe(true);
      expect(approx(r.value!, I, 0.05)).toBe(true);
    });
  });

  describe('solvePV (forme fermée — annuité)', () => {
    it('PV de 12 mensualités de -100 à 12 %/an ≈ 1125.51 (magnitude)', () => {
      const r = financeService.solvePV(12, 12, -100, 0, 12, 12, true);
      expect(r.success).toBe(true);
      expect(approx(Math.abs(r.value!), 1125.5075, 1e-2)).toBe(true);
    });
  });

  describe('NPV / IRR', () => {
    it('NPV à taux 0 = somme brute des flux + investissement', () => {
      // -1000 + 500 + 500 + 500 = 500
      expect(approx(financeService.calculateNPV(-1000, [500, 500, 500], 0), 500, 1e-9)).toBe(true);
    });

    it('NPV à 10 %', () => {
      // -1000 + 500/1.1 + 500/1.21 + 500/1.331 ≈ 243.43
      expect(approx(financeService.calculateNPV(-1000, [500, 500, 500], 10), 243.43, 1e-2)).toBe(true);
    });

    it('IRR de -1000 → [500,500,500] ≈ 23.4 %', () => {
      const r = financeService.calculateIRR(-1000, [500, 500, 500]);
      expect(r.success).toBe(true);
      expect(approx(r.value!, 23.4, 0.5)).toBe(true);
    });
  });
});
