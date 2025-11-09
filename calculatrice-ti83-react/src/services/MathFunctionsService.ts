/**
 * Service de fonctions mathématiques pour TI-83 Plus
 * NUM, CPX, PRB, DISTR
 */

import { distributionService } from './DistributionService';

export class MathFunctionsService {
  /**
   * MENU NUM - Fonctions numériques
   */

  // Valeur absolue
  abs(x: number): number {
    return Math.abs(x);
  }

  // Arrondir
  round(x: number, decimals = 0): number {
    const factor = Math.pow(10, decimals);
    return Math.round(x * factor) / factor;
  }

  // Partie entière (floor)
  iPart(x: number): number {
    return Math.floor(x);
  }

  // Partie fractionnaire
  fPart(x: number): number {
    return x - Math.floor(x);
  }

  // Partie entière (trunc)
  int(x: number): number {
    return Math.trunc(x);
  }

  // Minimum
  min(...args: number[]): number {
    return Math.min(...args);
  }

  // Maximum
  max(...args: number[]): number {
    return Math.max(...args);
  }

  // PGCD (Plus Grand Commun Diviseur)
  gcd(a: number, b: number): number {
    a = Math.abs(Math.floor(a));
    b = Math.abs(Math.floor(b));

    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  // PPCM (Plus Petit Commun Multiple)
  lcm(a: number, b: number): number {
    return Math.abs((a * b) / this.gcd(a, b));
  }

  /**
   * MENU CPX - Nombres complexes
   */

  // Module d'un nombre complexe
  complexAbs(real: number, imag: number): number {
    return Math.sqrt(real * real + imag * imag);
  }

  // Angle (argument) d'un nombre complexe
  complexAngle(real: number, imag: number): number {
    return Math.atan2(imag, real);
  }

  // Conjugué
  complexConj(real: number, imag: number): { real: number; imag: number } {
    return { real, imag: -imag };
  }

  // Conversion rectangulaire → polaire
  rectToPolar(real: number, imag: number): { r: number; θ: number } {
    return {
      r: this.complexAbs(real, imag),
      θ: this.complexAngle(real, imag)
    };
  }

  // Conversion polaire → rectangulaire
  polarToRect(r: number, θ: number): { real: number; imag: number } {
    return {
      real: r * Math.cos(θ),
      imag: r * Math.sin(θ)
    };
  }

  /**
   * MENU PRB - Probabilités
   */

  // Factorielle
  factorial(n: number): number {
    if (n < 0) throw new Error('n doit être positif');
    if (n > 170) throw new Error('n trop grand (max 170)');

    n = Math.floor(n);
    if (n === 0 || n === 1) return 1;

    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  // Permutations : nPr = n! / (n-r)!
  nPr(n: number, r: number): number {
    n = Math.floor(n);
    r = Math.floor(r);

    if (r < 0 || r > n) throw new Error('0 ≤ r ≤ n requis');

    let result = 1;
    for (let i = 0; i < r; i++) {
      result *= (n - i);
    }
    return result;
  }

  // Combinaisons : nCr = n! / (r! * (n-r)!)
  nCr(n: number, r: number): number {
    n = Math.floor(n);
    r = Math.floor(r);

    if (r < 0 || r > n) throw new Error('0 ≤ r ≤ n requis');

    // Optimisation : C(n,r) = C(n, n-r)
    if (r > n - r) r = n - r;

    let result = 1;
    for (let i = 0; i < r; i++) {
      result *= (n - i);
      result /= (i + 1);
    }
    return Math.round(result);
  }

  // Nombre aléatoire entre 0 et 1
  rand(): number {
    return Math.random();
  }

  // Nombre aléatoire entier entre min et max (inclus)
  randInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Distributions de probabilité
   */

  // Distribution normale standard
  normalPDF(x: number): number {
    return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
  }

  // Distribution normale
  normalPDFWithParams(x: number, μ: number, σ: number): number {
    const z = (x - μ) / σ;
    return (1 / (σ * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
  }

  // Fonction de répartition normale (approximation)
  normalCDF(x: number): number {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - prob : prob;
  }

  // Distribution binomiale : P(X = k) = C(n,k) * p^k * (1-p)^(n-k)
  binomialPDF(n: number, p: number, k: number): number {
    if (k < 0 || k > n) return 0;
    return this.nCr(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  }

  // Distribution binomiale cumulative : P(X ≤ k)
  binomialCDF(n: number, p: number, k: number): number {
    let sum = 0;
    for (let i = 0; i <= k; i++) {
      sum += this.binomialPDF(n, p, i);
    }
    return sum;
  }

  // Distribution de Poisson : P(X = k) = (λ^k * e^(-λ)) / k!
  poissonPDF(λ: number, k: number): number {
    if (k < 0) return 0;
    return (Math.pow(λ, k) * Math.exp(-λ)) / this.factorial(k);
  }

  // Distribution de Poisson cumulative
  poissonCDF(λ: number, k: number): number {
    let sum = 0;
    for (let i = 0; i <= k; i++) {
      sum += this.poissonPDF(λ, i);
    }
    return sum;
  }

  /**
   * Conversions d'angles
   */

  // Degrés → Radians
  degToRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Radians → Degrés
  radToDeg(radians: number): number {
    return radians * (180 / Math.PI);
  }

  /**
   * Fonctions trigonométriques inverses
   */

  // Arcsinus (en radians)
  asin(x: number): number {
    if (x < -1 || x > 1) throw new Error('-1 ≤ x ≤ 1 requis');
    return Math.asin(x);
  }

  // Arccosinus (en radians)
  acos(x: number): number {
    if (x < -1 || x > 1) throw new Error('-1 ≤ x ≤ 1 requis');
    return Math.acos(x);
  }

  // Arctangente (en radians)
  atan(x: number): number {
    return Math.atan(x);
  }

  // Arcsinus (en degrés)
  asinDeg(x: number): number {
    return this.radToDeg(this.asin(x));
  }

  // Arccosinus (en degrés)
  acosDeg(x: number): number {
    return this.radToDeg(this.acos(x));
  }

  // Arctangente (en degrés)
  atanDeg(x: number): number {
    return this.radToDeg(this.atan(x));
  }

  /**
   * Fonctions hyperboliques
   */

  sinh(x: number): number {
    return (Math.exp(x) - Math.exp(-x)) / 2;
  }

  cosh(x: number): number {
    return (Math.exp(x) + Math.exp(-x)) / 2;
  }

  tanh(x: number): number {
    return this.sinh(x) / this.cosh(x);
  }

  // Fonctions hyperboliques inverses
  asinh(x: number): number {
    return Math.log(x + Math.sqrt(x * x + 1));
  }

  acosh(x: number): number {
    if (x < 1) throw new Error('x ≥ 1 requis pour acosh');
    return Math.log(x + Math.sqrt(x * x - 1));
  }

  atanh(x: number): number {
    if (x <= -1 || x >= 1) throw new Error('-1 < x < 1 requis pour atanh');
    return 0.5 * Math.log((1 + x) / (1 - x));
  }

  /**
   * Autres fonctions utiles
   */

  // Somme d'une liste
  sum(values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0);
  }

  // Produit d'une liste
  prod(values: number[]): number {
    return values.reduce((prod, val) => prod * val, 1);
  }

  // Séquence : génère [start, start+step, ..., end]
  seq(start: number, end: number, step = 1): number[] {
    const result: number[] = [];
    if (step > 0) {
      for (let i = start; i <= end; i += step) {
        result.push(i);
      }
    } else if (step < 0) {
      for (let i = start; i >= end; i += step) {
        result.push(i);
      }
    }
    return result;
  }

  // Modulo
  mod(a: number, b: number): number {
    return ((a % b) + b) % b;
  }

  // Reste de division
  remainder(a: number, b: number): number {
    return a % b;
  }

  // Arrondi supérieur (ceil)
  ceil(x: number): number {
    return Math.ceil(x);
  }

  // Arrondi inférieur (floor)
  floor(x: number): number {
    return Math.floor(x);
  }

  // Signe d'un nombre (-1, 0, 1)
  sign(x: number): number {
    return Math.sign(x);
  }

  // Troncature (supprime la partie décimale)
  trunc(x: number): number {
    return Math.trunc(x);
  }

  // Hypoténuse : √(x² + y²)
  hypot(x: number, y: number): number {
    return Math.hypot(x, y);
  }

  // Logarithme en base quelconque
  logBase(x: number, base: number): number {
    return Math.log(x) / Math.log(base);
  }

  // Cube root (racine cubique)
  cbrt(x: number): number {
    return Math.cbrt(x);
  }

  // Exponentiation e^x
  exp(x: number): number {
    return Math.exp(x);
  }

  // Puissance de 10 : 10^x
  pow10(x: number): number {
    return Math.pow(10, x);
  }

  // Conversion degrés → radians
  degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Conversion radians → degrés
  radiansToDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }

  // Nombre aléatoire normal (distribution normale)
  randNorm(μ = 0, σ = 1): number {
    // Box-Muller transform
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return μ + σ * z0;
  }

  // Nombre aléatoire binomial
  randBin(n: number, p: number): number {
    let count = 0;
    for (let i = 0; i < n; i++) {
      if (Math.random() < p) count++;
    }
    return count;
  }

  /**
   * MENU DISTR - Distributions statistiques
   */

  // Distribution normale - PDF
  normalpdf(x: number, μ = 0, σ = 1): number {
    return distributionService.normalpdf(x, μ, σ);
  }

  // Distribution normale - CDF
  normalcdf(lower: number, upper: number, μ = 0, σ = 1): number {
    return distributionService.normalcdf(lower, upper, μ, σ);
  }

  // Inverse de la distribution normale
  invNorm(area: number, μ = 0, σ = 1): number {
    return distributionService.invNorm(area, μ, σ);
  }

  // Distribution t de Student - PDF
  tpdf(x: number, df: number): number {
    return distributionService.tpdf(x, df);
  }

  // Distribution t de Student - CDF
  tcdf(lower: number, upper: number, df: number): number {
    return distributionService.tcdf(lower, upper, df);
  }

  // Distribution Chi-carré - PDF
  chi2pdf(x: number, df: number): number {
    return distributionService.chi2pdf(x, df);
  }

  // Distribution Chi-carré - CDF
  chi2cdf(lower: number, upper: number, df: number): number {
    return distributionService.chi2cdf(lower, upper, df);
  }

  // Distribution F - PDF
  Fpdf(x: number, df1: number, df2: number): number {
    return distributionService.Fpdf(x, df1, df2);
  }

  // Distribution F - CDF
  Fcdf(lower: number, upper: number, df1: number, df2: number): number {
    return distributionService.Fcdf(lower, upper, df1, df2);
  }

  // Distribution binomiale - PDF
  binompdf(n: number, p: number, x: number): number {
    return distributionService.binompdf(n, p, x);
  }

  // Distribution binomiale - CDF
  binomcdf(n: number, p: number, x: number): number {
    return distributionService.binomcdf(n, p, x);
  }

  // Distribution de Poisson - PDF
  poissonpdf(λ: number, x: number): number {
    return distributionService.poissonpdf(λ, x);
  }

  // Distribution de Poisson - CDF
  poissoncdf(λ: number, x: number): number {
    return distributionService.poissoncdf(λ, x);
  }

  // Distribution géométrique - PDF
  geometpdf(p: number, x: number): number {
    return distributionService.geometpdf(p, x);
  }

  // Distribution géométrique - CDF
  geometcdf(p: number, x: number): number {
    return distributionService.geometcdf(p, x);
  }

  /**
   * MENU TEST - Opérateurs de comparaison
   * Retournent 1 (vrai) ou 0 (faux)
   */

  // Égalité
  testEqual(a: number, b: number): number {
    return a === b ? 1 : 0;
  }

  // Non-égalité
  testNotEqual(a: number, b: number): number {
    return a !== b ? 1 : 0;
  }

  // Supérieur
  testGreater(a: number, b: number): number {
    return a > b ? 1 : 0;
  }

  // Supérieur ou égal
  testGreaterEqual(a: number, b: number): number {
    return a >= b ? 1 : 0;
  }

  // Inférieur
  testLess(a: number, b: number): number {
    return a < b ? 1 : 0;
  }

  // Inférieur ou égal
  testLessEqual(a: number, b: number): number {
    return a <= b ? 1 : 0;
  }

  /**
   * MENU LOGIC - Opérateurs logiques
   * Retournent 1 (vrai) ou 0 (faux)
   * 0 = faux, tout autre nombre = vrai
   */

  // ET logique
  logicAnd(a: number, b: number): number {
    return (a !== 0 && b !== 0) ? 1 : 0;
  }

  // OU logique
  logicOr(a: number, b: number): number {
    return (a !== 0 || b !== 0) ? 1 : 0;
  }

  // OU exclusif (XOR)
  logicXor(a: number, b: number): number {
    const aBool = a !== 0;
    const bBool = b !== 0;
    return (aBool !== bBool) ? 1 : 0;
  }

  // NON logique
  logicNot(a: number): number {
    return a === 0 ? 1 : 0;
  }
}

// Export singleton
export const mathFunctionsService = new MathFunctionsService();
