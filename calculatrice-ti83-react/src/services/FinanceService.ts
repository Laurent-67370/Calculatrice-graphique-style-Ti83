/**
 * Service de calculs financiers TI-83 Plus
 * Implémente TVM (Time Value of Money) et autres fonctions financières
 */

export interface TVMVariables {
  N: number;    // Nombre de périodes
  I: number;    // Taux d'intérêt annuel (en %)
  PV: number;   // Valeur actuelle (Present Value)
  PMT: number;  // Paiement périodique (Payment)
  FV: number;   // Valeur future (Future Value)
  PY: number;   // Paiements par an (Payments per Year)
  CY: number;   // Compositions par an (Compoundings per Year)
  PMTEnd: boolean; // Paiement en fin de période (true) ou début (false)
}

export interface TVMResult {
  success: boolean;
  value?: number;
  iterations?: number;
  error?: string;
}

export class FinanceService {
  private readonly MAX_ITERATIONS = 100;
  private readonly TOLERANCE = 1e-6;

  /**
   * Convertit le taux d'intérêt annuel en taux périodique
   */
  private getPeriodicRate(annualRate: number, paymentsPerYear: number, compoundingsPerYear: number): number {
    if (annualRate === 0) return 0;

    // Taux d'intérêt par période de composition
    const ratePerCompounding = annualRate / (100 * compoundingsPerYear);

    // Si les paiements et les compositions sont identiques
    if (paymentsPerYear === compoundingsPerYear) {
      return ratePerCompounding;
    }

    // Sinon, convertir le taux effectif
    const effectiveRate = Math.pow(1 + ratePerCompounding, compoundingsPerYear / paymentsPerYear) - 1;
    return effectiveRate;
  }

  /**
   * Calcule N (nombre de périodes)
   */
  solveN(I: number, PV: number, PMT: number, FV: number, PY: number, CY: number, PMTEnd: boolean): TVMResult {
    try {
      const i = this.getPeriodicRate(I, PY, CY);

      if (i === 0) {
        // Cas simple sans intérêt
        if (PMT === 0) {
          return { success: false, error: 'PMT ne peut pas être 0 quand I%=0' };
        }
        const n = -(PV + FV) / PMT;
        if (n < 0) {
          return { success: false, error: 'Pas de solution positive' };
        }
        return { success: true, value: n };
      }

      const pmt = PMTEnd ? PMT : PMT * (1 + i);

      // Formule : N = -log((FV * i - pmt) / (PV * i + pmt)) / log(1 + i)
      const numerator = FV * i - pmt;
      const denominator = PV * i + pmt;

      if (denominator === 0 || numerator / denominator <= 0) {
        return { success: false, error: 'Pas de solution' };
      }

      const n = -Math.log(numerator / denominator) / Math.log(1 + i);

      if (!isFinite(n) || n < 0) {
        return { success: false, error: 'Pas de solution positive' };
      }

      return { success: true, value: n };
    } catch (error) {
      return { success: false, error: 'Erreur de calcul' };
    }
  }

  /**
   * Calcule I% (taux d'intérêt) par méthode de Newton-Raphson
   */
  solveI(N: number, PV: number, PMT: number, FV: number, PY: number, _CY: number, PMTEnd: boolean): TVMResult {
    try {
      // Estimation initiale
      let i = 0.1 / PY; // 10% annuel converti en taux périodique

      for (let iter = 0; iter < this.MAX_ITERATIONS; iter++) {
        const payment = PMTEnd ? PMT : PMT * (1 + i);

        // Fonction TVM
        let f: number;
        let df: number;

        if (Math.abs(i) < 1e-10) {
          f = PV + PMT * N + FV;
          df = PMT * N * 0.5; // Approximation de la dérivée
        } else {
          const pvFactor = Math.pow(1 + i, -N);

          f = PV + payment * (1 - pvFactor) / i + FV * pvFactor;

          // Dérivée de la fonction TVM
          df = payment * ((1 - pvFactor) / (i * i) - N * pvFactor / i) - N * FV * pvFactor / (1 + i);
        }

        if (Math.abs(f) < this.TOLERANCE) {
          // Convertir le taux périodique en taux annuel
          const annualRate = i * PY * 100;
          return { success: true, value: annualRate, iterations: iter + 1 };
        }

        if (Math.abs(df) < 1e-10) {
          return { success: false, error: 'Dérivée nulle' };
        }

        const iNew = i - f / df;

        if (Math.abs(iNew - i) < this.TOLERANCE) {
          const annualRate = iNew * PY * 100;
          return { success: true, value: annualRate, iterations: iter + 1 };
        }

        i = iNew;

        // Éviter les valeurs négatives extrêmes
        if (i < -0.99) i = -0.99;
      }

      return { success: false, error: 'Pas de convergence' };
    } catch (error) {
      return { success: false, error: 'Erreur de calcul' };
    }
  }

  /**
   * Calcule PV (valeur actuelle)
   */
  solvePV(N: number, I: number, PMT: number, FV: number, PY: number, CY: number, PMTEnd: boolean): TVMResult {
    try {
      const i = this.getPeriodicRate(I, PY, CY);

      if (i === 0) {
        const pv = -PMT * N - FV;
        return { success: true, value: pv };
      }

      const payment = PMTEnd ? PMT : PMT * (1 + i);
      const pvFactor = Math.pow(1 + i, -N);

      const pv = -payment * (1 - pvFactor) / i - FV * pvFactor;

      if (!isFinite(pv)) {
        return { success: false, error: 'Résultat infini' };
      }

      return { success: true, value: pv };
    } catch (error) {
      return { success: false, error: 'Erreur de calcul' };
    }
  }

  /**
   * Calcule PMT (paiement périodique)
   */
  solvePMT(N: number, I: number, PV: number, FV: number, PY: number, CY: number, PMTEnd: boolean): TVMResult {
    try {
      const i = this.getPeriodicRate(I, PY, CY);

      if (i === 0) {
        const pmt = -(PV + FV) / N;
        return { success: true, value: pmt };
      }

      const pvFactor = Math.pow(1 + i, -N);
      const multiplier = PMTEnd ? 1 : (1 + i);

      const pmt = -(PV * i + FV * pvFactor * i) / (multiplier * (1 - pvFactor));

      if (!isFinite(pmt)) {
        return { success: false, error: 'Résultat infini' };
      }

      return { success: true, value: pmt };
    } catch (error) {
      return { success: false, error: 'Erreur de calcul' };
    }
  }

  /**
   * Calcule FV (valeur future)
   */
  solveFV(N: number, I: number, PV: number, PMT: number, PY: number, CY: number, PMTEnd: boolean): TVMResult {
    try {
      const i = this.getPeriodicRate(I, PY, CY);

      if (i === 0) {
        const fv = -PV - PMT * N;
        return { success: true, value: fv };
      }

      const payment = PMTEnd ? PMT : PMT * (1 + i);
      const fvFactor = Math.pow(1 + i, N);

      const fv = -PV * fvFactor - payment * (fvFactor - 1) / i;

      if (!isFinite(fv)) {
        return { success: false, error: 'Résultat infini' };
      }

      return { success: true, value: fv };
    } catch (error) {
      return { success: false, error: 'Erreur de calcul' };
    }
  }

  /**
   * Calcule NPV (Net Present Value)
   */
  calculateNPV(initialInvestment: number, cashFlows: number[], rate: number): number {
    let npv = initialInvestment;
    for (let i = 0; i < cashFlows.length; i++) {
      npv += cashFlows[i] / Math.pow(1 + rate / 100, i + 1);
    }
    return npv;
  }

  /**
   * Calcule IRR (Internal Rate of Return) par méthode de Newton-Raphson
   */
  calculateIRR(initialInvestment: number, cashFlows: number[]): TVMResult {
    try {
      let rate = 0.1; // 10% comme estimation initiale

      for (let iter = 0; iter < this.MAX_ITERATIONS; iter++) {
        let npv = initialInvestment;
        let dnpv = 0;

        for (let i = 0; i < cashFlows.length; i++) {
          const period = i + 1;
          const factor = Math.pow(1 + rate, period);
          npv += cashFlows[i] / factor;
          dnpv -= period * cashFlows[i] / (factor * (1 + rate));
        }

        if (Math.abs(npv) < this.TOLERANCE) {
          return { success: true, value: rate * 100, iterations: iter + 1 };
        }

        if (Math.abs(dnpv) < 1e-10) {
          return { success: false, error: 'Dérivée nulle' };
        }

        const rateNew = rate - npv / dnpv;

        if (Math.abs(rateNew - rate) < this.TOLERANCE) {
          return { success: true, value: rateNew * 100, iterations: iter + 1 };
        }

        rate = rateNew;
      }

      return { success: false, error: 'Pas de convergence' };
    } catch (error) {
      return { success: false, error: 'Erreur de calcul' };
    }
  }

  /**
   * Calcule le balance (solde) d'un prêt après un certain nombre de paiements
   */
  calculateBalance(_N: number, I: number, PV: number, PMT: number, paymentsCompleted: number, PY: number, CY: number, PMTEnd: boolean): number {
    const i = this.getPeriodicRate(I, PY, CY);

    if (i === 0) {
      return PV + PMT * paymentsCompleted;
    }

    const payment = PMTEnd ? PMT : PMT * (1 + i);
    const factor = Math.pow(1 + i, paymentsCompleted);

    return PV * factor + payment * (factor - 1) / i;
  }

  /**
   * Calcule la somme du principal payé entre deux périodes
   */
  calculateSumPrincipal(N: number, I: number, PV: number, PMT: number, startPeriod: number, endPeriod: number, PY: number, CY: number, PMTEnd: boolean): number {
    const balStart = this.calculateBalance(N, I, PV, PMT, startPeriod - 1, PY, CY, PMTEnd);
    const balEnd = this.calculateBalance(N, I, PV, PMT, endPeriod, PY, CY, PMTEnd);

    return balStart - balEnd;
  }

  /**
   * Calcule la somme des intérêts payés entre deux périodes
   */
  calculateSumInterest(N: number, I: number, PV: number, PMT: number, startPeriod: number, endPeriod: number, PY: number, CY: number, PMTEnd: boolean): number {
    const numPeriods = endPeriod - startPeriod + 1;
    const totalPaid = PMT * numPeriods;
    const principal = this.calculateSumPrincipal(N, I, PV, PMT, startPeriod, endPeriod, PY, CY, PMTEnd);

    return totalPaid - principal;
  }
}

export const financeService = new FinanceService();
