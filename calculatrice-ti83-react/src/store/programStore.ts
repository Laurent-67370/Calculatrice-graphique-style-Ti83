/**
 * Store Zustand pour la gestion des programmes TI-BASIC
 * Compatible TI-83 Plus
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
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
  updateInputValue: (value: string) => void;
  clearInputValue: () => void;
  provideInput: (value: number) => void;
  provideMenuSelection: (optionIndex: number) => void;
  updateVariable: (name: string, value: number) => void;
  clearHomeScreen: () => void;

  // Actions pour import/export de fichiers
  exportPrograms: () => string;
  importPrograms: (jsonData: string) => boolean;
}

export const useProgramStore = create<ProgramStore>()(
  persist(
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

        // Préparer les lignes de tous les programmes pour les appels prgm
        const allPrograms = get().programs;
        const programLines: Record<string, string[]> = {};
        Object.keys(allPrograms).forEach(key => {
          programLines[key] = allPrograms[key].lines;
        });

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
          isCompleted: false,
          isWaitingInput: false,
          isWaitingMenu: false,
          output: [],
          programLines, // Ajouter toutes les lignes de programmes
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
            // Marquer le programme comme terminé sans le fermer
            // L'utilisateur pourra voir l'output et fermer manuellement
            const state = get();
            if (state.executionContext) {
              set({
                executionContext: {
                  ...state.executionContext,
                  isCompleted: true,
                },
              });
            }
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
              inputValue: '', // Réinitialiser la valeur d'input
            },
          };
        });
      },

      // Mettre à jour la valeur d'input en cours
      updateInputValue: (value: string) => {
        set((state) => {
          if (!state.executionContext) return state;

          return {
            executionContext: {
              ...state.executionContext,
              inputValue: value,
            },
          };
        });
      },

      // Effacer la valeur d'input
      clearInputValue: () => {
        set((state) => {
          if (!state.executionContext) return state;

          return {
            executionContext: {
              ...state.executionContext,
              inputValue: '',
            },
          };
        });
      },

      // Fournir la valeur d'input
      provideInput: (value: number) => {
        const state = get();
        if (!state.executionContext || !state.executionContext.inputVariable) {
          return;
        }

        const variable = state.executionContext.inputVariable;

        // Affecter la valeur à la variable
        const newVariables = {
          ...state.executionContext.variables,
          [variable]: value,
        };

        // Vérifier s'il y a d'autres variables à demander (Prompt)
        const promptQueue = state.executionContext.promptQueue || [];

        if (promptQueue.length > 0) {
          // Il reste des variables à demander
          const nextVariable = promptQueue[0];
          const remainingQueue = promptQueue.slice(1);

          // Afficher la valeur entrée dans l'output (comme sur TI-83)
          get().addOutput({ type: 'text', content: String(value) });

          set({
            executionContext: {
              ...state.executionContext,
              variables: newVariables,
              inputVariable: nextVariable,
              inputPrompt: `${nextVariable}=?`,
              inputValue: '', // Réinitialiser pour la prochaine saisie
              promptQueue: remainingQueue.length > 0 ? remainingQueue : undefined,
            },
          });

          // Ajouter le prompt suivant à l'output
          get().addOutput({ type: 'text', content: `${nextVariable}=?` });
        } else {
          // Plus de variables à demander, reprendre l'exécution

          // Afficher la valeur entrée dans l'output (comme sur TI-83)
          get().addOutput({ type: 'text', content: String(value) });

          set({
            executionContext: {
              ...state.executionContext,
              variables: newVariables,
              isWaitingInput: false,
              inputPrompt: undefined,
              inputVariable: undefined,
              inputValue: '', // Réinitialiser
              promptQueue: undefined,
            },
          });

          // Passer à la ligne suivante
          const context = get().executionContext;
          if (context && state.executingProgram) {
            const program = state.programs[state.executingProgram];
            if (program) {
              context.currentLine++;

              // Reprendre l'exécution
              ProgramInterpreter.executeProgram(
                program.lines,
                context,
                (line) => {
                  get().addOutput(line);
                },
                () => {
                  get().clearOutput();
                },
                () => {
                  get().stopProgram();
                },
                (error) => {
                  get().setError(error);
                }
              );
            }
          }
        }
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

      // Fournir la sélection de menu
      provideMenuSelection: (optionIndex: number) => {
        const state = get();
        if (!state.executionContext || !state.executionContext.menuOptions) {
          return;
        }

        const options = state.executionContext.menuOptions;

        // Vérifier que l'index est valide
        if (optionIndex < 0 || optionIndex >= options.length) {
          console.error('Index de menu invalide:', optionIndex);
          return;
        }

        const selectedOption = options[optionIndex];
        const targetLabel = selectedOption.targetLabel;

        // Trouver le label correspondant
        const labelLine = state.executionContext.labels[targetLabel];

        if (labelLine === undefined) {
          set({
            executionContext: {
              ...state.executionContext,
              error: `ERR:LABEL ${targetLabel}`,
            },
          });
          return;
        }

        // Mettre à jour le contexte pour aller au label
        set({
          executionContext: {
            ...state.executionContext,
            isWaitingMenu: false,
            menuTitle: undefined,
            menuOptions: undefined,
            currentLine: labelLine,
          },
        });

        // Reprendre l'exécution
        const context = get().executionContext;
        if (context && state.executingProgram) {
          const program = state.programs[state.executingProgram];
          if (program) {
            ProgramInterpreter.executeProgram(
              program.lines,
              context,
              (line) => {
                get().addOutput(line);
              },
              () => {
                get().clearOutput();
              },
              () => {
                get().stopProgram();
              },
              (error) => {
                get().setError(error);
              }
            );
          }
        }
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

      // Exporter les programmes vers JSON
      exportPrograms: () => {
        const state = get();
        const exportData = {
          version: '3.0.0.0',
          exportDate: new Date().toISOString(),
          programs: state.programs,
        };
        return JSON.stringify(exportData, null, 2);
      },

      // Importer des programmes depuis JSON
      importPrograms: (jsonData: string): boolean => {
        try {
          const importData = JSON.parse(jsonData);

          // Valider la structure
          if (!importData.programs || typeof importData.programs !== 'object') {
            console.error('Format de données invalide');
            return false;
          }

          // Merger les programmes importés avec les existants
          set((state) => ({
            programs: {
              ...state.programs,
              ...importData.programs,
            },
          }));

          return true;
        } catch (error) {
          console.error('Erreur lors de l\'import:', error);
          return false;
        }
      },
      }),
      { name: 'ProgramStore' }
    ),
    {
      name: 'ti83-programs-storage',
      // Ne persister que les programmes, pas le contexte d'exécution
      partialize: (state) => ({
        programs: state.programs,
        currentProgram: state.currentProgram,
      }),
    }
  )
);
