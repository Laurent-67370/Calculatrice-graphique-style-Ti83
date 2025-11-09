/**
 * Handlers pour les fonctions LIST (OPS & MATH)
 * Compatible TI-83 Plus
 */

export const listHandlers = {
  // NAMES - Insertion des noms de listes
  L1: () => 'L₁',
  L2: () => 'L₂',
  L3: () => 'L₃',
  L4: () => 'L₄',
  L5: () => 'L₅',
  L6: () => 'L₆',

  // OPS - Opérations sur listes
  sortA: () => 'SortA(',
  sortD: () => 'SortD(',
  dim: () => 'dim(',
  fill: () => 'Fill(',
  seq: () => 'seq(',
  cumSum: () => 'cumSum(',
  deltaList: () => 'ΔList(',

  // MATH - Fonctions mathématiques sur listes
  min: () => 'min(',
  max: () => 'max(',
  mean: () => 'mean(',
  median: () => 'median(',
  sum: () => 'sum(',
  prod: () => 'prod(',
  stdDev: () => 'stdDev(',
  variance: () => 'variance(',
};
