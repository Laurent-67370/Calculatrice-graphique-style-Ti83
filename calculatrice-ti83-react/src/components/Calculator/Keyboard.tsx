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
    { action: 'x', secondAction: 'link', primary: 'X,T,θ,n', second: 'LINK', color: 'gray' },
    { action: 'stat', primary: 'STAT', color: 'blue' },
    { action: 'down', primary: '↓', color: 'gray' },
    { action: 'right', primary: '→', color: 'gray' },
  ],
  // Ligne 4 : MATH, APPS, PRGM, VARS, CLEAR  (ALPHA : A, B, C ; VARS & CLEAR sans lettre verte)
  [
    { action: 'math', secondAction: 'test', primary: 'MATH', second: 'TEST', alpha: 'A', color: 'gray' },
    { action: 'apps', secondAction: 'angle', primary: 'APPS', second: 'ANGLE', alpha: 'B', color: 'gray' },
    { action: 'prgm', secondAction: 'draw', primary: 'PRGM', second: 'DRAW', alpha: 'C', color: 'gray' },
    { action: 'vars', secondAction: 'distr', primary: 'VARS', second: 'DISTR', color: 'gray' },
    { action: 'clear', primary: 'CLEAR', color: 'gray' },
  ],
  // Ligne 5 : X⁻¹, SIN, COS, TAN, ^  (ALPHA : D, E, F, G, H)
  [
    { action: 'inverse', secondAction: 'matrix', primary: 'X⁻¹', second: 'MATRIX', alpha: 'D' },
    { action: 'sin', secondAction: 'asin', primary: 'SIN', second: 'SIN⁻¹', alpha: 'E' },
    { action: 'cos', secondAction: 'acos', primary: 'COS', second: 'COS⁻¹', alpha: 'F' },
    { action: 'tan', secondAction: 'atan', primary: 'TAN', second: 'TAN⁻¹', alpha: 'G' },
    { action: 'pow', secondAction: 'pi', primary: '^', second: 'π', alpha: 'H' },
  ],
  // Ligne 6 : X², , (virgule), (, ), ÷  (ALPHA : I, J, K, L, M)
  [
    { action: 'square', secondAction: 'sqrt', primary: 'X²', second: '√', alpha: 'I' },
    { action: 'comma', secondAction: 'ee', primary: ',', second: 'EE', alpha: 'J' },
    { action: 'left-paren', secondAction: 'left-brace', primary: '(', second: '{', alpha: 'K' },
    { action: 'right-paren', secondAction: 'right-brace', primary: ')', second: '}', alpha: 'L' },
    { action: 'divide', secondAction: 'exp', primary: '÷', second: 'e', alpha: 'M' },
  ],
  // Ligne 7 : LOG, 7, 8, 9, ×  (ALPHA : N, O, P, Q, R)
  [
    { action: 'log', secondAction: 'power10', primary: 'LOG', second: '10ˣ', alpha: 'N' },
    { action: '7', secondAction: 'u', primary: '7', second: 'u', alpha: 'O' },
    { action: '8', secondAction: 'v', primary: '8', second: 'v', alpha: 'P' },
    { action: '9', secondAction: 'w', primary: '9', second: 'w', alpha: 'Q' },
    { action: 'multiply', secondAction: 'left-bracket', primary: '×', second: '[', alpha: 'R' },
  ],
  // Ligne 8 : LN, 4, 5, 6, −  (ALPHA : S, T, U, V, W)
  [
    { action: 'ln', secondAction: 'exp-func', primary: 'LN', second: 'eˣ', alpha: 'S' },
    { action: '4', secondAction: 'left-brace-small', primary: '4', second: '{', alpha: 'T' },
    { action: '5', primary: '5', alpha: 'U' },
    { action: '6', secondAction: 'right-brace-small', primary: '6', second: '}', alpha: 'V' },
    { action: 'subtract', secondAction: 'right-bracket', primary: '−', second: ']', alpha: 'W' },
  ],
  // Ligne 9 : STO→, 1, 2, 3, +  (ALPHA : X, Y, Z ; 3 sans lettre ; + = ")
  [
    { action: 'sto', secondAction: 'rcl', primary: 'STO→', second: 'RCL', alpha: 'X' },
    { action: '1', primary: '1', alpha: 'Y' },
    { action: '2', secondAction: 'list', primary: '2', second: 'LIST', alpha: 'Z' },
    { action: '3', primary: '3' },
    { action: 'add', secondAction: 'mem', primary: '+', second: 'MEM', alpha: '"' },
  ],
  // Ligne 10 : ON, 0, ., (−), ENTER  (ALPHA : 0=espace, .=: ; (−) sans lettre)
  [
    { action: 'on', secondAction: 'off', primary: 'ON', second: 'OFF', color: 'gray' },
    { action: '0', secondAction: 'catalog', primary: '0', second: 'CATALOG', alpha: ' ' },
    { action: 'dot', secondAction: 'i', primary: '.', second: 'i', alpha: ':' },
    { action: 'negative', secondAction: 'ans', primary: '(−)', second: 'ANS' },
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
    let actionToSend: string = key.action;

    if (isSecondActive && key.secondAction) {
      actionToSend = key.secondAction;
    } else if (isAlphaActive && key.alpha) {
      // En mode ALPHA, envoyer la lettre directement
      actionToSend = `alpha-${key.alpha}`;
    }

    onKeyPress(actionToSend as KeyAction);
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
