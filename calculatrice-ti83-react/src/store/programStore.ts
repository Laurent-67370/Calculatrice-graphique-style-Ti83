/**
 * Store Zustand pour la gestion des programmes TI-BASIC
 * Compatible TI-83 Plus
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  ProgramState,
  ExecutionContext,
  OutputLine,
} from '../types/program.types';
import { ProgramInterpreter } from '../services/ProgramInterpreter';

interface ProgramStore extends ProgramState {
  // Actions pour gérer les programmes
  createProgram: (name: string) => void;
  deleteProgram: (name: string) => void;
  saveProgram: (name: string, lines: string[]) => void;
  setCurrentProgram: (name: string | null) => void;

  // Actions pour l'exécution
  runProgram: (name: string) => void;
  stopProgram: () => void;
  pauseProgram: () => void;
  resumeProgram: () => void;
  stepProgram: () => void;

  // Actions pour le contexte d'exécution
  addOutput: (line: OutputLine) => void;
  clearOutput: () => void;
  setError: (error: string | undefined) => void;
  setWaitingInput: (waiting: boolean, prompt?: string, variable?: string) => void;
  provideInput: (value: number) => void;
  updateVariable: (name: string, value: number) => void;
  clearHomeScreen: () => void;
}

export const useProgramStore = create<ProgramStore>()(
  devtools(
    (set, get) => ({
      // État initial
      programs: {},
      currentProgram: null,
      executingProgram: null,
      executionContext: null,

      // Créer un nouveau programme
      createProgram: (name: string) => {
        // Valider le nom (max 8 caractères, alphanumériques)
        const validName = name.slice(0, 8).toUpperCase();

        set((state) => ({
          programs: {
            ...state.programs,
            [validName]: {
              name: validName,
              lines: [],
              createdAt: new Date(),
              modifiedAt: new Date(),
            },
          },
          currentProgram: validName,
        }));
      },

      // Supprimer un programme
      deleteProgram: (name: string) => {
        set((state) => {
          const { [name]: deleted, ...remainingPrograms } = state.programs;
          return {
            programs: remainingPrograms,
            currentProgram: state.currentProgram === name ? null : state.currentProgram,
          };
        });
      },

      // Sauvegarder les lignes d'un programme
      saveProgram: (name: string, lines: string[]) => {
        set((state) => ({
          programs: {
            ...state.programs,
            [name]: {
              ...state.programs[name],
              lines,
              modifiedAt: new Date(),
            },
          },
        }));
      },

      // Définir le programme en cours d'édition
      setCurrentProgram: (name: string | null) => {
        set({ currentProgram: name });
      },

      // Lancer l'exécution d'un programme
      runProgram: (name: string) => {
        const program = get().programs[name];
        if (!program) {
          console.error(`Programme ${name} introuvable`);
          return;
        }

        // Initialiser le contexte d'exécution
        const context: ExecutionContext = {
          programName: name,
          currentLine: 0,
          variables: {},
          stack: [],
          labels: {},
          forLoops: [],
          whileLoops: [],
          repeatLoops: [],
          ifStack: [],
          isPaused: false,
          isWaitingInput: false,
          output: [],
        };

        set({
          executingProgram: name,
          executionContext: context,
        });

        // Lancer l'exécution avec le ProgramInterpreter
        ProgramInterpreter.executeProgram(
          program.lines,
          context,
          // Callback pour ajouter une ligne de sortie
          (line: OutputLine) => {
            get().addOutput(line);
          },
          // Callback pour effacer l'écran
          () => {
            get().clearOutput();
          },
          // Callback quand le programme est terminé
          () => {
            get().stopProgram();
          },
          // Callback en cas d'erreur
          (error: string) => {
            get().setError(error);
          }
        );
      },

      // Arrêter l'exécution
      stopProgram: () => {
        set({
          executingProgram: null,
          executionContext: null,
        });
      },

      // Mettre en pause
      pauseProgram: () => {
        set((state) => {
          if (!state.executionContext) return state;

          return {
            executionContext: {
              ...state.executionContext,
              isPaused: true,
            },
          };
        });
      },

      // Reprendre l'exécution
      resumeProgram: () => {
        const state = get();
        if (!state.executionContext || !state.executingProgram) return;

        const program = state.programs[state.executingProgram];
        if (!program) return;

        // Désactiver la pause
        set({
          executionContext: {
            ...state.executionContext,
            isPaused: false,
          },
        });

        // Reprendre l'exécution
        const context = get().executionContext;
        if (!context) return;

        ProgramInterpreter.executeProgram(
          program.lines,
          context,
          (line: OutputLine) => {
            get().addOutput(line);
          },
          () => {
            get().clearOutput();
          },
          () => {
            get().stopProgram();
          },
          (error: string) => {
            get().setError(error);
          }
        );
      },

      // Exécuter une ligne (pour debug pas à pas)
      stepProgram: () => {
        // Cette fonction sera implémentée plus tard
        // Elle exécutera une seule ligne et s'arrêtera
        console.log('stepProgram: à implémenter');
      },

      // Ajouter une ligne de sortie
      addOutput: (line: OutputLine) => {
        set((state) => {
          if (!state.executionContext) return state;

          return {
            executionContext: {
              ...state.executionContext,
              output: [...state.executionContext.output, line],
            },
          };
        });
      },

      // Effacer l'écran de sortie
      clearOutput: () => {
        set((state) => {
          if (!state.executionContext) return state;

          return {
            executionContext: {
              ...state.executionContext,
              output: [],
            },
          };
        });
      },

      // Définir une erreur
      setError: (error: string | undefined) => {
        set((state) => {
          if (!state.executionContext) return state;

          return {
            executionContext: {
              ...state.executionContext,
              error,
            },
          };
        });
      },

      // Attendre un input utilisateur
      setWaitingInput: (waiting: boolean, prompt?: string, variable?: string) => {
        set((state) => {
          if (!state.executionContext) return state;

          return {
            executionContext: {
              ...state.executionContext,
              isWaitingInput: waiting,
              inputPrompt: prompt,
              inputVariable: variable,
            },
          };
        });
      },

      // Fournir la valeur d'input
      provideInput: (value: number) => {
        set((state) => {
          if (!state.executionContext || !state.executionContext.inputVariable) {
            return state;
          }

          return {
            executionContext: {
              ...state.executionContext,
              variables: {
                ...state.executionContext.variables,
                [state.executionContext.inputVariable]: value,
              },
              isWaitingInput: false,
              inputPrompt: undefined,
              inputVariable: undefined,
            },
          };
        });
      },

      // Mettre à jour une variable
      updateVariable: (name: string, value: number) => {
        set((state) => {
          if (!state.executionContext) return state;

          return {
            executionContext: {
              ...state.executionContext,
              variables: {
                ...state.executionContext.variables,
                [name]: value,
              },
            },
          };
        });
      },

      // Effacer l'écran d'accueil (ClrHome)
      clearHomeScreen: () => {
        set((state) => {
          if (!state.executionContext) return state;

          return {
            executionContext: {
              ...state.executionContext,
              output: [],
            },
          };
        });
      },
    }),
    { name: 'ProgramStore' }
  )
);
