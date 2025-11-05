/**
 * Composant principal de la calculatrice TI-83 Plus
 */

import React, { useCallback, useEffect } from 'react';
import { useCalculatorStore } from '../../store/calculatorStore';
import { Display } from './Display';
import { Keyboard } from './Keyboard';
import { GraphCanvas } from '../Graph/GraphCanvas';
import type { KeyAction, GraphFunction } from '../../types';

export const Calculator: React.FC = () => {
  const {
    currentInput,
    history,
    currentMode,
    isSecondFunction,
    isAlphaMode,
    isGraphMode,
    graphFunctions,
    activeFunctions,
    windowSettings,
    config,
    setInput,
    appendInput,
    deleteLastChar,
    clearInput,
    addToHistory,
    setMode,
    toggleSecondFunction,
    toggleAlphaMode,
    setGraphMode,
    setFunctionExpression,
    currentFunction,
    setCurrentFunction,
  } = useCalculatorStore();

  /**
   * Gère les actions des touches
   */
  const handleKeyPress = useCallback(
    (action: KeyAction) => {
      // Gérer 2ND et ALPHA
      if (action === '2nd') {
        toggleSecondFunction();
        return;
      }

      if (action === 'alpha') {
        toggleAlphaMode();
        return;
      }

      // Gérer CLEAR
      if (action === 'clear') {
        clearInput();
        setMode('NORMAL');
        return;
      }

      // Gérer DEL
      if (action === 'del') {
        deleteLastChar();
        return;
      }

      // Gérer GRAPH
      if (action === 'graph') {
        setGraphMode(true);
        setMode('NORMAL');
        return;
      }

      // Gérer Y=
      if (action === 'y-vars') {
        setMode('Y_EDITOR');
        setGraphMode(false);
        setInput(`Y${currentFunction + 1}=${graphFunctions[currentFunction]}`);
        return;
      }

      // Gérer WINDOW
      if (action === 'window') {
        setMode('WINDOW');
        setGraphMode(false);
        return;
      }

      // Gérer ZOOM
      if (action === 'zoom') {
        setMode('ZOOM');
        setGraphMode(false);
        return;
      }

      // En mode Y_EDITOR
      if (currentMode === 'Y_EDITOR') {
        if (action === 'enter') {
          // Extraire la fonction de l'entrée (format: Y1=expression)
          const match = currentInput.match(/Y(\d+)=(.+)/);
          if (match) {
            const funcIndex = parseInt(match[1]) - 1;
            const expression = match[2];
            setFunctionExpression(funcIndex, expression);
            addToHistory(`Y${funcIndex + 1}=${expression}`);
            addToHistory('Appuyez GRAPH pour tracer');
          }
          setMode('NORMAL');
          clearInput();
          return;
        }

        if (action === 'up' || action === 'down') {
          const newIndex = action === 'up'
            ? (currentFunction + 5) % 6
            : (currentFunction + 1) % 6;
          setCurrentFunction(newIndex);
          setInput(`Y${newIndex + 1}=${graphFunctions[newIndex]}`);
          return;
        }
      }

      // Gestion des nombres et opérateurs en mode normal
      if (currentMode === 'NORMAL' || currentMode === 'Y_EDITOR') {
        const numberActions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
        if (numberActions.includes(action as typeof numberActions[number])) {
          appendInput(action);
          return;
        }

        const operatorMap: Record<string, string> = {
          'add': '+',
          'subtract': '−',
          'multiply': '×',
          'divide': '÷',
          'left-paren': '(',
          'right-paren': ')',
          'pow': '^',
          'x': 'X',
          'sin': 'sin(',
          'cos': 'cos(',
          'tan': 'tan(',
          'sqrt': '√(',
          'ln': 'ln(',
          'log': 'log(',
        };

        if (operatorMap[action]) {
          appendInput(operatorMap[action]);
          return;
        }

        // Gérer ENTER pour évaluer
        if (action === 'enter' && currentMode === 'NORMAL') {
          try {
            // Évaluation simple pour la démo
            const expr = currentInput
              .replace(/×/g, '*')
              .replace(/÷/g, '/')
              .replace(/π/g, Math.PI.toString())
              .replace(/\^/g, '**')
              .replace(/√\(/g, 'Math.sqrt(')
              .replace(/sin\(/g, 'Math.sin(')
              .replace(/cos\(/g, 'Math.cos(')
              .replace(/tan\(/g, 'Math.tan(')
              .replace(/ln\(/g, 'Math.log(')
              .replace(/log\(/g, 'Math.log10(')
              .replace(/X/g, '0'); // Pour l'instant, X = 0 en mode normal

            const result = Function('"use strict"; return (' + expr + ')')();
            addToHistory(`${currentInput} = ${result}`);
            setInput(result.toString());
          } catch (error) {
            addToHistory(`${currentInput} = ERREUR`);
            setInput('ERREUR');
          }
          return;
        }
      }
    },
    [
      currentInput,
      currentMode,
      currentFunction,
      graphFunctions,
      appendInput,
      clearInput,
      deleteLastChar,
      setInput,
      addToHistory,
      setMode,
      toggleSecondFunction,
      toggleAlphaMode,
      setGraphMode,
      setFunctionExpression,
      setCurrentFunction,
    ]
  );

  /**
   * Gère les raccourcis clavier
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: Record<string, KeyAction> = {
        'Enter': 'enter',
        'Escape': 'clear',
        'Backspace': 'del',
        'ArrowUp': 'up',
        'ArrowDown': 'down',
        'ArrowLeft': 'left',
        'ArrowRight': 'right',
        '0': '0',
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        '+': 'add',
        '-': 'subtract',
        '*': 'multiply',
        '/': 'divide',
        '(': 'left-paren',
        ')': 'right-paren',
      };

      if (keyMap[e.key]) {
        e.preventDefault();
        handleKeyPress(keyMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  // Préparer les fonctions pour le graphique
  const graphFunctionsData: GraphFunction[] = graphFunctions.map((expr, index) => ({
    index,
    expression: expr,
    active: activeFunctions[index],
  }));

  return (
    <div className="ti83-calculator">
      <div className="ti83-body">
        {/* Écran */}
        <div className="ti83-screen">
          {isGraphMode ? (
            <GraphCanvas
              functions={graphFunctionsData}
              window={windowSettings}
              angleMode={config.angleMode}
            />
          ) : (
            <Display
              input={currentInput}
              history={history}
              mode={currentMode}
              secondActive={isSecondFunction}
              alphaActive={isAlphaMode}
            />
          )}
        </div>

        {/* Clavier */}
        <Keyboard
          onKeyPress={handleKeyPress}
          isSecondActive={isSecondFunction}
          isAlphaActive={isAlphaMode}
        />
      </div>
    </div>
  );
};
