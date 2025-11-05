/**
 * Store Zustand pour la gestion d'état de la calculatrice
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  CalculatorState,
  CalculatorMode,
  CalculatorConfig,
  WindowSettings,
} from '../types';

interface CalculatorStore extends CalculatorState {
  // Configuration
  config: CalculatorConfig;

  // Actions pour l'affichage
  setInput: (input: string) => void;
  appendInput: (value: string) => void;
  clearInput: () => void;
  deleteLastChar: () => void;
  addToHistory: (entry: string) => void;
  clearHistory: () => void;

  // Actions pour les modes
  setMode: (mode: CalculatorMode) => void;
  toggleSecondFunction: () => void;
  toggleAlphaMode: () => void;
  setGraphMode: (isGraph: boolean) => void;

  // Actions pour les fonctions graphiques
  setCurrentFunction: (index: number) => void;
  setFunctionExpression: (index: number, expression: string) => void;
  toggleFunctionActive: (index: number) => void;
  clearFunction: (index: number) => void;
  clearAllFunctions: () => void;

  // Actions pour la fenêtre
  setWindowSettings: (settings: Partial<WindowSettings>) => void;
  resetWindowSettings: () => void;

  // Actions pour l'éditeur
  setCurrentEditor: (editor: string | undefined) => void;
  setEditingField: (field: string | undefined) => void;

  // Actions pour la configuration
  setConfig: (config: Partial<CalculatorConfig>) => void;

  // Actions pour les menus
  currentMenu: string | null;
  menuSelectedIndex: number;
  setCurrentMenu: (menu: string | null) => void;
  setMenuSelectedIndex: (index: number) => void;
  navigateMenu: (direction: 'up' | 'down') => void;

  // Reset complet
  reset: () => void;
}

// Valeurs initiales
const initialWindowSettings: WindowSettings = {
  xMin: -10,
  xMax: 10,
  xScale: 1,
  yMin: -10,
  yMax: 10,
  yScale: 1,
};

const initialConfig: CalculatorConfig = {
  angleMode: 'DEGREE',
  floatMode: 'FLOAT',
  fixedDecimals: 2,
  scientificNotation: false,
  complexMode: 'REAL',
};

const initialState: CalculatorState = {
  currentInput: '0',
  history: [],
  currentMode: 'NORMAL',
  isSecondFunction: false,
  isAlphaMode: false,
  isGraphMode: false,
  currentFunction: 0,
  graphFunctions: ['', '', '', '', '', ''],
  activeFunctions: [false, false, false, false, false, false],
  windowSettings: initialWindowSettings,
  currentEditor: undefined,
  editingField: undefined,
};

export const useCalculatorStore = create<CalculatorStore>()(
  devtools(
    (set) => ({
      ...initialState,
      config: initialConfig,

      // Actions pour l'affichage
      setInput: (input: string) =>
        set({ currentInput: input }, false, 'setInput'),

      appendInput: (value: string) =>
        set((state) => ({
          currentInput: state.currentInput === '0' ? value : state.currentInput + value,
        }), false, 'appendInput'),

      deleteLastChar: () =>
        set((state) => ({
          currentInput: state.currentInput.length > 1
            ? state.currentInput.slice(0, -1)
            : '0',
        }), false, 'deleteLastChar'),

      clearInput: () =>
        set({ currentInput: '0' }, false, 'clearInput'),

      addToHistory: (entry: string) =>
        set((state) => ({
          history: [...state.history, entry].slice(-10), // Garde seulement les 10 derniers
        }), false, 'addToHistory'),

      clearHistory: () =>
        set({ history: [] }, false, 'clearHistory'),

      // Actions pour les modes
      setMode: (mode: CalculatorMode) =>
        set({ currentMode: mode }, false, 'setMode'),

      toggleSecondFunction: () =>
        set((state) => ({
          isSecondFunction: !state.isSecondFunction,
          isAlphaMode: false, // Désactive alpha si actif
        }), false, 'toggleSecondFunction'),

      toggleAlphaMode: () =>
        set((state) => ({
          isAlphaMode: !state.isAlphaMode,
          isSecondFunction: false, // Désactive 2nd si actif
        }), false, 'toggleAlphaMode'),

      setGraphMode: (isGraph: boolean) =>
        set({ isGraphMode: isGraph }, false, 'setGraphMode'),

      // Actions pour les fonctions graphiques
      setCurrentFunction: (index: number) =>
        set({ currentFunction: index }, false, 'setCurrentFunction'),

      setFunctionExpression: (index: number, expression: string) =>
        set((state) => {
          const newFunctions = [...state.graphFunctions];
          const newActive = [...state.activeFunctions];
          newFunctions[index] = expression;
          // Activer automatiquement la fonction si elle a une expression
          newActive[index] = expression.trim() !== '';
          return {
            graphFunctions: newFunctions,
            activeFunctions: newActive,
          };
        }, false, 'setFunctionExpression'),

      toggleFunctionActive: (index: number) =>
        set((state) => {
          const newActive = [...state.activeFunctions];
          newActive[index] = !newActive[index];
          return { activeFunctions: newActive };
        }, false, 'toggleFunctionActive'),

      clearFunction: (index: number) =>
        set((state) => {
          const newFunctions = [...state.graphFunctions];
          const newActive = [...state.activeFunctions];
          newFunctions[index] = '';
          newActive[index] = false;
          return {
            graphFunctions: newFunctions,
            activeFunctions: newActive,
          };
        }, false, 'clearFunction'),

      clearAllFunctions: () =>
        set({
          graphFunctions: ['', '', '', '', '', ''],
          activeFunctions: [false, false, false, false, false, false],
        }, false, 'clearAllFunctions'),

      // Actions pour la fenêtre
      setWindowSettings: (settings: Partial<WindowSettings>) =>
        set((state) => ({
          windowSettings: { ...state.windowSettings, ...settings },
        }), false, 'setWindowSettings'),

      resetWindowSettings: () =>
        set({ windowSettings: initialWindowSettings }, false, 'resetWindowSettings'),

      // Actions pour l'éditeur
      setCurrentEditor: (editor: string | undefined) =>
        set({ currentEditor: editor }, false, 'setCurrentEditor'),

      setEditingField: (field: string | undefined) =>
        set({ editingField: field }, false, 'setEditingField'),

      // Actions pour la configuration
      setConfig: (config: Partial<CalculatorConfig>) =>
        set((state) => ({
          config: { ...state.config, ...config },
        }), false, 'setConfig'),

      // État et actions pour les menus
      currentMenu: null,
      menuSelectedIndex: 0,

      setCurrentMenu: (menu: string | null) =>
        set({ currentMenu: menu, menuSelectedIndex: 0 }, false, 'setCurrentMenu'),

      setMenuSelectedIndex: (index: number) =>
        set({ menuSelectedIndex: index }, false, 'setMenuSelectedIndex'),

      navigateMenu: (direction: 'up' | 'down') =>
        set((state) => {
          const maxIndex = 10; // Sera ajusté dynamiquement selon le menu
          const newIndex = direction === 'down'
            ? (state.menuSelectedIndex + 1) % maxIndex
            : (state.menuSelectedIndex - 1 + maxIndex) % maxIndex;
          return { menuSelectedIndex: newIndex };
        }, false, 'navigateMenu'),

      // Reset complet
      reset: () =>
        set({ ...initialState, config: initialConfig, currentMenu: null, menuSelectedIndex: 0 }, false, 'reset'),
    }),
    { name: 'TI-83 Calculator' }
  )
);
