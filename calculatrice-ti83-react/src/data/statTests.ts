/**
 * Registre config-driven des 15 tests STAT > TESTS de la TI-83 Plus.
 *
 * L'éditeur TestsEditor lit ce registre pour : rendre les champs, appeler
 * `compute` avec les valeurs résolues, et afficher les résultats.
 *
 * Valeurs résolues par type de champ (passées à compute) :
 *  - 'number'  → number (parseFloat)
 *  - 'list'    → nom de la liste (string, ex. "L1") — compute lit via statisticsService
 *  - 'matrix'  → number[] (donnée aplatie de la matrice du store)
 *  - 'alt'     → -1 ('<') | 0 ('≠') | 1 ('>')
 *  - 'inpt'    → 'data' | 'stats'
 *  - 'pooled'  → boolean
 */

import { hypothesisTestService, type TestResult } from '../services/HypothesisTestService';
import { statisticsService } from '../services/StatisticsService';

export type FieldType = 'number' | 'list' | 'matrix' | 'alt' | 'inpt' | 'pooled';

export interface FieldSpec {
  key: string;
  label: string;
  type: FieldType;
  default: number | string | boolean;
  /** N'affiche le champ que si cette prédicat renvoie true (ex: dépend du toggle inpt). */
  showIf?: (vals: Record<string, unknown>) => boolean;
}

export type FieldValues = Record<string, unknown>;

export interface TestSpec {
  key: string;
  label: string;
  category: 'test' | 'interval';
  fields: FieldSpec[];
  compute: (v: FieldValues) => TestResult;
}

const num = (v: unknown, d = 0): number => {
  const n = typeof v === 'number' ? v : parseFloat(String(v));
  return isNaN(n) ? d : n;
};
const isData = (v: unknown) => v === 'data';

/** Stats d'échantillon depuis un nom de liste (+ freq optionnel). */
const dataStats = (list: string, freq?: string) => {
  const f = freq && String(freq).trim() !== '' ? String(freq) : undefined;
  return hypothesisTestService.sampleStats(String(list), f);
};

const ALT: FieldSpec = { key: 'alt', label: 'μ:', type: 'alt', default: 0 };
const CLEVEL: FieldSpec = { key: 'clevel', label: 'C-Level', type: 'number', default: 0.95 };

export const STAT_TESTS: TestSpec[] = [
  // 1. Z-Test
  {
    key: 'ztest', label: 'Z-Test...', category: 'test',
    fields: [
      { key: 'inpt', label: 'Inpt', type: 'inpt', default: 'stats' },
      { key: 'mu0', label: 'μ₀', type: 'number', default: 0 },
      { key: 'sigma', label: 'σ', type: 'number', default: 1 },
      { key: 'list', label: 'List', type: 'list', default: 'L1', showIf: v => isData(v.inpt) },
      { key: 'freq', label: 'Freq', type: 'list', default: '', showIf: v => isData(v.inpt) },
      { key: 'mean', label: 'x̄', type: 'number', default: 0, showIf: v => !isData(v.inpt) },
      { key: 'n', label: 'n', type: 'number', default: 1, showIf: v => !isData(v.inpt) },
      ALT,
    ],
    compute: v => {
      let mean: number, n: number;
      if (isData(v.inpt)) { const s = dataStats(String(v.list), String(v.freq)); mean = s.mean; n = s.n; }
      else { mean = num(v.mean); n = num(v.n); }
      return hypothesisTestService.zTest(num(v.mu0), num(v.sigma), mean, n, num(v.alt));
    },
  },
  // 2. T-Test
  {
    key: 'ttest', label: 'T-Test...', category: 'test',
    fields: [
      { key: 'inpt', label: 'Inpt', type: 'inpt', default: 'stats' },
      { key: 'mu0', label: 'μ₀', type: 'number', default: 0 },
      { key: 'list', label: 'List', type: 'list', default: 'L1', showIf: v => isData(v.inpt) },
      { key: 'freq', label: 'Freq', type: 'list', default: '', showIf: v => isData(v.inpt) },
      { key: 'mean', label: 'x̄', type: 'number', default: 0, showIf: v => !isData(v.inpt) },
      { key: 'sx', label: 'Sx', type: 'number', default: 1, showIf: v => !isData(v.inpt) },
      { key: 'n', label: 'n', type: 'number', default: 2, showIf: v => !isData(v.inpt) },
      ALT,
    ],
    compute: v => {
      let mean: number, Sx: number, n: number;
      if (isData(v.inpt)) { const s = dataStats(String(v.list), String(v.freq)); mean = s.mean; Sx = s.Sx; n = s.n; }
      else { mean = num(v.mean); Sx = num(v.sx); n = num(v.n); }
      return hypothesisTestService.tTest(num(v.mu0), mean, Sx, n, num(v.alt));
    },
  },
  // 3. 2-Sample Z-Test
  {
    key: '2sampztest', label: '2-SampZTest...', category: 'test',
    fields: [
      { key: 'inpt', label: 'Inpt', type: 'inpt', default: 'stats' },
      { key: 'sigma1', label: 'σ1', type: 'number', default: 1 },
      { key: 'sigma2', label: 'σ2', type: 'number', default: 1 },
      { key: 'list1', label: 'List1', type: 'list', default: 'L1', showIf: v => isData(v.inpt) },
      { key: 'list2', label: 'List2', type: 'list', default: 'L2', showIf: v => isData(v.inpt) },
      { key: 'freq1', label: 'Freq1', type: 'list', default: '', showIf: v => isData(v.inpt) },
      { key: 'freq2', label: 'Freq2', type: 'list', default: '', showIf: v => isData(v.inpt) },
      { key: 'mean1', label: 'x̄1', type: 'number', default: 0, showIf: v => !isData(v.inpt) },
      { key: 'n1', label: 'n1', type: 'number', default: 1, showIf: v => !isData(v.inpt) },
      { key: 'mean2', label: 'x̄2', type: 'number', default: 0, showIf: v => !isData(v.inpt) },
      { key: 'n2', label: 'n2', type: 'number', default: 1, showIf: v => !isData(v.inpt) },
      ALT,
    ],
    compute: v => {
      let m1: number, n1: number, m2: number, n2: number;
      if (isData(v.inpt)) {
        const s1 = dataStats(String(v.list1), String(v.freq1)); const s2 = dataStats(String(v.list2), String(v.freq2));
        m1 = s1.mean; n1 = s1.n; m2 = s2.mean; n2 = s2.n;
      } else { m1 = num(v.mean1); n1 = num(v.n1); m2 = num(v.mean2); n2 = num(v.n2); }
      return hypothesisTestService.twoSampleZTest(num(v.sigma1), num(v.sigma2), m1, n1, m2, n2, num(v.alt));
    },
  },
  // 4. 2-Sample T-Test
  {
    key: '2sampttest', label: '2-SampTTest...', category: 'test',
    fields: [
      { key: 'inpt', label: 'Inpt', type: 'inpt', default: 'stats' },
      { key: 'list1', label: 'List1', type: 'list', default: 'L1', showIf: v => isData(v.inpt) },
      { key: 'list2', label: 'List2', type: 'list', default: 'L2', showIf: v => isData(v.inpt) },
      { key: 'freq1', label: 'Freq1', type: 'list', default: '', showIf: v => isData(v.inpt) },
      { key: 'freq2', label: 'Freq2', type: 'list', default: '', showIf: v => isData(v.inpt) },
      { key: 'mean1', label: 'x̄1', type: 'number', default: 0, showIf: v => !isData(v.inpt) },
      { key: 'sx1', label: 'Sx1', type: 'number', default: 1, showIf: v => !isData(v.inpt) },
      { key: 'n1', label: 'n1', type: 'number', default: 2, showIf: v => !isData(v.inpt) },
      { key: 'mean2', label: 'x̄2', type: 'number', default: 0, showIf: v => !isData(v.inpt) },
      { key: 'sx2', label: 'Sx2', type: 'number', default: 1, showIf: v => !isData(v.inpt) },
      { key: 'n2', label: 'n2', type: 'number', default: 2, showIf: v => !isData(v.inpt) },
      { key: 'pooled', label: 'Pooled', type: 'pooled', default: false },
      ALT,
    ],
    compute: v => {
      let m1: number, Sx1: number, n1: number, m2: number, Sx2: number, n2: number;
      if (isData(v.inpt)) {
        const s1 = dataStats(String(v.list1), String(v.freq1)); const s2 = dataStats(String(v.list2), String(v.freq2));
        m1 = s1.mean; Sx1 = s1.Sx; n1 = s1.n; m2 = s2.mean; Sx2 = s2.Sx; n2 = s2.n;
      } else { m1 = num(v.mean1); Sx1 = num(v.sx1); n1 = num(v.n1); m2 = num(v.mean2); Sx2 = num(v.sx2); n2 = num(v.n2); }
      return hypothesisTestService.twoSampleTTest(m1, Sx1, n1, m2, Sx2, n2, num(v.alt), !!v.pooled);
    },
  },
  // 5. 1-Prop Z-Test
  {
    key: '1propztest', label: '1-PropZTest...', category: 'test',
    fields: [
      { key: 'p0', label: 'p₀', type: 'number', default: 0.5 },
      { key: 'x', label: 'x', type: 'number', default: 0 },
      { key: 'n', label: 'n', type: 'number', default: 1 },
      ALT,
    ],
    compute: v => hypothesisTestService.onePropZTest(num(v.p0), num(v.x), num(v.n), num(v.alt)),
  },
  // 6. 2-Prop Z-Test
  {
    key: '2propztest', label: '2-PropZTest...', category: 'test',
    fields: [
      { key: 'x1', label: 'x1', type: 'number', default: 0 },
      { key: 'n1', label: 'n1', type: 'number', default: 1 },
      { key: 'x2', label: 'x2', type: 'number', default: 0 },
      { key: 'n2', label: 'n2', type: 'number', default: 1 },
      ALT,
    ],
    compute: v => hypothesisTestService.twoPropZTest(num(v.x1), num(v.n1), num(v.x2), num(v.n2), num(v.alt)),
  },
  // 7. χ²-Test (goodness-of-fit) — matrice observée [A]
  {
    key: 'chi2gof', label: 'χ²-Test...', category: 'test',
    fields: [
      { key: 'obs', label: 'Observed', type: 'matrix', default: 'A' },
    ],
    compute: v => {
      const obs = (v.obs as number[]) ?? [];
      return hypothesisTestService.chi2GofTest(obs);
    },
  },
  // 8. ZInterval
  {
    key: 'zint', label: 'ZInterval...', category: 'interval',
    fields: [
      { key: 'inpt', label: 'Inpt', type: 'inpt', default: 'stats' },
      { key: 'sigma', label: 'σ', type: 'number', default: 1 },
      { key: 'list', label: 'List', type: 'list', default: 'L1', showIf: v => isData(v.inpt) },
      { key: 'freq', label: 'Freq', type: 'list', default: '', showIf: v => isData(v.inpt) },
      { key: 'mean', label: 'x̄', type: 'number', default: 0, showIf: v => !isData(v.inpt) },
      { key: 'n', label: 'n', type: 'number', default: 1, showIf: v => !isData(v.inpt) },
      CLEVEL,
    ],
    compute: v => {
      let mean: number, n: number;
      if (isData(v.inpt)) { const s = dataStats(String(v.list), String(v.freq)); mean = s.mean; n = s.n; }
      else { mean = num(v.mean); n = num(v.n); }
      return hypothesisTestService.zInterval(num(v.sigma), mean, n, num(v.clevel));
    },
  },
  // 9. TInterval
  {
    key: 'tint', label: 'TInterval...', category: 'interval',
    fields: [
      { key: 'inpt', label: 'Inpt', type: 'inpt', default: 'stats' },
      { key: 'list', label: 'List', type: 'list', default: 'L1', showIf: v => isData(v.inpt) },
      { key: 'freq', label: 'Freq', type: 'list', default: '', showIf: v => isData(v.inpt) },
      { key: 'mean', label: 'x̄', type: 'number', default: 0, showIf: v => !isData(v.inpt) },
      { key: 'sx', label: 'Sx', type: 'number', default: 1, showIf: v => !isData(v.inpt) },
      { key: 'n', label: 'n', type: 'number', default: 2, showIf: v => !isData(v.inpt) },
      CLEVEL,
    ],
    compute: v => {
      let mean: number, Sx: number, n: number;
      if (isData(v.inpt)) { const s = dataStats(String(v.list), String(v.freq)); mean = s.mean; Sx = s.Sx; n = s.n; }
      else { mean = num(v.mean); Sx = num(v.sx); n = num(v.n); }
      return hypothesisTestService.tInterval(mean, Sx, n, num(v.clevel));
    },
  },
  // 10. 2-Sample Z Interval
  {
    key: '2sampzint', label: '2-SampZInt...', category: 'interval',
    fields: [
      { key: 'inpt', label: 'Inpt', type: 'inpt', default: 'stats' },
      { key: 'sigma1', label: 'σ1', type: 'number', default: 1 },
      { key: 'sigma2', label: 'σ2', type: 'number', default: 1 },
      { key: 'list1', label: 'List1', type: 'list', default: 'L1', showIf: v => isData(v.inpt) },
      { key: 'list2', label: 'List2', type: 'list', default: 'L2', showIf: v => isData(v.inpt) },
      { key: 'freq1', label: 'Freq1', type: 'list', default: '', showIf: v => isData(v.inpt) },
      { key: 'freq2', label: 'Freq2', type: 'list', default: '', showIf: v => isData(v.inpt) },
      { key: 'mean1', label: 'x̄1', type: 'number', default: 0, showIf: v => !isData(v.inpt) },
      { key: 'n1', label: 'n1', type: 'number', default: 1, showIf: v => !isData(v.inpt) },
      { key: 'mean2', label: 'x̄2', type: 'number', default: 0, showIf: v => !isData(v.inpt) },
      { key: 'n2', label: 'n2', type: 'number', default: 1, showIf: v => !isData(v.inpt) },
      CLEVEL,
    ],
    compute: v => {
      let m1: number, n1: number, m2: number, n2: number;
      if (isData(v.inpt)) {
        const s1 = dataStats(String(v.list1), String(v.freq1)); const s2 = dataStats(String(v.list2), String(v.freq2));
        m1 = s1.mean; n1 = s1.n; m2 = s2.mean; n2 = s2.n;
      } else { m1 = num(v.mean1); n1 = num(v.n1); m2 = num(v.mean2); n2 = num(v.n2); }
      return hypothesisTestService.twoSampleZInterval(num(v.sigma1), num(v.sigma2), m1, n1, m2, n2, num(v.clevel));
    },
  },
  // 11. 2-Sample T Interval
  {
    key: '2samptint', label: '2-SampTInt...', category: 'interval',
    fields: [
      { key: 'inpt', label: 'Inpt', type: 'inpt', default: 'stats' },
      { key: 'list1', label: 'List1', type: 'list', default: 'L1', showIf: v => isData(v.inpt) },
      { key: 'list2', label: 'List2', type: 'list', default: 'L2', showIf: v => isData(v.inpt) },
      { key: 'freq1', label: 'Freq1', type: 'list', default: '', showIf: v => isData(v.inpt) },
      { key: 'freq2', label: 'Freq2', type: 'list', default: '', showIf: v => isData(v.inpt) },
      { key: 'mean1', label: 'x̄1', type: 'number', default: 0, showIf: v => !isData(v.inpt) },
      { key: 'sx1', label: 'Sx1', type: 'number', default: 1, showIf: v => !isData(v.inpt) },
      { key: 'n1', label: 'n1', type: 'number', default: 2, showIf: v => !isData(v.inpt) },
      { key: 'mean2', label: 'x̄2', type: 'number', default: 0, showIf: v => !isData(v.inpt) },
      { key: 'sx2', label: 'Sx2', type: 'number', default: 1, showIf: v => !isData(v.inpt) },
      { key: 'n2', label: 'n2', type: 'number', default: 2, showIf: v => !isData(v.inpt) },
      { key: 'pooled', label: 'Pooled', type: 'pooled', default: false },
      CLEVEL,
    ],
    compute: v => {
      let m1: number, Sx1: number, n1: number, m2: number, Sx2: number, n2: number;
      if (isData(v.inpt)) {
        const s1 = dataStats(String(v.list1), String(v.freq1)); const s2 = dataStats(String(v.list2), String(v.freq2));
        m1 = s1.mean; Sx1 = s1.Sx; n1 = s1.n; m2 = s2.mean; Sx2 = s2.Sx; n2 = s2.n;
      } else { m1 = num(v.mean1); Sx1 = num(v.sx1); n1 = num(v.n1); m2 = num(v.mean2); Sx2 = num(v.sx2); n2 = num(v.n2); }
      return hypothesisTestService.twoSampleTInterval(m1, Sx1, n1, m2, Sx2, n2, num(v.clevel), !!v.pooled);
    },
  },
  // 12. 1-Prop Z Interval
  {
    key: '1propzint', label: '1-PropZInt...', category: 'interval',
    fields: [
      { key: 'x', label: 'x', type: 'number', default: 0 },
      { key: 'n', label: 'n', type: 'number', default: 1 },
      CLEVEL,
    ],
    compute: v => hypothesisTestService.onePropZInterval(num(v.x), num(v.n), num(v.clevel)),
  },
  // 13. 2-Prop Z Interval
  {
    key: '2propzint', label: '2-PropZInt...', category: 'interval',
    fields: [
      { key: 'x1', label: 'x1', type: 'number', default: 0 },
      { key: 'n1', label: 'n1', type: 'number', default: 1 },
      { key: 'x2', label: 'x2', type: 'number', default: 0 },
      { key: 'n2', label: 'n2', type: 'number', default: 1 },
      CLEVEL,
    ],
    compute: v => hypothesisTestService.twoPropZInterval(num(v.x1), num(v.n1), num(v.x2), num(v.n2), num(v.clevel)),
  },
  // 14. LinRegTTest
  {
    key: 'linregttest', label: 'LinRegTTest...', category: 'test',
    fields: [
      { key: 'xlist', label: 'Xlist', type: 'list', default: 'L1' },
      { key: 'ylist', label: 'Ylist', type: 'list', default: 'L2' },
      ALT,
    ],
    compute: v => hypothesisTestService.linRegTTest(String(v.xlist), String(v.ylist), num(v.alt)),
  },
  // 15. ANOVA (3 groupes ; n'utilise que les listes non vides)
  {
    key: 'anova', label: 'ANOVA...', category: 'test',
    fields: [
      { key: 'list1', label: 'List 1', type: 'list', default: 'L1' },
      { key: 'list2', label: 'List 2', type: 'list', default: 'L2' },
      { key: 'list3', label: 'List 3', type: 'list', default: 'L3' },
    ],
    compute: v => {
      const names = [v.list1, v.list2, v.list3]
        .map(n => String(n))
        .filter(n => statisticsService.getList(n).filter(x => !isNaN(x)).length > 0);
      if (names.length < 2) throw new Error('≥ 2 listes non vides requises');
      return hypothesisTestService.anova(names);
    },
  },
];

export const getTestSpec = (key: string): TestSpec | undefined =>
  STAT_TESTS.find(t => t.key === key);