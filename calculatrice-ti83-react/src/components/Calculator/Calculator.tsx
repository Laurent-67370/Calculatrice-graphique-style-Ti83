/**
 * Composant principal de la calculatrice TI-83 Plus
 */

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useCalculatorStore } from '../../store/calculatorStore';
import { Display } from './Display';
import { Keyboard } from './Keyboard';
import { GraphCanvas } from '../Graph/GraphCanvas';
import { TraceCanvas } from '../Graph/TraceCanvas';
import { Menu } from '../Menus/Menu';
import { WindowEditor, type WindowEditorHandle } from '../Editors/WindowEditor';
import { ModeEditor, type ModeEditorHandle } from '../Editors/ModeEditor';
import { graphingEngine } from '../../services/GraphingEngine';
import { statisticsService } from '../../services/StatisticsService';
import { mathFunctionsService } from '../../services/MathFunctionsService';
import { statMenuItems, mathMenuItems, zoomMenuItems, calcMenuItems } from '../../data/menus';
import { createZoomHandlers, createMathHandlers, createStatHandlers, createCalcHandlers } from '../../utils/menuHandlers';
import { ListEditor, type ListEditorHandle } from '../Editors/ListEditor';
import type { KeyAction, GraphFunction } from '../../types';

export const Calculator: React.FC = () => {
  // Refs pour contrôler les éditeurs depuis le clavier virtuel
  const windowEditorRef = useRef<WindowEditorHandle>(null);
  const modeEditorRef = useRef<ModeEditorHandle>(null);
  const listEditorRef = useRef<ListEditorHandle>(null);
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
    config,
    setInput,
    appendInput,
    deleteLastChar,
    clearInput,
    addToHistory,
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
    currentMenu,
    menuSelectedIndex,
    setCurrentMenu,
    navigateMenu,
  } = useCalculatorStore();

  // Supprimer warnings pour services importés
  console.log({ graphingEngine, statisticsService, mathFunctionsService });

  // Obtenir les items du menu actuel AVANT handleKeyPress
  const currentMenuItems = useMemo(() => {
    if (currentMenu === 'STAT') return statMenuItems;
    if (currentMenu === 'MATH') return mathMenuItems;
    if (currentMenu === 'ZOOM') return zoomMenuItems;
    if (currentMenu === 'CALC') return calcMenuItems;
    return [];
  }, [currentMenu]);

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
      // Désactiver automatiquement les modes SECOND et ALPHA après cette action
      // (sauf si c'est la touche 2nd ou alpha elle-même)
      const shouldDeactivateModes = action !== '2nd' && action !== 'alpha';
      const wasSecondActive = isSecondFunction;
      const wasAlphaActive = isAlphaMode;

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
          setCurrentMenu(null);
          return;
        }
        if (action === 'enter') {
          // Exécuter l'action du menu sélectionné
          const currentItem = currentMenuItems[menuSelectedIndex];
          if (currentItem) {
            // Déterminer le handler approprié selon le menu
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

      // Gérer CLEAR (sauf en mode WINDOW, MODE, ou STAT_EDIT qui ont leur propre gestion)
      if (action === 'clear' && currentMode !== 'WINDOW' && currentMode !== 'MODE' && currentMode !== 'STAT_EDIT') {
        clearInput();
        setMode('NORMAL');
        setCurrentMenu(null);
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
            action === 'negative') {
          windowEditorRef.current.handleInput(action === 'negative' ? '-' : action);
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
            action === 'negative') {
          listEditorRef.current.handleInput(action === 'negative' ? '-' : action);
          return;
        }
        // Support pour le point décimal
        if (action === 'left-paren') {
          // Sur TI-83, on peut utiliser '.' pour le point décimal, mapper à left-paren temporairement
          listEditorRef.current.handleInput('.');
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

        const operatorMap: Record<string, string> = {
          'add': '+',
          'subtract': '−',
          'multiply': '×',
          'divide': '÷',
          'left-paren': '(',
          'right-paren': ')',
          'left-brace': '{',
          'right-brace': '}',
          'pow': '^',
          'x': 'X',
          'sin': 'sin(',
          'cos': 'cos(',
          'tan': 'tan(',
          'asin': 'asin(',
          'acos': 'acos(',
          'atan': 'atan(',
          'sqrt': '√(',
          'square': '^2',
          'ln': 'ln(',
          'log': 'log(',
          'pi': 'π',
          'exp': 'e',
          'exp-func': 'e^',
          'power10': '10^',
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

      // Désactiver automatiquement le mode SECOND ou ALPHA après utilisation
      if (shouldDeactivateModes) {
        if (wasSecondActive) {
          toggleSecondFunction();
        }
        if (wasAlphaActive) {
          toggleAlphaMode();
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
      appendInput,
      clearInput,
      deleteLastChar,
      setInput,
      addToHistory,
      setMode,
      toggleSecondFunction,
      toggleAlphaMode,
      setGraphMode,
      setTraceMode,
      setTraceX,
      setTraceFunctionIndex,
      setFunctionExpression,
      setCurrentFunction,
      setCurrentMenu,
      setWindowSettings,
      navigateMenu,
      zoomHandlers,
      mathHandlers,
      statHandlers,
      calcHandlers,
      isSecondFunction,
      isAlphaMode,
    ]
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
        handleKeyPress(keyMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress, currentMode]);

  // Préparer les fonctions pour le graphique
  const graphFunctionsData: GraphFunction[] = graphFunctions.map((expr, index) => ({
    index,
    expression: expr,
    active: activeFunctions[index],
  }));

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
      />
    );
  };

  return (
    <div className="ti83-calculator">
      <div className="ti83-body">
        {/* Écran */}
        <div className="ti83-screen">
          {renderScreen()}
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
