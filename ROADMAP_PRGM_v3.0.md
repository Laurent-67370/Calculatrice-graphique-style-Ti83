# 🎯 Roadmap PRGM - Version 3.0.0.0

**Objectif :** Implémenter la programmation TI-BASIC complète  
**Compatibilité cible :** 95% TI-83 Plus  
**Complexité :** Élevée (système d'interprétation complet)

---

## 📋 Fonctionnalités PRGM TI-83 Plus

### Menu PRGM (3 onglets)

#### 1. EXEC - Exécuter un programme
- Liste de tous les programmes créés
- Sélection et exécution
- Affichage pendant l'exécution

#### 2. EDIT - Éditer un programme
- Créer nouveau programme (demande nom)
- Éditer programme existant
- Éditeur de texte ligne par ligne
- Catalogue de commandes accessible

#### 3. NEW - Créer un nouveau programme
- Demande le nom (max 8 caractères)
- Ouvre l'éditeur vide
- Sauvegarde automatique

---

## 🔧 Commandes TI-BASIC à implémenter

### Priorité 1 : Structures de base

| Commande | Syntaxe | Description | Complexité |
|----------|---------|-------------|------------|
| **If** | `If condition` | Début condition | ⭐⭐ |
| **Then** | `Then` | Début bloc si vrai | ⭐ |
| **Else** | `Else` | Bloc sinon | ⭐ |
| **End** | `End` | Fin bloc | ⭐ |
| **For** | `For(var,début,fin[,pas])` | Boucle For | ⭐⭐⭐ |
| **While** | `While condition` | Boucle While | ⭐⭐ |
| **Repeat** | `Repeat condition` | Boucle Repeat-Until | ⭐⭐ |
| **Disp** | `Disp expression` | Afficher | ⭐⭐ |
| **Output** | `Output(ligne,col,texte)` | Afficher position | ⭐⭐ |
| **Input** | `Input "prompt",var` | Demander valeur | ⭐⭐⭐ |
| **Prompt** | `Prompt var` | Demander variable | ⭐⭐ |

### Priorité 2 : Navigation

| Commande | Syntaxe | Description | Complexité |
|----------|---------|-------------|------------|
| **Lbl** | `Lbl nom` | Définir label | ⭐ |
| **Goto** | `Goto nom` | Aller au label | ⭐⭐ |
| **Menu** | `Menu("titre","opt1",lbl1,...)` | Menu interactif | ⭐⭐⭐⭐ |
| **prgm** | `prgm NOM` | Appeler sous-programme | ⭐⭐⭐ |
| **Return** | `Return` | Retour sous-programme | ⭐⭐ |

### Priorité 3 : Contrôle d'exécution

| Commande | Syntaxe | Description | Complexité |
|----------|---------|-------------|------------|
| **Pause** | `Pause [expression]` | Pause avec affichage | ⭐⭐ |
| **Stop** | `Stop` | Arrêter programme | ⭐ |
| **DelVar** | `DelVar variable` | Supprimer variable | ⭐ |
| **ClrHome** | `ClrHome` | Effacer écran texte | ⭐ |
| **ClrList** | `ClrList L1,L2...` | Effacer listes | ⭐ |

### Priorité 4 : Graphiques dans programmes

| Commande | Syntaxe | Description | Complexité |
|----------|---------|-------------|------------|
| **DispGraph** | `DispGraph` | Afficher graphique | ⭐ |
| **DispTable** | `DispTable` | Afficher table | ⭐ |
| **All DRAW** | (déjà implémenté) | Commandes dessin | ✅ |

---

## 🏗️ Architecture technique

### 1. Types TypeScript

```typescript
// types/program.types.ts

export interface Program {
  name: string;
  lines: string[];
  createdAt: Date;
  modifiedAt: Date;
}

export interface ProgramState {
  programs: Record<string, Program>;
  currentProgram: string | null;
  isRunning: boolean;
  executionContext: ExecutionContext | null;
}

export interface ExecutionContext {
  programName: string;
  currentLine: number;
  variables: Record<string, any>;
  stack: StackFrame[];
  labels: Record<string, number>; // nom -> numéro de ligne
  forLoops: ForLoopState[];
  whileLoops: WhileLoopState[];
  isPaused: boolean;
  output: string[];
}

export interface StackFrame {
  programName: string;
  returnLine: number;
}

export interface ForLoopState {
  variable: string;
  current: number;
  end: number;
  step: number;
  startLine: number;
}

export interface WhileLoopState {
  condition: string;
  startLine: number;
}
```

### 2. Store Zustand

```typescript
// store/programStore.ts

interface ProgramStore {
  programs: Record<string, Program>;
  currentProgram: string | null;
  isRunning: boolean;
  executionContext: ExecutionContext | null;
  
  // Actions
  createProgram: (name: string) => void;
  deleteProgram: (name: string) => void;
  saveProgram: (name: string, lines: string[]) => void;
  runProgram: (name: string) => void;
  stopProgram: () => void;
  stepProgram: () => void; // Pour débogage
}
```

### 3. Interpréteur TI-BASIC

```typescript
// services/BasicInterpreter.ts

export class BasicInterpreter {
  private context: ExecutionContext;
  
  constructor(program: Program) {
    this.context = this.initContext(program);
  }
  
  // Exécution
  execute(): void;
  step(): void;
  stop(): void;
  
  // Parser
  private parseLine(line: string): Command;
  
  // Exécuteurs de commandes
  private executeIf(condition: string): void;
  private executeFor(params: ForParams): void;
  private executeWhile(condition: string): void;
  private executeDisp(expression: string): void;
  private executeInput(prompt: string, variable: string): void;
  private executeGoto(label: string): void;
  
  // Évaluation
  private evaluateCondition(condition: string): boolean;
  private evaluateExpression(expr: string): any;
  
  // Navigation
  private findLabel(name: string): number;
  private jumpToLine(lineNum: number): void;
}
```

### 4. Composants React

```typescript
// components/Program/ProgramMenu.tsx
export const ProgramMenu: React.FC = () => {
  // EXEC / EDIT / NEW tabs
  // Liste des programmes
  // Actions (Run, Edit, Delete)
}

// components/Program/ProgramEditor.tsx
export const ProgramEditor: React.FC<{ programName: string }> = () => {
  // Éditeur ligne par ligne
  // Numéros de ligne
  // Catalogue de commandes (2ND + 0)
  // Sauvegarde auto
}

// components/Program/ProgramRunner.tsx
export const ProgramRunner: React.FC = () => {
  // Affichage pendant exécution
  // Gestion Input/Prompt
  // Affichage Disp/Output
  // Boutons Stop/Pause
}
```

---

## 📝 Exemples de programmes TI-BASIC

### Exemple 1 : Hello World
```basic
PROGRAM:HELLO
:Disp "HELLO WORLD"
:Pause
```

### Exemple 2 : Calcul factorielle
```basic
PROGRAM:FACT
:Input "N=",N
:1→F
:For(I,1,N)
:F*I→F
:End
:Disp "N!=",F
```

### Exemple 3 : Menu interactif
```basic
PROGRAM:MENU1
:Menu("CALCULS","AIRE",1,"PERIM",2,"QUIT",3)
:Lbl 1
:Input "RAYON:",R
:πR²→A
:Disp "AIRE=",A
:Stop
:Lbl 2
:Input "RAYON:",R
:2πR→P
:Disp "PERIM=",P
:Stop
:Lbl 3
:Stop
```

### Exemple 4 : Boucle While
```basic
PROGRAM:WHILE
:0→X
:While X<10
:Disp X
:X+1→X
:End
:Disp "FINI"
```

### Exemple 5 : Conditions If/Then/Else
```basic
PROGRAM:NOTE
:Input "NOTE:",N
:If N≥10
:Then
:Disp "ADMIS"
:Else
:Disp "RECALE"
:End
```

---

## 🎯 Plan d'implémentation (étapes)

### Phase 1 : Infrastructure ✅ COMPLÉTÉ
- [x] Créer types TypeScript
- [x] Créer ProgramStore
- [x] Créer ProgramEditor (basique)
- [x] Menu PRGM (NEW/EDIT/EXEC)

### Phase 2 : Interpréteur de base ✅ COMPLÉTÉ
- [x] Parser de lignes
- [x] Évaluateur d'expressions
- [x] Exécuteur séquentiel
- [x] Disp et Output

### Phase 3 : Structures de contrôle ✅ COMPLÉTÉ
- [x] If/Then/Else/End
- [x] For loops
- [x] While loops
- [x] Repeat loops

### Phase 4 : I/O et navigation ✅ COMPLÉTÉ
- [x] Input et Prompt
- [x] Lbl et Goto
- [x] Stop, Pause, Return
- [x] ProgramRunner UI

### Phase 5 : Avancé ✅ COMPLÉTÉ
- [x] Menu interactif
- [x] Appel sous-programmes (prgm)
- [x] DelVar, ClrHome
- [x] Gestion erreurs

### Phase 6 : Tests et polish ✅ COMPLÉTÉ
- [x] Collection de 17 programmes exemples
- [x] Guide utilisateur complet
- [x] Documentation technique détaillée
- [x] Tests Phase 4 et Phase 5

---

## 📊 Impact sur compatibilité

| Catégorie | Avant v3.0 | Après v3.0 | Gain |
|-----------|------------|------------|------|
| **PRGM** | 0% | 80-90% | +80% |
| **Global** | 90% | **95%** | +5% |

---

## 🚧 Défis techniques

### Défi 1 : Parsing TI-BASIC
- Syntaxe unique (pas de parenthèses pour certaines commandes)
- Espaces optionnels
- Symboles spéciaux (→, ≥, ≤, ≠)

**Solution :** Parser ligne par ligne avec regex adaptés

### Défi 2 : Exécution asynchrone
- Input nécessite pause pour saisie utilisateur
- Pause nécessite suspension d'exécution

**Solution :** Async/await avec callbacks pour Input

### Défi 3 : Gestion de stack
- Appels sous-programmes imbriqués
- Retours corrects

**Solution :** Stack explicite de frames

### Défi 4 : Boucles imbriquées
- For dans While dans If
- Track de tous les contextes

**Solution :** Stack de contextes de contrôle

---

## 📚 Ressources

- **TI-BASIC Reference:** Guide officiel TI-83 Plus
- **Examples:** tibasicdev.wikidot.com
- **Parser inspiration:** Implémenter récursivement

---

## ✅ Critères de succès

- [x] Créer un programme simple (Hello World)
- [x] Exécuter boucle For
- [x] Conditions If/Then/Else fonctionnent
- [x] Input demande saisie utilisateur
- [x] Goto/Lbl navigue correctement
- [x] Programmes sauvegardés persistent
- [x] Exemples classiques fonctionnent (factorielle, fibonacci, etc.)
- [x] Appels de sous-programmes avec prgm/Return
- [x] Menus interactifs fonctionnels
- [x] Gestion complète des variables

---

**Temps estimé total :** 15-20 heures  
**Complexité :** Élevée (interpréteur complet)  
**Valeur ajoutée :** Énorme (vraie calculatrice programmable)
