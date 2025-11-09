/**
 * Service pour les opérations sur les listes (LIST OPS & MATH)
 * Compatible TI-83 Plus
 */

import { create, all } from 'mathjs';

const math = create(all);

export class ListService {

  // ==================== OPS ====================

  /**
   * SortA - Trier une liste par ordre croissant
   * @param list Liste à trier
   * @returns Liste triée par ordre croissant
   */
  static sortA(list: number[]): number[] {
    return [...list].sort((a, b) => a - b);
  }

  /**
   * SortD - Trier une liste par ordre décroissant
   * @param list Liste à trier
   * @returns Liste triée par ordre décroissant
   */
  static sortD(list: number[]): number[] {
    return [...list].sort((a, b) => b - a);
  }

  /**
   * dim - Retourner la dimension (taille) d'une liste
   * @param list Liste
   * @returns Nombre d'éléments dans la liste
   */
  static dim(list: number[]): number {
    return list.length;
  }

  /**
   * Fill - Remplir une liste avec une valeur
   * @param value Valeur à utiliser pour remplir
   * @param size Taille de la liste à créer
   * @returns Liste remplie avec la valeur
   */
  static fill(value: number, size: number): number[] {
    return Array(size).fill(value);
  }

  /**
   * seq - Générer une séquence selon une expression
   * @param expr Expression mathématique (doit contenir la variable)
   * @param variable Nom de la variable (ex: 'X')
   * @param start Valeur de départ
   * @param end Valeur de fin
   * @param step Pas (optionnel, défaut = 1)
   * @returns Liste générée selon la séquence
   */
  static seq(expr: string, variable: string, start: number, end: number, step: number = 1): number[] {
    const result: number[] = [];

    try {
      // Normaliser l'expression : remplacer la variable par 'x' pour mathjs
      const normalizedExpr = expr.replace(new RegExp(variable, 'gi'), 'x');
      const compiledExpr = math.compile(normalizedExpr);

      for (let i = start; step > 0 ? i <= end : i >= end; i += step) {
        const value = compiledExpr.evaluate({ x: i });
        result.push(typeof value === 'number' ? value : 0);
      }
    } catch (error) {
      console.error('Erreur dans seq:', error);
      return [];
    }

    return result;
  }

  /**
   * cumSum - Calculer la somme cumulée d'une liste
   * @param list Liste de nombres
   * @returns Liste des sommes cumulées
   */
  static cumSum(list: number[]): number[] {
    const result: number[] = [];
    let sum = 0;

    for (const value of list) {
      sum += value;
      result.push(sum);
    }

    return result;
  }

  /**
   * ΔList (Delta List) - Calculer les différences successives
   * @param list Liste de nombres
   * @returns Liste des différences (list[i+1] - list[i])
   */
  static deltaList(list: number[]): number[] {
    if (list.length < 2) return [];

    const result: number[] = [];
    for (let i = 0; i < list.length - 1; i++) {
      result.push(list[i + 1] - list[i]);
    }

    return result;
  }

  // ==================== MATH ====================

  /**
   * min - Trouver le minimum d'une liste
   * @param list Liste de nombres
   * @returns Valeur minimale
   */
  static min(list: number[]): number {
    if (list.length === 0) return NaN;
    return Math.min(...list);
  }

  /**
   * max - Trouver le maximum d'une liste
   * @param list Liste de nombres
   * @returns Valeur maximale
   */
  static max(list: number[]): number {
    if (list.length === 0) return NaN;
    return Math.max(...list);
  }

  /**
   * mean - Calculer la moyenne d'une liste
   * @param list Liste de nombres
   * @returns Moyenne
   */
  static mean(list: number[]): number {
    if (list.length === 0) return NaN;
    return this.sum(list) / list.length;
  }

  /**
   * median - Calculer la médiane d'une liste
   * @param list Liste de nombres
   * @returns Médiane
   */
  static median(list: number[]): number {
    if (list.length === 0) return NaN;

    const sorted = [...list].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      // Si pair, moyenne des deux valeurs centrales
      return (sorted[middle - 1] + sorted[middle]) / 2;
    } else {
      // Si impair, valeur centrale
      return sorted[middle];
    }
  }

  /**
   * sum - Calculer la somme d'une liste
   * @param list Liste de nombres
   * @returns Somme de tous les éléments
   */
  static sum(list: number[]): number {
    if (list.length === 0) return 0;
    return list.reduce((acc, val) => acc + val, 0);
  }

  /**
   * prod (product) - Calculer le produit d'une liste
   * @param list Liste de nombres
   * @returns Produit de tous les éléments
   */
  static prod(list: number[]): number {
    if (list.length === 0) return 1;
    return list.reduce((acc, val) => acc * val, 1);
  }

  /**
   * stdDev - Calculer l'écart-type d'une liste
   * @param list Liste de nombres
   * @returns Écart-type (sample standard deviation)
   */
  static stdDev(list: number[]): number {
    if (list.length <= 1) return NaN;
    return Math.sqrt(this.variance(list));
  }

  /**
   * variance - Calculer la variance d'une liste
   * @param list Liste de nombres
   * @returns Variance (sample variance)
   */
  static variance(list: number[]): number {
    if (list.length <= 1) return NaN;

    const avg = this.mean(list);
    const squaredDiffs = list.map(x => Math.pow(x - avg, 2));

    // Variance d'échantillon (division par n-1)
    return this.sum(squaredDiffs) / (list.length - 1);
  }
}
