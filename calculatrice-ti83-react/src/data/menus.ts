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
