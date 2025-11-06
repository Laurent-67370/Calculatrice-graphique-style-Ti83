/**
 * Handlers pour connecter les menus aux services
 */

import { graphingEngine } from '../services/GraphingEngine';
import { statisticsService } from '../services/StatisticsService';
import { mathFunctionsService } from '../services/MathFunctionsService';
import type { WindowSettings } from '../types';

/**
 * Handlers pour le menu ZOOM
 */
export const createZoomHandlers = (
  setWindowSettings: (settings: Partial<WindowSettings>) => void,
  setCurrentMenu: (menu: string | null) => void
) => ({
  'zstandard': () => {
    const preset = graphingEngine.getZoomPreset('standard');
    if (preset) {
      setWindowSettings({
        xMin: preset.xMin,
        xMax: preset.xMax,
        xScale: preset.xScale,
        yMin: preset.yMin,
        yMax: preset.yMax,
        yScale: preset.yScale,
      });
    }
    setCurrentMenu(null);
  },

  'zdecimal': () => {
    const preset = graphingEngine.getZoomPreset('decimal');
    if (preset) {
      setWindowSettings({
        xMin: preset.xMin,
        xMax: preset.xMax,
        xScale: preset.xScale,
        yMin: preset.yMin,
        yMax: preset.yMax,
        yScale: preset.yScale,
      });
    }
    setCurrentMenu(null);
  },

  'ztrig': () => {
    const preset = graphingEngine.getZoomPreset('trig');
    if (preset) {
      setWindowSettings({
        xMin: preset.xMin,
        xMax: preset.xMax,
        xScale: preset.xScale,
        yMin: preset.yMin,
        yMax: preset.yMax,
        yScale: preset.yScale,
      });
    }
    setCurrentMenu(null);
  },

  'zsquare': () => {
    const preset = graphingEngine.getZoomPreset('square');
    if (preset) {
      setWindowSettings({
        xMin: preset.xMin,
        xMax: preset.xMax,
        xScale: preset.xScale,
        yMin: preset.yMin,
        yMax: preset.yMax,
        yScale: preset.yScale,
      });
    }
    setCurrentMenu(null);
  },

  'zoomin': (windowSettings: WindowSettings) => {
    const newSettings = graphingEngine.calculateZoomIn(windowSettings);
    setWindowSettings(newSettings);
    setCurrentMenu(null);
  },

  'zoomout': (windowSettings: WindowSettings) => {
    const newSettings = graphingEngine.calculateZoomOut(windowSettings);
    setWindowSettings(newSettings);
    setCurrentMenu(null);
  },
});

/**
 * Handlers pour le menu MATH
 */
export const createMathHandlers = (
  appendInput: (value: string) => void,
  setCurrentMenu: (menu: string | null) => void
) => ({
  // Menu NUM
  'abs': () => { appendInput('abs('); setCurrentMenu(null); },
  'round': () => { appendInput('round('); setCurrentMenu(null); },
  'ipart': () => { appendInput('iPart('); setCurrentMenu(null); },
  'fpart': () => { appendInput('fPart('); setCurrentMenu(null); },
  'int': () => { appendInput('int('); setCurrentMenu(null); },
  'min': () => { appendInput('min('); setCurrentMenu(null); },
  'max': () => { appendInput('max('); setCurrentMenu(null); },
  'lcm': () => { appendInput('lcm('); setCurrentMenu(null); },
  'gcd': () => { appendInput('gcd('); setCurrentMenu(null); },

  // Menu CPX
  'conj': () => { appendInput('conj('); setCurrentMenu(null); },
  'real': () => { appendInput('real('); setCurrentMenu(null); },
  'imag': () => { appendInput('imag('); setCurrentMenu(null); },
  'angle': () => { appendInput('angle('); setCurrentMenu(null); },
  'rect': () => { appendInput('Rect('); setCurrentMenu(null); },
  'polar': () => { appendInput('Polar('); setCurrentMenu(null); },

  // Menu PRB
  'rand': () => {
    const value = mathFunctionsService.rand();
    appendInput(value.toFixed(4));
    setCurrentMenu(null);
  },
  'npr': () => { appendInput('nPr('); setCurrentMenu(null); },
  'ncr': () => { appendInput('nCr('); setCurrentMenu(null); },
  'factorial': () => { appendInput('!'); setCurrentMenu(null); },
  'randint': () => { appendInput('randInt('); setCurrentMenu(null); },
  'randnorm': () => { appendInput('randNorm('); setCurrentMenu(null); },
  'randsamp': () => { appendInput('randSamp('); setCurrentMenu(null); },
});

/**
 * Handlers pour le menu STAT
 */
export const createStatHandlers = (
  addToHistory: (entry: string) => void,
  setCurrentMenu: (menu: string | null) => void,
  setMode?: (mode: string) => void
) => ({
  'edit': () => {
    if (setMode) setMode('STAT_EDIT');
    setCurrentMenu(null);
  },

  '1-var-stats': () => {
    try {
      // Calculer stats sur L1 par défaut
      const stats = statisticsService.calculate1VarStats('L1');

      // Afficher les résultats
      addToHistory('1-Var Stats (L1)');
      addToHistory(`n=${stats.n}`);
      addToHistory(`mean=${stats.mean.toFixed(4)}`);
      addToHistory(`Σx=${stats.sumX.toFixed(4)}`);
      addToHistory(`Sx=${stats.Sx.toFixed(4)}`);
      addToHistory(`σx=${stats.σx.toFixed(4)}`);
      addToHistory(`min=${stats.min}`);
      addToHistory(`Q1=${stats.Q1}`);
      addToHistory(`Med=${stats.median}`);
      addToHistory(`Q3=${stats.Q3}`);
      addToHistory(`max=${stats.max}`);

      setCurrentMenu(null);
    } catch (error) {
      addToHistory('Erreur: Liste vide');
      setCurrentMenu(null);
    }
  },

  '2-var-stats': () => {
    try {
      const stats = statisticsService.calculate2VarStats('L1', 'L2');

      addToHistory('2-Var Stats (L1,L2)');
      addToHistory(`n=${stats.n}`);
      addToHistory(`meanX=${stats.mean.toFixed(4)}`);
      addToHistory(`meanY=${stats.meanY.toFixed(4)}`);
      addToHistory(`Sx=${stats.Sx.toFixed(4)}`);
      addToHistory(`Sy=${stats.Sy.toFixed(4)}`);

      setCurrentMenu(null);
    } catch (error) {
      addToHistory('Erreur: Listes vides');
      setCurrentMenu(null);
    }
  },

  'linreg': () => {
    try {
      const result = statisticsService.linearRegression('L1', 'L2');

      addToHistory('LinReg (L1,L2)');
      addToHistory(result.equation);
      addToHistory(`a=${result.a.toFixed(6)}`);
      addToHistory(`b=${result.b.toFixed(6)}`);
      if (result.r) addToHistory(`r=${result.r.toFixed(6)}`);
      if (result.r2) addToHistory(`r²=${result.r2.toFixed(6)}`);

      setCurrentMenu(null);
    } catch (error) {
      addToHistory('Erreur: Données insuffisantes');
      setCurrentMenu(null);
    }
  },

  'quadreg': () => {
    try {
      const result = statisticsService.quadraticRegression('L1', 'L2');

      addToHistory('QuadReg (L1,L2)');
      addToHistory(result.equation);
      addToHistory(`a=${result.a.toFixed(6)}`);
      addToHistory(`b=${result.b.toFixed(6)}`);
      if (result.c) addToHistory(`c=${result.c.toFixed(6)}`);

      setCurrentMenu(null);
    } catch (error) {
      addToHistory('Erreur: Données insuffisantes');
      setCurrentMenu(null);
    }
  },

  'expreg': () => {
    try {
      const result = statisticsService.exponentialRegression('L1', 'L2');

      addToHistory('ExpReg (L1,L2)');
      addToHistory(result.equation);
      addToHistory(`a=${result.a.toFixed(6)}`);
      addToHistory(`b=${result.b.toFixed(6)}`);

      setCurrentMenu(null);
    } catch (error) {
      addToHistory('Erreur: Données insuffisantes');
      setCurrentMenu(null);
    }
  },

  'pwrreg': () => {
    try {
      const result = statisticsService.powerRegression('L1', 'L2');

      addToHistory('PwrReg (L1,L2)');
      addToHistory(result.equation);
      addToHistory(`a=${result.a.toFixed(6)}`);
      addToHistory(`b=${result.b.toFixed(6)}`);

      setCurrentMenu(null);
    } catch (error) {
      addToHistory('Erreur: Données insuffisantes');
      setCurrentMenu(null);
    }
  },

  'lnreg': () => {
    try {
      const result = statisticsService.logarithmicRegression('L1', 'L2');

      addToHistory('LnReg (L1,L2)');
      addToHistory(result.equation);
      addToHistory(`a=${result.a.toFixed(6)}`);
      addToHistory(`b=${result.b.toFixed(6)}`);

      setCurrentMenu(null);
    } catch (error) {
      addToHistory('Erreur: Données insuffisantes');
      setCurrentMenu(null);
    }
  },
});

/**
 * Handlers pour le menu CALC (calculs sur courbes)
 */
export const createCalcHandlers = (
  graphFunctions: string[],
  activeFunctions: boolean[],
  windowSettings: any,
  angleMode: 'DEGREE' | 'RADIAN',
  addToHistory: (entry: string) => void,
  setCurrentMenu: (menu: string | null) => void
) => ({
  'value': () => {
    // Calculer f(x) pour un X donné
    // TODO: Implémenter avec prompt utilisateur
    addToHistory('value: Entrez X avec prompt');
    setCurrentMenu(null);
  },

  'zero': () => {
    // Trouver le zéro de la fonction active
    try {
      const activeFuncIndex = activeFunctions.findIndex(active => active);
      if (activeFuncIndex === -1) {
        addToHistory('Erreur: Aucune fonction active');
        setCurrentMenu(null);
        return;
      }

      const expression = graphFunctions[activeFuncIndex];
      const xStart = (windowSettings.xMin + windowSettings.xMax) / 2;

      const result = graphingEngine.findZero(expression, xStart, angleMode);

      if (result) {
        addToHistory(`Zero trouvé:`);
        addToHistory(`X=${result.x.toFixed(6)}`);
        addToHistory(`Y=${result.y.toFixed(6)}`);
      } else {
        addToHistory('Aucun zéro trouvé dans cet intervalle');
      }

      setCurrentMenu(null);
    } catch (error) {
      addToHistory('Erreur lors de la recherche de zéro');
      setCurrentMenu(null);
    }
  },

  'minimum': () => {
    // Trouver le minimum de la fonction active
    try {
      const activeFuncIndex = activeFunctions.findIndex(active => active);
      if (activeFuncIndex === -1) {
        addToHistory('Erreur: Aucune fonction active');
        setCurrentMenu(null);
        return;
      }

      const expression = graphFunctions[activeFuncIndex];

      const result = graphingEngine.findMinimum(
        expression,
        windowSettings.xMin,
        windowSettings.xMax,
        angleMode
      );

      if (result) {
        addToHistory(`Minimum trouvé:`);
        addToHistory(`X=${result.x.toFixed(6)}`);
        addToHistory(`Y=${result.y.toFixed(6)}`);
      } else {
        addToHistory('Aucun minimum trouvé');
      }

      setCurrentMenu(null);
    } catch (error) {
      addToHistory('Erreur lors de la recherche de minimum');
      setCurrentMenu(null);
    }
  },

  'maximum': () => {
    // Trouver le maximum de la fonction active
    try {
      const activeFuncIndex = activeFunctions.findIndex(active => active);
      if (activeFuncIndex === -1) {
        addToHistory('Erreur: Aucune fonction active');
        setCurrentMenu(null);
        return;
      }

      const expression = graphFunctions[activeFuncIndex];

      const result = graphingEngine.findMaximum(
        expression,
        windowSettings.xMin,
        windowSettings.xMax,
        angleMode
      );

      if (result) {
        addToHistory(`Maximum trouvé:`);
        addToHistory(`X=${result.x.toFixed(6)}`);
        addToHistory(`Y=${result.y.toFixed(6)}`);
      } else {
        addToHistory('Aucun maximum trouvé');
      }

      setCurrentMenu(null);
    } catch (error) {
      addToHistory('Erreur lors de la recherche de maximum');
      setCurrentMenu(null);
    }
  },

  'intersect': () => {
    // Trouver l'intersection de deux fonctions
    // TODO: Implémenter recherche d'intersection
    addToHistory('intersect: À implémenter');
    setCurrentMenu(null);
  },

  'dy-dx': () => {
    // Calculer la dérivée en un point
    // TODO: Implémenter avec prompt pour X
    addToHistory('dy/dx: À implémenter avec prompt');
    setCurrentMenu(null);
  },

  'integral': () => {
    // Calculer l'intégrale définie
    try {
      const activeFuncIndex = activeFunctions.findIndex(active => active);
      if (activeFuncIndex === -1) {
        addToHistory('Erreur: Aucune fonction active');
        setCurrentMenu(null);
        return;
      }

      const expression = graphFunctions[activeFuncIndex];

      // Utiliser les bornes de la fenêtre ou un sous-intervalle
      const a = windowSettings.xMin;
      const b = windowSettings.xMax;

      const result = graphingEngine.integrate(expression, a, b, angleMode);

      addToHistory(`∫f(x)dx de ${a.toFixed(2)} à ${b.toFixed(2)}:`);
      addToHistory(`Résultat = ${result.toFixed(6)}`);

      setCurrentMenu(null);
    } catch (error) {
      addToHistory('Erreur lors du calcul de l\'intégrale');
      setCurrentMenu(null);
    }
  },
});

/**
 * Fonction utilitaire pour obtenir le handler d'un menu
 */
export const getMenuHandler = (
  menuType: string,
  itemId: string,
  handlers: Record<string, any>
): (() => void) | null => {
  console.log({ menuType }); // Supprimer warning
  const handler = handlers[itemId];
  return handler || null;
};
