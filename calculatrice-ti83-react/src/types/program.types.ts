/**
 * Types pour les programmes TI-BASIC
 * Compatible TI-83 Plus
 */

// Programme TI-BASIC
export interface Program {
  name: string;           // Nom du programme (max 8 caractères)
  lines: string[];        // Lignes de code
  createdAt: Date;        // Date de création
  modifiedAt: Date;       // Date de dernière modification
}

// État d'exécution d'un programme
export interface ExecutionContext {
  programName: string;           // Nom du programme en cours
  currentLine: number;           // Ligne en cours d'exécution
  variables: Record<string, number>; // Variables du programme
  stack: StackFrame[];           // Pile d'appels (pour sous-programmes)
  labels: Record<string, number>; // Labels et leurs numéros de ligne
  forLoops: ForLoopState[];      // Stack des boucles For
  whileLoops: WhileLoopState[];  // Stack des boucles While
  repeatLoops: RepeatLoopState[]; // Stack des boucles Repeat
  ifStack: IfState[];            // Stack des conditions If/Then/Else
  isPaused: boolean;             // Programme en pause
  isCompleted: boolean;          // Programme terminé (mais toujours affiché)
  isWaitingInput: boolean;       // Attente d'input utilisateur
  inputPrompt?: string;          // Message d'input en cours
  inputVariable?: string;        // Variable à affecter après input
  inputValue?: string;           // Valeur en cours de saisie
  promptQueue?: string[];        // Queue de variables pour Prompt
  isWaitingMenu: boolean;        // Attente de sélection menu
  menuTitle?: string;            // Titre du menu
  menuOptions?: MenuOption[];    // Options du menu
  output: OutputLine[];          // Lignes de sortie
  error?: string;                // Erreur d'exécution
  gotoLine?: number;             // Ligne de saut (pour Goto et Return)
  allPrograms?: Record<string, Program>; // Tous les programmes disponibles (pour prgm)
  programLines?: Record<string, string[]>; // Lignes de tous les programmes (cache)
  callProgram?: string;          // Nom du programme à appeler (pour prgm)
  lastKeyPressed?: number;       // Code de la dernière touche pressée (pour Getkey)
}

// Frame de la pile d'appels
export interface StackFrame {
  programName: string;    // Programme appelant
  returnLine: number;     // Ligne de retour
  variables: Record<string, number>; // Variables locales
}

// État d'une boucle For
export interface ForLoopState {
  variable: string;       // Variable de boucle
  start: number;          // Valeur initiale
  current: number;        // Valeur actuelle
  end: number;            // Valeur finale
  step: number;           // Pas d'incrémentation
  startLine: number;      // Ligne de début de boucle
  endLine: number;        // Ligne de fin de boucle (End)
}

// État d'une boucle While
export interface WhileLoopState {
  condition: string;      // Condition de boucle
  startLine: number;      // Ligne de début de boucle
}

// État d'une boucle Repeat
export interface RepeatLoopState {
  condition: string;      // Condition de sortie
  startLine: number;      // Ligne de début de boucle
}

// État d'une structure If
export interface IfState {
  hasExecutedThen: boolean;  // Le bloc Then a été exécuté
  hasElse: boolean;          // Il y a un bloc Else
  lineAfterThen?: number;    // Ligne après le Then
  lineElse?: number;         // Ligne du Else
  lineEnd?: number;          // Ligne du End
}

// Ligne de sortie (pour Disp, Output)
export type OutputLine =
  | {
      type: 'text';
      content: string;
    }
  | {
      type: 'positioned';
      content: string;
      row: number;
      col: number;
    };

// Commande parsée
export interface ParsedCommand {
  type: CommandType;
  params?: any;
  line?: number; // Optionnel car le parser peut ne pas connaître le numéro de ligne
}

// Types de commandes TI-BASIC
export type CommandType =
  // Structures de contrôle
  | 'IF'
  | 'THEN'
  | 'ELSE'
  | 'END'
  // Boucles
  | 'FOR'
  | 'WHILE'
  | 'REPEAT'
  // Navigation
  | 'LBL'
  | 'GOTO'
  | 'MENU'
  | 'PRGM'
  | 'RETURN'
  // I/O
  | 'DISP'
  | 'OUTPUT'
  | 'INPUT'
  | 'PROMPT'
  // Contrôle d'exécution
  | 'PAUSE'
  | 'STOP'
  | 'DELVAR'
  | 'GETKEY'
  | 'CLRHOME'
  | 'CLRLIST'
  // Graphiques
  | 'DISPGRAPH'
  | 'DISPTABLE'
  // Affectation
  | 'ASSIGN'
  // Expression simple
  | 'EXPRESSION'
  // Commentaire
  | 'COMMENT';

// Paramètres pour commande For
export interface ForParams {
  variable: string;
  start: number;
  end: number;
  step: number;
}

// Paramètres pour commande Input
export interface InputParams {
  prompt?: string;
  variable: string;
}

// Paramètres pour commande Output
export interface OutputParams {
  row: number;
  col: number;
  value: string;
}

// Paramètres pour commande Menu
export interface MenuParams {
  title: string;
  options: MenuOption[];
}

export interface MenuOption {
  label: string;
  targetLabel: string;
}

// État global des programmes
export interface ProgramState {
  programs: Record<string, Program>;  // Programmes enregistrés
  currentProgram: string | null;      // Programme en cours d'édition
  executingProgram: string | null;    // Programme en cours d'exécution
  executionContext: ExecutionContext | null; // Contexte d'exécution
}
