import { describe, it, expect } from 'vitest';
import { MatrixService } from '../src/services/MatrixService';

const approx = (a: number, e: number, t = 1e-9) =>
  Math.abs(a - e) <= t || Math.abs((a - e) / (e || 1)) <= t;

// Les méthodes statiques renvoient des math.Matrix ; on récupère le tableau.
const to2D = (r: any): number[][] =>
  (typeof r.toArray === 'function' ? r.toArray() : r) as number[][];
const to1D = (r: any): number[] =>
  (typeof r.toArray === 'function' ? r.toArray() : r) as number[];
const mApprox = (a: number[][], e: number[][], t = 1e-9) => {
  if (a.length !== e.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].length !== e[i].length) return false;
    for (let j = 0; j < a[i].length; j++) if (!approx(a[i][j], e[i][j], t)) return false;
  }
  return true;
};

describe('MatrixService — MATRX MATH/OPS', () => {
  describe('MATH', () => {
    it('det([[1,2],[3,4]]) = -2', () => {
      expect(MatrixService.det([[1, 2], [3, 4]])).toBe(-2);
    });
    it('transpose([[1,2],[3,4]]) = [[1,3],[2,4]]', () => {
      expect(mApprox(to2D(MatrixService.transpose([[1, 2], [3, 4]])), [[1, 3], [2, 4]])).toBe(true);
    });
    it('inverse([[4,7],[2,6]]) (det=10)', () => {
      const inv = to2D(MatrixService.inverse([[4, 7], [2, 6]]));
      expect(mApprox(inv, [[0.6, -0.7], [-0.2, 0.4]])).toBe(true);
    });
    it('identity(3)', () => {
      expect(mApprox(to2D(MatrixService.identity(3)), [[1, 0, 0], [0, 1, 0], [0, 0, 1]])).toBe(true);
    });
    it('augment([A],[B]) — concat horizontale', () => {
      expect(mApprox(to2D(MatrixService.augment([[1, 2], [3, 4]], [[5], [6]])), [[1, 2, 5], [3, 4, 6]])).toBe(true);
    });
  });

  describe('Formes échelonnées', () => {
    it('rref résout le système x+2y=5, 3x+4y=7 → [[1,0,-3],[0,1,4]]', () => {
      expect(mApprox(to2D(MatrixService.rref([[1, 2, 5], [3, 4, 7]])), [[1, 0, -3], [0, 1, 4]])).toBe(true);
    });
    it('ref — pivot à 1, zéro sous le pivot', () => {
      const r = to2D(MatrixService.ref([[1, 2, 5], [3, 4, 7]]));
      expect(approx(r[0][0], 1)).toBe(true);
      expect(approx(r[1][0], 0)).toBe(true);
    });
  });

  describe('Opérations sur lignes (1-based)', () => {
    it('rowSwap([A],1,2)', () => {
      expect(mApprox(to2D(MatrixService.rowSwap([[1, 2], [3, 4]], 1, 2)), [[3, 4], [1, 2]])).toBe(true);
    });
    it('rowSwap hors dimension → throw', () => {
      expect(() => MatrixService.rowSwap([[1, 2], [3, 4]], 9, 1)).toThrow();
    });
    it('*row(2,[A],1)', () => {
      expect(mApprox(to2D(MatrixService.row(2, [[1, 2], [3, 4]], 1)), [[2, 4], [3, 4]])).toBe(true);
    });
    it('*row+(2,[A],1,2) : L2 += 2·L1', () => {
      expect(mApprox(to2D(MatrixService.rowPlus(2, [[1, 1], [1, 1]], 1, 2)), [[1, 1], [3, 3]])).toBe(true);
    });
    it('*row-(2,[A],1,2) : L2 -= 2·L1', () => {
      expect(mApprox(to2D(MatrixService.rowMinus(2, [[1, 1], [5, 5]], 1, 2)), [[1, 1], [3, 3]])).toBe(true);
    });
  });

  describe('Conversions liste ↔ matrice', () => {
    it('matrToList([A],1) → colonne 1', () => {
      expect(to1D(MatrixService.matrToList([[1, 2], [3, 4]], 1))).toEqual([1, 3]);
    });
    it('listToMatr([1,3],[2,4]) → colonnes assemblées', () => {
      expect(mApprox(to2D(MatrixService.listToMatr([1, 3], [2, 4])), [[1, 2], [3, 4]])).toBe(true);
    });
  });

  describe('dim / cumSum', () => {
    it('dim(matrice) → [lignes, cols]', () => {
      expect(to1D(MatrixService.dim([[1, 2, 3], [4, 5, 6]]))).toEqual([2, 3]);
    });
    it('dim(liste) → longueur', () => {
      expect(MatrixService.dim([1, 2, 3, 4])).toBe(4);
    });
    it('cumSum(liste)', () => {
      expect(to1D(MatrixService.cumSum([1, 2, 3]))).toEqual([1, 3, 6]);
    });
  });

  describe('fill / sortA (valeur retournée — la mutation en place est dans Calculator.tsx)', () => {
    it('fill(5, matrice) → matrice pleine de 5', () => {
      expect(mApprox(to2D(MatrixService.fill(5, [[0, 0], [0, 0]])), [[5, 5], [5, 5]])).toBe(true);
    });
    it('sortA(liste) → tri croissant', () => {
      expect(to1D(MatrixService.sortA([3, 1, 2]))).toEqual([1, 2, 3]);
    });
  });
});
