/**
 * Types pour la calculatrice TI-83 Plus
 */

// Modes de fonctionnement de la calculatrice
export type CalculatorMode =
  | 'NORMAL'
  | 'Y_EDITOR'
  | 'Y_EDIT'
  | 'WINDOW'
  | 'WINDOW_EDIT'
  | 'MODE'
  | 'TABLE'
  | 'STAT'
  | 'STAT_EDIT'
  | 'MATH'
  | 'CALC_VALUE'
  | 'CALC_DERIV'
  | 'CALC_INTEGRAL_LOWER'
  | 'CALC_INTEGRAL_UPPER'
  | 'ZOOM';

// Actions possibles sur les touches
export type KeyAction =
  | 'y-vars' | 'window' | 'zoom' | 'trace' | 'graph'
  | 'stat' | 'math' | 'calc' | 'mode' | 'del' | 'clear'
  | '2nd' | 'alpha' | 'apps' | 'prgm' | 'vars'
  | 'test' | 'angle' | 'draw' | 'distr' | 'matrix'
  | 'x' | 'sin' | 'cos' | 'tan' | 'pow'
  | 'sqrt' | 'ln' | 'log' | 'exp' | 'pi'
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | 'add' | 'subtract' | 'multiply' | 'divide'
  | 'left-paren' | 'right-paren' | 'comma' | 'negative'
  | 'enter' | 'up' | 'down' | 'left' | 'right';

// Configuration de l'écran
export interface DisplayConfig {
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
}

// État de la calculatrice
export interface CalculatorState {
  // Affichage
  currentInput: string;
  history: string[];

  // Mode et état
  currentMode: CalculatorMode;
  isSecondFunction: boolean;
  isAlphaMode: boolean;
  isGraphMode: boolean;

  // Fonctions graphiques
  currentFunction: number;
  graphFunctions: string[];
  activeFunctions: boolean[];

  // Fenêtre de visualisation
  windowSettings: WindowSettings;

  // Éditeur en cours
  currentEditor?: string;
  editingField?: string;
}

// Paramètres de la fenêtre graphique
export interface WindowSettings {
  xMin: number;
  xMax: number;
  xScale: number;
  yMin: number;
  yMax: number;
  yScale: number;
}

// Options de zoom
export interface ZoomOption {
  name: string;
  action: () => void;
}

// Historique de calcul
export interface HistoryEntry {
  expression: string;
  result: number | string;
  timestamp: Date;
}

// Configuration de la calculatrice
export interface CalculatorConfig {
  angleMode: 'DEGREE' | 'RADIAN';
  floatMode: 'FLOAT' | 'FIXED';
  fixedDecimals: number;
  scientificNotation: boolean;
  complexMode: 'REAL' | 'RECTANGULAR' | 'POLAR';
}

// Résultat d'évaluation
export interface EvaluationResult {
  success: boolean;
  value?: number;
  error?: string;
}

// Props pour les composants
export interface CalculatorProps {
  onStateChange?: (state: CalculatorState) => void;
  initialConfig?: Partial<CalculatorConfig>;
}

export interface KeyboardProps {
  onKeyPress: (action: KeyAction) => void;
  isSecondActive: boolean;
  isAlphaActive: boolean;
}

export interface DisplayProps {
  input: string;
  history: string[];
  mode: CalculatorMode;
}
