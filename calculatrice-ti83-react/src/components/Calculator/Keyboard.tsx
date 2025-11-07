/**
 * Composant clavier de la calculatrice TI-83
 */

import React from 'react';
import type { KeyAction } from '../../types';

interface KeyboardProps {
  onKeyPress: (action: KeyAction) => void;
  isSecondActive: boolean;
  isAlphaActive: boolean;
}

interface Key {
  action: KeyAction;
  secondAction?: KeyAction;
  alphaAction?: KeyAction;
  primary: string;
  second?: string;
  alpha?: string;
  color?: 'blue' | 'gray' | 'black';
  size?: 'normal' | 'wide';
}

const keyLayout: Key[][] = [
  // Ligne 1 : Touches graphiques bleues
  [
    { action: 'y-vars', secondAction: 'stat-plot', primary: 'Y=', second: 'STAT PLOT', color: 'blue' },
    { action: 'window', secondAction: 'tblset', primary: 'WINDOW', second: 'TBLSET', color: 'blue' },
    { action: 'zoom', secondAction: 'format', primary: 'ZOOM', second: 'FORMAT', color: 'blue' },
    { action: 'trace', secondAction: 'calc', primary: 'TRACE', second: 'CALC', color: 'blue' },
    { action: 'graph', secondAction: 'table', primary: 'GRAPH', second: 'TABLE', color: 'blue' },
  ],
  // Ligne 2 : 2ND, MODE, DEL, flèches gauche/haut
  [
    { action: '2nd', primary: '2ND', color: 'blue' },
    { action: 'mode', secondAction: 'quit', primary: 'MODE', second: 'QUIT', color: 'gray' },
    { action: 'del', secondAction: 'ins', primary: 'DEL', second: 'INS', color: 'gray' },
    { action: 'left', primary: '←', color: 'gray' },
    { action: 'up', primary: '↑', color: 'gray' },
  ],
  // Ligne 3 : ALPHA, X,T,Θ,n, STAT, flèches bas/droite
  [
    { action: 'alpha', primary: 'ALPHA', color: 'blue' },
    { action: 'x', secondAction: 'link', primary: 'X,T,θ,n', second: 'LINK', alpha: 'X', color: 'gray' },
    { action: 'stat', primary: 'STAT', color: 'blue' },
    { action: 'down', primary: '↓', color: 'gray' },
    { action: 'right', primary: '→', color: 'gray' },
  ],
  // Ligne 4 : MATH, APPS, PRGM, VARS, CLEAR
  [
    { action: 'math', secondAction: 'test', primary: 'MATH', second: 'TEST', color: 'gray' },
    { action: 'apps', secondAction: 'angle', primary: 'APPS', second: 'ANGLE', color: 'gray' },
    { action: 'prgm', secondAction: 'draw', primary: 'PRGM', second: 'DRAW', color: 'gray' },
    { action: 'vars', secondAction: 'distr', primary: 'VARS', second: 'DISTR', color: 'gray' },
    { action: 'clear', primary: 'CLEAR', color: 'gray' },
  ],
  // Ligne 5 : X⁻¹, SIN, COS, TAN, ^
  [
    { action: 'inverse', secondAction: 'matrix', primary: 'X⁻¹', second: 'MATRIX', alpha: 'P' },
    { action: 'sin', secondAction: 'asin', primary: 'SIN', second: 'SIN⁻¹', alpha: 'Q' },
    { action: 'cos', secondAction: 'acos', primary: 'COS', second: 'COS⁻¹', alpha: 'R' },
    { action: 'tan', secondAction: 'atan', primary: 'TAN', second: 'TAN⁻¹', alpha: 'S' },
    { action: 'pow', secondAction: 'pi', primary: '^', second: 'π', alpha: 'T' },
  ],
  // Ligne 6 : X², , (virgule), (, ), ÷
  [
    { action: 'square', secondAction: 'sqrt', primary: 'X²', second: '√', alpha: 'U' },
    { action: 'comma', secondAction: 'ee', primary: ',', second: 'EE', alpha: 'V' },
    { action: 'left-paren', secondAction: 'left-brace', primary: '(', second: '{', alpha: 'W' },
    { action: 'right-paren', secondAction: 'right-brace', primary: ')', second: '}', alpha: 'θ' },
    { action: 'divide', secondAction: 'exp', primary: '÷', second: 'e', alpha: 'X' },
  ],
  // Ligne 7 : LOG, 7, 8, 9, ×
  [
    { action: 'log', secondAction: 'power10', primary: 'LOG', second: '10ˣ', alpha: 'Y' },
    { action: '7', secondAction: 'u', primary: '7', second: 'u', alpha: 'A' },
    { action: '8', secondAction: 'v', primary: '8', second: 'v', alpha: 'B' },
    { action: '9', secondAction: 'w', primary: '9', second: 'w', alpha: 'C' },
    { action: 'multiply', secondAction: 'left-bracket', primary: '×', second: '[', alpha: 'Z' },
  ],
  // Ligne 8 : LN, 4, 5, 6, −
  [
    { action: 'ln', secondAction: 'exp-func', primary: 'LN', second: 'eˣ', alpha: 'n' },
    { action: '4', secondAction: 'left-brace-small', primary: '4', second: '{', alpha: 'D' },
    { action: '5', primary: '5', alpha: 'E' },
    { action: '6', secondAction: 'right-brace-small', primary: '6', second: '}', alpha: 'F' },
    { action: 'subtract', secondAction: 'right-bracket', primary: '−', second: ']', alpha: 'G' },
  ],
  // Ligne 9 : STO→, 1, 2, 3, +
  [
    { action: 'sto', secondAction: 'rcl', primary: 'STO→', second: 'RCL', alpha: 'H' },
    { action: '1', primary: '1', alpha: 'I' },
    { action: '2', secondAction: 'list', primary: '2', second: 'LIST', alpha: 'J' },
    { action: '3', primary: '3', alpha: 'K' },
    { action: 'add', secondAction: 'mem', primary: '+', second: 'MEM', alpha: 'L' },
  ],
  // Ligne 10 : ON, 0, ., (−), ENTER
  [
    { action: 'on', secondAction: 'off', primary: 'ON', second: 'OFF', color: 'gray' },
    { action: '0', secondAction: 'catalog', primary: '0', second: 'CATALOG', alpha: ' ' },
    { action: 'dot', secondAction: 'i', primary: '.', second: 'i', alpha: ':' },
    { action: 'negative', secondAction: 'ans', primary: '(−)', second: 'ANS', alpha: 'M' },
    { action: 'enter', secondAction: 'entry', primary: 'ENTER', second: 'ENTRY', size: 'wide', color: 'blue' },
  ],
];

export const Keyboard: React.FC<KeyboardProps> = ({
  onKeyPress,
  isSecondActive,
  isAlphaActive,
}) => {
  const getKeyDisplay = (key: Key): string => {
    if (isSecondActive && key.second) return key.second;
    if (isAlphaActive && key.alpha) return key.alpha;
    return key.primary;
  };

  const getKeyClass = (key: Key): string => {
    const classes = ['ti83-key'];

    if (key.color) {
      classes.push(`key-${key.color}`);
    }

    if (key.size === 'wide') {
      classes.push('key-wide');
    }

    if (key.action === '2nd' && isSecondActive) {
      classes.push('key-active');
    }

    if (key.action === 'alpha' && isAlphaActive) {
      classes.push('key-active');
    }

    return classes.join(' ');
  };

  const handleKeyClick = (key: Key) => {
    // Déterminer quelle action envoyer
    let actionToSend = key.action;

    if (isSecondActive && key.secondAction) {
      actionToSend = key.secondAction;
    } else if (isAlphaActive && key.alphaAction) {
      actionToSend = key.alphaAction;
    }

    onKeyPress(actionToSend);
  };

  return (
    <div className="ti83-keyboard">
      {keyLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key, keyIndex) => (
            <button
              key={keyIndex}
              className={getKeyClass(key)}
              onClick={() => handleKeyClick(key)}
              type="button"
            >
              <div className="key-primary">{getKeyDisplay(key)}</div>
              {!isSecondActive && !isAlphaActive && (
                <>
                  {key.second && (
                    <div className="key-second">{key.second}</div>
                  )}
                  {key.alpha && (
                    <div className="key-alpha">{key.alpha}</div>
                  )}
                </>
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};
