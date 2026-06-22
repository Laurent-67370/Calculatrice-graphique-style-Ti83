import { describe, it, expect } from 'vitest';
import { mathFunctionsService } from '../src/services/MathFunctionsService';

const approx = (a: number, e: number, t = 1e-9) =>
  Math.abs(a - e) <= t || Math.abs((a - e) / (e || 1)) <= t;
const M = mathFunctionsService;

describe('MathFunctionsService — MATH NUM', () => {
  describe('abs / round', () => {
    it('abs(-5) = 5', () => expect(M.abs(-5)).toBe(5));
    it('round(3.14159, 2) = 3.14', () => expect(M.round(3.14159, 2)).toBe(3.14));
    it('round() sans décimales → entier', () => expect(M.round(3.7)).toBe(4));
  });

  // Sémantique TI-83 : iPart = troncature vers zéro, int = greatest integer (floor),
  // fPart = partie fractionnaire signe préservé (x - iPart(x)).
  describe('iPart / fPart / int (sémantique TI-83)', () => {
    it('iPart(-3.7) = -3 (troncature vers zéro)', () => expect(M.iPart(-3.7)).toBe(-3));
    it('int(-3.7) = -4 (greatest integer / floor)', () => expect(M.int(-3.7)).toBe(-4));
    it('fPart(-3.7) = -0.7 (signe préservé)', () => {
      expect(approx(M.fPart(-3.7), -0.7, 1e-9)).toBe(true);
    });
    it('fPart(3.7) = 0.7', () => {
      expect(approx(M.fPart(3.7), 0.7, 1e-9)).toBe(true);
    });
    it('iPart(3.7) = 3, int(3.7) = 3 (identiques sur positif)', () => {
      expect(M.iPart(3.7)).toBe(3);
      expect(M.int(3.7)).toBe(3);
    });
  });

  describe('min / max', () => {
    it('min(3,1,2) = 1', () => expect(M.min(3, 1, 2)).toBe(1));
    it('max(3,1,2) = 3', () => expect(M.max(3, 1, 2)).toBe(3));
  });

  describe('gcd / lcm', () => {
    it('gcd(12,18) = 6', () => expect(M.gcd(12, 18)).toBe(6));
    it('lcm(4,6) = 12', () => expect(M.lcm(4, 6)).toBe(12));
  });

  describe('factorial / nPr / nCr', () => {
    it('factorial(5) = 120', () => expect(M.factorial(5)).toBe(120));
    it('nPr(5,2) = 20', () => expect(M.nPr(5, 2)).toBe(20));
    it('nCr(5,2) = 10', () => expect(M.nCr(5, 2)).toBe(10));
  });

  describe('degrés ↔ radians', () => {
    it('degToRad(180) ≈ π', () => expect(approx(M.degToRad(180), Math.PI, 1e-9)).toBe(true));
    it('radToDeg(π) ≈ 180', () => expect(approx(M.radToDeg(Math.PI), 180, 1e-9)).toBe(true));
  });

  describe('Complexe (CPX)', () => {
    it('complexAbs(3,4) = 5', () => expect(M.complexAbs(3, 4)).toBe(5));
    it('complexConj(3,4) = {3,-4}', () => expect(M.complexConj(3, 4)).toEqual({ real: 3, imag: -4 }));
  });
});
