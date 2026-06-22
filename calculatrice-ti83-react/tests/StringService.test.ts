import { describe, it, expect } from 'vitest';
import { stringService } from '../src/services/StringService';

describe('StringService — fonctions chaîne TI-BASIC (positions 1-based)', () => {
  describe('length(', () => {
    it('length("hello") = 5', () => {
      expect(stringService.length('hello')).toBe(5);
    });
    it('length("") = 0', () => {
      expect(stringService.length('')).toBe(0);
    });
  });

  describe('sub( — sous-chaîne', () => {
    it('sub("abcdef", 2, 3) = "bcd" (départ 1-based, longueur)', () => {
      expect(stringService.sub('abcdef', 2, 3)).toBe('bcd');
    });
    it('sub("abcdef", 1, 2) = "ab"', () => {
      expect(stringService.sub('abcdef', 1, 2)).toBe('ab');
    });
    it('sub tronque si la longueur dépasse la fin', () => {
      expect(stringService.sub('abcdef', 5, 10)).toBe('ef');
    });
  });

  describe('inString( — recherche', () => {
    it('inString("abcdef", "c") = 3 (1-based)', () => {
      expect(stringService.inString('abcdef', 'c')).toBe(3);
    });
    it('inString non trouvé = 0', () => {
      expect(stringService.inString('abcdef', 'z')).toBe(0);
    });
    it('inString avec départ = 1ère occurrence après pos', () => {
      expect(stringService.inString('abcabc', 'a', 3)).toBe(4);
    });
  });

  describe('expr( — évaluation', () => {
    it('expr("2+3*4") = 14', () => {
      expect(stringService.expr('2+3*4')).toBe(14);
    });
    it('expr("2^10") = 1024', () => {
      expect(stringService.expr('2^10')).toBe(1024);
    });
  });
});
