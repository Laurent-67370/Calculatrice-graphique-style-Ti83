/**
 * Service de fonctions mathématiques pour TI-83 Plus
 * NUM, CPX, PRB
 */

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
}

// Export singleton
export const mathFunctionsService = new MathFunctionsService();
