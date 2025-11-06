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
  [
    { action: 'y-vars', secondAction: 'stat-plot', primary: 'Y=', second: 'STAT PLOT', color: 'blue' },
    { action: 'window', secondAction: 'tblset', primary: 'WINDOW', second: 'TBLSET', color: 'blue' },
    { action: 'zoom', secondAction: 'format', primary: 'ZOOM', second: 'FORMAT', color: 'blue' },
    { action: 'trace', secondAction: 'calc', primary: 'TRACE', second: 'CALC', color: 'blue' },
    { action: 'graph', secondAction: 'table', primary: 'GRAPH', second: 'TABLE', color: 'blue' },
  ],
  [
    { action: '2nd', primary: '2ND', color: 'blue' },
    { action: 'mode', secondAction: 'quit', primary: 'MODE', second: 'QUIT', color: 'gray' },
    { action: 'del', secondAction: 'ins', primary: 'DEL', second: 'INS', color: 'gray' },
    { action: 'alpha', primary: 'ALPHA', color: 'blue' },
    { action: 'stat', primary: 'STAT', color: 'blue' },
  ],
  [
    { action: 'math', secondAction: 'test', primary: 'MATH', second: 'TEST', color: 'gray' },
    { action: 'apps', secondAction: 'angle', primary: 'APPS', second: 'ANGLE', color: 'gray' },
    { action: 'prgm', secondAction: 'draw', primary: 'PRGM', second: 'DRAW', color: 'gray' },
    { action: 'vars', secondAction: 'distr', primary: 'VARS', second: 'DISTR', color: 'gray' },
    { action: 'clear', primary: 'CLEAR', color: 'gray' },
  ],
  [
    { action: 'x', secondAction: 'link', primary: 'X,T,θ,n', second: 'LINK', alpha: 'X' },
    { action: 'sin', secondAction: 'asin', primary: 'SIN', second: 'SIN⁻¹', alpha: 'S' },
    { action: 'cos', secondAction: 'acos', primary: 'COS', second: 'COS⁻¹', alpha: 'T' },
    { action: 'tan', secondAction: 'atan', primary: 'TAN', second: 'TAN⁻¹', alpha: 'U' },
    { action: 'pow', secondAction: 'pi', primary: '^', second: 'π', alpha: 'V' },
  ],
  [
    { action: 'sqrt', secondAction: 'square', primary: '√', second: 'x²', alpha: 'W' },
    { action: '7', primary: '7', second: 'u', alpha: 'A' },
    { action: '8', primary: '8', second: 'v', alpha: 'B' },
    { action: '9', primary: '9', second: 'w', alpha: 'C' },
    { action: 'divide', secondAction: 'exp', primary: '÷', second: 'e', alpha: 'D' },
  ],
  [
    { action: 'ln', secondAction: 'exp-func', primary: 'LN', second: 'eˣ', alpha: 'X' },
    { action: '4', primary: '4', alpha: 'E' },
    { action: '5', primary: '5', alpha: 'F' },
    { action: '6', primary: '6', alpha: 'G' },
    { action: 'multiply', secondAction: 'left-brace', primary: '×', second: '[', alpha: 'H' },
  ],
  [
    { action: 'log', secondAction: 'power10', primary: 'LOG', second: '10ˣ', alpha: 'Y' },
    { action: '1', primary: '1', alpha: 'I' },
    { action: '2', primary: '2', alpha: 'J' },
    { action: '3', primary: '3', alpha: 'K' },
    { action: 'subtract', secondAction: 'right-brace', primary: '−', second: ']', alpha: 'L' },
  ],
  [
    { action: 'negative', secondAction: 'ans', primary: '(−)', second: 'ANS', alpha: 'Z' },
    { action: '0', primary: '0', alpha: ' ' },
    { action: 'left-paren', secondAction: 'left-brace', primary: '(', second: '{', alpha: 'M' },
    { action: 'right-paren', secondAction: 'right-brace', primary: ')', second: '}', alpha: 'N' },
    { action: 'add', secondAction: 'mem', primary: '+', second: 'MEM', alpha: 'O' },
  ],
  [
    { action: 'left', primary: '←' },
    { action: 'down', primary: '↓' },
    { action: 'up', primary: '↑' },
    { action: 'right', primary: '→' },
    { action: 'enter', primary: 'ENTER', size: 'wide', color: 'gray' },
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
