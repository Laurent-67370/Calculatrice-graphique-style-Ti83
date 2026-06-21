/**
 * Types pour les menus et les statistiques
 */

// Type de menu
export type MenuType =
  | 'STAT'
  | 'MATH'
  | 'MODE'
  | 'ZOOM'
  | 'CALC'
  | 'TEST'
  | 'LOGIC'
  | 'ANGLE'
  | 'VARS'
  | 'CATALOG'
  | 'LIST'
  | 'DISTR'
  | 'DRAW'
  | 'MATRIX';

// Item de menu
export interface MenuItem {
  id: string;
  label: string;
  action: () => void;
  submenu?: MenuItem[];
}

// État du menu
export interface MenuState {
  currentMenu: MenuType | null;
  menuStack: MenuType[];
  selectedIndex: number;
  items: MenuItem[];
}

// Sous-menus MATH
export type MathSubmenu = 'NUM' | 'CPX' | 'PRB';

// Sous-menus STAT
export type StatSubmenu = 'EDIT' | 'CALC' | 'TESTS';

// Props des composants de menu
export interface MenuSystemProps {
  menu: MenuState;
  onNavigate: (direction: 'up' | 'down') => void;
  onSelect: () => void;
  onClose: () => void;
}

export interface MenuItemProps {
  item: MenuItem;
  isSelected: boolean;
  onSelect: () => void;
}

// Listes statistiques
export interface StatList {
  name: string;
  values: number[];
}

// Résultats statistiques 1-Var
export interface OneVarStats {
  n: number;
  mean: number;
  sum: number;
  sumSquared: number;
  sampleStdDev: number;
  populationStdDev: number;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}

// Résultats statistiques 2-Var
export interface TwoVarStats extends OneVarStats {
  meanX: number;
  meanY: number;
  sumX: number;
  sumY: number;
  sumXY: number;
  sumX2: number;
  sumY2: number;
}

// Types de régression
export type RegressionType =
  | 'LINEAR'
  | 'QUADRATIC'
  | 'CUBIC'
  | 'QUARTIC'
  | 'EXPONENTIAL'
  | 'LOGARITHMIC'
  | 'POWER'
  | 'SINUSOIDAL'
  | 'LOGISTIC';

// Résultat de régression
export interface RegressionResult {
  type: RegressionType;
  equation: string;
  coefficients: number[];
  r?: number;
  r2?: number;
}

// Configuration des listes
export interface ListConfig {
  lists: StatList[];
  maxLists: number;
  maxValues: number;
}

// État de l'éditeur de listes
export interface ListEditorState {
  currentList: number;
  currentRow: number;
  editing: boolean;
  tempValue: string;
}

// Fonctions mathématiques
export interface MathFunction {
  name: string;
  category: MathSubmenu;
  description: string;
  execute: (...args: number[]) => number;
  paramCount: number;
}

// Distributions de probabilité
export type DistributionType =
  | 'NORMAL'
  | 'STUDENT_T'
  | 'CHI_SQUARE'
  | 'F_DIST'
  | 'BINOMIAL'
  | 'POISSON'
  | 'GEOMETRIC';

export interface DistributionParams {
  type: DistributionType;
  params: number[];
}
