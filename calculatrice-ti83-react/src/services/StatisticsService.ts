/**
 * Service de statistiques pour TI-83 Plus
 * Gère les listes, calculs statistiques et régressions
 */

export interface StatList {
  name: string;
  values: number[];
}

export interface OneVarStats {
  n: number;
  mean: number;
  sumX: number;
  sumX2: number;
  Sx: number;  // Sample std dev
  σx: number;  // Population std dev
  min: number;
  Q1: number;
  median: number;
  Q3: number;
  max: number;
}

export interface TwoVarStats extends OneVarStats {
  meanY: number;
  sumY: number;
  sumXY: number;
  sumY2: number;
  Sy: number;
  σy: number;
}

export interface RegressionResult {
  type: string;
  equation: string;
  a: number;
  b: number;
  c?: number;
  d?: number;
  r?: number;
  r2?: number;
}

export class StatisticsService {
  private lists: Map<string, number[]> = new Map();

  constructor() {
    // Initialiser les 6 listes
    for (let i = 1; i <= 6; i++) {
      this.lists.set(`L${i}`, []);
    }
  }

  /**
   * Obtenir une liste
   */
  getList(name: string): number[] {
    return this.lists.get(name) || [];
  }

  /**
   * Définir une liste
   */
  setList(name: string, values: number[]): void {
    this.lists.set(name, values);
  }

  /**
   * Ajouter une valeur à une liste
   */
  addToList(name: string, value: number): void {
    const list = this.getList(name);
    list.push(value);
    this.lists.set(name, list);
  }

  /**
   * Effacer une liste
   */
  clearList(name: string): void {
    this.lists.set(name, []);
  }

  /**
   * Trier une liste
   */
  sortList(name: string, ascending = true): void {
    const list = this.getList(name);
    list.sort((a, b) => ascending ? a - b : b - a);
    this.lists.set(name, list);
  }

  /**
   * Calculer les statistiques à 1 variable
   */
  calculate1VarStats(listName: string): OneVarStats {
    const data = this.getList(listName).filter(x => !isNaN(x));

    if (data.length === 0) {
      throw new Error('Liste vide');
    }

    const n = data.length;
    const sumX = data.reduce((sum, x) => sum + x, 0);
    const mean = sumX / n;
    const sumX2 = data.reduce((sum, x) => sum + x * x, 0);

    // Écart-type échantillon
    const Sx = Math.sqrt((sumX2 - (sumX * sumX) / n) / (n - 1));

    // Écart-type population
    const σx = Math.sqrt((sumX2 - (sumX * sumX) / n) / n);

    // Trier pour quartiles
    const sorted = [...data].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[n - 1];

    const median = this.calculateMedian(sorted);
    const Q1 = this.calculateMedian(sorted.slice(0, Math.floor(n / 2)));
    const Q3 = this.calculateMedian(sorted.slice(Math.ceil(n / 2)));

    return { n, mean, sumX, sumX2, Sx, σx, min, Q1, median, Q3, max };
  }

  /**
   * Calculer la médiane
   */
  private calculateMedian(sorted: number[]): number {
    const n = sorted.length;
    if (n === 0) return 0;
    if (n % 2 === 0) {
      return (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    }
    return sorted[Math.floor(n / 2)];
  }

  /**
   * Calculer les statistiques à 2 variables
   */
  calculate2VarStats(listX: string, listY: string): TwoVarStats {
    const dataX = this.getList(listX).filter(x => !isNaN(x));
    const dataY = this.getList(listY).filter(x => !isNaN(x));

    const n = Math.min(dataX.length, dataY.length);
    if (n === 0) throw new Error('Listes vides');

    // Stats X
    const sumX = dataX.slice(0, n).reduce((sum, x) => sum + x, 0);
    const sumX2 = dataX.slice(0, n).reduce((sum, x) => sum + x * x, 0);
    const mean = sumX / n;

    // Stats Y
    const sumY = dataY.slice(0, n).reduce((sum, y) => sum + y, 0);
    const sumY2 = dataY.slice(0, n).reduce((sum, y) => sum + y * y, 0);
    const meanY = sumY / n;

    // Produits croisés
    const sumXY = dataX.slice(0, n).reduce((sum, x, i) => sum + x * dataY[i], 0);

    // Écarts-types
    const Sx = Math.sqrt((sumX2 - (sumX * sumX) / n) / (n - 1));
    const σx = Math.sqrt((sumX2 - (sumX * sumX) / n) / n);
    const Sy = Math.sqrt((sumY2 - (sumY * sumY) / n) / (n - 1));
    const σy = Math.sqrt((sumY2 - (sumY * sumY) / n) / n);

    // Quartiles (juste pour X)
    const sortedX = [...dataX.slice(0, n)].sort((a, b) => a - b);
    const min = sortedX[0];
    const max = sortedX[n - 1];
    const median = this.calculateMedian(sortedX);
    const Q1 = this.calculateMedian(sortedX.slice(0, Math.floor(n / 2)));
    const Q3 = this.calculateMedian(sortedX.slice(Math.ceil(n / 2)));

    return {
      n, mean, sumX, sumX2, Sx, σx, min, Q1, median, Q3, max,
      meanY, sumY, sumXY, sumY2, Sy, σy
    };
  }

  /**
   * Régression linéaire : y = ax + b
   */
  linearRegression(listX: string, listY: string): RegressionResult {
    const stats = this.calculate2VarStats(listX, listY);
    const { n, mean, meanY, sumX, sumY, sumXY, sumX2 } = stats;

    const a = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b = meanY - a * mean;

    // Coefficient de corrélation
    const { sumY2 } = stats;
    const r = (n * sumXY - sumX * sumY) /
              Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    const r2 = r * r;

    return {
      type: 'LinReg(ax+b)',
      equation: `y=${a.toFixed(4)}x+${b.toFixed(4)}`,
      a,
      b,
      r,
      r2
    };
  }

  /**
   * Régression quadratique : y = ax² + bx + c
   */
  quadraticRegression(listX: string, listY: string): RegressionResult {
    const dataX = this.getList(listX).filter(x => !isNaN(x));
    const dataY = this.getList(listY).filter(x => !isNaN(x));
    const n = Math.min(dataX.length, dataY.length);

    if (n < 3) throw new Error('Au moins 3 points requis');

    // Calculs des sommes
    let sumX = 0, sumX2 = 0, sumX3 = 0, sumX4 = 0;
    let sumY = 0, sumXY = 0, sumX2Y = 0;

    for (let i = 0; i < n; i++) {
      const x = dataX[i];
      const y = dataY[i];
      sumX += x;
      sumX2 += x * x;
      sumX3 += x * x * x;
      sumX4 += x * x * x * x;
      sumY += y;
      sumXY += x * y;
      sumX2Y += x * x * y;
    }

    // Résolution du système 3x3 (méthode de Cramer simplifiée)
    const denom = n * (sumX2 * sumX4 - sumX3 * sumX3) -
                  sumX * (sumX * sumX4 - sumX2 * sumX3) +
                  sumX2 * (sumX * sumX3 - sumX2 * sumX2);

    const a = (n * (sumX2Y * sumX2 - sumXY * sumX3) -
               sumY * (sumX * sumX2 - sumX2 * sumX2) +
               sumX2Y * (sumX * sumX3 - sumX2 * sumX2)) / denom;

    const b = (n * (sumXY * sumX4 - sumX2Y * sumX3) -
               sumX * (sumY * sumX4 - sumX2Y * sumX2) +
               sumX2 * (sumY * sumX3 - sumXY * sumX2)) / denom;

    const c = (n * (sumX2 * sumX2Y - sumX3 * sumXY) -
               sumX * (sumX * sumX2Y - sumX2 * sumXY) +
               sumX2 * (sumX * sumXY - sumX2 * sumY)) / denom;

    return {
      type: 'QuadReg',
      equation: `y=${a.toFixed(4)}x²+${b.toFixed(4)}x+${c.toFixed(4)}`,
      a, b, c
    };
  }

  /**
   * Régression exponentielle : y = a*b^x
   */
  exponentialRegression(listX: string, listY: string): RegressionResult {
    const dataX = this.getList(listX).filter(x => !isNaN(x));
    const dataY = this.getList(listY).filter(x => !isNaN(x) && x > 0);
    const n = Math.min(dataX.length, dataY.length);

    if (n < 2) throw new Error('Au moins 2 points requis');

    // Transformation logarithmique : ln(y) = ln(a) + x*ln(b)
    const lnY = dataY.map(y => Math.log(y));

    const sumX = dataX.reduce((s, x) => s + x, 0);
    const sumLnY = lnY.reduce((s, y) => s + y, 0);
    const sumXLnY = dataX.reduce((s, x, i) => s + x * lnY[i], 0);
    const sumX2 = dataX.reduce((s, x) => s + x * x, 0);

    const lnB = (n * sumXLnY - sumX * sumLnY) / (n * sumX2 - sumX * sumX);
    const lnA = (sumLnY - lnB * sumX) / n;

    const a = Math.exp(lnA);
    const b = Math.exp(lnB);

    return {
      type: 'ExpReg',
      equation: `y=${a.toFixed(4)}*${b.toFixed(4)}^x`,
      a, b
    };
  }

  /**
   * Régression puissance : y = a*x^b
   */
  powerRegression(listX: string, listY: string): RegressionResult {
    const dataX = this.getList(listX).filter(x => !isNaN(x) && x > 0);
    const dataY = this.getList(listY).filter(x => !isNaN(x) && x > 0);
    const n = Math.min(dataX.length, dataY.length);

    if (n < 2) throw new Error('Au moins 2 points requis');

    // Transformation : ln(y) = ln(a) + b*ln(x)
    const lnX = dataX.map(x => Math.log(x));
    const lnY = dataY.map(y => Math.log(y));

    const sumLnX = lnX.reduce((s, x) => s + x, 0);
    const sumLnY = lnY.reduce((s, y) => s + y, 0);
    const sumLnXLnY = lnX.reduce((s, x, i) => s + x * lnY[i], 0);
    const sumLnX2 = lnX.reduce((s, x) => s + x * x, 0);

    const b = (n * sumLnXLnY - sumLnX * sumLnY) / (n * sumLnX2 - sumLnX * sumLnX);
    const lnA = (sumLnY - b * sumLnX) / n;
    const a = Math.exp(lnA);

    return {
      type: 'PwrReg',
      equation: `y=${a.toFixed(4)}*x^${b.toFixed(4)}`,
      a, b
    };
  }

  /**
   * Régression logarithmique : y = a + b*ln(x)
   */
  logarithmicRegression(listX: string, listY: string): RegressionResult {
    const dataX = this.getList(listX).filter(x => !isNaN(x) && x > 0);
    const dataY = this.getList(listY).filter(x => !isNaN(x));
    const n = Math.min(dataX.length, dataY.length);

    if (n < 2) throw new Error('Au moins 2 points requis');

    const lnX = dataX.map(x => Math.log(x));
    const sumLnX = lnX.reduce((s, x) => s + x, 0);
    const sumY = dataY.reduce((s, y) => s + y, 0);
    const sumLnXY = lnX.reduce((s, x, i) => s + x * dataY[i], 0);
    const sumLnX2 = lnX.reduce((s, x) => s + x * x, 0);

    const b = (n * sumLnXY - sumLnX * sumY) / (n * sumLnX2 - sumLnX * sumLnX);
    const a = (sumY - b * sumLnX) / n;

    return {
      type: 'LnReg',
      equation: `y=${a.toFixed(4)}+${b.toFixed(4)}*ln(x)`,
      a, b
    };
  }
}

// Export singleton
export const statisticsService = new StatisticsService();
