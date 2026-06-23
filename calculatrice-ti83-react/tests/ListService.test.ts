import { describe, it, expect } from 'vitest';
import { ListService } from '../src/services/ListService';

// ListService — opérations LIST OPS & MATH (TI-83 Plus).
// sortA/sortD/fill sont les briques utilisées par l'intercept en place de
// Calculator.tsx pour Fill/SortA/SortD sur les listes L₁-L₆.

describe('ListService — LIST OPS & MATH (TI-83 Plus)', () => {
  describe('SortA( / SortD( — tri', () => {
    it('SortA [3,1,2] = [1,2,3]', () => {
      expect(ListService.sortA([3, 1, 2])).toEqual([1, 2, 3]);
    });
    it('SortD [3,1,2] = [3,2,1]', () => {
      expect(ListService.sortD([3, 1, 2])).toEqual([3, 2, 1]);
    });
    it('SortA gère les négatifs', () => {
      expect(ListService.sortA([-1, 2, -3])).toEqual([-3, -1, 2]);
    });
    it('ne mute pas la liste source', () => {
      const src = [3, 1, 2];
      ListService.sortA(src);
      expect(src).toEqual([3, 1, 2]);
    });
  });

  describe('Fill( / dim( — création & dimension', () => {
    it('Fill(7, 4) = [7,7,7,7]', () => {
      expect(ListService.fill(7, 4)).toEqual([7, 7, 7, 7]);
    });
    it('dim([5,2,8]) = 3', () => {
      expect(ListService.dim([5, 2, 8])).toBe(3);
    });
  });

  describe('seq( — génération', () => {
    // seq() opère sur une expression mathjs : remplacement brut de la variable
    // puis math.compile. Le token ² (U+00B2) n'est pas géré ici (les rewrites
    // ²→^2 sont propres à l'écran home) → utiliser ^ pour la puissance.
    it('seq(X^2,X,1,4,1) = [1,4,9,16] (pas 1)', () => {
      expect(ListService.seq('X^2', 'X', 1, 4, 1)).toEqual([1, 4, 9, 16]);
    });
    it('seq(X,X,0,10,2) = [0,2,4,6,8,10] (pas 2)', () => {
      expect(ListService.seq('X', 'X', 0, 10, 2)).toEqual([0, 2, 4, 6, 8, 10]);
    });
  });

  describe('cumSum( / ΔList(', () => {
    it('cumSum [1,2,3,4,5] = [1,3,6,10,15]', () => {
      expect(ListService.cumSum([1, 2, 3, 4, 5])).toEqual([1, 3, 6, 10, 15]);
    });
    it('ΔList [5,8,12,17,23] = [3,4,5,6]', () => {
      expect(ListService.deltaList([5, 8, 12, 17, 23])).toEqual([3, 4, 5, 6]);
    });
    it('ΔList sur <2 éléments = []', () => {
      expect(ListService.deltaList([7])).toEqual([]);
    });
  });

  describe('LIST MATH — statistiques', () => {
    const L = [2, 5, 3, 8, 1, 6, 4];
    it('min = 1, max = 8', () => {
      expect(ListService.min(L)).toBe(1);
      expect(ListService.max(L)).toBe(8);
    });
    it('mean = 29/7 ≈ 4.1429', () => {
      expect(ListService.mean(L)).toBeCloseTo(29 / 7, 4);
    });
    it('median = 4', () => {
      expect(ListService.median(L)).toBe(4);
    });
    it('sum = 29, prod = 5760', () => {
      expect(ListService.sum(L)).toBe(29);
      expect(ListService.prod(L)).toBe(5760);
    });
    it('stdDev (échantillon) ≈ 2.410', () => {
      expect(ListService.stdDev(L)).toBeCloseTo(2.410, 2);
    });
    it('variance (échantillon) ≈ 5.810', () => {
      expect(ListService.variance(L)).toBeCloseTo(5.810, 2);
    });
  });
});
