/**
 * Composant principal de la calculatrice TI-83 Plus
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { create, all } from 'mathjs';
import { useCalculatorStore } from '../../store/calculatorStore';
import { Display } from './Display';
import { HistoryModal } from './HistoryModal';
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
import { CatalogViewer, type CatalogViewerHandle } from '../Editors/CatalogViewer';
import { SolverEditor, type SolverEditorHandle } from '../Editors/SolverEditor';
import { FinanceEditor, type FinanceEditorHandle } from '../Editors/FinanceEditor';
import { TestsEditor, type TestsEditorHandle } from '../Editors/TestsEditor';
import { HelpModal } from '../Help/HelpModal';
import { graphingEngine } from '../../services/GraphingEngine';
import { statisticsService } from '../../services/StatisticsService';
import { mathFunctionsService } from '../../services/MathFunctionsService';
import { statMenuItems, mathMenuItems, zoomMenuItems, calcMenuItems, varsMenuItems, distrMenuItems, testMenuItems, logicMenuItems, listMenuItems, drawMenuItems, matrixMenuItems } from '../../data/menus';
import { createZoomHandlers, createMathHandlers, createStatHandlers, createCalcHandlers, createDistrHandlers, createTestHandlers, createLogicHandlers, createMatrixHandlers } from '../../utils/menuHandlers';
import { listHandlers } from '../../utils/listHandlers';
import { createDrawHandlers } from '../../utils/drawHandlers';
import { MatrixService } from '../../services/MatrixService';
import { stringService } from '../../services/StringService';
import { extractCalculusCalls } from '../../utils/calculus';
import { ListEditor, type ListEditorHandle } from '../Editors/ListEditor';
import { ProgramMenu } from '../Program/ProgramMenu';
import { ProgramEditor } from '../Program/ProgramEditor';
import { ProgramOutput } from '../Program/ProgramOutput';
import { useProgramStore } from '../../store/programStore';
import { ProgramInterpreter } from '../../services/ProgramInterpreter';
import type { KeyAction, GraphFunction } from '../../types';

// Créer une instance de mathjs avec toutes les fonctions
const math = create(all);

/**
 * Codes getKey TI-BASIC (ligne×10 + colonne) associés à chaque touche de la
 * calculatrice. Utilisés pour alimenter ProgramInterpreter.pushKey() quand un
 * programme tourne et lit le clavier via getKey.
 * Réf. : http://tibasicdev.wikidot.com/key-codes
 * Les flèches suivent la convention TI (←24 ↑25 →26 ↓34), pas la grille.
 */
const GETKEY_CODES: Record<string, number> = {
  'y-vars': 11, window: 12, zoom: 13, trace: 14, graph: 15,
  '2nd': 21, mode: 22, del: 23, left: 24, up: 25, right: 26,
  alpha: 31, x: 32, stat: 33, down: 34,
  math: 41, apps: 42, prgm: 43, vars: 44, clear: 45,
  inverse: 51, sin: 52, cos: 53, tan: 54, pow: 55,
  square: 61, comma: 62, 'left-paren': 63, 'right-paren': 64, divide: 65,
  log: 71, '7': 72, '8': 73, '9': 74, multiply: 75,
  ln: 81, '4': 82, '5': 83, '6': 84, subtract: 85,
  sto: 91, '1': 92, '2': 93, '3': 94, add: 95,
  '0': 102, dot: 103, negative: 104, enter: 105,
};

/**
 * Convertit un résultat Matrix mathjs au format store {rows, cols, data}.
 */
function toStoredMatrix(m: any): { rows: number; cols: number; data: number[][] } {
  const arr = (m && typeof m.toArray === 'function') ? m.toArray() : m;
  if (Array.isArray(arr) && Array.isArray(arr[0])) {
    return { rows: arr.length, cols: arr[0].length, data: arr as number[][] };
  }
  // Vecteur 1D → matrice 1×n
  const flat = (Array.isArray(arr) ? arr : [arr]) as number[];
  return { rows: 1, cols: flat.length, data: [flat] };
}

/**
 * Sépare les arguments de premier niveau d'un appel de fonction (split sur
 * les ',' hors parenthèses). Retourne null si les parenthèses sont déséquilibrées.
 */
function splitTopLevelArgs(s: string): string[] | null {
  const args: string[] = [];
  let depth = 0;
  let cur = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '(') { depth++; cur += ch; }
    else if (ch === ')') { depth--; if (depth < 0) return null; cur += ch; }
    else if (ch === ',' && depth === 0) { args.push(cur); cur = ''; }
    else cur += ch;
  }
  if (depth !== 0) return null;
  args.push(cur);
  return args;
}

export const Calculator: React.FC = () => {
  // State pour le modal d'aide
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // State pour le modal d'historique complet
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // State pour le menu PRGM
  const [showProgramMenu, setShowProgramMenu] = useState(false);

  // State pour la matrice en cours d'édition
  const [editingMatrixName, setEditingMatrixName] = useState<string | null>(null);

  // STAT > TESTS — test sélectionné pour l'éditeur
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

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
  const catalogViewerRef = useRef<CatalogViewerHandle>(null);
  const solverEditorRef = useRef<SolverEditorHandle>(null);
  const financeEditorRef = useRef<FinanceEditorHandle>(null);
  const testsEditorRef = useRef<TestsEditorHandle>(null);

  // State du programme en cours d'exécution
  const { executingProgram, executionContext, updateInputValue, provideInput, programInputValue } = useProgramStore();

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
    parametricFunctionsX,
    parametricFunctionsY,
    activeParametricFunctions,
    polarFunctions,
    activePolarFunctions,
    sequenceFunctions,
    activeSequenceFunctions,
    sequenceInitValues,
    editingParametricComponent,
    windowSettings,
    tableSettings,
    statPlots,
    drawElements,
    config,
    lastAnswer,
    isInputResult,
    matrices,
    variables,
    getMatrix,
    setMatrix,
    cursorPosition,
    // cursorPosition et setCursorPosition sont gérés automatiquement par le store
    setInput,
    setInputResult,
    appendInput,
    deleteLastChar,
    clearInput,
    addToHistory,
    clearHistory,
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
    setParametricFunctionX,
    setParametricFunctionY,
    setPolarFunction,
    setEditingParametricComponent,
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
    addDrawElement,
    clearDraw,
    storePicture,
    recallPicture,
    storeGDB,
    recallGDB,
  } = useCalculatorStore();

  // Supprimer warnings pour services importés
  console.log({ graphingEngine, statisticsService, mathFunctionsService });

  // Obtenir les items du menu actuel AVANT handleKeyPress
  // Générer le menu VARS dynamiquement selon le mode graphique
  const varsMenuItemsDynamic = useMemo(() => {
    console.log('[VARS Menu] Mode graphique actuel:', config.graphMode);

    // Créer le sous-menu Window selon le mode graphique
    const windowSubmenu = [
      { id: 'xmin', label: 'Xmin', action: () => {} },
      { id: 'xmax', label: 'Xmax', action: () => {} },
      { id: 'xscl', label: 'Xscl', action: () => {} },
      { id: 'ymin', label: 'Ymin', action: () => {} },
      { id: 'ymax', label: 'Ymax', action: () => {} },
      { id: 'yscl', label: 'Yscl', action: () => {} },
    ];

    // Ajouter les variables spécifiques au mode
    if (config.graphMode === 'PAR') {
      console.log('[VARS Menu] Ajout des variables paramétriques Tmin, Tmax, Tstep');
      windowSubmenu.push(
        { id: 'tmin', label: 'Tmin', action: () => {} },
        { id: 'tmax', label: 'Tmax', action: () => {} },
        { id: 'tstep', label: 'Tstep', action: () => {} }
      );
    } else if (config.graphMode === 'POL') {
      console.log('[VARS Menu] Ajout des variables polaires θmin, θmax, θstep');
      windowSubmenu.push(
        { id: 'θmin', label: 'θmin', action: () => {} },
        { id: 'θmax', label: 'θmax', action: () => {} },
        { id: 'θstep', label: 'θstep', action: () => {} }
      );
    } else if (config.graphMode === 'SEQ') {
      console.log('[VARS Menu] Ajout des variables de séquence nMin, nMax, PlotStart, PlotStep');
      windowSubmenu.push(
        { id: 'nmin', label: 'nMin', action: () => {} },
        { id: 'nmax', label: 'nMax', action: () => {} },
        { id: 'plotstart', label: 'PlotStart', action: () => {} },
        { id: 'plotstep', label: 'PlotStep', action: () => {} }
      );
    } else {
      console.log('[VARS Menu] Mode FUNC - pas de variables supplémentaires');
    }

    console.log('[VARS Menu] Sous-menu Window contient', windowSubmenu.length, 'items:', windowSubmenu.map(i => i.label).join(', '));

    // Retourner le menu VARS complet avec Window dynamique
    return [
      { id: 'vars-window', label: 'Window...', action: () => {}, submenu: windowSubmenu },
      ...varsMenuItems.slice(1), // Garder Zoom, XY, Matrix
    ];
  }, [config.graphMode]);

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
    if (currentMenu === 'VARS') return varsMenuItemsDynamic;
    if (currentMenu === 'DISTR') return distrMenuItems;
    if (currentMenu === 'TEST') return testMenuItems;
    if (currentMenu === 'LOGIC') return logicMenuItems;
    if (currentMenu === 'LIST') return listMenuItems;
    if (currentMenu === 'DRAW') return drawMenuItems;
    if (currentMenu === 'MATRIX') return matrixMenuItems;
    return [];
  }, [currentMenu, menuStack, varsMenuItemsDynamic]);

  // Créer les handlers pour les menus
  const zoomHandlers = useMemo(() =>
    createZoomHandlers(setWindowSettings, setCurrentMenu),
    [setWindowSettings, setCurrentMenu]
  );

  const mathHandlers = useMemo(() =>
    createMathHandlers(appendInput, setCurrentMenu, setMode as (mode: string) => void),
    [appendInput, setCurrentMenu, setMode]
  );

  // STAT > TESTS — ouvrir l'éditeur du test sélectionné
  const openStatTest = useCallback((key: string) => {
    setSelectedTest(key);
    setCurrentMenu(null);
    setMode('STAT_TESTS');
  }, [setMode]);

  const statHandlers = useMemo(() =>
    createStatHandlers(addToHistory, setCurrentMenu, setMode as (mode: string) => void, openStatTest),
    [addToHistory, setCurrentMenu, setMode, openStatTest]
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

  const distrHandlers = useMemo(() =>
    createDistrHandlers(appendInput, setCurrentMenu),
    [appendInput, setCurrentMenu]
  );

  const testHandlers = useMemo(() =>
    createTestHandlers(appendInput, setCurrentMenu),
    [appendInput, setCurrentMenu]
  );

  const logicHandlers = useMemo(() =>
    createLogicHandlers(appendInput, setCurrentMenu),
    [appendInput, setCurrentMenu]
  );

  const drawHandlers = useMemo(() =>
    createDrawHandlers(appendInput, setCurrentMenu),
    [appendInput, setCurrentMenu]
  );

  const matrixHandlers = useMemo(() =>
    createMatrixHandlers(appendInput, setCurrentMenu, setMode as (mode: string) => void),
    [appendInput, setCurrentMenu, setMode]
  );

  /**
   * Gère le clic sur un élément de l'historique pour le réutiliser
   */
  const handleHistoryClick = useCallback(
    (result: string) => {
      if (currentMode === 'NORMAL') {
        // Insérer le résultat dans l'input à la position du curseur
        appendInput(result);
      }
    },
    [currentMode, appendInput]
  );

  /**
   * Gère les actions des touches
   */
  const handleKeyPress = useCallback(
    (action: KeyAction) => {

      // Si un programme est en attente d'input, rediriger les touches vers le champ input
      if (executionContext?.isWaitingInput) {
        const currentValue = programInputValue || '';

        // Touches numériques
        if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(action)) {
          updateInputValue(currentValue + action);
          return;
        }

        // Point décimal
        if (action === 'dot' && !currentValue.includes('.')) {
          updateInputValue(currentValue + '.');
          return;
        }

        // Signe négatif (au début uniquement)
        if (action === 'negative' && currentValue.length === 0) {
          updateInputValue('-');
          return;
        }

        // Backspace/Delete
        if (action === 'del' && currentValue.length > 0) {
          updateInputValue(currentValue.slice(0, -1));
          return;
        }

        // Enter pour valider
        if (action === 'enter') {
          const targetVar = executionContext?.inputVariable;
          if (targetVar && /^Str[1-9]$/.test(targetVar)) {
            // Input StrN : saisie d'une chaîne (texte brut)
            provideInput(currentValue);
          } else {
            const value = parseFloat(currentValue);
            if (!isNaN(value)) {
              provideInput(value);
            }
          }
          return;
        }

        // Ignorer les autres touches pendant l'input
        return;
      }

      // Si un programme tourne et lit le clavier via getKey (hors attente
      // d'Input ou de Menu), router la touche vers le tampon de l'interpréteur.
      if (
        executingProgram &&
        !executionContext?.isWaitingInput &&
        !executionContext?.isWaitingMenu
      ) {
        const code = GETKEY_CODES[action];
        if (code !== undefined) {
          ProgramInterpreter.pushKey(code);
        }
        return; // consommer la touche (pas d'action calculatrice normale)
      }

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
            } else if (currentMenu === 'DISTR') {
              handler = (distrHandlers as any)[currentItem.id];
            } else if (currentMenu === 'TEST') {
              handler = (testHandlers as any)[currentItem.id];
            } else if (currentMenu === 'LOGIC') {
              handler = (logicHandlers as any)[currentItem.id];
            } else if (currentMenu === 'LIST') {
              handler = (listHandlers as any)[currentItem.id];
            } else if (currentMenu === 'DRAW') {
              handler = (drawHandlers as any)[currentItem.id];
            } else if (currentMenu === 'MATRIX') {
              handler = (matrixHandlers as any)[currentItem.id];
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
      if (action === 'clear' && currentMode !== 'WINDOW' && currentMode !== 'MODE' && currentMode !== 'STAT_EDIT' && currentMode !== 'STAT_TESTS') {
        clearInput();
        setMode('NORMAL');
        setCurrentMenu(null);
        setGraphMode(false);  // Sortir du mode graphique
        setTraceMode(false);   // Désactiver le mode trace
        return;
      }

      // Gérer DEL (sauf les modes qui ont leur propre gestion)
      if (action === 'del' && currentMode !== 'STAT_EDIT' && currentMode !== 'SOLVER' && currentMode !== 'FINANCE' && currentMode !== 'STAT_TESTS' && currentMode !== 'MATRIX_EDIT' && currentMode !== 'TBLSET') {
        deleteLastChar();
        return;
      }

      // Gérer GRAPH (sauf les modes qui ont leur propre gestion)
      if (action === 'graph' && currentMode !== 'SOLVER' && currentMode !== 'FINANCE' && currentMode !== 'STAT_TESTS') {
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

        // Afficher le bon format selon le mode graphique
        if (config.graphMode === 'PAR') {
          // En mode paramétrique, commencer par X
          setEditingParametricComponent('X');
          setInput(`X${currentFunction + 1}T=${parametricFunctionsX[currentFunction]}`);
        } else if (config.graphMode === 'POL') {
          // En mode polaire
          setInput(`r${currentFunction + 1}=${polarFunctions[currentFunction]}`);
        } else if (config.graphMode === 'SEQ') {
          // En mode séquence (u, v, w seulement - 3 fonctions au lieu de 6)
          const seqNames = ['u', 'v', 'w'];
          const funcIndex = Math.min(currentFunction, 2); // Max 3 fonctions en mode SEQ
          setInput(`${seqNames[funcIndex]}(n)=${sequenceFunctions[funcIndex]}`);
        } else {
          // Mode FUNC par défaut
          setInput(`Y${currentFunction + 1}=${graphFunctions[currentFunction]}`);
        }
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

      // Gérer CATALOG (2ND + 0)
      if (action === 'catalog') {
        setMode('CATALOG');
        setGraphMode(false);
        return;
      }

      // Gérer APPS - Ouvrir le Finance TVM Solver
      if (action === 'apps') {
        setMode('FINANCE');
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

      // Gérer PRGM
      if (action === 'prgm') {
        setShowProgramMenu(true);
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

      // Gérer TEST (2ND + MATH)
      if (action === 'test') {
        setCurrentMenu('TEST');
        setGraphMode(false);
        return;
      }

      // Gérer DISTR (2ND + VARS)
      if (action === 'distr') {
        setCurrentMenu('DISTR');
        setGraphMode(false);
        return;
      }

      // Gérer LIST (2ND + STAT via 2ND + 2)
      if (action === 'list') {
        setCurrentMenu('LIST');
        setGraphMode(false);
        return;
      }

      // Gérer DRAW (2ND + PRGM)
      if (action === 'draw') {
        setCurrentMenu('DRAW');
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

      // Gérer MATRIX (2ND + X⁻¹) → ouvrir le menu MATRX (NAMES/MATH/OPS + Edit)
      if (action === 'matrix') {
        setCurrentMenu('MATRIX');
        setGraphMode(false);
        // Note: Le mode alpha est désactivé automatiquement par handleKeyPressWithAutoDeactivate
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

      // En mode CATALOG - gérer la navigation via ref
      if (currentMode === 'CATALOG' && catalogViewerRef.current) {
        if (action === 'up') {
          catalogViewerRef.current.navigate('up');
          return;
        }
        if (action === 'down') {
          catalogViewerRef.current.navigate('down');
          return;
        }
        if (action === 'enter') {
          catalogViewerRef.current.select();
          return;
        }
        if (action === 'clear') {
          catalogViewerRef.current.close();
          return;
        }
      }

      // En mode SOLVER - gérer la navigation via ref
      if (currentMode === 'SOLVER' && solverEditorRef.current) {
        if (action === 'up') {
          solverEditorRef.current.navigate('up');
          return;
        }
        if (action === 'down') {
          solverEditorRef.current.navigate('down');
          return;
        }
        if (action === 'enter') {
          solverEditorRef.current.handleEnter();
          return;
        }
        if (action === 'del') {
          solverEditorRef.current.handleDelete();
          return;
        }
        if ((action as string) === 'graph') {
          solverEditorRef.current.solve();
          return;
        }
        if (action === 'clear') {
          solverEditorRef.current.close();
          return;
        }
        // Gérer les chiffres, opérateurs et symboles pour l'édition
        if (action === '0' || action === '1' || action === '2' || action === '3' || action === '4' ||
            action === '5' || action === '6' || action === '7' || action === '8' || action === '9' ||
            action === 'dot' || action === 'negative' || action === 'add' || action === 'subtract' ||
            action === 'multiply' || action === 'divide' || action === 'left-paren' || action === 'right-paren' ||
            action === 'x' || action === 'pow' || action === 'square' || action === 'sin' || action === 'cos' ||
            action === 'tan' || action === 'sqrt' || action === 'ln' || action === 'log' || action === 'inverse') {
          const inputMap: Record<string, string> = {
            'negative': '-',
            'dot': '.',
            'add': '+',
            'subtract': '-',
            'multiply': '*',
            'divide': '/',
            'left-paren': '(',
            'right-paren': ')',
            'x': 'X',
            'pow': '^',
            'square': '^2',
            'sin': 'sin(',
            'cos': 'cos(',
            'tan': 'tan(',
            'sqrt': '√(',
            'ln': 'ln(',
            'log': 'log(',
            'inverse': '1/',
          };
          solverEditorRef.current.handleInput(inputMap[action] || action);
          return;
        }
      }

      // En mode FINANCE - gérer la navigation via ref
      if (currentMode === 'FINANCE' && financeEditorRef.current) {
        if (action === 'up') {
          financeEditorRef.current.navigate('up');
          return;
        }
        if (action === 'down') {
          financeEditorRef.current.navigate('down');
          return;
        }
        if (action === 'enter') {
          financeEditorRef.current.handleEnter();
          return;
        }
        if (action === 'del') {
          financeEditorRef.current.handleDelete();
          return;
        }
        if ((action as string) === 'graph') {
          financeEditorRef.current.solve();
          return;
        }
        if (action === 'clear') {
          financeEditorRef.current.close();
          return;
        }
        // Gérer les chiffres, opérateurs et symboles pour l'édition
        if (action === '0' || action === '1' || action === '2' || action === '3' || action === '4' ||
            action === '5' || action === '6' || action === '7' || action === '8' || action === '9' ||
            action === 'dot' || action === 'negative') {
          const inputMap: Record<string, string> = {
            'negative': '-',
            'dot': '.',
          };
          financeEditorRef.current.handleInput(inputMap[action] || action);
          return;
        }
      }

      // En mode STAT_TESTS - gérer la navigation via ref
      if (currentMode === 'STAT_TESTS' && testsEditorRef.current) {
        if (action === 'up') {
          testsEditorRef.current.navigate('up');
          return;
        }
        if (action === 'down') {
          testsEditorRef.current.navigate('down');
          return;
        }
        if (action === 'enter') {
          testsEditorRef.current.handleEnter();
          return;
        }
        if (action === 'del') {
          testsEditorRef.current.handleDelete();
          return;
        }
        if ((action as string) === 'graph') {
          testsEditorRef.current.calculate();
          return;
        }
        if (action === 'clear') {
          testsEditorRef.current.close();
          return;
        }
        // Gérer les chiffres, point et signe moins pour l'édition des champs nombre
        if (action === '0' || action === '1' || action === '2' || action === '3' || action === '4' ||
            action === '5' || action === '6' || action === '7' || action === '8' || action === '9' ||
            action === 'dot' || action === 'negative') {
          const inputMap: Record<string, string> = {
            'negative': '-',
            'dot': '.',
          };
          testsEditorRef.current.handleInput(inputMap[action] || action);
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
          // Parser selon le mode graphique
          if (config.graphMode === 'PAR') {
            // Mode paramétrique: X1T= ou Y1T=
            const matchX = currentInput.match(/X(\d+)T=(.+)/);
            const matchY = currentInput.match(/Y(\d+)T=(.+)/);

            if (matchX) {
              const funcIndex = parseInt(matchX[1]) - 1;
              const expression = matchX[2];
              setParametricFunctionX(funcIndex, expression);
              addToHistory(`X${funcIndex + 1}T=${expression}`);

              // Passer automatiquement à Y
              setEditingParametricComponent('Y');
              setInput(`Y${funcIndex + 1}T=${parametricFunctionsY[funcIndex]}`);
              return; // Ne pas fermer l'éditeur
            } else if (matchY) {
              const funcIndex = parseInt(matchY[1]) - 1;
              const expression = matchY[2];
              setParametricFunctionY(funcIndex, expression);
              addToHistory(`Y${funcIndex + 1}T=${expression}`);
              addToHistory('Appuyez GRAPH pour tracer');
              setMode('NORMAL');
              clearInput();
              return;
            }
          } else if (config.graphMode === 'POL') {
            // Mode polaire: r1=
            const match = currentInput.match(/r(\d+)=(.+)/);
            if (match) {
              const funcIndex = parseInt(match[1]) - 1;
              const expression = match[2];
              setPolarFunction(funcIndex, expression);
              addToHistory(`r${funcIndex + 1}=${expression}`);
              addToHistory('Appuyez GRAPH pour tracer');
            }
          } else if (config.graphMode === 'SEQ') {
            // Mode séquence: u(n)=, v(n)=, w(n)=
            const match = currentInput.match(/([uvw])\(n\)=(.+)/);
            if (match) {
              const seqNames = ['u', 'v', 'w'];
              const funcIndex = seqNames.indexOf(match[1]);
              const expression = match[2];
              const { setSequenceFunction } = useCalculatorStore.getState();
              setSequenceFunction(funcIndex, expression);
              addToHistory(`${match[1]}(n)=${expression}`);
              addToHistory('Appuyez GRAPH pour tracer');
            }
          } else {
            // Mode FUNC: Y1=
            const match = currentInput.match(/Y(\d+)=(.+)/);
            if (match) {
              const funcIndex = parseInt(match[1]) - 1;
              const expression = match[2];
              setFunctionExpression(funcIndex, expression);
              addToHistory(`Y${funcIndex + 1}=${expression}`);
              addToHistory('Appuyez GRAPH pour tracer');
            }
          }
          setMode('NORMAL');
          clearInput();
          return;
        }

        if (action === 'up' || action === 'down') {
          const maxFunctions = config.graphMode === 'SEQ' ? 3 : 6;
          const newIndex = action === 'up'
            ? (currentFunction + maxFunctions - 1) % maxFunctions
            : (currentFunction + 1) % maxFunctions;
          setCurrentFunction(newIndex);

          // Afficher le bon format selon le mode graphique
          if (config.graphMode === 'PAR') {
            if (editingParametricComponent === 'X') {
              setInput(`X${newIndex + 1}T=${parametricFunctionsX[newIndex]}`);
            } else {
              setInput(`Y${newIndex + 1}T=${parametricFunctionsY[newIndex]}`);
            }
          } else if (config.graphMode === 'POL') {
            setInput(`r${newIndex + 1}=${polarFunctions[newIndex]}`);
          } else if (config.graphMode === 'SEQ') {
            const seqNames = ['u', 'v', 'w'];
            setInput(`${seqNames[newIndex]}(n)=${sequenceFunctions[newIndex]}`);
          } else {
            setInput(`Y${newIndex + 1}=${graphFunctions[newIndex]}`);
          }
          return;
        }

        // En mode PAR, permettre de passer de X à Y avec les flèches gauche/droite
        if (config.graphMode === 'PAR' && (action === 'left' || action === 'right')) {
          if (action === 'right' && editingParametricComponent === 'X') {
            // Passer de X à Y
            setEditingParametricComponent('Y');
            setInput(`Y${currentFunction + 1}T=${parametricFunctionsY[currentFunction]}`);
            return;
          } else if (action === 'left' && editingParametricComponent === 'Y') {
            // Passer de Y à X
            setEditingParametricComponent('X');
            setInput(`X${currentFunction + 1}T=${parametricFunctionsX[currentFunction]}`);
            return;
          }
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
          'subtract': '-',  // Utiliser le tiret ASCII, pas Unicode
          'multiply': '×',
          'divide': '÷',
          'pow': '^',
        };

        if (arithmeticOperators[action] && isInputResult && currentMode === 'NORMAL') {
          // Si l'input actuel est un résultat, continuer avec ce résultat
          setInput(`${currentInput}${arithmeticOperators[action]}`);
          return;
        }

        // Déterminer la variable à insérer selon le mode graphique
        let variableForXKey = 'X';
        if (config.graphMode === 'PAR') {
          variableForXKey = 'T';
        } else if (config.graphMode === 'POL') {
          variableForXKey = 'θ';
        } else if (config.graphMode === 'SEQ') {
          variableForXKey = 'n';
        }

        const operatorMap: Record<string, string> = {
          // Opérateurs arithmétiques
          'add': '+',
          'subtract': '-',  // Utiliser ASCII au lieu d'Unicode pour compatibilité mathjs
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
          // Variables (dynamique selon le mode graphique)
          'x': variableForXKey,
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

        if ((action as string) === 'catalog' || (action as string) === 'entry' || (action as string) === 'list') {
          // Actions non implémentées pour l'instant
          console.log(`Action ${action} non implémentée`);
          return;
        }

        // Gérer ENTER pour évaluer
        if (action === 'enter' && currentMode === 'NORMAL') {
          try {
            // Détecter les commandes DRAW
            const input = currentInput.trim();

            // ClrDraw : Effacer tous les dessins
            if (input === 'ClrDraw') {
              clearDraw();
              addToHistory('ClrDraw');
              setInput('Done');
              setGraphMode(true); // Afficher le graphique
              return;
            }

            // Line(x1,y1,x2,y2) : Tracer une ligne
            const lineMatch = input.match(/^Line\s*\(\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\)$/);
            if (lineMatch) {
              const [, x1, y1, x2, y2] = lineMatch;
              addDrawElement({
                type: 'line',
                x1: parseFloat(x1),
                y1: parseFloat(y1),
                x2: parseFloat(x2),
                y2: parseFloat(y2),
              });
              addToHistory(input);
              setInput('Done');
              setGraphMode(true);
              return;
            }

            // Horizontal y : Ligne horizontale
            const horizMatch = input.match(/^Horizontal\s+(-?\d+\.?\d*)$/);
            if (horizMatch) {
              const [, y] = horizMatch;
              addDrawElement({
                type: 'horizontal',
                y: parseFloat(y),
              });
              addToHistory(input);
              setInput('Done');
              setGraphMode(true);
              return;
            }

            // Vertical x : Ligne verticale
            const vertMatch = input.match(/^Vertical\s+(-?\d+\.?\d*)$/);
            if (vertMatch) {
              const [, x] = vertMatch;
              addDrawElement({
                type: 'vertical',
                x: parseFloat(x),
              });
              addToHistory(input);
              setInput('Done');
              setGraphMode(true);
              return;
            }

            // Circle(x,y,r) : Dessiner un cercle
            const circleMatch = input.match(/^Circle\s*\(\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*,\s*(\d+\.?\d*)\s*\)$/);
            if (circleMatch) {
              const [, x, y, r] = circleMatch;
              addDrawElement({
                type: 'circle',
                x: parseFloat(x),
                y: parseFloat(y),
                r: parseFloat(r),
              });
              addToHistory(input);
              setInput('Done');
              setGraphMode(true);
              return;
            }

            // Text(x,y,"texte") : Afficher du texte
            const textMatch = input.match(/^Text\s*\(\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*,\s*["'](.+)["']\s*\)$/);
            if (textMatch) {
              const [, x, y, text] = textMatch;
              addDrawElement({
                type: 'text',
                x: parseFloat(x),
                y: parseFloat(y),
                text: text,
              });
              addToHistory(input);
              setInput('Done');
              setGraphMode(true);
              return;
            }

            // Tangent(expr,x) : Dessiner la tangente à une fonction
            const tangentMatch = input.match(/^Tangent\s*\(\s*(.+?)\s*,\s*(-?\d+\.?\d*)\s*\)$/);
            if (tangentMatch) {
              const [, expr, x] = tangentMatch;
              addDrawElement({
                type: 'tangent',
                expr: expr.trim(),
                x: parseFloat(x),
              });
              addToHistory(input);
              setInput('Done');
              setGraphMode(true);
              return;
            }

            // DrawF expr : Dessiner une fonction
            const drawFMatch = input.match(/^DrawF\s+(.+)$/);
            if (drawFMatch) {
              const [, expr] = drawFMatch;
              addDrawElement({
                type: 'function',
                expr: expr.trim(),
              });
              addToHistory(input);
              setInput('Done');
              setGraphMode(true);
              return;
            }

            // DrawInv expr : Dessiner l'inverse d'une fonction
            const drawInvMatch = input.match(/^DrawInv\s+(.+)$/);
            if (drawInvMatch) {
              const [, expr] = drawInvMatch;
              addDrawElement({
                type: 'inverse',
                expr: expr.trim(),
              });
              addToHistory(input);
              setInput('Done');
              setGraphMode(true);
              return;
            }

            // Shade(f1,f2,xmin,xmax) : Ombrage entre deux fonctions
            const shadeMatch = input.match(/^Shade\s*\(\s*(.+?)\s*,\s*(.+?)\s*,\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\)$/);
            if (shadeMatch) {
              const [, f1, f2, xMin, xMax] = shadeMatch;
              addDrawElement({
                type: 'shade',
                f1: f1.trim(),
                f2: f2.trim(),
                xMin: parseFloat(xMin),
                xMax: parseFloat(xMax),
              });
              addToHistory(input);
              setInput('Done');
              setGraphMode(true);
              return;
            }

            // Pt-On(x,y[,mark]) : Activer un point
            const ptOnMatch = input.match(/^Pt-On\s*\(\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*(?:,\s*(\d+))?\s*\)$/);
            if (ptOnMatch) {
              const [, x, y] = ptOnMatch;
              addDrawElement({
                type: 'point',
                x: parseFloat(x),
                y: parseFloat(y),
                on: true,
              });
              addToHistory(input);
              setInput('Done');
              setGraphMode(true);
              return;
            }

            // Pt-Off(x,y[,mark]) : Désactiver un point
            const ptOffMatch = input.match(/^Pt-Off\s*\(\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*(?:,\s*(\d+))?\s*\)$/);
            if (ptOffMatch) {
              const [, x, y] = ptOffMatch;
              addDrawElement({
                type: 'point',
                x: parseFloat(x),
                y: parseFloat(y),
                on: false,
              });
              addToHistory(input);
              setInput('Done');
              setGraphMode(true);
              return;
            }

            // Pt-Change(x,y[,mark]) : Basculer l'état d'un point
            const ptChangeMatch = input.match(/^Pt-Change\s*\(\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*(?:,\s*(\d+))?\s*\)$/);
            if (ptChangeMatch) {
              const [, x, y] = ptChangeMatch;
              // Pour Pt-Change, on doit vérifier si le point existe déjà
              const existingPoint = drawElements.find(
                el => el.type === 'point' && el.x === parseFloat(x) && el.y === parseFloat(y)
              );
              addDrawElement({
                type: 'point',
                x: parseFloat(x),
                y: parseFloat(y),
                on: existingPoint ? !(existingPoint as any).on : true,
              });
              addToHistory(input);
              setInput('Done');
              setGraphMode(true);
              return;
            }

            // StorePic n : Sauvegarder l'écran dans Pic1-Pic10
            const storePicMatch = input.match(/^StorePic\s+(\d+)$/);
            if (storePicMatch) {
              const [, n] = storePicMatch;
              const picNum = parseInt(n);
              if (picNum >= 1 && picNum <= 10) {
                storePicture(`Pic${picNum}`);
                addToHistory(input);
                setInput('Done');
                return;
              }
            }

            // RecallPic n : Rappeler une image sauvegardée
            const recallPicMatch = input.match(/^RecallPic\s+(\d+)$/);
            if (recallPicMatch) {
              const [, n] = recallPicMatch;
              const picNum = parseInt(n);
              if (picNum >= 1 && picNum <= 10) {
                recallPicture(`Pic${picNum}`);
                addToHistory(input);
                setInput('Done');
                setGraphMode(true);
                return;
              }
            }

            // StoreGDB n : Sauvegarder les paramètres graphiques dans GDB1-GDB10
            const storeGDBMatch = input.match(/^StoreGDB\s+(\d+)$/);
            if (storeGDBMatch) {
              const [, n] = storeGDBMatch;
              const gdbNum = parseInt(n);
              if (gdbNum >= 1 && gdbNum <= 10) {
                storeGDB(`GDB${gdbNum}`);
                addToHistory(input);
                setInput('Done');
                return;
              }
            }

            // RecallGDB n : Rappeler les paramètres graphiques sauvegardés
            const recallGDBMatch = input.match(/^RecallGDB\s+(\d+)$/);
            if (recallGDBMatch) {
              const [, n] = recallGDBMatch;
              const gdbNum = parseInt(n);
              if (gdbNum >= 1 && gdbNum <= 10) {
                recallGDB(`GDB${gdbNum}`);
                addToHistory(input);
                setInput('Done');
                return;
              }
            }

            // Fill(v,[X]) / SortA([X]) / SortD([X]) — commandes en place sur matrices.
            // Sur TI-83 ces commandes modifient la matrice en place et affichent Done.
            const matrixCmdMatch = input.match(/^(Fill|SortA|SortD)\((.+)\)$/);
            if (matrixCmdMatch) {
              const [, cmd, argsStr] = matrixCmdMatch;
              const args = splitTopLevelArgs(argsStr);
              if (args) {
                try {
                  if (cmd === 'Fill') {
                    // Fill(value, [X])
                    const target = args[1]?.match(/^\[([A-J])\]$/);
                    if (target) {
                      const m = getMatrix(target[1]);
                      const filled = MatrixService.fill(Number(args[0]), math.matrix(m.data));
                      setMatrix(target[1], toStoredMatrix(filled));
                      addToHistory(input); setInput('Done'); return;
                    }
                  } else {
                    // SortA([X]) / SortD([X]) — trie chaque ligne en place
                    const target = args[0]?.match(/^\[([A-J])\]$/);
                    if (target) {
                      const m = getMatrix(target[1]);
                      const sorted = (cmd === 'SortA' ? MatrixService.sortA : MatrixService.sortD)(math.matrix(m.data));
                      setMatrix(target[1], toStoredMatrix(sorted));
                      addToHistory(input); setInput('Done'); return;
                    }
                  }
                } catch {
                  // tombé à l'eau → évaluation normale ci-dessous
                }
              }
            }

            // Détecter si c'est un stockage de variable (→)
            const storeMatch = currentInput.match(/^(.+)→([A-Zθ]|Str[1-9])$/);
            // Stockage vers une matrice : expr→[A]..[J]
            const matrixStoreMatch = !storeMatch
              ? currentInput.match(/^(.+)→\[(A|B|C|D|E|F|G|H|I|J)\]$/)
              : null;

            let expr = currentInput;
            let varName: string | null = null;
            let matrixTarget: string | null = null;

            if (storeMatch) {
              // C'est un stockage de variable : expression→VarName
              expr = storeMatch[1].trim();
              varName = storeMatch[2];
            } else if (matrixStoreMatch) {
              expr = matrixStoreMatch[1].trim();
              matrixTarget = matrixStoreMatch[2];
            }

            // Préparer l'expression
            // nDeriv( / fnInt( : ces fonctions reçoivent une expression NON évaluée
            // et la variable par rapport à laquelle dériver/intégrer. Il faut les
            // extraire et les calculer AVANT la substitution X→0 (qui casserait
            // l'argument expression) et avant mathjs.
            expr = extractCalculusCalls(expr);

            expr = expr
              .replace(/−/g, '-')  // Remplacer le signe moins Unicode (U+2212) par le tiret ASCII
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
            // (numériques ET chaînes — Str1-Str9 sont des identifiants mathjs valides)
            Object.entries(variables).forEach(([name, value]) => {
              if (typeof value === 'number' || typeof value === 'string') {
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

            // Ajouter les matrices au scope avec un préfixe pour éviter conflits
            // Sur TI-83, les variables A-Z et les matrices [A]-[J] sont complètement séparées
            const definedMatrices: string[] = [];
            matrixNames.forEach(name => {
              if (matrices[name] && matrices[name].rows > 0 && matrices[name].cols > 0) {
                // Si la matrice est définie (même vide), l'ajouter au scope
                // pour que [A] fonctionne correctement
                scope[`MAT_${name}`] = math.matrix(matrices[name].data);
                definedMatrices.push(name);
              }
            });

            // Remplacer [NomMatrice] par MAT_NomMatrice UNIQUEMENT pour les matrices définies
            // Cela permet d'avoir A (variable) et [A] (matrice) séparés
            definedMatrices.forEach(name => {
              const regex = new RegExp(`\\[${name}\\]`, 'g');
              expr = expr.replace(regex, `MAT_${name}`);
            });

            // Gérer la transposée: remplacer MAT_NomMatrice^T par transpose(MAT_NomMatrice)
            matrixNames.forEach(name => {
              const transposeRegex = new RegExp(`MAT_${name}\\^T`, 'g');
              expr = expr.replace(transposeRegex, `transpose(MAT_${name})`);
            });

            // Rewrites des tokens matriciels TI (noms avec opérateurs/caractères non-identifiants)
            // NB: *row+ et *row- doivent être réécrits AVANT *row
            expr = expr.replace(/Matr►list\(/g, 'matrToList(');
            expr = expr.replace(/List►matr\(/g, 'listToMatr(');
            expr = expr.replace(/\*row\+\(/g, 'rowPlus(');
            expr = expr.replace(/\*row-\(/g, 'rowMinus(');
            expr = expr.replace(/\*row\(/g, 'row(');

            // Rewrites des tokens ANGLE TI (caractères non-identifiants ►/→/°)
            // R►Pr/R►Pθ : conversion rectangulaire → polaire ; P►Rx/P►Ry : polaire → rectangulaire
            // °→rad / rad→° : conversions d'unités d'angle ; →DMS / →Dec : format DMS
            expr = expr.replace(/R►Pr\(/g, 'rToP_r(');
            expr = expr.replace(/R►Pθ\(/g, 'rToP_theta(');
            expr = expr.replace(/P►Rx\(/g, 'pToR_x(');
            expr = expr.replace(/P►Ry\(/g, 'pToR_y(');
            expr = expr.replace(/°→rad\(/g, 'degToRad(');
            expr = expr.replace(/rad→°\(/g, 'radToDeg(');
            expr = expr.replace(/→DMS\(/g, 'toDMS(');
            expr = expr.replace(/→Dec\(/g, 'toDec(');

            // Enregistrer les fonctions matricielles TI dans le scope.
            // mathjs (create, all) gère déjà en built-in: det, identity, transpose, inv, + arithmétique.
            scope.randM = MatrixService.randM;
            scope.ref = MatrixService.ref;
            scope.rref = MatrixService.rref;
            scope.rowSwap = MatrixService.rowSwap;
            scope.row = MatrixService.row;
            scope.rowPlus = MatrixService.rowPlus;
            scope.rowMinus = MatrixService.rowMinus;
            scope.matrToList = MatrixService.matrToList;
            scope.listToMatr = MatrixService.listToMatr;
            scope.augment = MatrixService.augment;
            scope.cumSum = MatrixService.cumSum;
            scope.dim = MatrixService.dim;
            scope.Fill = MatrixService.fill;
            scope.SortA = MatrixService.sortA;
            scope.SortD = MatrixService.sortD;

            // Fonctions ANGLE — conversions polaire/rectangulaire + DMS.
            // θ est renvoyé dans le mode d'angle courant (DEGREE ou RADIAN).
            const toRad = (a: number) => a * (Math.PI / 180);
            const toDeg = (a: number) => a * (180 / Math.PI);
            scope.rToP_r = (x: number, y: number) => Math.hypot(x, y);
            scope.rToP_theta = (x: number, y: number) => {
              const theta = Math.atan2(y, x);
              return config.angleMode === 'DEGREE' ? toDeg(theta) : theta;
            };
            scope.pToR_x = (r: number, theta: number) => {
              const t = config.angleMode === 'DEGREE' ? toRad(theta) : theta;
              return r * Math.cos(t);
            };
            scope.pToR_y = (r: number, theta: number) => {
              const t = config.angleMode === 'DEGREE' ? toRad(theta) : theta;
              return r * Math.sin(t);
            };
            scope.degToRad = (d: number) => toRad(d);
            scope.radToDeg = (r: number) => toDeg(r);
            // →DMS : convertit des degrés décimaux en chaîne "D°M'S"
            scope.toDMS = (deg: number) => {
              const sign = deg < 0 ? '-' : '';
              const abs = Math.abs(deg);
              const D = Math.floor(abs);
              const minF = (abs - D) * 60;
              const M = Math.floor(minF);
              const S = Math.round((minF - M) * 60);
              return `${sign}${D}°${M}'${S}"`;
            };
            // →Dec : convertit une valeur DMS en degrés décimaux. Accepte une
            // chaîne "D°M'S\"" (format produit par →DMS) → D + M/60 + S/3600,
            // ou un nombre (arrondi). Permet le round-trip →Dec(→DMS(12.5)).
            scope.toDec = (x: number | string) => {
              if (typeof x === 'string') {
                const m = x.match(/^(-?\d+)°(\d+)'(\d+(?:\.\d+)?)"$/);
                if (m) {
                  const sign = m[1].startsWith('-') ? -1 : 1;
                  return sign * (Math.abs(Number(m[1])) + Number(m[2]) / 60 + Number(m[3]) / 3600);
                }
                return Number(x);
              }
              return Math.round(x * 1e10) / 1e10;
            };

            // Fonctions chaîne TI-BASIC (length/sub/inString/expr)
            scope.length = (s: string) => stringService.length(s);
            scope.sub = (s: string, start: number, len: number) => stringService.sub(s, start, len);
            scope.inString = (s: string, sub: string, start?: number) => stringService.inString(s, sub, start);
            scope.expr = (s: string) => stringService.expr(s);

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
            } else if (varName && typeof result === 'string' && /^Str[1-9]$/.test(varName)) {
              // Stockage d'une chaîne vers Str1-Str9 (fidèle TI-83 : affiche Done)
              setVariable(varName, result);
              addToHistory(input);
              setInput('Done');
            } else if (matrixTarget && result && typeof result === 'object' && result.type === 'Matrix') {
              // Stockage d'un résultat matriciel vers [A]-[J] (fidèle TI-83 : Done)
              setMatrix(matrixTarget, toStoredMatrix(result));
              addToHistory(input);
              setInput('Done');
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
      config.graphMode,
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
      addDrawElement,
      clearDraw,
      zoomHandlers,
      mathHandlers,
      statHandlers,
      calcHandlers,
      isSecondFunction,
      isAlphaMode,
      executionContext,
      executingProgram,
      updateInputValue,
      provideInput,
      programInputValue,
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
    const editorModes = ['STAT_EDIT', 'PRGM_EDIT'];
    if (editorModes.includes(currentMode)) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Raccourcis avec modificateurs (Ctrl, Alt, etc.)
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'c':
            // Ctrl+C : Copier le résultat ou l'input
            e.preventDefault();
            const textToCopy = isInputResult && lastAnswer !== undefined
              ? String(lastAnswer)
              : currentInput;
            if (textToCopy) {
              navigator.clipboard.writeText(textToCopy).catch(err =>
                console.error('Erreur copie:', err)
              );
            }
            return;

          case 'v':
            // Ctrl+V : Coller du texte
            e.preventDefault();
            navigator.clipboard.readText().then(text => {
              if (text && currentMode === 'NORMAL') {
                appendInput(text);
              }
            }).catch(err => console.error('Erreur collage:', err));
            return;

          case 'z':
            // Ctrl+Z : Effacer l'input (Undo basique)
            e.preventDefault();
            clearInput();
            return;

          default:
            return;
        }
      }

      // Touches de fonction
      if (e.key === 'F1') {
        // F1 : Ouvrir l'aide
        e.preventDefault();
        setIsHelpOpen(true);
        return;
      }

      if (e.key === 'F5') {
        // F5 : Rafraîchir le graphique
        e.preventDefault();
        if (isGraphMode) {
          setGraphMode(false);
          setTimeout(() => setGraphMode(true), 50);
        }
        return;
      }

      if (e.key === 'Tab') {
        // Tab : Basculer entre modes (FUNC/PAR/POL/SEQ)
        e.preventDefault();
        const modes: ('FUNC' | 'PAR' | 'POL' | 'SEQ')[] = ['FUNC', 'PAR', 'POL', 'SEQ'];
        const currentIndex = modes.indexOf(config.graphMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        setConfig({ ...config, graphMode: modes[nextIndex] });
        return;
      }

      // Mapping des touches standards
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
  }, [handleKeyPressWithAutoDeactivate, currentMode, isInputResult, lastAnswer, currentInput, appendInput, clearInput, isGraphMode, setGraphMode, config, setConfig]);

  // Préparer les fonctions pour le graphique selon le mode
  const graphFunctionsData: GraphFunction[] = useMemo(() => {
    if (config.graphMode === 'PAR') {
      // En mode paramétrique, utiliser les fonctions paramétriques
      return parametricFunctionsX.map((expr, index) => ({
        index,
        expression: expr,
        active: activeParametricFunctions[index],
      }));
    } else if (config.graphMode === 'POL') {
      // En mode polaire, utiliser les fonctions polaires
      return polarFunctions.map((expr, index) => ({
        index,
        expression: expr,
        active: activePolarFunctions[index],
      }));
    } else if (config.graphMode === 'SEQ') {
      // En mode séquence, utiliser les fonctions de séquence (u, v, w)
      return sequenceFunctions.map((expr, index) => ({
        index,
        expression: expr,
        active: activeSequenceFunctions[index],
      }));
    } else {
      // Mode FUNC par défaut
      return graphFunctions.map((expr, index) => ({
        index,
        expression: expr,
        active: activeFunctions[index],
      }));
    }
  }, [config.graphMode, graphFunctions, activeFunctions, parametricFunctionsX, activeParametricFunctions, polarFunctions, activePolarFunctions, sequenceFunctions, activeSequenceFunctions]);

  // Préparer les fonctions paramétriques
  const parametricFunctionsData = useMemo(() => {
    if (config.graphMode === 'PAR') {
      return {
        x: parametricFunctionsX,
        y: parametricFunctionsY
      };
    }
    return undefined;
  }, [config.graphMode, parametricFunctionsX, parametricFunctionsY]);

  // Préparer les fonctions de séquence
  const sequenceFunctionsData = useMemo(() => {
    if (config.graphMode === 'SEQ') {
      return {
        functions: sequenceFunctions,
        initValues: sequenceInitValues
      };
    }
    return undefined;
  }, [config.graphMode, sequenceFunctions, sequenceInitValues]);

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
    // Si un programme est en cours d'exécution
    if (executingProgram) {
      return <ProgramOutput onClose={() => setMode('NORMAL')} />;
    }

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
          graphMode={config.graphMode}
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
          graphMode={config.graphMode}
          parametricFunctionsX={parametricFunctionsX}
          parametricFunctionsY={parametricFunctionsY}
          activeParametricFunctions={activeParametricFunctions}
          onClose={() => setMode('NORMAL')}
        />
      );
    }

    // Affichage du Catalog
    if (currentMode === 'CATALOG') {
      return (
        <CatalogViewer
          ref={catalogViewerRef}
          onInsert={(text) => {
            appendInput(text);
            setMode('NORMAL');
          }}
          onClose={() => setMode('NORMAL')}
        />
      );
    }

    // Affichage du Solver
    if (currentMode === 'SOLVER') {
      return (
        <SolverEditor
          ref={solverEditorRef}
          onClose={() => setMode('NORMAL')}
        />
      );
    }

    // Affichage du Finance TVM Solver
    if (currentMode === 'FINANCE') {
      return (
        <FinanceEditor
          ref={financeEditorRef}
          onClose={() => setMode('NORMAL')}
        />
      );
    }

    // Affichage de l'éditeur STAT > TESTS (test d'hypothèse / intervalle)
    if (currentMode === 'STAT_TESTS' && selectedTest) {
      return (
        <TestsEditor
          ref={testsEditorRef}
          test={selectedTest}
          onClose={() => { setSelectedTest(null); setMode('NORMAL'); }}
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
          graphMode={config.graphMode}
          plotMode={config.plotMode}
          sequentialMode={config.sequentialMode}
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

    // Si l'éditeur de programmes est ouvert
    if (currentMode === 'PRGM_EDIT') {
      return <ProgramEditor onClose={() => setMode('NORMAL')} />;
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
          graphMode={config.graphMode}
          statPlots={statPlots}
          lists={listsData}
          parametricFunctions={parametricFunctionsData}
          sequenceFunctions={sequenceFunctionsData}
          plotMode={config.plotMode}
          drawElements={drawElements}
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
        graphMode={config.graphMode}
        onHistoryClick={handleHistoryClick}
        onShowFullHistory={() => setIsHistoryModalOpen(true)}
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

      {/* Modal d'historique complet */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        onUseEntry={handleHistoryClick}
        onClearHistory={clearHistory}
      />

      {/* Menu PRGM */}
      {showProgramMenu && (
        <ProgramMenu
          onClose={() => setShowProgramMenu(false)}
          onEdit={() => setMode('PRGM_EDIT')}
        />
      )}
    </div>
  );
};
