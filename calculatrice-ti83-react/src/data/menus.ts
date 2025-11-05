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
  ]},
  { id: 'math-cpx', label: 'CPX', action: () => {}, submenu: [
    { id: 'conj', label: 'conj(', action: () => {} },
    { id: 'real', label: 'real(', action: () => {} },
    { id: 'imag', label: 'imag(', action: () => {} },
    { id: 'angle', label: 'angle(', action: () => {} },
    { id: 'abs', label: 'abs(', action: () => {} },
    { id: 'rect', label: 'Rect', action: () => {} },
    { id: 'polar', label: 'Polar', action: () => {} },
  ]},
  { id: 'math-prb', label: 'PRB', action: () => {}, submenu: [
    { id: 'rand', label: 'rand', action: () => {} },
    { id: 'npr', label: 'nPr', action: () => {} },
    { id: 'ncr', label: 'nCr', action: () => {} },
    { id: 'factorial', label: '!', action: () => {} },
    { id: 'randint', label: 'randInt(', action: () => {} },
    { id: 'randnorm', label: 'randNorm(', action: () => {} },
    { id: 'randsamp', label: 'randSamp(', action: () => {} },
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
