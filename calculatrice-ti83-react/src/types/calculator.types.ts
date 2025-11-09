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
  | 'MEM'
  | 'MATRIX'
  | 'MATRIX_EDIT'
  | 'TABLE'
  | 'TABLE_VIEW'
  | 'TBLSET'
  | 'TBLSET_EDIT'
  | 'STAT'
  | 'STAT_EDIT'
  | 'STAT_PLOT'
  | 'MATH'
  | 'CALC_VALUE'
  | 'CALC_DERIV'
  | 'CALC_INTEGRAL_LOWER'
  | 'CALC_INTEGRAL_UPPER'
  | 'ZOOM'
  | 'TRACE'
  | 'CATALOG'
  | 'SOLVER'
  | 'FINANCE'
  | 'PRGM_EDIT';

// Actions possibles sur les touches
export type KeyAction =
  // Touches graphiques
  | 'y-vars' | 'window' | 'zoom' | 'trace' | 'graph'
  // Touches de menu
  | 'stat' | 'math' | 'calc' | 'mode' | 'del' | 'clear'
  | '2nd' | 'alpha' | 'apps' | 'prgm' | 'vars'
  // Fonctions secondaires de menu
  | 'test' | 'angle' | 'draw' | 'distr' | 'matrix'
  // Touches de fonction
  | 'x' | 'sin' | 'cos' | 'tan' | 'pow' | 'inverse'
  | 'sqrt' | 'ln' | 'log' | 'exp' | 'pi'
  // Chiffres
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  // Opérateurs
  | 'add' | 'subtract' | 'multiply' | 'divide'
  // Symboles
  | 'left-paren' | 'right-paren' | 'comma' | 'dot' | 'negative'
  // Navigation
  | 'enter' | 'up' | 'down' | 'left' | 'right'
  // Stockage et récupération
  | 'sto' | 'rcl' | 'on' | 'off'
  // Actions secondaires
  | 'quit' | 'ins' | 'table' | 'tblset' | 'format' | 'stat-plot'
  | 'asin' | 'acos' | 'atan' | 'square' | 'exp-func' | 'power10'
  | 'ans' | 'left-brace' | 'right-brace' | 'mem' | 'link'
  | 'ee' | 'catalog' | 'entry' | 'list'
  | 'left-bracket' | 'right-bracket' | 'left-brace-small' | 'right-brace-small'
  | 'u' | 'v' | 'w' | 'i'
  // Actions pour le mode ALPHA
  | 'alpha-A' | 'alpha-B' | 'alpha-C' | 'alpha-D' | 'alpha-E' | 'alpha-F' | 'alpha-G'
  | 'alpha-H' | 'alpha-I' | 'alpha-J' | 'alpha-K' | 'alpha-L' | 'alpha-M' | 'alpha-N'
  | 'alpha-O' | 'alpha-P' | 'alpha-Q' | 'alpha-R' | 'alpha-S' | 'alpha-T'
  | 'alpha-U' | 'alpha-V' | 'alpha-W' | 'alpha-X' | 'alpha-Y' | 'alpha-Z'
  | 'alpha-θ' | 'alpha-n' | 'alpha- ' | 'alpha-:';

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

// Mode de graphique
export type GraphMode = 'FUNC' | 'PAR' | 'POL' | 'SEQ';

// Paramètres de la fenêtre graphique
export interface WindowSettings {
  xMin: number;
  xMax: number;
  xScale: number;
  yMin: number;
  yMax: number;
  yScale: number;
  // Paramètres pour mode paramétrique
  tMin: number;
  tMax: number;
  tStep: number;
  // Paramètres pour mode polaire
  θMin: number;
  θMax: number;
  θStep: number;
  // Paramètres pour mode séquence
  nMin: number;
  nMax: number;
  plotStart: number;
  plotStep: number;
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
  graphMode: GraphMode;
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
