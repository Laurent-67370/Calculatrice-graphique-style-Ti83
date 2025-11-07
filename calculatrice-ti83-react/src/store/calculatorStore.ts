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

// Type pour une matrice
export interface Matrix {
  rows: number;
  cols: number;
  data: number[][];
}

// Type pour les variables stockées
export interface StoredVariables {
  [key: string]: number | string;
}

interface CalculatorStore extends CalculatorState {
  // Configuration
  config: CalculatorConfig;

  // Stockage des matrices (A à J)
  matrices: Record<string, Matrix>;

  // Stockage des variables utilisateur
  variables: StoredVariables;

  // État du mode TRACE
  isTraceMode: boolean;
  traceX: number;
  traceFunctionIndex: number;

  // État de l'input
  isInputResult: boolean; // Indique si l'input actuel est un résultat de calcul
  cursorPosition: number; // Position du curseur dans l'input
  lastAnswer: string; // Dernier résultat calculé (pour la touche ANS)

  // Actions pour l'affichage
  setInput: (input: string) => void;
  setInputResult: (input: string) => void; // Marque l'input comme résultat de calcul
  appendInput: (value: string) => void;
  clearInput: () => void;
  deleteLastChar: () => void;
  addToHistory: (entry: string) => void;
  clearHistory: () => void;
  setCursorPosition: (position: number) => void;
  setLastAnswer: (answer: string) => void; // Stocke le dernier résultat

  // Actions pour les matrices
  getMatrix: (name: string) => Matrix;
  setMatrix: (name: string, matrix: Matrix) => void;
  clearMatrix: (name: string) => void;
  clearAllMatrices: () => void;

  // Actions pour les variables
  setVariable: (name: string, value: number | string) => void;
  getVariable: (name: string) => number | string | undefined;
  deleteVariable: (name: string) => void;
  getAllVariables: () => StoredVariables;
  clearAllVariables: () => void;

  // Actions pour les modes
  setMode: (mode: CalculatorMode) => void;
  toggleSecondFunction: () => void;
  toggleAlphaMode: () => void;
  setGraphMode: (isGraph: boolean) => void;
  setTraceMode: (isTrace: boolean) => void;
  setTraceX: (x: number) => void;
  setTraceFunctionIndex: (index: number) => void;

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
  menuStack: any[][]; // Stack de menus pour gérer les sous-menus
  setCurrentMenu: (menu: string | null) => void;
  setMenuSelectedIndex: (index: number) => void;
  navigateMenu: (direction: 'up' | 'down', maxIndex: number) => void;
  enterSubmenu: (submenu: any[]) => void;
  exitSubmenu: () => void;

  // Reset complet
  reset: () => void;
  resetMemory: () => void; // Reset seulement la mémoire (variables + matrices)
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

// Créer une matrice vide
const createEmptyMatrix = (): Matrix => ({
  rows: 3,
  cols: 3,
  data: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
});

// Matrices initiales (A à J)
const initialMatrices: Record<string, Matrix> = {
  A: createEmptyMatrix(),
  B: createEmptyMatrix(),
  C: createEmptyMatrix(),
  D: createEmptyMatrix(),
  E: createEmptyMatrix(),
  F: createEmptyMatrix(),
  G: createEmptyMatrix(),
  H: createEmptyMatrix(),
  I: createEmptyMatrix(),
  J: createEmptyMatrix(),
};

export const useCalculatorStore = create<CalculatorStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      config: initialConfig,

      // État initial des matrices et variables
      matrices: initialMatrices,
      variables: {},

      // État initial du mode TRACE
      isTraceMode: false,
      traceX: 0,
      traceFunctionIndex: 0,

      // État initial de l'input
      isInputResult: false,
      cursorPosition: 1, // Au début, curseur à la fin de "0"
      lastAnswer: '0', // Pas de dernier résultat au démarrage

      // Actions pour l'affichage
      setInput: (input: string) =>
        set({ currentInput: input, isInputResult: false, cursorPosition: input.length }, false, 'setInput'),

      setInputResult: (input: string) =>
        set({ currentInput: input, isInputResult: true, cursorPosition: input.length }, false, 'setInputResult'),

      appendInput: (value: string) =>
        set((state) => {
          // Si l'input actuel est un résultat, remplacer par la nouvelle valeur
          if (state.isInputResult) {
            return {
              currentInput: value,
              isInputResult: false,
              cursorPosition: value.length,
            };
          }

          // Sinon, insérer à la position du curseur
          const before = state.currentInput.slice(0, state.cursorPosition);
          const after = state.currentInput.slice(state.cursorPosition);
          const newInput = state.currentInput === '0' ? value : before + value + after;

          return {
            currentInput: newInput,
            isInputResult: false,
            cursorPosition: state.currentInput === '0' ? value.length : state.cursorPosition + value.length,
          };
        }, false, 'appendInput'),

      deleteLastChar: () =>
        set((state) => {
          if (state.cursorPosition === 0) return state; // Rien à supprimer avant le curseur

          const newInput = state.currentInput.length > 1
            ? state.currentInput.slice(0, state.cursorPosition - 1) + state.currentInput.slice(state.cursorPosition)
            : '0';

          return {
            currentInput: newInput,
            cursorPosition: newInput === '0' ? 1 : Math.max(0, state.cursorPosition - 1),
          };
        }, false, 'deleteLastChar'),

      clearInput: () =>
        set({ currentInput: '0', cursorPosition: 1 }, false, 'clearInput'),

      setCursorPosition: (position: number) =>
        set({ cursorPosition: position }, false, 'setCursorPosition'),

      setLastAnswer: (answer: string) =>
        set({ lastAnswer: answer }, false, 'setLastAnswer'),

      addToHistory: (entry: string) =>
        set((state) => ({
          history: [...state.history, entry].slice(-10), // Garde seulement les 10 derniers
        }), false, 'addToHistory'),

      clearHistory: () =>
        set({ history: [] }, false, 'clearHistory'),

      // Actions pour les matrices
      getMatrix: (name: string) => {
        const state = get();
        return state.matrices[name] || createEmptyMatrix();
      },

      setMatrix: (name: string, matrix: Matrix) =>
        set((state) => ({
          matrices: {
            ...state.matrices,
            [name]: matrix,
          },
        }), false, 'setMatrix'),

      clearMatrix: (name: string) =>
        set((state) => ({
          matrices: {
            ...state.matrices,
            [name]: createEmptyMatrix(),
          },
        }), false, 'clearMatrix'),

      clearAllMatrices: () =>
        set({ matrices: initialMatrices }, false, 'clearAllMatrices'),

      // Actions pour les variables
      setVariable: (name: string, value: number | string) =>
        set((state) => ({
          variables: {
            ...state.variables,
            [name]: value,
          },
        }), false, 'setVariable'),

      getVariable: (name: string) => {
        const state = get();
        return state.variables[name];
      },

      deleteVariable: (name: string) =>
        set((state) => {
          const newVariables = { ...state.variables };
          delete newVariables[name];
          return { variables: newVariables };
        }, false, 'deleteVariable'),

      getAllVariables: () => {
        const state = get();
        return state.variables;
      },

      clearAllVariables: () =>
        set({ variables: {} }, false, 'clearAllVariables'),

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

      setTraceMode: (isTrace: boolean) =>
        set({ isTraceMode: isTrace }, false, 'setTraceMode'),

      setTraceX: (x: number) =>
        set({ traceX: x }, false, 'setTraceX'),

      setTraceFunctionIndex: (index: number) =>
        set({ traceFunctionIndex: index }, false, 'setTraceFunctionIndex'),

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
      menuStack: [],

      setCurrentMenu: (menu: string | null) =>
        set({ currentMenu: menu, menuSelectedIndex: 0, menuStack: [] }, false, 'setCurrentMenu'),

      setMenuSelectedIndex: (index: number) =>
        set({ menuSelectedIndex: index }, false, 'setMenuSelectedIndex'),

      navigateMenu: (direction: 'up' | 'down', maxIndex: number) =>
        set((state) => {
          const newIndex = direction === 'down'
            ? (state.menuSelectedIndex + 1) % maxIndex
            : (state.menuSelectedIndex - 1 + maxIndex) % maxIndex;
          return { menuSelectedIndex: newIndex };
        }, false, 'navigateMenu'),

      enterSubmenu: (submenu: any[]) =>
        set((state) => ({
          menuStack: [...state.menuStack, submenu],
          menuSelectedIndex: 0,
        }), false, 'enterSubmenu'),

      exitSubmenu: () =>
        set((state) => {
          if (state.menuStack.length === 0) {
            // Si on est au niveau racine, fermer le menu
            return { currentMenu: null, menuSelectedIndex: 0 };
          }
          // Sinon, revenir au menu parent
          const newStack = state.menuStack.slice(0, -1);
          return {
            menuStack: newStack,
            menuSelectedIndex: 0,
          };
        }, false, 'exitSubmenu'),

      // Reset mémoire seulement (variables + matrices)
      resetMemory: () =>
        set({
          matrices: initialMatrices,
          variables: {},
          history: [],
        }, false, 'resetMemory'),

      // Reset complet
      reset: () =>
        set({
          ...initialState,
          config: initialConfig,
          currentMenu: null,
          menuSelectedIndex: 0,
          matrices: initialMatrices,
          variables: {},
        }, false, 'reset'),
    }),
    { name: 'TI-83 Calculator' }
  )
);
