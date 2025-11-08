/**
 * Composant principal de la calculatrice TI-83 Plus
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { create, all } from 'mathjs';
import { useCalculatorStore } from '../../store/calculatorStore';
import { Display } from './Display';
import { Keyboard } from './Keyboard';
import { GraphCanvas } from '../Graph/GraphCanvas';
import { TraceCanvas } from '../Graph/TraceCanvas';
import { Menu } from '../Menus/Menu';
import { WindowEditor, type WindowEditorHandle } from '../Editors/WindowEditor';
import { ModeEditor, type ModeEditorHandle } from '../Editors/ModeEditor';
import { MemEditor, type MemEditorHandle } from '../Editors/MemEditor';
import { MatrixEditor, type MatrixEditorHandle } from '../Editors/MatrixEditor';
import { MatrixGridEditor, type MatrixGridEditorHandle } from '../Editors/MatrixGridEditor';
import { TableSetEditor, type TableSetEditorHandle } from '../Editors/TableSetEditor';
import { TableViewer, type TableViewerHandle } from '../Editors/TableViewer';
import { StatPlotEditor, type StatPlotEditorHandle } from '../Editors/StatPlotEditor';
import { HelpModal } from '../Help/HelpModal';
import { graphingEngine } from '../../services/GraphingEngine';
import { statisticsService } from '../../services/StatisticsService';
import { mathFunctionsService } from '../../services/MathFunctionsService';
import { statMenuItems, mathMenuItems, zoomMenuItems, calcMenuItems, varsMenuItems } from '../../data/menus';
import { createZoomHandlers, createMathHandlers, createStatHandlers, createCalcHandlers } from '../../utils/menuHandlers';
import { ListEditor, type ListEditorHandle } from '../Editors/ListEditor';
import type { KeyAction, GraphFunction } from '../../types';

// Créer une instance de mathjs avec toutes les fonctions
const math = create(all);

export const Calculator: React.FC = () => {
  // State pour le modal d'aide
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // State pour la matrice en cours d'édition
  const [editingMatrixName, setEditingMatrixName] = useState<string | null>(null);

  // Refs pour contrôler les éditeurs depuis le clavier virtuel
  const windowEditorRef = useRef<WindowEditorHandle>(null);
  const modeEditorRef = useRef<ModeEditorHandle>(null);
  const memEditorRef = useRef<MemEditorHandle>(null);
  const matrixEditorRef = useRef<MatrixEditorHandle>(null);
  const matrixGridEditorRef = useRef<MatrixGridEditorHandle>(null);
  const listEditorRef = useRef<ListEditorHandle>(null);
  const tableSetEditorRef = useRef<TableSetEditorHandle>(null);
  const tableViewerRef = useRef<TableViewerHandle>(null);
  const statPlotEditorRef = useRef<StatPlotEditorHandle>(null);
  const {
    currentInput,
    history,
    currentMode,
    isSecondFunction,
    isAlphaMode,
    isGraphMode,
    isTraceMode,
    traceX,
    traceFunctionIndex,
    graphFunctions,
    activeFunctions,
    windowSettings,
    tableSettings,
    statPlots,
    config,
    lastAnswer,
    isInputResult,
    matrices,
    variables,
    cursorPosition,
    // cursorPosition et setCursorPosition sont gérés automatiquement par le store
    setInput,
    setInputResult,
    appendInput,
    deleteLastChar,
    clearInput,
    addToHistory,
    setLastAnswer,
    setMode,
    setConfig,
    toggleSecondFunction,
    toggleAlphaMode,
    setGraphMode,
    setTraceMode,
    setTraceX,
    setTraceFunctionIndex,
    setFunctionExpression,
    currentFunction,
    setCurrentFunction,
    setWindowSettings,
    setTableSettings,
    setStatPlot,
    currentMenu,
    menuSelectedIndex,
    menuStack,
    setCurrentMenu,
    navigateMenu,
    enterSubmenu,
    exitSubmenu,
    setVariable,
    getVariable,
  } = useCalculatorStore();

  // Supprimer warnings pour services importés
  console.log({ graphingEngine, statisticsService, mathFunctionsService });

  // Obtenir les items du menu actuel AVANT handleKeyPress
  const currentMenuItems = useMemo(() => {
    // Si on est dans un sous-menu, utiliser le dernier item du stack
    if (menuStack.length > 0) {
      return menuStack[menuStack.length - 1];
    }
    // Sinon, utiliser le menu racine
    if (currentMenu === 'STAT') return statMenuItems;
    if (currentMenu === 'MATH') return mathMenuItems;
    if (currentMenu === 'ZOOM') return zoomMenuItems;
    if (currentMenu === 'CALC') return calcMenuItems;
    if (currentMenu === 'VARS') return varsMenuItems;
    return [];
  }, [currentMenu, menuStack]);

  // Créer les handlers pour les menus
  const zoomHandlers = useMemo(() =>
    createZoomHandlers(setWindowSettings, setCurrentMenu),
    [setWindowSettings, setCurrentMenu]
  );

  const mathHandlers = useMemo(() =>
    createMathHandlers(appendInput, setCurrentMenu),
    [appendInput, setCurrentMenu]
  );

  const statHandlers = useMemo(() =>
    createStatHandlers(addToHistory, setCurrentMenu, setMode as (mode: string) => void),
    [addToHistory, setCurrentMenu, setMode]
  );

  const calcHandlers = useMemo(() =>
    createCalcHandlers(
      graphFunctions,
      activeFunctions,
      windowSettings,
      config.angleMode,
      addToHistory,
      setCurrentMenu
    ),
    [graphFunctions, activeFunctions, windowSettings, config.angleMode, addToHistory, setCurrentMenu]
  );

  /**
   * Gère les actions des touches
   */
  const handleKeyPress = useCallback(
    (action: KeyAction) => {

      // Si un menu est ouvert, gérer la navigation
      if (currentMenu) {
        if (action === 'up') {
          navigateMenu('up', currentMenuItems.length);
          return;
        }
        if (action === 'down') {
          navigateMenu('down', currentMenuItems.length);
          return;
        }
        if (action === 'clear') {
          // Si on est dans un sous-menu, revenir au menu parent
          // Sinon, fermer complètement le menu
          exitSubmenu();
          return;
        }
        if (action === 'enter') {
          // Exécuter l'action du menu sélectionné
          const currentItem = currentMenuItems[menuSelectedIndex];
          if (currentItem) {
            // Si l'item a un sous-menu, entrer dedans
            if (currentItem.submenu && currentItem.submenu.length > 0) {
              enterSubmenu(currentItem.submenu);
              return;
            }

            // Sinon, déterminer le handler approprié selon le menu
            let handler;
            if (currentMenu === 'ZOOM') {
              handler = (zoomHandlers as any)[currentItem.id];
              // ZoomIn et ZoomOut ont besoin des windowSettings
              if (currentItem.id === 'zoomin' || currentItem.id === 'zoomout') {
                handler = () => (zoomHandlers as any)[currentItem.id](windowSettings);
              }
            } else if (currentMenu === 'MATH') {
              handler = (mathHandlers as any)[currentItem.id];
            } else if (currentMenu === 'STAT') {
              handler = (statHandlers as any)[currentItem.id];
            } else if (currentMenu === 'CALC') {
              handler = (calcHandlers as any)[currentItem.id];
            } else if (currentMenu === 'RCL') {
              // Menu RCL : insérer la variable sélectionnée dans l'input
              const varName = currentItem.label;
              handler = () => {
                appendInput(varName);
                setCurrentMenu(null);
              };
            } else if (currentMenu === 'VARS') {
              // Menu VARS : insérer la variable système sélectionnée
              const varName = currentItem.label;
              handler = () => {
                appendInput(varName);
                setCurrentMenu(null);
              };
            }

            // Exécuter le handler s'il existe
            if (handler) {
              handler();
            } else {
              // Fallback pour actions non implémentées
              console.log(`Pas de handler pour ${currentMenu} item: ${currentItem.id}`);
              setCurrentMenu(null);
            }
          }
          return;
        }
        return;
      }

      // Gérer les touches fléchées en mode TRACE
      if (isTraceMode && isGraphMode) {
        if (action === 'left') {
          // Déplacer le curseur vers la gauche
          const step = (windowSettings.xMax - windowSettings.xMin) / 100; // 1% de la plage
          setTraceX(Math.max(windowSettings.xMin, traceX - step));
          return;
        }
        if (action === 'right') {
          // Déplacer le curseur vers la droite
          const step = (windowSettings.xMax - windowSettings.xMin) / 100;
          setTraceX(Math.min(windowSettings.xMax, traceX + step));
          return;
        }
        if (action === 'up') {
          // Passer à la fonction suivante
          const activeIndices = activeFunctions
            .map((active, index) => (active ? index : -1))
            .filter(index => index !== -1);
          if (activeIndices.length > 1) {
            const currentPos = activeIndices.indexOf(traceFunctionIndex);
            const nextPos = (currentPos + 1) % activeIndices.length;
            setTraceFunctionIndex(activeIndices[nextPos]);
          }
          return;
        }
        if (action === 'down') {
          // Passer à la fonction précédente
          const activeIndices = activeFunctions
            .map((active, index) => (active ? index : -1))
            .filter(index => index !== -1);
          if (activeIndices.length > 1) {
            const currentPos = activeIndices.indexOf(traceFunctionIndex);
            const nextPos = (currentPos - 1 + activeIndices.length) % activeIndices.length;
            setTraceFunctionIndex(activeIndices[nextPos]);
          }
          return;
        }
      }

      // Gérer 2ND et ALPHA
      if (action === '2nd') {
        toggleSecondFunction();
        return;
      }

      if (action === 'alpha') {
        toggleAlphaMode();
        return;
      }

      // Gérer les lettres en mode ALPHA
      if (action.startsWith('alpha-')) {
        const letter = action.substring(6); // Extraire la lettre après "alpha-"
        appendInput(letter);
        // Note: Le mode alpha est désactivé automatiquement par handleKeyPressWithAutoDeactivate
        return;
      }

      // Gérer ANS pour insérer le dernier résultat
      if (action === 'ans') {
        appendInput(lastAnswer);
        return;
      }

      // Gérer CLEAR (sauf en mode WINDOW, MODE, ou STAT_EDIT qui ont leur propre gestion)
      if (action === 'clear' && currentMode !== 'WINDOW' && currentMode !== 'MODE' && currentMode !== 'STAT_EDIT') {
        clearInput();
        setMode('NORMAL');
        setCurrentMenu(null);
        setGraphMode(false);  // Sortir du mode graphique
        setTraceMode(false);   // Désactiver le mode trace
        return;
      }

      // Gérer DEL (sauf en mode STAT_EDIT qui a sa propre gestion)
      if (action === 'del' && currentMode !== 'STAT_EDIT') {
        deleteLastChar();
        return;
      }

      // Gérer GRAPH
      if (action === 'graph') {
        setGraphMode(true);
        setTraceMode(false);
        setMode('NORMAL');
        return;
      }

      // Gérer TRACE
      if (action === 'trace') {
        // Activer le mode TRACE si on est en mode graphique ou passer en mode graphique avec TRACE
        if (isGraphMode) {
          // Basculer le mode TRACE
          setTraceMode(!isTraceMode);
          // Initialiser le curseur au milieu de la fenêtre
          if (!isTraceMode) {
            const midX = (windowSettings.xMin + windowSettings.xMax) / 2;
            setTraceX(midX);
            // Trouver la première fonction active
            const firstActiveIndex = activeFunctions.findIndex(active => active);
            if (firstActiveIndex !== -1) {
              setTraceFunctionIndex(firstActiveIndex);
            }
          }
        } else {
          // Si pas en mode graphique, activer graphique + trace
          setGraphMode(true);
          setTraceMode(true);
          const midX = (windowSettings.xMin + windowSettings.xMax) / 2;
          setTraceX(midX);
          const firstActiveIndex = activeFunctions.findIndex(active => active);
          if (firstActiveIndex !== -1) {
            setTraceFunctionIndex(firstActiveIndex);
          }
        }
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

      // Gérer TABLE
      if (action === 'table') {
        setMode('TABLE_VIEW');
        setGraphMode(false);
        return;
      }

      // Gérer TBLSET
      if (action === 'tblset') {
        setMode('TBLSET');
        setGraphMode(false);
        return;
      }

      // Gérer STAT PLOT
      if (action === 'stat-plot') {
        setMode('STAT_PLOT');
        setGraphMode(false);
        return;
      }

      // Gérer ZOOM
      if (action === 'zoom') {
        setCurrentMenu('ZOOM');
        setGraphMode(false);
        return;
      }

      // Gérer STAT
      if (action === 'stat') {
        setCurrentMenu('STAT');
        setGraphMode(false);
        return;
      }

      // Gérer MATH
      if (action === 'math') {
        setCurrentMenu('MATH');
        setGraphMode(false);
        return;
      }

      // Gérer VARS
      if (action === 'vars') {
        setCurrentMenu('VARS');
        setGraphMode(false);
        return;
      }

      // Gérer CALC (2ND + TRACE sur TI-83)
      if (action === 'calc') {
        setCurrentMenu('CALC');
        setGraphMode(false);
        return;
      }

      // Gérer MODE
      if (action === 'mode') {
        setMode('MODE');
        setGraphMode(false);
        return;
      }

      // Gérer MEM (2ND + +)
      if (action === 'mem') {
        setMode('MEM');
        setGraphMode(false);
        return;
      }

      // Gérer MATRIX (2ND + X⁻¹)
      if (action === 'matrix') {
        setMode('MATRIX');
        setGraphMode(false);
        // Désactiver le mode ALPHA si actif
        if (isAlphaMode) toggleAlphaMode();
        return;
      }

      // Gérer QUIT (2ND + MODE)
      if (action === 'quit') {
        // Fermer l'éditeur actuel et revenir en mode normal
        setMode('NORMAL');
        setGraphMode(false);
        setCurrentMenu(null);
        return;
      }

      // En mode WINDOW - gérer la navigation via ref
      if (currentMode === 'WINDOW' && windowEditorRef.current) {
        if (action === 'up') {
          windowEditorRef.current.navigate('up');
          return;
        }
        if (action === 'down') {
          windowEditorRef.current.navigate('down');
          return;
        }
        if (action === 'enter') {
          windowEditorRef.current.handleEnter();
          return;
        }
        if (action === 'clear') {
          // Sauvegarder les changements avant de fermer
          windowEditorRef.current.save();
          setMode('NORMAL');
          return;
        }
        // Si c'est un chiffre, l'envoyer au WindowEditor
        if (action === '0' || action === '1' || action === '2' || action === '3' || action === '4' ||
            action === '5' || action === '6' || action === '7' || action === '8' || action === '9' ||
            action === 'negative' || action === 'dot' || action === 'comma') {
          windowEditorRef.current.handleInput(
            action === 'negative' ? '-' :
            action === 'dot' ? '.' :
            action === 'comma' ? ',' :
            action
          );
          return;
        }
      }

      // En mode TBLSET - gérer la navigation via ref
      if (currentMode === 'TBLSET' && tableSetEditorRef.current) {
        if (action === 'up') {
          tableSetEditorRef.current.navigate('up');
          return;
        }
        if (action === 'down') {
          tableSetEditorRef.current.navigate('down');
          return;
        }
        if (action === 'enter') {
          tableSetEditorRef.current.handleEnter();
          return;
        }
        if (action === 'clear') {
          tableSetEditorRef.current.save();
          setMode('NORMAL');
          return;
        }
        if (action === '0' || action === '1' || action === '2' || action === '3' || action === '4' ||
            action === '5' || action === '6' || action === '7' || action === '8' || action === '9' ||
            action === 'negative' || action === 'dot') {
          tableSetEditorRef.current.handleInput(
            action === 'negative' ? '-' : action === 'dot' ? '.' : action
          );
          return;
        }
        if (action === 'del') {
          tableSetEditorRef.current.handleDelete();
          return;
        }
      }

      // En mode TABLE_VIEW - gérer la navigation via ref
      if (currentMode === 'TABLE_VIEW' && tableViewerRef.current) {
        if (action === 'up') {
          tableViewerRef.current.navigate('up');
          return;
        }
        if (action === 'down') {
          tableViewerRef.current.navigate('down');
          return;
        }
        if (action === 'left') {
          tableViewerRef.current.navigate('left');
          return;
        }
        if (action === 'right') {
          tableViewerRef.current.navigate('right');
          return;
        }
        if (action === 'clear') {
          setMode('NORMAL');
          return;
        }
      }

      // En mode STAT_PLOT - gérer la navigation via ref
      if (currentMode === 'STAT_PLOT' && statPlotEditorRef.current) {
        if (action === 'up') {
          statPlotEditorRef.current.navigate('up');
          return;
        }
        if (action === 'down') {
          statPlotEditorRef.current.navigate('down');
          return;
        }
        if (action === 'left') {
          statPlotEditorRef.current.navigate('left');
          return;
        }
        if (action === 'right') {
          statPlotEditorRef.current.navigate('right');
          return;
        }
        if (action === 'enter') {
          statPlotEditorRef.current.handleEnter();
          return;
        }
        if (action === 'clear') {
          statPlotEditorRef.current.save();
          setMode('NORMAL');
          return;
        }
      }

      // En mode MODE - gérer la navigation via ref
      if (currentMode === 'MODE' && modeEditorRef.current) {
        if (action === 'up') {
          modeEditorRef.current.navigate('up');
          return;
        }
        if (action === 'down') {
          modeEditorRef.current.navigate('down');
          return;
        }
        if (action === 'enter' || action === 'left' || action === 'right') {
          modeEditorRef.current.toggle();
          return;
        }
        if (action === 'clear') {
          // Sauvegarder les changements avant de fermer
          modeEditorRef.current.save();
          setMode('NORMAL');
          return;
        }
      }

      // En mode MEM - gérer la navigation via ref
      if (currentMode === 'MEM' && memEditorRef.current) {
        if (action === 'up') {
          memEditorRef.current.navigate('up');
          return;
        }
        if (action === 'down') {
          memEditorRef.current.navigate('down');
          return;
        }
        if (action === 'enter') {
          memEditorRef.current.select();
          return;
        }
        if (action === 'clear') {
          setMode('NORMAL');
          return;
        }
      }

      // En mode MATRIX - gérer la navigation via ref
      if (currentMode === 'MATRIX' && matrixEditorRef.current) {
        if (action === 'up') {
          matrixEditorRef.current.navigate('up');
          return;
        }
        if (action === 'down') {
          matrixEditorRef.current.navigate('down');
          return;
        }
        if (action === 'left') {
          matrixEditorRef.current.navigate('left');
          return;
        }
        if (action === 'right') {
          matrixEditorRef.current.navigate('right');
          return;
        }
        if (action === 'enter') {
          matrixEditorRef.current.select();
          return;
        }
        if (action === 'clear') {
          setMode('NORMAL');
          return;
        }
      }

      // En mode MATRIX_EDIT - gérer la navigation et l'édition via ref
      if (currentMode === 'MATRIX_EDIT' && matrixGridEditorRef.current) {
        if (action === 'up') {
          matrixGridEditorRef.current.navigate('up');
          return;
        }
        if (action === 'down') {
          matrixGridEditorRef.current.navigate('down');
          return;
        }
        if (action === 'left') {
          matrixGridEditorRef.current.navigate('left');
          return;
        }
        if (action === 'right') {
          matrixGridEditorRef.current.navigate('right');
          return;
        }
        if (action === 'enter') {
          matrixGridEditorRef.current.handleEnter();
          return;
        }
        if (action === 'del') {
          matrixGridEditorRef.current.handleDelete();
          return;
        }
        if (action === 'clear') {
          setEditingMatrixName(null);
          setMode('NORMAL');
          return;
        }
        // Gérer les chiffres et symboles pour l'édition
        if (action === '0' || action === '1' || action === '2' || action === '3' || action === '4' ||
            action === '5' || action === '6' || action === '7' || action === '8' || action === '9' ||
            action === 'dot' || action === 'negative') {
          matrixGridEditorRef.current.handleInput(
            action === 'negative' ? '-' : action === 'dot' ? '.' : action
          );
          return;
        }
      }

      // En mode STAT_EDIT - gérer la navigation via ref
      if (currentMode === 'STAT_EDIT' && listEditorRef.current) {
        if (action === 'up') {
          listEditorRef.current.navigate('up');
          return;
        }
        if (action === 'down') {
          listEditorRef.current.navigate('down');
          return;
        }
        if (action === 'left') {
          listEditorRef.current.navigate('left');
          return;
        }
        if (action === 'right') {
          listEditorRef.current.navigate('right');
          return;
        }
        if (action === 'enter') {
          listEditorRef.current.handleEnter();
          return;
        }
        if (action === 'del') {
          listEditorRef.current.handleDelete();
          return;
        }
        if (action === 'clear') {
          // CLEAR ferme l'éditeur
          setMode('NORMAL');
          return;
        }
        // Si c'est un chiffre ou signe négatif, l'envoyer au ListEditor
        if (action === '0' || action === '1' || action === '2' || action === '3' || action === '4' ||
            action === '5' || action === '6' || action === '7' || action === '8' || action === '9' ||
            action === 'negative' || action === 'dot' || action === 'comma') {
          listEditorRef.current.handleInput(
            action === 'negative' ? '-' :
            action === 'dot' ? '.' :
            action === 'comma' ? ',' :
            action
          );
          return;
        }
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

        // Fonctions qui enveloppent leur argument: si on est sur un résultat, appliquer la fonction au résultat
        const wrappingFunctions: Record<string, string> = {
          'sin': 'sin',
          'cos': 'cos',
          'tan': 'tan',
          'asin': 'asin',
          'acos': 'acos',
          'atan': 'atan',
          'sqrt': '√',
          'ln': 'ln',
          'log': 'log',
        };

        // Opérations suffixées qui s'appliquent au résultat précédent
        const suffixOperators: Record<string, string> = {
          'square': '^2',
          'inverse': '⁻¹',  // On utilisera X⁻¹ pour éviter la confusion avec 1/
        };

        if (wrappingFunctions[action] && isInputResult && currentMode === 'NORMAL') {
          // Si l'input actuel est un résultat, appliquer la fonction au résultat
          const funcName = wrappingFunctions[action];
          setInput(`${funcName}(${currentInput})`);
          return;
        }

        if (suffixOperators[action] && isInputResult && currentMode === 'NORMAL') {
          // Si l'input actuel est un résultat, appliquer l'opérateur au résultat
          const operator = suffixOperators[action];
          if (action === 'inverse') {
            setInput(`1/${currentInput}`);
          } else {
            setInput(`${currentInput}${operator}`);
          }
          return;
        }

        // Opérateurs arithmétiques qui continuent le calcul avec le résultat
        const arithmeticOperators: Record<string, string> = {
          'add': '+',
          'subtract': '−',
          'multiply': '×',
          'divide': '÷',
          'pow': '^',
        };

        if (arithmeticOperators[action] && isInputResult && currentMode === 'NORMAL') {
          // Si l'input actuel est un résultat, continuer avec ce résultat
          setInput(`${currentInput}${arithmeticOperators[action]}`);
          return;
        }

        const operatorMap: Record<string, string> = {
          // Opérateurs arithmétiques
          'add': '+',
          'subtract': '−',
          'multiply': '×',
          'divide': '÷',
          // Parenthèses et crochets
          'left-paren': '(',
          'right-paren': ')',
          'left-brace': '{',
          'right-brace': '}',
          'left-bracket': '[',
          'right-bracket': ']',
          'left-brace-small': '{',
          'right-brace-small': '}',
          // Symboles
          'pow': '^',
          'dot': '.',
          'comma': ',',
          // Variables
          'x': 'X',
          // Fonctions trigonométriques
          'sin': 'sin(',
          'cos': 'cos(',
          'tan': 'tan(',
          'asin': 'asin(',
          'acos': 'acos(',
          'atan': 'atan(',
          // Fonctions mathématiques
          'sqrt': '√(',
          'square': '^2',
          'inverse': '1/',
          'ln': 'ln(',
          'log': 'log(',
          // Constantes et exponentielles
          'pi': 'π',
          'exp': 'e',
          'exp-func': 'e^',
          'power10': '10^',
          'ee': 'E',  // Notation scientifique
          // Lettres u, v, w (pour paramétrage)
          'u': 'u',
          'v': 'v',
          'w': 'w',
          // Nombres complexes
          'i': 'i',  // Unité imaginaire
        };

        if (operatorMap[action]) {
          appendInput(operatorMap[action]);
          return;
        }

        // Gérer les actions spéciales
        if (action === 'sto') {
          appendInput('→');  // Flèche de stockage
          return;
        }

        if (action === 'rcl') {
          // RCL : ouvrir un menu pour sélectionner une variable
          const varLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
          const rclMenuItems = varLetters.map(letter => ({
            id: `var-${letter}`,
            label: letter,
            value: getVariable(letter),
          }));

          setCurrentMenu('RCL');
          enterSubmenu(rclMenuItems);
          return;
        }

        if (action === 'on' || action === 'off') {
          // ON/OFF - ignorer ou reset
          console.log('ON/OFF action');
          return;
        }

        if (action === 'catalog' || action === 'entry' || action === 'list') {
          // Actions non implémentées pour l'instant
          console.log(`Action ${action} non implémentée`);
          return;
        }

        // Gérer ENTER pour évaluer
        if (action === 'enter' && currentMode === 'NORMAL') {
          try {
            // Détecter si c'est un stockage de variable (→)
            const storeMatch = currentInput.match(/^(.+)→([A-Z])$/);

            let expr = currentInput;
            let varName: string | null = null;

            if (storeMatch) {
              // C'est un stockage de variable : expression→VarName
              expr = storeMatch[1].trim();
              varName = storeMatch[2];
            }

            // Préparer l'expression
            expr = expr
              .replace(/×/g, '*')
              .replace(/÷/g, '/')
              .replace(/π/g, 'pi')
              .replace(/\^/g, '^')  // mathjs utilise ^ pour la puissance
              .replace(/√\(/g, 'sqrt(')
              .replace(/³√\(/g, 'cbrt(')
              .replace(/log\(/g, 'log10(')  // D'abord remplacer log() → log10() (base 10)
              .replace(/ln\(/g, 'log(')  // Puis remplacer ln() → log() (logarithme naturel)
              .replace(/[Xx]/g, '0'); // Pour l'instant, X = 0 en mode normal

            // Remplacer les références aux matrices [A], [B], etc. par les matrices réelles
            const matrixNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
            const scope: any = {
              // Constantes
              e: Math.E,
            };

            // Ajouter les variables utilisateur au scope
            Object.entries(variables).forEach(([name, value]) => {
              if (typeof value === 'number') {
                scope[name] = value;
              }
            });

            // Ajouter les variables VARS (Window settings) au scope
            scope.Xmin = windowSettings.xMin;
            scope.Xmax = windowSettings.xMax;
            scope.Xscl = windowSettings.xScale;
            scope.Ymin = windowSettings.yMin;
            scope.Ymax = windowSettings.yMax;
            scope.Yscl = windowSettings.yScale;

            // Ajouter les matrices au scope
            matrixNames.forEach(name => {
              if (matrices[name] && matrices[name].rows > 0 && matrices[name].cols > 0) {
                // Vérifier si la matrice a des valeurs
                const hasValues = matrices[name].data.some(row => row.some(val => val !== 0));
                if (hasValues || matrices[name].data.length > 0) {
                  // Créer une matrice mathjs à partir des données
                  scope[name] = math.matrix(matrices[name].data);
                }
              }
            });

            // Remplacer [NomMatrice] par NomMatrice dans l'expression
            matrixNames.forEach(name => {
              const regex = new RegExp(`\\[${name}\\]`, 'g');
              expr = expr.replace(regex, name);
            });

            // Gérer la transposée: remplacer NomMatrice^T par transpose(NomMatrice)
            matrixNames.forEach(name => {
              const transposeRegex = new RegExp(`${name}\\^T`, 'g');
              expr = expr.replace(transposeRegex, `transpose(${name})`);
            });

            // Évaluer l'expression avec mathjs
            const result = math.evaluate(expr, scope);

            // Formater le résultat
            let resultStr: string;
            if (result && typeof result === 'object' && result.type === 'Matrix') {
              // Si le résultat est une matrice, l'afficher de façon compacte
              const matrixData = result.toArray();
              if (Array.isArray(matrixData) && Array.isArray(matrixData[0])) {
                // Matrice 2D
                resultStr = '[' + matrixData.map(row =>
                  '[' + row.map((val: number) => {
                    // Arrondir à 6 décimales pour éviter les erreurs de précision
                    const rounded = Math.round(val * 1000000) / 1000000;
                    return rounded;
                  }).join(' ') + ']'
                ).join(' ') + ']';
              } else {
                // Vecteur ou cas spécial
                resultStr = JSON.stringify(matrixData);
              }
            } else if (typeof result === 'number') {
              // Arrondir les nombres pour éviter les erreurs de précision
              const rounded = Math.round(result * 1000000000) / 1000000000;
              resultStr = rounded.toString();
            } else {
              resultStr = result.toString();
            }

            // Si c'est un stockage de variable, stocker la valeur
            if (varName && typeof result === 'number') {
              setVariable(varName, result);
              addToHistory(`${currentInput} = ${resultStr}`);
              setInputResult(resultStr); // Afficher le résultat
            } else {
              addToHistory(`${currentInput} = ${resultStr}`);
              setInputResult(resultStr); // Marquer comme résultat pour le remplacer lors du prochain input
            }

            setLastAnswer(resultStr); // Sauvegarder le résultat pour la touche ANS
          } catch (error) {
            console.error('Erreur d\'évaluation:', error);
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
      activeFunctions,
      currentMenu,
      currentMenuItems,
      menuSelectedIndex,
      windowSettings,
      isGraphMode,
      isTraceMode,
      traceX,
      traceFunctionIndex,
      lastAnswer,
      isInputResult,
      matrices,
      variables,
      appendInput,
      clearInput,
      deleteLastChar,
      setInput,
      setInputResult,
      setLastAnswer,
      addToHistory,
      setMode,
      toggleSecondFunction,
      toggleAlphaMode,
      setGraphMode,
      setTraceMode,
      setVariable,
      setTraceX,
      setTraceFunctionIndex,
      setFunctionExpression,
      setCurrentFunction,
      setCurrentMenu,
      setWindowSettings,
      navigateMenu,
      enterSubmenu,
      getVariable,
      zoomHandlers,
      mathHandlers,
      statHandlers,
      calcHandlers,
      isSecondFunction,
      isAlphaMode,
    ]
  );

  /**
   * Wrapper pour handleKeyPress qui désactive automatiquement les modes SECOND et ALPHA
   * après l'exécution de l'action (sauf si c'est la touche 2nd ou alpha elle-même)
   */
  const handleKeyPressWithAutoDeactivate = useCallback(
    (action: KeyAction) => {
      // Sauvegarder les états AVANT l'action
      const wasSecondActive = isSecondFunction;
      const wasAlphaActive = isAlphaMode;
      const shouldDeactivateModes = action !== '2nd' && action !== 'alpha';

      // Exécuter l'action
      handleKeyPress(action);

      // Désactiver les modes APRÈS l'action si nécessaire
      if (shouldDeactivateModes) {
        if (wasSecondActive) {
          toggleSecondFunction();
        }
        if (wasAlphaActive) {
          toggleAlphaMode();
        }
      }
    },
    [handleKeyPress, isSecondFunction, isAlphaMode, toggleSecondFunction, toggleAlphaMode]
  );

  /**
   * Gère les raccourcis clavier
   */
  useEffect(() => {
    // Ne pas écouter les événements clavier si un éditeur spécial est ouvert
    // Ces éditeurs gèrent leurs propres événements clavier
    // WINDOW et MODE sont gérés via ref donc on ne les inclut pas ici
    const editorModes = ['STAT_EDIT'];
    if (editorModes.includes(currentMode)) {
      return;
    }

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
        handleKeyPressWithAutoDeactivate(keyMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPressWithAutoDeactivate, currentMode]);

  // Préparer les fonctions pour le graphique
  const graphFunctionsData: GraphFunction[] = graphFunctions.map((expr, index) => ({
    index,
    expression: expr,
    active: activeFunctions[index],
  }));

  // Préparer les listes pour les stat plots
  const listsData = useMemo(() => {
    const lists: Record<string, number[]> = {};
    for (let i = 1; i <= 6; i++) {
      lists[`L${i}`] = statisticsService.getList(`L${i}`);
    }
    return lists;
  }, []);

  // Rendu de l'écran selon l'état
  const renderScreen = () => {
    // Si un menu est ouvert
    if (currentMenu) {
      return (
        <Menu
          title={currentMenu}
          items={currentMenuItems}
          selectedIndex={menuSelectedIndex}
          onNavigate={navigateMenu}
          onSelect={() => console.log('Select')}
          onClose={() => setCurrentMenu(null)}
        />
      );
    }

    // Si l'éditeur WINDOW est ouvert
    if (currentMode === 'WINDOW') {
      return (
        <WindowEditor
          ref={windowEditorRef}
          settings={windowSettings}
          onSave={(settings) => {
            setWindowSettings(settings);
            setMode('NORMAL');
          }}
          onClose={() => setMode('NORMAL')}
        />
      );
    }

    // Si l'éditeur TBLSET est ouvert
    if (currentMode === 'TBLSET') {
      return (
        <TableSetEditor
          ref={tableSetEditorRef}
          settings={tableSettings}
          onSave={(settings) => {
            setTableSettings(settings);
            setMode('NORMAL');
          }}
          onClose={() => setMode('NORMAL')}
        />
      );
    }

    // Si le visualiseur TABLE est ouvert
    if (currentMode === 'TABLE_VIEW') {
      return (
        <TableViewer
          ref={tableViewerRef}
          functions={graphFunctions}
          activeFunctions={activeFunctions}
          settings={tableSettings}
          onClose={() => setMode('NORMAL')}
        />
      );
    }

    // Si l'éditeur STAT PLOT est ouvert
    if (currentMode === 'STAT_PLOT') {
      return (
        <StatPlotEditor
          ref={statPlotEditorRef}
          plots={statPlots}
          onSave={(plotIndex, plot) => {
            setStatPlot(plotIndex, plot);
          }}
          onClose={() => setMode('NORMAL')}
        />
      );
    }

    // Si l'éditeur MODE est ouvert
    if (currentMode === 'MODE') {
      return (
        <ModeEditor
          ref={modeEditorRef}
          angleMode={config.angleMode}
          floatMode={config.floatMode}
          fixedDecimals={config.fixedDecimals}
          onSave={(modeConfig) => {
            setConfig(modeConfig);
            setMode('NORMAL');
          }}
          onClose={() => setMode('NORMAL')}
        />
      );
    }

    // Si l'éditeur MEM est ouvert
    if (currentMode === 'MEM') {
      return (
        <MemEditor
          ref={memEditorRef}
          onClose={() => setMode('NORMAL')}
        />
      );
    }

    // Si l'éditeur MATRIX est ouvert
    if (currentMode === 'MATRIX') {
      return (
        <MatrixEditor
          ref={matrixEditorRef}
          onClose={() => setMode('NORMAL')}
          onEditMatrix={(matrixName) => {
            // Ouvrir l'éditeur de grille pour cette matrice
            setEditingMatrixName(matrixName);
            setMode('MATRIX_EDIT');
            // Désactiver les modes ALPHA et SECOND
            if (isAlphaMode) toggleAlphaMode();
            if (isSecondFunction) toggleSecondFunction();
          }}
        />
      );
    }

    // Si l'éditeur de grille MATRIX est ouvert
    if (currentMode === 'MATRIX_EDIT' && editingMatrixName) {
      return (
        <MatrixGridEditor
          ref={matrixGridEditorRef}
          matrixName={editingMatrixName}
          onClose={() => {
            setEditingMatrixName(null);
            setMode('NORMAL');
          }}
        />
      );
    }

    // Si l'éditeur STAT LIST est ouvert
    if (currentMode === 'STAT_EDIT') {
      return (
        <ListEditor
          ref={listEditorRef}
          onClose={() => setMode('NORMAL')}
        />
      );
    }

    // Si mode graphique
    if (isGraphMode) {
      // Si mode TRACE activé, utiliser TraceCanvas
      if (isTraceMode) {
        return (
          <TraceCanvas
            functions={graphFunctionsData}
            window={windowSettings}
            angleMode={config.angleMode}
            traceX={traceX}
            traceFunctionIndex={traceFunctionIndex}
          />
        );
      }
      // Sinon, affichage graphique normal
      return (
        <GraphCanvas
          functions={graphFunctionsData}
          window={windowSettings}
          angleMode={config.angleMode}
          statPlots={statPlots}
          lists={listsData}
        />
      );
    }

    // Affichage normal
    return (
      <Display
        input={currentInput}
        history={history}
        mode={currentMode}
        secondActive={isSecondFunction}
        alphaActive={isAlphaMode}
        cursorPosition={cursorPosition}
      />
    );
  };

  return (
    <div className="ti83-calculator">
      <div className="ti83-body">
        {/* Bouton d'aide */}
        <button
          className="calculator-help-button"
          onClick={() => setIsHelpOpen(true)}
          title="Aide à l'utilisation"
        >
          ?
        </button>

        {/* Écran */}
        <div className="ti83-screen">
          {renderScreen()}
        </div>

        {/* Clavier */}
        <Keyboard
          onKeyPress={handleKeyPressWithAutoDeactivate}
          isSecondActive={isSecondFunction}
          isAlphaActive={isAlphaMode}
        />
      </div>

      {/* Modal d'aide */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
};
