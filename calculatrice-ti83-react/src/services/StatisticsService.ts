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

  /**
   * Régression médiane-médiane : Méthode résistante basée sur les médianes
   */
  medianMedianRegression(listX: string, listY: string): RegressionResult {
    const dataX = this.getList(listX).filter(x => !isNaN(x));
    const dataY = this.getList(listY).filter(x => !isNaN(x));
    const n = Math.min(dataX.length, dataY.length);

    if (n < 3) throw new Error('Au moins 3 points requis');

    // Créer les paires (x, y) et trier par x
    const pairs = dataX.slice(0, n).map((x, i) => ({ x, y: dataY[i] }))
      .sort((a, b) => a.x - b.x);

    // Diviser en 3 groupes
    const groupSize = Math.floor(n / 3);
    const group1 = pairs.slice(0, groupSize);
    const group2 = pairs.slice(groupSize, 2 * groupSize);
    const group3 = pairs.slice(2 * groupSize);

    // Calculer les médianes de chaque groupe
    const median1X = this.calculateMedian(group1.map(p => p.x));
    const median1Y = this.calculateMedian(group1.map(p => p.y));
    const median2X = this.calculateMedian(group2.map(p => p.x));
    const median2Y = this.calculateMedian(group2.map(p => p.y));
    const median3X = this.calculateMedian(group3.map(p => p.x));
    const median3Y = this.calculateMedian(group3.map(p => p.y));

    // Calculer la pente
    const a = (median3Y - median1Y) / (median3X - median1X);

    // Calculer l'ordonnée à l'origine (médiane des 3 intercepts)
    const intercepts = [
      median1Y - a * median1X,
      median2Y - a * median2X,
      median3Y - a * median3X
    ];
    const b = this.calculateMedian(intercepts);

    return {
      type: 'Med-Med',
      equation: `y=${a.toFixed(4)}x+${b.toFixed(4)}`,
      a, b
    };
  }

  /**
   * Régression cubique : y = ax³ + bx² + cx + d
   */
  cubicRegression(listX: string, listY: string): RegressionResult {
    const dataX = this.getList(listX).filter(x => !isNaN(x));
    const dataY = this.getList(listY).filter(x => !isNaN(x));
    const n = Math.min(dataX.length, dataY.length);

    if (n < 4) throw new Error('Au moins 4 points requis');

    // Calculs des sommes nécessaires
    let sumX = 0, sumX2 = 0, sumX3 = 0, sumX4 = 0, sumX5 = 0, sumX6 = 0;
    let sumY = 0, sumXY = 0, sumX2Y = 0, sumX3Y = 0;

    for (let i = 0; i < n; i++) {
      const x = dataX[i];
      const y = dataY[i];
      const x2 = x * x;
      const x3 = x2 * x;
      const x4 = x3 * x;
      const x5 = x4 * x;
      const x6 = x5 * x;

      sumX += x;
      sumX2 += x2;
      sumX3 += x3;
      sumX4 += x4;
      sumX5 += x5;
      sumX6 += x6;
      sumY += y;
      sumXY += x * y;
      sumX2Y += x2 * y;
      sumX3Y += x3 * y;
    }

    // Résolution du système 4x4 par la méthode de Gauss
    const matrix = [
      [n, sumX, sumX2, sumX3, sumY],
      [sumX, sumX2, sumX3, sumX4, sumXY],
      [sumX2, sumX3, sumX4, sumX5, sumX2Y],
      [sumX3, sumX4, sumX5, sumX6, sumX3Y]
    ];

    const coefficients = this.gaussianElimination(matrix);
    const [d, c, b, a] = coefficients;

    return {
      type: 'CubicReg',
      equation: `y=${a.toFixed(4)}x³+${b.toFixed(4)}x²+${c.toFixed(4)}x+${d.toFixed(4)}`,
      a, b, c, d
    };
  }

  /**
   * Régression quartique : y = ax⁴ + bx³ + cx² + dx + e
   */
  quarticRegression(listX: string, listY: string): RegressionResult {
    const dataX = this.getList(listX).filter(x => !isNaN(x));
    const dataY = this.getList(listY).filter(x => !isNaN(x));
    const n = Math.min(dataX.length, dataY.length);

    if (n < 5) throw new Error('Au moins 5 points requis');

    // Calculs des sommes nécessaires
    let sumX = 0, sumX2 = 0, sumX3 = 0, sumX4 = 0, sumX5 = 0, sumX6 = 0, sumX7 = 0, sumX8 = 0;
    let sumY = 0, sumXY = 0, sumX2Y = 0, sumX3Y = 0, sumX4Y = 0;

    for (let i = 0; i < n; i++) {
      const x = dataX[i];
      const y = dataY[i];
      const x2 = x * x;
      const x3 = x2 * x;
      const x4 = x3 * x;
      const x5 = x4 * x;
      const x6 = x5 * x;
      const x7 = x6 * x;
      const x8 = x7 * x;

      sumX += x;
      sumX2 += x2;
      sumX3 += x3;
      sumX4 += x4;
      sumX5 += x5;
      sumX6 += x6;
      sumX7 += x7;
      sumX8 += x8;
      sumY += y;
      sumXY += x * y;
      sumX2Y += x2 * y;
      sumX3Y += x3 * y;
      sumX4Y += x4 * y;
    }

    // Résolution du système 5x5
    const matrix = [
      [n, sumX, sumX2, sumX3, sumX4, sumY],
      [sumX, sumX2, sumX3, sumX4, sumX5, sumXY],
      [sumX2, sumX3, sumX4, sumX5, sumX6, sumX2Y],
      [sumX3, sumX4, sumX5, sumX6, sumX7, sumX3Y],
      [sumX4, sumX5, sumX6, sumX7, sumX8, sumX4Y]
    ];

    const coefficients = this.gaussianElimination(matrix);
    const [e, d, c, b, a] = coefficients;

    return {
      type: 'QuartReg',
      equation: `y=${a.toFixed(4)}x⁴+${b.toFixed(4)}x³+${c.toFixed(4)}x²+${d.toFixed(4)}x+${e.toFixed(4)}`,
      a, b, c, d
    };
  }

  /**
   * Régression sinusoïdale : y = a*sin(bx + c) + d
   * Utilise une approximation par moindres carrés non linéaires simplifiée
   */
  sinusoidalRegression(listX: string, listY: string): RegressionResult {
    const dataX = this.getList(listX).filter(x => !isNaN(x));
    const dataY = this.getList(listY).filter(x => !isNaN(x));
    const n = Math.min(dataX.length, dataY.length);

    if (n < 4) throw new Error('Au moins 4 points requis');

    // Estimer les paramètres initiaux
    const minY = Math.min(...dataY);
    const maxY = Math.max(...dataY);
    const a = (maxY - minY) / 2; // Amplitude
    const d = (maxY + minY) / 2; // Décalage vertical

    // Estimer la période (fréquence b)
    // Trouver les pics pour estimer la période
    let period = (dataX[n - 1] - dataX[0]) / 2;
    const b = (2 * Math.PI) / period;

    // Estimer le déphasage c
    // Trouver le premier maximum
    let maxIndex = 0;
    for (let i = 1; i < n; i++) {
      if (dataY[i] > dataY[maxIndex]) maxIndex = i;
    }
    const c = Math.PI / 2 - b * dataX[maxIndex];

    return {
      type: 'SinReg',
      equation: `y=${a.toFixed(4)}*sin(${b.toFixed(4)}x+${c.toFixed(4)})+${d.toFixed(4)}`,
      a, b, c, d
    };
  }

  /**
   * Régression logistique : y = c / (1 + a*e^(-bx))
   * Utilise une approximation simplifiée
   */
  logisticRegression(listX: string, listY: string): RegressionResult {
    const dataX = this.getList(listX).filter(x => !isNaN(x));
    const dataY = this.getList(listY).filter(x => !isNaN(x) && x > 0);
    const n = Math.min(dataX.length, dataY.length);

    if (n < 3) throw new Error('Au moins 3 points requis');

    // Estimer c (limite supérieure) comme le max des y
    const c = Math.max(...dataY) * 1.1;

    // Transformation logit : ln((c/y) - 1) = ln(a) - bx
    const validPoints = dataX.slice(0, n)
      .map((x, i) => ({ x, y: dataY[i] }))
      .filter(p => p.y < c && p.y > 0);

    if (validPoints.length < 2) throw new Error('Données insuffisantes pour régression logistique');

    const logitY = validPoints.map(p => Math.log(c / p.y - 1));
    const xValues = validPoints.map(p => p.x);

    const sumX = xValues.reduce((s, x) => s + x, 0);
    const sumLogitY = logitY.reduce((s, y) => s + y, 0);
    const sumXLogitY = xValues.reduce((s, x, i) => s + x * logitY[i], 0);
    const sumX2 = xValues.reduce((s, x) => s + x * x, 0);
    const m = validPoints.length;

    const b = -(m * sumXLogitY - sumX * sumLogitY) / (m * sumX2 - sumX * sumX);
    const lnA = (sumLogitY + b * sumX) / m;
    const a = Math.exp(lnA);

    return {
      type: 'Logistic',
      equation: `y=${c.toFixed(4)}/(1+${a.toFixed(4)}*e^(-${b.toFixed(4)}x))`,
      a, b, c
    };
  }

  /**
   * Méthode d'élimination de Gauss pour résoudre un système d'équations linéaires
   * Utilisée pour les régressions polynomiales d'ordre supérieur
   */
  private gaussianElimination(matrix: number[][]): number[] {
    const n = matrix.length;

    // Forward elimination
    for (let i = 0; i < n; i++) {
      // Find pivot
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(matrix[k][i]) > Math.abs(matrix[maxRow][i])) {
          maxRow = k;
        }
      }

      // Swap rows
      [matrix[i], matrix[maxRow]] = [matrix[maxRow], matrix[i]];

      // Make all rows below this one 0 in current column
      for (let k = i + 1; k < n; k++) {
        const factor = matrix[k][i] / matrix[i][i];
        for (let j = i; j <= n; j++) {
          matrix[k][j] -= factor * matrix[i][j];
        }
      }
    }

    // Back substitution
    const solution = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      solution[i] = matrix[i][n];
      for (let j = i + 1; j < n; j++) {
        solution[i] -= matrix[i][j] * solution[j];
      }
      solution[i] /= matrix[i][i];
    }

    return solution;
  }
}

// Export singleton
export const statisticsService = new StatisticsService();
