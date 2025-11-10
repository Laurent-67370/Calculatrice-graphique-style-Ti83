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
import { CatalogViewer, type CatalogViewerHandle } from '../Editors/CatalogViewer';
import { SolverEditor, type SolverEditorHandle } from '../Editors/SolverEditor';
import { FinanceEditor, type FinanceEditorHandle } from '../Editors/FinanceEditor';
import { HelpModal } from '../Help/HelpModal';
import { graphingEngine } from '../../services/GraphingEngine';
import { statisticsService } from '../../services/StatisticsService';
import { mathFunctionsService } from '../../services/MathFunctionsService';
import { statMenuItems, mathMenuItems, zoomMenuItems, calcMenuItems, varsMenuItems, distrMenuItems, testMenuItems, logicMenuItems, listMenuItems, drawMenuItems } from '../../data/menus';
import { createZoomHandlers, createMathHandlers, createStatHandlers, createCalcHandlers, createDistrHandlers, createTestHandlers, createLogicHandlers } from '../../utils/menuHandlers';
import { listHandlers } from '../../utils/listHandlers';
import { createDrawHandlers } from '../../utils/drawHandlers';
import { ListEditor, type ListEditorHandle } from '../Editors/ListEditor';
import { ProgramMenu } from '../Program/ProgramMenu';
import { ProgramEditor } from '../Program/ProgramEditor';
import { ProgramOutput } from '../Program/ProgramOutput';
import { useProgramStore } from '../../store/programStore';
import type { KeyAction, GraphFunction } from '../../types';

// Créer une instance de mathjs avec toutes les fonctions
const math = create(all);

export const Calculator: React.FC = () => {
  // State pour le modal d'aide
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // State pour le menu PRGM
  const [showProgramMenu, setShowProgramMenu] = useState(false);

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
  const catalogViewerRef = useRef<CatalogViewerHandle>(null);
  const solverEditorRef = useRef<SolverEditorHandle>(null);
  const financeEditorRef = useRef<FinanceEditorHandle>(null);

  // State du programme en cours d'exécution
  const { executingProgram } = useProgramStore();

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

      // Gérer DEL (sauf les modes qui ont leur propre gestion)
      if (action === 'del' && currentMode !== 'STAT_EDIT' && currentMode !== 'SOLVER' && currentMode !== 'FINANCE' && currentMode !== 'MATRIX_EDIT' && currentMode !== 'TBLSET') {
        deleteLastChar();
        return;
      }

      // Gérer GRAPH (sauf les modes qui ont leur propre gestion)
      if (action === 'graph' && currentMode !== 'SOLVER' && currentMode !== 'FINANCE') {
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

      // Gérer MATRIX (2ND + X⁻¹)
      if (action === 'matrix') {
        setMode('MATRIX');
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
          const newIndex = action === 'up'
            ? (currentFunction + 5) % 6
            : (currentFunction + 1) % 6;
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
    } else {
      // Mode FUNC par défaut
      return graphFunctions.map((expr, index) => ({
        index,
        expression: expr,
        active: activeFunctions[index],
      }));
    }
  }, [config.graphMode, graphFunctions, activeFunctions, parametricFunctionsX, activeParametricFunctions, polarFunctions, activePolarFunctions]);

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
