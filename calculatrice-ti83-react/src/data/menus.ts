/**
 * Définitions des menus TI-83 Plus
 */

import type { MenuItem } from '../components/Menus/Menu';

// Menu STAT
export const statMenuItems: MenuItem[] = [
  { id: 'edit', label: 'Edit...', action: () => {} },
  { id: '1-var-stats', label: '1-Var Stats', action: () => {} },
  { id: '2-var-stats', label: '2-Var Stats', action: () => {} },
  { id: 'med-med', label: 'Med-Med', action: () => {} },
  { id: 'linreg', label: 'LinReg(ax+b)', action: () => {} },
  { id: 'quadreg', label: 'QuadReg', action: () => {} },
  { id: 'cubicreg', label: 'CubicReg', action: () => {} },
  { id: 'quartreg', label: 'QuartReg', action: () => {} },
  { id: 'linreg-ab', label: 'LinReg(a+bx)', action: () => {} },
  { id: 'expreg', label: 'ExpReg', action: () => {} },
  { id: 'pwrreg', label: 'PwrReg', action: () => {} },
  { id: 'lnreg', label: 'LnReg', action: () => {} },
  { id: 'sinreg', label: 'SinReg', action: () => {} },
  { id: 'logistic', label: 'Logistic', action: () => {} },
];

// Menu MATH
export const mathMenuItems: MenuItem[] = [
  // Solver (MATH > 0)
  { id: 'solver', label: 'Solver...', action: () => {} },

  // Sous-menu principal MATH
  { id: 'cbrt', label: '³√(', action: () => {} },
  { id: 'log-base', label: 'logBASE(', action: () => {} },
  { id: 'exp', label: 'e^(', action: () => {} },
  { id: 'pow10', label: '10^(', action: () => {} },
  { id: 'hypot', label: 'hypot(', action: () => {} },

  // Sous-menu NUM
  { id: 'math-num', label: 'NUM', action: () => {}, submenu: [
    { id: 'abs', label: 'abs(', action: () => {} },
    { id: 'round', label: 'round(', action: () => {} },
    { id: 'ipart', label: 'iPart(', action: () => {} },
    { id: 'fpart', label: 'fPart(', action: () => {} },
    { id: 'int', label: 'int(', action: () => {} },
    { id: 'min', label: 'min(', action: () => {} },
    { id: 'max', label: 'max(', action: () => {} },
    { id: 'lcm', label: 'lcm(', action: () => {} },
    { id: 'gcd', label: 'gcd(', action: () => {} },
    { id: 'ceil', label: 'ceil(', action: () => {} },
    { id: 'floor', label: 'floor(', action: () => {} },
    { id: 'sign', label: 'sign(', action: () => {} },
    { id: 'trunc', label: 'trunc(', action: () => {} },
    { id: 'mod', label: 'mod(', action: () => {} },
  ]},

  // Sous-menu CPX
  { id: 'math-cpx', label: 'CPX', action: () => {}, submenu: [
    { id: 'conj', label: 'conj(', action: () => {} },
    { id: 'real', label: 'real(', action: () => {} },
    { id: 'imag', label: 'imag(', action: () => {} },
    { id: 'angle', label: 'angle(', action: () => {} },
    { id: 'abs-cpx', label: 'abs(', action: () => {} },
    { id: 'rect', label: 'Rect(', action: () => {} },
    { id: 'polar', label: 'Polar(', action: () => {} },
  ]},

  // Sous-menu PRB
  { id: 'math-prb', label: 'PRB', action: () => {}, submenu: [
    { id: 'rand', label: 'rand', action: () => {} },
    { id: 'npr', label: 'nPr(', action: () => {} },
    { id: 'ncr', label: 'nCr(', action: () => {} },
    { id: 'factorial', label: '!', action: () => {} },
    { id: 'randint', label: 'randInt(', action: () => {} },
    { id: 'randnorm', label: 'randNorm(', action: () => {} },
    { id: 'randbin', label: 'randBin(', action: () => {} },
  ]},

  // Sous-menu ANGLE
  { id: 'math-angle', label: 'ANGLE', action: () => {}, submenu: [
    { id: 'deg-to-rad', label: '°→rad', action: () => {} },
    { id: 'rad-to-deg', label: 'rad→°', action: () => {} },
    { id: 'dms', label: '→DMS', action: () => {} },
    { id: 'dec', label: '→Dec', action: () => {} },
  ]},

  // Sous-menu TRIG
  { id: 'math-trig', label: 'TRIG', action: () => {}, submenu: [
    { id: 'sinh', label: 'sinh(', action: () => {} },
    { id: 'cosh', label: 'cosh(', action: () => {} },
    { id: 'tanh', label: 'tanh(', action: () => {} },
    { id: 'asinh', label: 'asinh(', action: () => {} },
    { id: 'acosh', label: 'acosh(', action: () => {} },
    { id: 'atanh', label: 'atanh(', action: () => {} },
  ]},
];

// Menu ZOOM
export const zoomMenuItems: MenuItem[] = [
  { id: 'zbox', label: 'ZBox', action: () => {} },
  { id: 'zoomin', label: 'Zoom In', action: () => {} },
  { id: 'zoomout', label: 'Zoom Out', action: () => {} },
  { id: 'zdecimal', label: 'ZDecimal', action: () => {} },
  { id: 'zsquare', label: 'ZSquare', action: () => {} },
  { id: 'zstandard', label: 'ZStandard', action: () => {} },
  { id: 'ztrig', label: 'ZTrig', action: () => {} },
  { id: 'zinteger', label: 'ZInteger', action: () => {} },
  { id: 'zprevious', label: 'ZPrevious', action: () => {} },
  { id: 'zoomstat', label: 'ZoomStat', action: () => {} },
];

// Menu CALC (calculs sur courbes)
export const calcMenuItems: MenuItem[] = [
  { id: 'value', label: 'value', action: () => {} },
  { id: 'zero', label: 'zero', action: () => {} },
  { id: 'minimum', label: 'minimum', action: () => {} },
  { id: 'maximum', label: 'maximum', action: () => {} },
  { id: 'intersect', label: 'intersect', action: () => {} },
  { id: 'dy-dx', label: 'dy/dx', action: () => {} },
  { id: 'integral', label: '∫f(x)dx', action: () => {} },
];

// Menu MODE
export interface ModeConfig {
  angleMode: 'DEGREE' | 'RADIAN';
  floatMode: 'FLOAT' | 'FIXED';
  fixedDecimals: number;
  complexMode: 'REAL' | 'RECTANGULAR' | 'POLAR';
  seqMode: 'FUNC' | 'PAR' | 'POL' | 'SEQ';
  connected: boolean;
  sequential: boolean;
}

export const defaultModeConfig: ModeConfig = {
  angleMode: 'DEGREE',
  floatMode: 'FLOAT',
  fixedDecimals: 2,
  complexMode: 'REAL',
  seqMode: 'FUNC',
  connected: true,
  sequential: false,
};

// Menu VARS
export const varsMenuItems: MenuItem[] = [
  // Sous-menu Window
  { id: 'vars-window', label: 'Window...', action: () => {}, submenu: [
    { id: 'xmin', label: 'Xmin', action: () => {} },
    { id: 'xmax', label: 'Xmax', action: () => {} },
    { id: 'xscl', label: 'Xscl', action: () => {} },
    { id: 'ymin', label: 'Ymin', action: () => {} },
    { id: 'ymax', label: 'Ymax', action: () => {} },
    { id: 'yscl', label: 'Yscl', action: () => {} },
  ]},

  // Sous-menu Zoom
  { id: 'vars-zoom', label: 'Zoom...', action: () => {}, submenu: [
    { id: 'zxmin', label: 'ZXmin', action: () => {} },
    { id: 'zxmax', label: 'ZXmax', action: () => {} },
    { id: 'zxscl', label: 'ZXscl', action: () => {} },
    { id: 'zymin', label: 'ZYmin', action: () => {} },
    { id: 'zymax', label: 'ZYmax', action: () => {} },
    { id: 'zyscl', label: 'ZYscl', action: () => {} },
  ]},

  // XY (coordonnées du dernier point tracé)
  { id: 'vars-xy', label: 'XY', action: () => {}, submenu: [
    { id: 'x', label: 'X', action: () => {} },
    { id: 'y', label: 'Y', action: () => {} },
  ]},

  // Sous-menu Matrix (matrices A à J)
  { id: 'vars-matrix', label: 'Matrix...', action: () => {}, submenu: [
    { id: 'matrix-a', label: '[A]', action: () => {} },
    { id: 'matrix-b', label: '[B]', action: () => {} },
    { id: 'matrix-c', label: '[C]', action: () => {} },
    { id: 'matrix-d', label: '[D]', action: () => {} },
    { id: 'matrix-e', label: '[E]', action: () => {} },
    { id: 'matrix-f', label: '[F]', action: () => {} },
    { id: 'matrix-g', label: '[G]', action: () => {} },
    { id: 'matrix-h', label: '[H]', action: () => {} },
    { id: 'matrix-i', label: '[I]', action: () => {} },
    { id: 'matrix-j', label: '[J]', action: () => {} },
  ]},
];

// Menu DISTR (2ND + VARS)
export const distrMenuItems: MenuItem[] = [
  { id: 'normalpdf', label: 'normalpdf(', action: () => {} },
  { id: 'normalcdf', label: 'normalcdf(', action: () => {} },
  { id: 'invnorm', label: 'invNorm(', action: () => {} },
  { id: 'tpdf', label: 'tpdf(', action: () => {} },
  { id: 'tcdf', label: 'tcdf(', action: () => {} },
  { id: 'chi2pdf', label: 'χ²pdf(', action: () => {} },
  { id: 'chi2cdf', label: 'χ²cdf(', action: () => {} },
  { id: 'fpdf', label: 'Fpdf(', action: () => {} },
  { id: 'fcdf', label: 'Fcdf(', action: () => {} },
  { id: 'binompdf', label: 'binompdf(', action: () => {} },
  { id: 'binomcdf', label: 'binomcdf(', action: () => {} },
  { id: 'poissonpdf', label: 'poissonpdf(', action: () => {} },
  { id: 'poissoncdf', label: 'poissoncdf(', action: () => {} },
  { id: 'geometpdf', label: 'geometpdf(', action: () => {} },
  { id: 'geometcdf', label: 'geometcdf(', action: () => {} },
];

// Menu LOGIC (sous-menu de TEST)
export const logicMenuItems: MenuItem[] = [
  { id: 'and', label: 'and', action: () => {} },
  { id: 'or', label: 'or', action: () => {} },
  { id: 'xor', label: 'xor', action: () => {} },
  { id: 'not', label: 'not(', action: () => {} },
];

// Menu TEST (2ND + MATH)
export const testMenuItems: MenuItem[] = [
  // Sous-menu LOGIC en premier (comme sur la vraie TI-83)
  { id: 'test-logic', label: 'LOGIC', action: () => {}, submenu: logicMenuItems },

  // Opérateurs de comparaison
  { id: 'equal', label: '=', action: () => {} },
  { id: 'not-equal', label: '≠', action: () => {} },
  { id: 'greater', label: '>', action: () => {} },
  { id: 'greater-equal', label: '≥', action: () => {} },
  { id: 'less', label: '<', action: () => {} },
  { id: 'less-equal', label: '≤', action: () => {} },
];

// Menu LIST - NAMES (sous-menu)
export const listNamesMenuItems: MenuItem[] = [
  { id: 'L1', label: 'L₁', action: () => {} },
  { id: 'L2', label: 'L₂', action: () => {} },
  { id: 'L3', label: 'L₃', action: () => {} },
  { id: 'L4', label: 'L₄', action: () => {} },
  { id: 'L5', label: 'L₅', action: () => {} },
  { id: 'L6', label: 'L₆', action: () => {} },
];

// Menu LIST - OPS (sous-menu)
export const listOpsMenuItems: MenuItem[] = [
  { id: 'sortA', label: 'SortA(', action: () => {} },
  { id: 'sortD', label: 'SortD(', action: () => {} },
  { id: 'dim', label: 'dim(', action: () => {} },
  { id: 'fill', label: 'Fill(', action: () => {} },
  { id: 'seq', label: 'seq(', action: () => {} },
  { id: 'cumSum', label: 'cumSum(', action: () => {} },
  { id: 'deltaList', label: 'ΔList(', action: () => {} },
];

// Menu LIST - MATH (sous-menu)
export const listMathMenuItems: MenuItem[] = [
  { id: 'min', label: 'min(', action: () => {} },
  { id: 'max', label: 'max(', action: () => {} },
  { id: 'mean', label: 'mean(', action: () => {} },
  { id: 'median', label: 'median(', action: () => {} },
  { id: 'sum', label: 'sum(', action: () => {} },
  { id: 'prod', label: 'prod(', action: () => {} },
  { id: 'stdDev', label: 'stdDev(', action: () => {} },
  { id: 'variance', label: 'variance(', action: () => {} },
];

// Menu LIST principal (2ND + STAT)
export const listMenuItems: MenuItem[] = [
  { id: 'list-names', label: 'NAMES', action: () => {}, submenu: listNamesMenuItems },
  { id: 'list-ops', label: 'OPS', action: () => {}, submenu: listOpsMenuItems },
  { id: 'list-math', label: 'MATH', action: () => {}, submenu: listMathMenuItems },
];

// Menu DRAW - POINTS (sous-menu)
export const drawPointsMenuItems: MenuItem[] = [
  { id: 'pt-on', label: 'Pt-On(', action: () => {} },
  { id: 'pt-off', label: 'Pt-Off(', action: () => {} },
  { id: 'pt-change', label: 'Pt-Change(', action: () => {} },
];

// Menu DRAW - STO (sous-menu)
export const drawStoMenuItems: MenuItem[] = [
  { id: 'store-pic', label: 'StorePic', action: () => {} },
  { id: 'recall-pic', label: 'RecallPic', action: () => {} },
  { id: 'store-gdb', label: 'StoreGDB', action: () => {} },
  { id: 'recall-gdb', label: 'RecallGDB', action: () => {} },
];

// Menu DRAW principal (2ND + PRGM)
export const drawMenuItems: MenuItem[] = [
  { id: 'clr-draw', label: 'ClrDraw', action: () => {} },
  { id: 'line', label: 'Line(', action: () => {} },
  { id: 'horizontal', label: 'Horizontal', action: () => {} },
  { id: 'vertical', label: 'Vertical', action: () => {} },
  { id: 'tangent', label: 'Tangent(', action: () => {} },
  { id: 'draw-f', label: 'DrawF', action: () => {} },
  { id: 'shade', label: 'Shade(', action: () => {} },
  { id: 'draw-inv', label: 'DrawInv', action: () => {} },
  { id: 'circle', label: 'Circle(', action: () => {} },
  { id: 'text', label: 'Text(', action: () => {} },
  { id: 'draw-points', label: 'POINTS', action: () => {}, submenu: drawPointsMenuItems },
  { id: 'draw-sto', label: 'STO', action: () => {}, submenu: drawStoMenuItems },
];

// Menu MATRX (2ND + X⁻¹) — onglets NAMES / MATH / OPS + Edit
const matrixNamesMenuItems: MenuItem[] = [
  { id: 'mx-edit', label: 'Edit...', action: () => {} },
  { id: 'mx-a', label: '[A]', action: () => {} },
  { id: 'mx-b', label: '[B]', action: () => {} },
  { id: 'mx-c', label: '[C]', action: () => {} },
  { id: 'mx-d', label: '[D]', action: () => {} },
  { id: 'mx-e', label: '[E]', action: () => {} },
  { id: 'mx-f', label: '[F]', action: () => {} },
  { id: 'mx-g', label: '[G]', action: () => {} },
  { id: 'mx-h', label: '[H]', action: () => {} },
  { id: 'mx-i', label: '[I]', action: () => {} },
  { id: 'mx-j', label: '[J]', action: () => {} },
];

const matrixMathMenuItems: MenuItem[] = [
  { id: 'mx-det', label: 'det(', action: () => {} },
  { id: 'mx-transpose', label: 'ᵀ', action: () => {} },
  { id: 'mx-dim', label: 'dim(', action: () => {} },
  { id: 'mx-fill', label: 'Fill(', action: () => {} },
  { id: 'mx-identity', label: 'identity(', action: () => {} },
  { id: 'mx-randm', label: 'randM(', action: () => {} },
  { id: 'mx-augment', label: 'augment(', action: () => {} },
  { id: 'mx-matrlist', label: 'Matr►list(', action: () => {} },
  { id: 'mx-listmatr', label: 'List►matr(', action: () => {} },
  { id: 'mx-cumsum', label: 'cumSum(', action: () => {} },
  { id: 'mx-ref', label: 'ref(', action: () => {} },
  { id: 'mx-rref', label: 'rref(', action: () => {} },
  { id: 'mx-rowswap', label: 'rowSwap(', action: () => {} },
  { id: 'mx-row', label: '*row(', action: () => {} },
  { id: 'mx-rowplus', label: '*row+(', action: () => {} },
  { id: 'mx-rowminus', label: '*row-(', action: () => {} },
];

const matrixOpsMenuItems: MenuItem[] = [
  { id: 'mx-sorta', label: 'SortA(', action: () => {} },
  { id: 'mx-sortd', label: 'SortD(', action: () => {} },
  { id: 'mx-dim', label: 'dim(', action: () => {} },
  { id: 'mx-fill', label: 'Fill(', action: () => {} },
  { id: 'mx-identity', label: 'identity(', action: () => {} },
  { id: 'mx-randm', label: 'randM(', action: () => {} },
  { id: 'mx-augment', label: 'augment(', action: () => {} },
  { id: 'mx-matrlist', label: 'Matr►list(', action: () => {} },
  { id: 'mx-listmatr', label: 'List►matr(', action: () => {} },
  { id: 'mx-cumsum', label: 'cumSum(', action: () => {} },
];

// Menu MATRX (2ND + X⁻¹) — NAMES ([A]-[J] + Edit) à plat en racine (fidèle TI-83 :
// l'onglet NAMES est l'onglet par défaut), MATH et OPS en sous-menus drill-in.
export const matrixMenuItems: MenuItem[] = [
  ...matrixNamesMenuItems,   // Edit..., [A]..[J] directement accessibles (1 étape)
  { id: 'mx-math', label: 'MATH', action: () => {}, submenu: matrixMathMenuItems },
  { id: 'mx-ops', label: 'OPS', action: () => {}, submenu: matrixOpsMenuItems },
];

