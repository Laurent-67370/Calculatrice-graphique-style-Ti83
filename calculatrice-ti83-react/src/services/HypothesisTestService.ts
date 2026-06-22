/**
 * Service de tests d'hypothèses et d'intervalles de confiance - TI-83 Plus
 * Implémente les 15 tests du menu STAT > TESTS.
 *
 * Réutilise distributionService (normalcdf, invNorm, tcdf, invT, chi2cdf, Fcdf)
 * et statisticsService (listes, régression).
 *
 * alt ∈ { -1: '<' , 0: '≠' , 1: '>' }.
 */

import { distributionService } from './DistributionService';
import { statisticsService } from './StatisticsService';

export interface TestExtra {
  label: string;
  value: number | string;
}

export interface TestResult {
  statName: string;        // "z", "t", "χ²", "F"
  statValue: number;
  pValue?: number;
  df?: number;
  df2?: number;            // second df (ANOVA: den)
  ci?: [number, number];   // intervalle de confiance
  extras: TestExtra[];     // lignes additionnelles (x̄, n, p̂, ...)
}

const INF = 1e6;

// Φ(z) pour la loi normale standard
const Phi = (z: number) => distributionService.normalcdf(-INF, z, 0, 1);
// p-value bilatérale à partir de |z|
const twoSidedZ = (z: number) => 2 * (1 - Phi(Math.abs(z)));

/**
 * Fonction de répartition de la loi t : P(T ≤ x).
 * Utilise la symétrie pour n'intégrer que sur [-|x|, |x|] (plage saine pour
 * Simpson), évitant l'intégration sur [-∞, x] qui rate le pic.
 *   P(T ≤ x) = 0.5 + 0.5·sign(x)·P(-|x| < T < |x|)
 */
const tCdf = (x: number, df: number): number => {
  if (x === 0) return 0.5;
  const central = distributionService.tcdf(-Math.abs(x), Math.abs(x), df);
  return 0.5 + 0.5 * Math.sign(x) * central;
};
// p-value bilatérale t : P(|T| > |t|) = 1 - P(-|t| < T < |t|)
const twoSidedT = (t: number, df: number) =>
  1 - distributionService.tcdf(-Math.abs(t), Math.abs(t), df);

interface SampleStats { n: number; mean: number; Sx: number; sumX: number; sumX2: number; }

/**
 * Stats d'échantillon à partir d'une liste + fréquences (optionnel).
 * Sx = écart-type d'échantillon (n-1).
 */
function sampleStats(listName: string, freqListName?: string): SampleStats {
  const data = statisticsService.getList(listName).filter(x => !isNaN(x));
  if (data.length === 0) throw new Error('Liste vide');
  let freq: number[];
  if (freqListName) {
    const f = statisticsService.getList(freqListName).filter(x => !isNaN(x));
    if (f.length !== data.length) throw new Error('Freq: dimension incompatible');
    freq = f;
  } else {
    freq = data.map(() => 1);
  }
  let n = 0, sumX = 0, sumX2 = 0;
  for (let i = 0; i < data.length; i++) {
    n += freq[i];
    sumX += freq[i] * data[i];
    sumX2 += freq[i] * data[i] * data[i];
  }
  if (n < 1) throw new Error('n < 1');
  const mean = sumX / n;
  const Sx = n > 1 ? Math.sqrt((sumX2 - (sumX * sumX) / n) / (n - 1)) : 0;
  return { n, mean, Sx, sumX, sumX2 };
}

export class HypothesisTestService {
  // ---- Tests Z / T à 1 échantillon ----

  /** Z-Test (1 échantillon, σ connu). */
  zTest(mu0: number, sigma: number, mean: number, n: number, alt: number): TestResult {
    if (sigma <= 0) throw new Error('σ > 0 requis');
    if (n < 1) throw new Error('n ≥ 1 requis');
    const se = sigma / Math.sqrt(n);
    const z = (mean - mu0) / se;
    let p: number;
    if (alt === 0) p = twoSidedZ(z);
    else if (alt === 1) p = 1 - Phi(z);
    else p = Phi(z);
    return { statName: 'z', statValue: z, pValue: p, extras: [
      { label: 'x̄', value: mean }, { label: 'n', value: n },
    ] };
  }

  /** T-Test (1 échantillon, σ inconnu). */
  tTest(mu0: number, mean: number, Sx: number, n: number, alt: number): TestResult {
    if (n < 2) throw new Error('n ≥ 2 requis');
    const se = Sx / Math.sqrt(n);
    const t = (mean - mu0) / se;
    const df = n - 1;
    let p: number;
    if (alt === 0) p = twoSidedT(t, df);
    else if (alt === 1) p = 1 - tCdf(t, df);
    else p = tCdf(t, df);
    return { statName: 't', statValue: t, pValue: p, df, extras: [
      { label: 'x̄', value: mean }, { label: 'Sx', value: Sx }, { label: 'n', value: n },
    ] };
  }

  // ---- Tests Z / T à 2 échantillons ----

  /** 2-Sample Z-Test. */
  twoSampleZTest(sigma1: number, sigma2: number,
    mean1: number, n1: number, mean2: number, n2: number, alt: number): TestResult {
    const se = Math.sqrt(sigma1 * sigma1 / n1 + sigma2 * sigma2 / n2);
    const z = (mean1 - mean2) / se;
    let p: number;
    if (alt === 0) p = twoSidedZ(z);
    else if (alt === 1) p = 1 - Phi(z);
    else p = Phi(z);
    return { statName: 'z', statValue: z, pValue: p, extras: [
      { label: 'x̄1', value: mean1 }, { label: 'n1', value: n1 },
      { label: 'x̄2', value: mean2 }, { label: 'n2', value: n2 },
    ] };
  }

  /** 2-Sample T-Test (pooled ou Satterthwaite). */
  twoSampleTTest(mean1: number, Sx1: number, n1: number,
    mean2: number, Sx2: number, n2: number, alt: number, pooled: boolean): TestResult {
    let se: number, df: number;
    if (pooled) {
      const Sp2 = ((n1 - 1) * Sx1 * Sx1 + (n2 - 1) * Sx2 * Sx2) / (n1 + n2 - 2);
      const Sp = Math.sqrt(Sp2);
      se = Sp * Math.sqrt(1 / n1 + 1 / n2);
      df = n1 + n2 - 2;
    } else {
      const v1 = Sx1 * Sx1 / n1, v2 = Sx2 * Sx2 / n2;
      se = Math.sqrt(v1 + v2);
      df = (v1 + v2) * (v1 + v2) / ((v1 * v1) / (n1 - 1) + (v2 * v2) / (n2 - 1));
    }
    const t = (mean1 - mean2) / se;
    let p: number;
    if (alt === 0) p = twoSidedT(t, df);
    else if (alt === 1) p = 1 - tCdf(t, df);
    else p = tCdf(t, df);
    return { statName: 't', statValue: t, pValue: p, df, extras: [
      { label: 'x̄1', value: mean1 }, { label: 'Sx1', value: Sx1 }, { label: 'n1', value: n1 },
      { label: 'x̄2', value: mean2 }, { label: 'Sx2', value: Sx2 }, { label: 'n2', value: n2 },
    ] };
  }

  // ---- Tests de proportions ----

  /** 1-Prop Z-Test. */
  onePropZTest(p0: number, x: number, n: number, alt: number): TestResult {
    if (n < 1) throw new Error('n ≥ 1 requis');
    const phat = x / n;
    const z = (phat - p0) / Math.sqrt(p0 * (1 - p0) / n);
    let p: number;
    if (alt === 0) p = twoSidedZ(z);
    else if (alt === 1) p = 1 - Phi(z);
    else p = Phi(z);
    return { statName: 'z', statValue: z, pValue: p, extras: [
      { label: 'p̂', value: phat }, { label: 'n', value: n },
    ] };
  }

  /** 2-Prop Z-Test. */
  twoPropZTest(x1: number, n1: number, x2: number, n2: number, alt: number): TestResult {
    const phat1 = x1 / n1, phat2 = x2 / n2;
    const phat = (x1 + x2) / (n1 + n2);
    const z = (phat1 - phat2) / Math.sqrt(phat * (1 - phat) * (1 / n1 + 1 / n2));
    let p: number;
    if (alt === 0) p = twoSidedZ(z);
    else if (alt === 1) p = 1 - Phi(z);
    else p = Phi(z);
    return { statName: 'z', statValue: z, pValue: p, extras: [
      { label: 'p̂1', value: phat1 }, { label: 'n1', value: n1 },
      { label: 'p̂2', value: phat2 }, { label: 'n2', value: n2 },
    ] };
  }

  // ---- χ²-Test (goodness of fit) ----

  /** χ²-Test (goodness-of-fit). observed = [O1..Ok], expected = [E1..Ek] (uniform si non fourni). */
  chi2GofTest(observed: number[], expected?: number[]): TestResult {
    const k = observed.length;
    if (k < 2) throw new Error('≥ 2 catégories requises');
    const total = observed.reduce((s, o) => s + o, 0);
    const exp = expected ?? observed.map(() => total / k);
    if (exp.length !== k) throw new Error('Expected: dimension incompatible');
    let chi2 = 0;
    for (let i = 0; i < k; i++) {
      chi2 += ((observed[i] - exp[i]) ** 2) / exp[i];
    }
    const df = k - 1;
    const p = 1 - distributionService.chi2cdf(0, chi2, df);
    return { statName: 'χ²', statValue: chi2, pValue: p, df, extras: [
      { label: 'df', value: df },
    ] };
  }

  // ---- Intervalles de confiance ----

  /** ZInterval (1 échantillon, σ connu). */
  zInterval(sigma: number, mean: number, n: number, cLevel: number): TestResult {
    const zStar = distributionService.invNorm((1 + cLevel) / 2, 0, 1);
    const me = zStar * sigma / Math.sqrt(n);
    return { statName: 'z', statValue: zStar, ci: [mean - me, mean + me], extras: [
      { label: 'x̄', value: mean }, { label: 'n', value: n },
    ] };
  }

  /** TInterval (1 échantillon). */
  tInterval(mean: number, Sx: number, n: number, cLevel: number): TestResult {
    const df = n - 1;
    const tStar = distributionService.invT((1 + cLevel) / 2, df);
    const me = tStar * Sx / Math.sqrt(n);
    return { statName: 't', statValue: tStar, df, ci: [mean - me, mean + me], extras: [
      { label: 'x̄', value: mean }, { label: 'Sx', value: Sx }, { label: 'n', value: n },
    ] };
  }

  /** 2-Sample Z Interval. */
  twoSampleZInterval(sigma1: number, sigma2: number,
    mean1: number, n1: number, mean2: number, n2: number, cLevel: number): TestResult {
    const zStar = distributionService.invNorm((1 + cLevel) / 2, 0, 1);
    const me = zStar * Math.sqrt(sigma1 * sigma1 / n1 + sigma2 * sigma2 / n2);
    const diff = mean1 - mean2;
    return { statName: 'z', statValue: zStar, ci: [diff - me, diff + me], extras: [
      { label: 'x̄1', value: mean1 }, { label: 'n1', value: n1 },
      { label: 'x̄2', value: mean2 }, { label: 'n2', value: n2 },
    ] };
  }

  /** 2-Sample T Interval (Satterthwaite). */
  twoSampleTInterval(mean1: number, Sx1: number, n1: number,
    mean2: number, Sx2: number, n2: number, cLevel: number, pooled: boolean): TestResult {
    let se: number, df: number;
    if (pooled) {
      const Sp2 = ((n1 - 1) * Sx1 * Sx1 + (n2 - 1) * Sx2 * Sx2) / (n1 + n2 - 2);
      se = Math.sqrt(Sp2 * (1 / n1 + 1 / n2));
      df = n1 + n2 - 2;
    } else {
      const v1 = Sx1 * Sx1 / n1, v2 = Sx2 * Sx2 / n2;
      se = Math.sqrt(v1 + v2);
      df = (v1 + v2) * (v1 + v2) / ((v1 * v1) / (n1 - 1) + (v2 * v2) / (n2 - 1));
    }
    const tStar = distributionService.invT((1 + cLevel) / 2, df);
    const me = tStar * se;
    const diff = mean1 - mean2;
    return { statName: 't', statValue: tStar, df, ci: [diff - me, diff + me], extras: [
      { label: 'x̄1', value: mean1 }, { label: 'n1', value: n1 },
      { label: 'x̄2', value: mean2 }, { label: 'n2', value: n2 },
    ] };
  }

  /** 1-Prop Z Interval. */
  onePropZInterval(x: number, n: number, cLevel: number): TestResult {
    const phat = x / n;
    const zStar = distributionService.invNorm((1 + cLevel) / 2, 0, 1);
    const me = zStar * Math.sqrt(phat * (1 - phat) / n);
    return { statName: 'z', statValue: zStar, ci: [phat - me, phat + me], extras: [
      { label: 'p̂', value: phat }, { label: 'n', value: n },
    ] };
  }

  /** 2-Prop Z Interval. */
  twoPropZInterval(x1: number, n1: number, x2: number, n2: number, cLevel: number): TestResult {
    const phat1 = x1 / n1, phat2 = x2 / n2;
    const zStar = distributionService.invNorm((1 + cLevel) / 2, 0, 1);
    const me = zStar * Math.sqrt(phat1 * (1 - phat1) / n1 + phat2 * (1 - phat2) / n2);
    const diff = phat1 - phat2;
    return { statName: 'z', statValue: zStar, ci: [diff - me, diff + me], extras: [
      { label: 'p̂1', value: phat1 }, { label: 'n1', value: n1 },
      { label: 'p̂2', value: phat2 }, { label: 'n2', value: n2 },
    ] };
  }

  // ---- LinRegTTest ----

  /** LinRegTTest : test sur la pente β (et coefficient de corrélation r). */
  linRegTTest(listX: string, listY: string, alt: number): TestResult {
    const reg = statisticsService.linearRegression(listX, listY) as any;
    // statisticsService.nomme la pente « a » et l'ordonnée à l'origine « b » (y = a·x + b).
    // La TI-83, à l'inverse, affiche la pente sous l'étiquette « b » et l'ordonnée sous « a » (y = a + b·x).
    const slope = reg.a;          // pente (coefficient testé)
    const intercept = reg.b;      // ordonnée à l'origine
    const r = reg.r ?? 0, r2 = reg.r2 ?? 0;
    const xs = statisticsService.getList(listX).filter(x => !isNaN(x));
    const ys = statisticsService.getList(listY).filter(x => !isNaN(x));
    const n = Math.min(xs.length, ys.length);
    if (n < 3) throw new Error('n ≥ 3 requis');
    const meanX = xs.slice(0, n).reduce((s, x) => s + x, 0) / n;
    const sxx = xs.slice(0, n).reduce((s, x) => s + (x - meanX) ** 2, 0);
    // Résidus
    let ssRes = 0;
    for (let i = 0; i < n; i++) ssRes += (ys[i] - (intercept + slope * xs[i])) ** 2;
    const s = Math.sqrt(ssRes / (n - 2));
    const seB = s / Math.sqrt(sxx);   // écart-type de la pente
    const t = slope / seB;
    const df = n - 2;
    let p: number;
    if (alt === 0) p = twoSidedT(t, df);
    else if (alt === 1) p = 1 - tCdf(t, df);
    else p = tCdf(t, df);
    return { statName: 't', statValue: t, pValue: p, df, extras: [
      // Étiquettes TI-83 : b = pente, a = ordonnée à l'origine.
      { label: 'b', value: slope }, { label: 'a', value: intercept }, { label: 's', value: s },
      { label: 'r²', value: r2 }, { label: 'r', value: r },
    ] };
  }

  // ---- ANOVA (one-way) ----

  /** ANOVA à un facteur sur k listes. */
  anova(listNames: string[]): TestResult {
    const groups = listNames.map(name => statisticsService.getList(name).filter(x => !isNaN(x)));
    if (groups.length < 2) throw new Error('≥ 2 listes requises');
    let N = 0, grandSum = 0;
    const means: number[] = [];
    const ns: number[] = [];
    for (const g of groups) {
      if (g.length === 0) throw new Error('Liste vide');
      const s = g.reduce((a, b) => a + b, 0);
      ns.push(g.length);
      means.push(s / g.length);
      N += g.length;
      grandSum += s;
    }
    const grandMean = grandSum / N;
    let ssb = 0, ssw = 0;
    for (let i = 0; i < groups.length; i++) {
      ssb += ns[i] * (means[i] - grandMean) ** 2;
      for (const v of groups[i]) ssw += (v - means[i]) ** 2;
    }
    const dfB = groups.length - 1;
    const dfW = N - groups.length;
    const F = (ssb / dfB) / (ssw / dfW);
    const p = 1 - distributionService.Fcdf(0, F, dfB, dfW);
    return { statName: 'F', statValue: F, pValue: p, df: dfB, df2: dfW, extras: [
      { label: 'SS facteur', value: ssb }, { label: 'SS erreur', value: ssw },
      { label: 'SS total', value: ssb + ssw },
      ...means.map((m, i) => ({ label: `x̄${i + 1}`, value: m })),
    ] };
  }

  // ---- Helper exposé pour l'éditeur (mode Data) ----
  /** Stats d'échantillon (mode Data) — exposed for the TestsEditor config. */
  sampleStats(listName: string, freqListName?: string): SampleStats {
    return sampleStats(listName, freqListName);
  }
}

export const hypothesisTestService = new HypothesisTestService();