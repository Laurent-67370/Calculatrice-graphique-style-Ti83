/**
 * Service de distributions statistiques - TI-83 Plus
 * Implémente toutes les distributions du menu DISTR
 */

export class DistributionService {
  /**
   * Fonction d'erreur (erf) - utilisée pour la distribution normale
   */
  private erf(x: number): number {
    // Approximation de la fonction d'erreur
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }

  /**
   * Distribution normale standard - fonction de densité de probabilité
   */
  normalpdf(x: number, μ: number = 0, σ: number = 1): number {
    if (σ <= 0) throw new Error('σ doit être > 0');
    const z = (x - μ) / σ;
    return (1 / (σ * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
  }

  /**
   * Distribution normale standard - fonction de répartition
   */
  normalcdf(lower: number, upper: number, μ: number = 0, σ: number = 1): number {
    if (σ <= 0) throw new Error('σ doit être > 0');

    const zLower = (lower - μ) / σ;
    const zUpper = (upper - μ) / σ;

    const cdfLower = 0.5 * (1 + this.erf(zLower / Math.sqrt(2)));
    const cdfUpper = 0.5 * (1 + this.erf(zUpper / Math.sqrt(2)));

    return cdfUpper - cdfLower;
  }

  /**
   * Inverse de la distribution normale (quantile)
   */
  invNorm(area: number, μ: number = 0, σ: number = 1): number {
    if (area <= 0 || area >= 1) throw new Error('area doit être entre 0 et 1');
    if (σ <= 0) throw new Error('σ doit être > 0');

    // Approximation de Beasley-Springer-Moro
    const p = area;
    const q = p - 0.5;

    let r: number;
    let val: number;

    if (Math.abs(q) <= 0.425) {
      r = 0.180625 - q * q;
      val = q * (((((((r * 2509.0809287301226727 +
                      33430.575583588128105) * r + 67265.770927008700853) * r +
                    45921.953931549871457) * r + 13731.693765509461125) * r +
                  1971.5909503065514427) * r + 133.14166789178437745) * r +
                3.387132872796366608)
        / (((((((r * 5226.495278852854561 +
                 28729.085735721942674) * r + 39307.89580009271061) * r +
               21213.794301586595867) * r + 5394.1960214247511077) * r +
             687.1870074920579083) * r + 42.313330701600911252) * r + 1);
    } else {
      if (q < 0) {
        r = p;
      } else {
        r = 1 - p;
      }

      r = Math.sqrt(-Math.log(r));

      if (r <= 5) {
        r = r - 1.6;
        val = (((((((r * 7.7454501427834140764e-4 +
                     0.0227238449892691845833) * r + 0.24178072517745061177) *
                   r + 1.27045825245236838258) * r +
                  3.64784832476320460504) * r + 5.7694972214606914055) *
                r + 4.6303378461565452959) * r +
              1.42343711074968357734)
          / (((((((r *
                   1.05075007164441684324e-9 + 5.475938084995344946e-4) *
                  r + 0.0151986665636164571966) * r +
                 0.14810397642748007459) * r + 0.68976733498510000455) *
               r + 1.6763848301838038494) * r +
              2.05319162663775882187) * r + 1);
      } else {
        r = r - 5;
        val = (((((((r * 2.01033439929228813265e-7 +
                     2.71155556874348757815e-5) * r +
                    0.0012426609473880784386) * r + 0.026532189526576123093) *
                  r + 0.29656057182850489123) * r +
                 1.7848265399172913358) * r + 5.4637849111641143699) *
               r + 6.6579046435011037772)
          / (((((((r *
                   2.04426310338993978564e-15 + 1.4215117583164458887e-7) *
                  r + 1.8463183175100546818e-5) * r +
                 7.868691311456132591e-4) * r + 0.0148753612908506148525)
               * r + 0.13692988092273580531) * r +
              0.59983220655588793769) * r + 1);
      }

      if (q < 0) {
        val = -val;
      }
    }

    return μ + σ * val;
  }

  /**
   * Distribution t de Student - fonction de densité de probabilité
   */
  tpdf(x: number, df: number): number {
    if (df <= 0) throw new Error('df doit être > 0');

    const numerator = this.gamma((df + 1) / 2);
    const denominator = Math.sqrt(df * Math.PI) * this.gamma(df / 2);

    return (numerator / denominator) * Math.pow(1 + (x * x) / df, -(df + 1) / 2);
  }

  /**
   * Distribution t de Student - fonction de répartition
   */
  tcdf(lower: number, upper: number, df: number): number {
    if (df <= 0) throw new Error('df doit être > 0');

    return this.integrateSimpson((x) => this.tpdf(x, df), lower, upper, 1000);
  }

  /**
   * Inverse de la distribution t de Student (quantile).
   * Trouve x tel que P(T ≤ x) = area, par dichotomie.
   * P(T ≤ x) est calculé via la symétrie (intégration sur [-|x|,|x|] seulement)
   * pour éviter l'intégration Simpson sur [-∞, x] qui raterait le pic.
   * Utilisé pour les intervalles T (TInterval, 2-SampleTInt).
   */
  invT(area: number, df: number): number {
    if (df <= 0) throw new Error('df doit être > 0');
    if (area <= 0 || area >= 1) throw new Error('area doit être entre 0 et 1');

    // P(T ≤ x) = 0.5 + 0.5·sign(x)·tcdf(-|x|, |x|, df)
    const cdfAt = (x: number): number => {
      if (x === 0) return 0.5;
      const central = this.tcdf(-Math.abs(x), Math.abs(x), df);
      return 0.5 + 0.5 * Math.sign(x) * central;
    };

    let lo = -100, hi = 100;
    for (let i = 0; i < 200; i++) {
      const mid = (lo + hi) / 2;
      if (cdfAt(mid) < area) lo = mid;
      else hi = mid;
      if (hi - lo < 1e-9) break;
    }
    return (lo + hi) / 2;
  }

  /**
   * Distribution Chi-carré - fonction de densité de probabilité
   */
  chi2pdf(x: number, df: number): number {
    if (x < 0) return 0;
    if (df <= 0) throw new Error('df doit être > 0');

    const k = df / 2;
    const numerator = Math.pow(x, k - 1) * Math.exp(-x / 2);
    const denominator = Math.pow(2, k) * this.gamma(k);

    return numerator / denominator;
  }

  /**
   * Distribution Chi-carré - fonction de répartition
   */
  chi2cdf(lower: number, upper: number, df: number): number {
    if (df <= 0) throw new Error('df doit être > 0');

    return this.integrateSimpson((x) => this.chi2pdf(x, df), Math.max(0, lower), upper, 1000);
  }

  /**
   * Distribution F - fonction de densité de probabilité
   */
  Fpdf(x: number, df1: number, df2: number): number {
    // x = 0 est exclu : la formule donnerait 0/0 (NaN) car le dénominateur x·B(a,b)
    // s'annule en même temps que le numérateur. La pdf de Fisher est définie sur x > 0 ;
    // renvoyer 0 à ce seul point n'affecte pas l'intégrale (mesure nulle).
    if (x <= 0) return 0;
    if (df1 <= 0 || df2 <= 0) throw new Error('df1 et df2 doivent être > 0');

    const d1 = df1;
    const d2 = df2;

    const numerator = Math.sqrt(Math.pow(d1 * x, d1) * Math.pow(d2, d2) / Math.pow(d1 * x + d2, d1 + d2));
    const denominator = x * this.beta(d1 / 2, d2 / 2);

    return numerator / denominator;
  }

  /**
   * Distribution F - fonction de répartition
   */
  Fcdf(lower: number, upper: number, df1: number, df2: number): number {
    if (df1 <= 0 || df2 <= 0) throw new Error('df1 et df2 doivent être > 0');

    return this.integrateSimpson((x) => this.Fpdf(x, df1, df2), Math.max(0, lower), upper, 1000);
  }

  /**
   * Distribution binomiale - fonction de masse de probabilité
   */
  binompdf(n: number, p: number, x: number): number {
    if (n < 0 || !Number.isInteger(n)) throw new Error('n doit être un entier ≥ 0');
    if (p < 0 || p > 1) throw new Error('p doit être entre 0 et 1');
    if (x < 0 || !Number.isInteger(x) || x > n) return 0;

    return this.binomialCoeff(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x);
  }

  /**
   * Distribution binomiale - fonction de répartition
   */
  binomcdf(n: number, p: number, x: number): number {
    if (n < 0 || !Number.isInteger(n)) throw new Error('n doit être un entier ≥ 0');
    if (p < 0 || p > 1) throw new Error('p doit être entre 0 et 1');

    let sum = 0;
    for (let i = 0; i <= Math.min(x, n); i++) {
      sum += this.binompdf(n, p, i);
    }
    return sum;
  }

  /**
   * Distribution de Poisson - fonction de masse de probabilité
   */
  poissonpdf(λ: number, x: number): number {
    if (λ <= 0) throw new Error('λ doit être > 0');
    if (x < 0 || !Number.isInteger(x)) return 0;

    return (Math.pow(λ, x) * Math.exp(-λ)) / this.factorial(x);
  }

  /**
   * Distribution de Poisson - fonction de répartition
   */
  poissoncdf(λ: number, x: number): number {
    if (λ <= 0) throw new Error('λ doit être > 0');

    let sum = 0;
    for (let i = 0; i <= Math.floor(x); i++) {
      sum += this.poissonpdf(λ, i);
    }
    return sum;
  }

  /**
   * Distribution géométrique - fonction de masse de probabilité
   */
  geometpdf(p: number, x: number): number {
    if (p <= 0 || p > 1) throw new Error('p doit être entre 0 et 1');
    if (x < 1 || !Number.isInteger(x)) return 0;

    return Math.pow(1 - p, x - 1) * p;
  }

  /**
   * Distribution géométrique - fonction de répartition
   */
  geometcdf(p: number, x: number): number {
    if (p <= 0 || p > 1) throw new Error('p doit être entre 0 et 1');

    return 1 - Math.pow(1 - p, Math.floor(x));
  }

  /**
   * Fonction gamma (extension de la factorielle)
   */
  private gamma(z: number): number {
    // Approximation de Stirling pour gamma
    if (z < 0.5) {
      return Math.PI / (Math.sin(Math.PI * z) * this.gamma(1 - z));
    }

    z -= 1;
    const g = 7;
    const coefficients = [
      0.99999999999980993,
      676.5203681218851,
      -1259.1392167224028,
      771.32342877765313,
      -176.61502916214059,
      12.507343278686905,
      -0.13857109526572012,
      9.9843695780195716e-6,
      1.5056327351493116e-7
    ];

    let x = coefficients[0];
    for (let i = 1; i < g + 2; i++) {
      x += coefficients[i] / (z + i);
    }

    const t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  }

  /**
   * Fonction beta
   */
  private beta(a: number, b: number): number {
    return this.gamma(a) * this.gamma(b) / this.gamma(a + b);
  }

  /**
   * Coefficient binomial C(n, k)
   */
  private binomialCoeff(n: number, k: number): number {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;

    k = Math.min(k, n - k); // Optimisation

    let result = 1;
    for (let i = 0; i < k; i++) {
      result *= (n - i);
      result /= (i + 1);
    }

    return result;
  }

  /**
   * Factorielle
   */
  private factorial(n: number): number {
    if (n < 0) throw new Error('n doit être ≥ 0');
    if (n === 0 || n === 1) return 1;

    // Utiliser gamma pour les grands nombres
    if (n > 170) return this.gamma(n + 1);

    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  /**
   * Intégration numérique par la méthode de Simpson
   */
  private integrateSimpson(f: (x: number) => number, a: number, b: number, n: number = 1000): number {
    if (n % 2 === 1) n++; // n doit être pair

    const h = (b - a) / n;
    let sum = f(a) + f(b);

    for (let i = 1; i < n; i++) {
      const x = a + i * h;
      sum += f(x) * (i % 2 === 0 ? 2 : 4);
    }

    return (h / 3) * sum;
  }
}

export const distributionService = new DistributionService();
