/**
 * Interpréteur de programmes TI-BASIC
 * Compatible TI-83 Plus
 */

import { create, all } from 'mathjs';
import { mathFunctionsService } from './MathFunctionsService';
import type {
  ParsedCommand,
  ExecutionContext,
  OutputLine,
} from '../types/program.types';

// Créer une instance de mathjs avec toutes les fonctions
const math = create(all);

/**
 * Substitue les variables par leur valeur dans une expression, en préservant
 * le contenu des littéraux chaîne "...".
 *
 * Deux passes quote-aware (via transformOutsideQuotes) :
 *  1. tokens Str1-Str9 (chaînes) → littéral "..." échappé (JSON.stringify).
 *     Fait AVANT la passe mono-caractère pour que le contenu des chaînes
 *     insérées soit protégé par la passe 2.
 *  2. variables mono-caractère A-Z, θ → valeur numérique.
 *
 * @param expr              Expression à traiter
 * @param variables         Map varName → valeur (number | string)
 * @param presentSingleLetterVars  Noms de vars mono-caractère présents dans l'expression
 */
function substituteVariables(
  expr: string,
  variables: Record<string, number | string>,
  presentSingleLetterVars: string[]
): string {
  // Passe 1 : Str1-Str9 (valeurs chaîne) → littéral échappé
  const strNames = Object.keys(variables).filter(
    k => /^Str[1-9]$/.test(k) && typeof variables[k] === 'string'
  );
  if (strNames.length) {
    expr = transformOutsideQuotes(expr, (code) => {
      let out = code;
      for (const name of strNames) {
        const regex = new RegExp(`\\b${name}\\b`, 'g');
        out = out.replace(regex, () => JSON.stringify(String(variables[name])));
      }
      return out;
    });
  }
  // Passe 2 : vars mono-caractère (hors guillemets, y compris ceux insérés en passe 1)
  if (presentSingleLetterVars.length) {
    expr = transformOutsideQuotes(expr, (code) => {
      let out = code;
      for (const varName of presentSingleLetterVars) {
        const value = variables[varName];
        if (value !== undefined) {
          const regex = new RegExp(`\\b${varName}\\b`, 'g');
          out = out.replace(regex, value.toString());
        }
      }
      return out;
    });
  }
  return expr;
}

/**
 * Normalise un nom de variable capturé : majuscule pour les vars mono-caractère
 * (A-Z, θ), forme canonique "StrN" pour les variables chaîne.
 */
function normVar(v: string): string {
  const trimmed = v.trim();
  if (/^str[1-9]$/i.test(trimmed)) {
    return 'Str' + trimmed.slice(-1);
  }
  return trimmed.toUpperCase();
}

/**
 * Applique `fn` aux segments de code hors guillemets (littéraux chaîne "..."
 * préservés intacts). Utilisé pour la substitution de variables sans corrompre
 * le contenu des chaînes.
 */
function transformOutsideQuotes(expr: string, fn: (code: string) => string): string {
  let result = '';
  let buf = '';
  let inStr = false;
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === '"') {
      if (!inStr) {
        result += fn(buf) + '"';
        buf = '';
        inStr = true;
      } else {
        result += buf + '"';
        buf = '';
        inStr = false;
      }
    } else {
      buf += ch;
    }
  }
  result += inStr ? buf : fn(buf);
  return result;
}

/**
 * Réécrit les tokens ANGLE TI (caractères non-identifiants ►/→/°) en noms
 * de fonctions mathjs. Doit être appelé avant math.evaluate().
 */
function rewriteAngleTokens(expr: string): string {
  return expr
    .replace(/R►Pr\(/g, 'rToP_r(')
    .replace(/R►Pθ\(/g, 'rToP_theta(')
    .replace(/P►Rx\(/g, 'pToR_x(')
    .replace(/P►Ry\(/g, 'pToR_y(')
    .replace(/°→rad\(/g, 'degToRad(')
    .replace(/rad→°\(/g, 'radToDeg(')
    .replace(/→DMS\(/g, 'toDMS(')
    .replace(/→Dec\(/g, 'toDec(');
}

// Importer les fonctions chaîne + ANGLE sur l'instance mathjs partagée par
// l'interpréteur (qui n'utilise pas de scope). Mode d'angle par défaut :
// DEGREE (cohérent avec le mode par défaut de l'application).
const _toRad = (a: number) => a * (Math.PI / 180);
const _toDeg = (a: number) => a * (180 / Math.PI);
math.import({
  // Fonctions chaîne TI-BASIC
  length: (s: string) => String(s).length,
  sub: (s: string, start: number, len: number) => String(s).substr(Math.max(0, Math.floor(start) - 1), Math.max(0, Math.floor(len))),
  inString: (s: string, needle: string, start: number = 1) => {
    const idx = String(s).indexOf(String(needle), Math.max(0, Math.floor(start) - 1));
    return idx < 0 ? 0 : idx + 1;
  },
  expr: (s: string) => math.evaluate(String(s)),
  // Fonctions NUM TI-83 (iPart = troncature, int = greatest integer, fPart = signe préservé)
  iPart: mathFunctionsService.iPart,
  int: mathFunctionsService.int,
  fPart: mathFunctionsService.fPart,
  // Fonctions ANGLE
  rToP_r: (x: number, y: number) => Math.hypot(x, y),
  rToP_theta: (x: number, y: number) => _toDeg(Math.atan2(y, x)),
  pToR_x: (r: number, t: number) => r * Math.cos(_toRad(t)),
  pToR_y: (r: number, t: number) => r * Math.sin(_toRad(t)),
  degToRad: (d: number) => _toRad(d),
  radToDeg: (r: number) => _toDeg(r),
  toDMS: (deg: number) => {
    const sign = deg < 0 ? '-' : '';
    const abs = Math.abs(deg);
    const D = Math.floor(abs);
    const minF = (abs - D) * 60;
    const M = Math.floor(minF);
    const S = Math.round((minF - M) * 60);
    return `${sign}${D}°${M}'${S}"`;
  },
  toDec: (x: number | string) => {
    if (typeof x === 'string') {
      const m = x.match(/^(-?\d+)°(\d+)'(\d+(?:\.\d+)?)"$/);
      if (m) {
        const sign = m[1].startsWith('-') ? -1 : 1;
        return sign * (Math.abs(Number(m[1])) + Number(m[2]) / 60 + Number(m[3]) / 3600);
      }
      return Number(x);
    }
    return Math.round(x * 1e10) / 1e10;
  },
}, { override: true });

/**
 * Service d'interprétation de programmes TI-BASIC
 */
export class ProgramInterpreter {
  /**
   * Tampon clavier non bloquant pour getKey.
   * Contient le code (style TI-BASIC, ligne×10+colonne) de la dernière
   * touche pressée, ou 0 si aucune. La lecture par getKey le remet à 0.
   */
  static lastKeyCode = 0;

  /**
   * Enregistre une touche pressée pendant l'exécution d'un programme.
   * Appelé par le clavier de la calculatrice (Calculator.tsx) lorsqu'un
   * programme tourne et n'attend ni Input ni Menu.
   */
  static pushKey(code: number): void {
    this.lastKeyCode = code;
  }

  /**
   * Vide le tampon clavier (au démarrage d'un programme).
   */
  static resetKeyBuffer(): void {
    this.lastKeyCode = 0;
  }

  /**
   * Parser une ligne de code TI-BASIC
   */
  static parseLine(line: string): ParsedCommand | null {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      return null; // Ligne vide
    }

    // Commentaire (commence par #)
    if (trimmedLine.startsWith('#')) {
      return {
        type: 'COMMENT',
        params: {},
      };
    }

    // Disp [expr1,expr2,...]
    const dispMatch = trimmedLine.match(/^Disp\s+(.+)$/i);
    if (dispMatch) {
      const expressions = dispMatch[1].split(',').map(e => e.trim());
      return {
        type: 'DISP',
        params: { expressions },
      };
    }

    // Disp (sans argument - ligne vide)
    if (trimmedLine.match(/^Disp$/i)) {
      return {
        type: 'DISP',
        params: { expressions: [] },
      };
    }

    // Output(row,col,value)
    const outputMatch = trimmedLine.match(/^Output\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(.+)\s*\)$/i);
    if (outputMatch) {
      return {
        type: 'OUTPUT',
        params: {
          row: parseInt(outputMatch[1]),
          col: parseInt(outputMatch[2]),
          value: outputMatch[3].trim(),
        },
      };
    }

    // ClrHome
    if (trimmedLine.match(/^ClrHome$/i)) {
      return {
        type: 'CLRHOME',
        params: {},
      };
    }

    // Assignment: variable→valeur ou valeur→variable
    const assignMatch = trimmedLine.match(/^(.+?)\s*→\s*([A-Zθ]|Str[1-9])$/i);
    if (assignMatch) {
      return {
        type: 'ASSIGN',
        params: {
          variable: normVar(assignMatch[2]),
          expression: assignMatch[1].trim(),
        },
      };
    }

    // Pause [expr]
    const pauseMatch = trimmedLine.match(/^Pause(?:\s+(.+))?$/i);
    if (pauseMatch) {
      return {
        type: 'PAUSE',
        params: {
          message: pauseMatch[1]?.trim(),
        },
      };
    }

    // Stop
    if (trimmedLine.match(/^Stop$/i)) {
      return {
        type: 'STOP',
        params: {},
      };
    }

    // If condition
    const ifMatch = trimmedLine.match(/^If\s+(.+)$/i);
    if (ifMatch) {
      return {
        type: 'IF',
        params: {
          condition: ifMatch[1].trim(),
        },
      };
    }

    // Then
    if (trimmedLine.match(/^Then$/i)) {
      return {
        type: 'THEN',
        params: {},
      };
    }

    // Else
    if (trimmedLine.match(/^Else$/i)) {
      return {
        type: 'ELSE',
        params: {},
      };
    }

    // For(variable,start,end[,step])
    const forMatch = trimmedLine.match(/^For\s*\(\s*([A-Z])\s*,\s*(.+?)\s*,\s*(.+?)(?:\s*,\s*(.+?))?\s*\)$/i);
    if (forMatch) {
      return {
        type: 'FOR',
        params: {
          variable: forMatch[1].toUpperCase(),
          start: forMatch[2].trim(),
          end: forMatch[3].trim(),
          step: forMatch[4]?.trim() || '1',
        },
      };
    }

    // While condition
    const whileMatch = trimmedLine.match(/^While\s+(.+)$/i);
    if (whileMatch) {
      return {
        type: 'WHILE',
        params: {
          condition: whileMatch[1].trim(),
        },
      };
    }

    // Repeat condition
    const repeatMatch = trimmedLine.match(/^Repeat\s+(.+)$/i);
    if (repeatMatch) {
      return {
        type: 'REPEAT',
        params: {
          condition: repeatMatch[1].trim(),
        },
      };
    }

    // Input "prompt",variable ou Input variable
    const inputMatch = trimmedLine.match(/^Input\s+(?:"(.+?)"\s*,\s*)?([A-Zθ]|Str[1-9])$/i);
    if (inputMatch) {
      return {
        type: 'INPUT',
        params: {
          prompt: inputMatch[1]?.trim(),
          variable: normVar(inputMatch[2]),
        },
      };
    }

    // Prompt variable1,variable2,...
    const promptMatch = trimmedLine.match(/^Prompt\s+(.+)$/i);
    if (promptMatch) {
      const variables = promptMatch[1].split(',').map(v => normVar(v));
      return {
        type: 'PROMPT',
        params: {
          variables,
        },
      };
    }

    // Lbl nom
    const lblMatch = trimmedLine.match(/^Lbl\s+([A-Z0-9θ]+)$/i);
    if (lblMatch) {
      return {
        type: 'LBL',
        params: {
          name: lblMatch[1].toUpperCase(),
        },
      };
    }

    // Goto nom
    const gotoMatch = trimmedLine.match(/^Goto\s+([A-Z0-9θ]+)$/i);
    if (gotoMatch) {
      return {
        type: 'GOTO',
        params: {
          label: gotoMatch[1].toUpperCase(),
        },
      };
    }

    // Return
    if (trimmedLine.match(/^Return$/i)) {
      return {
        type: 'RETURN',
        params: {},
      };
    }

    // DelVar variable
    const delVarMatch = trimmedLine.match(/^DelVar\s+([A-Zθ]|Str[1-9])$/i);
    if (delVarMatch) {
      return {
        type: 'DELVAR',
        params: {
          variable: normVar(delVarMatch[1]),
        },
      };
    }

    // getKey (retourne le code de la touche pressée)
    if (trimmedLine.match(/^getKey$/i)) {
      return {
        type: 'GETKEY',
        params: {},
      };
    }

    // ClrList L1,L2,...
    const clrListMatch = trimmedLine.match(/^ClrList\s+(.+)$/i);
    if (clrListMatch) {
      const lists = clrListMatch[1].split(',').map(l => l.trim());
      return {
        type: 'CLRLIST',
        params: {
          lists,
        },
      };
    }

    // prgm NOM
    const prgmMatch = trimmedLine.match(/^prgm\s+([A-Z0-9]+)$/i);
    if (prgmMatch) {
      return {
        type: 'PRGM',
        params: {
          programName: prgmMatch[1].toUpperCase(),
        },
      };
    }

    // Menu("titre","opt1",lbl1,"opt2",lbl2,...)
    const menuMatch = trimmedLine.match(/^Menu\s*\((.+)\)$/i);
    if (menuMatch) {
      // Parser les paramètres du menu
      const paramsStr = menuMatch[1];
      const params: string[] = [];

      let current = '';
      let inQuotes = false;
      let depth = 0;

      for (let i = 0; i < paramsStr.length; i++) {
        const char = paramsStr[i];

        if (char === '"') {
          inQuotes = !inQuotes;
          current += char;
        } else if (char === '(' && !inQuotes) {
          depth++;
          current += char;
        } else if (char === ')' && !inQuotes) {
          depth--;
          current += char;
        } else if (char === ',' && !inQuotes && depth === 0) {
          params.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }

      if (current.trim()) {
        params.push(current.trim());
      }

      // Extraire le titre et les options
      if (params.length < 3 || params.length % 2 === 0) {
        console.error('Menu: nombre de paramètres invalide');
        return null;
      }

      const title = params[0].replace(/^"|"$/g, ''); // Enlever les guillemets
      const options: { label: string; targetLabel: string }[] = [];

      for (let i = 1; i < params.length; i += 2) {
        const optionLabel = params[i].replace(/^"|"$/g, '');
        const targetLabel = params[i + 1];
        options.push({ label: optionLabel, targetLabel });
      }

      return {
        type: 'MENU',
        params: {
          title,
          options,
        },
      };
    }

    // End
    if (trimmedLine.match(/^End$/i)) {
      return {
        type: 'END',
        params: {},
      };
    }

    // Commande non reconnue
    console.warn(`Commande non reconnue: ${trimmedLine}`);
    return null;
  }

  /**
   * Évaluer une expression mathématique
   */
  static evaluateExpression(
    expr: string,
    context: ExecutionContext
  ): number | string {
    try {
      // Si l'expression est entre guillemets, c'est une chaîne :
      // la retourner telle quelle, SANS substituer les variables
      // (sinon "ENTREZ N" avec N=5 deviendrait "ENTREZ 5").
      const stringMatch = expr.match(/^"(.+)"$/);
      if (stringMatch) {
        return stringMatch[1]; // Retourner la chaîne sans guillemets
      }

      // getKey : renvoie le code (TI-BASIC) de la dernière touche pressée,
      // 0 si aucune, puis remet le tampon à zéro (la lecture consomme).
      // À traiter AVANT la substitution des variables (sinon le 'K' de
      // "getKey" serait vu comme une variable).
      if (/getKey/i.test(expr)) {
        const code = ProgramInterpreter.lastKeyCode;
        ProgramInterpreter.lastKeyCode = 0;
        expr = expr.replace(/getKey/gi, String(code));
      }

      // Remplacer les variables par leurs valeurs (Str1-Str9 puis A-Z/θ)
      // en préservant le contenu des littéraux chaîne "..."
      const varMatches = expr.match(/[A-Zθ]/g);
      let processedExpr = substituteVariables(expr, context.variables, varMatches || []);

      // Réécrire les tokens ANGLE TI (►/→/°) en identifiants mathjs
      processedExpr = rewriteAngleTokens(processedExpr);

      // Sinon, évaluer l'expression mathématique
      const result = math.evaluate(processedExpr);

      if (typeof result === 'number') {
        return result;
      } else if (typeof result === 'string') {
        return result;
      } else {
        return String(result);
      }
    } catch (error) {
      console.error('Erreur évaluation expression:', expr, error);
      throw new Error(`Erreur d'expression: ${expr}`);
    }
  }

  /**
   * Évaluer une condition booléenne
   */
  static evaluateCondition(
    condition: string,
    context: ExecutionContext
  ): boolean {
    try {
      // Remplacer les variables par leurs valeurs
      let processedCondition = condition;

      // getKey dans une condition (ex. Repeat getKey) : code de la dernière
      // touche, puis reset. À faire avant la substitution des variables.
      if (/getKey/i.test(processedCondition)) {
        const code = ProgramInterpreter.lastKeyCode;
        ProgramInterpreter.lastKeyCode = 0;
        processedCondition = processedCondition.replace(/getKey/gi, String(code));
      }

      // Remplacer les variables A-Z et θ (en préservant les littéraux chaîne)
      const varMatches = condition.match(/[A-Zθ]/g);
      processedCondition = substituteVariables(processedCondition, context.variables, varMatches || []);

      // Réécrire les tokens ANGLE TI (►/→/°) en identifiants mathjs
      processedCondition = rewriteAngleTokens(processedCondition);

      // Convertir les opérateurs de comparaison TI-BASIC vers la syntaxe mathjs :
      //  - '=' est l'égalité en TI-BASIC (mathjs l'interprète sinon comme une assignation)
      //  - les caractères Unicode ≠ ≥ ≤ ne sont pas reconnus par mathjs
      processedCondition = processedCondition
        .replace(/≠/g, '!=')
        .replace(/≥/g, '>=')
        .replace(/≤/g, '<=')
        .replace(/(?<![<>=!])=(?!=)/g, '==');

      // Évaluer l'expression booléenne
      const result = math.evaluate(processedCondition);

      // Convertir en booléen (0 = false, non-zéro = true)
      if (typeof result === 'number') {
        return result !== 0;
      } else if (typeof result === 'boolean') {
        return result;
      } else {
        return Boolean(result);
      }
    } catch (error) {
      console.error('Erreur évaluation condition:', condition, error);
      throw new Error(`Erreur de condition: ${condition}`);
    }
  }

  /**
   * Index du premier ':' non inclus dans une chaîne entre guillemets.
   * Sert à séparer "If cond:commande" sans couper les ':' à l'intérieur d'une
   * chaîne littérale (ex: If X=3:Disp "A:B").
   * Retourne -1 s'il n'y en a aucun.
   */
  static indexOfColonOutsideQuotes(s: string): number {
    let inQuote = false;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === '"') {
        inQuote = !inQuote;
      } else if (c === ':' && !inQuote) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Scanner tous les labels dans un programme
   */
  static scanLabels(lines: string[]): Record<string, number> {
    const labels: Record<string, number> = {};

    for (let i = 0; i < lines.length; i++) {
      const command = this.parseLine(lines[i]);
      if (command?.type === 'LBL') {
        const labelName = command.params.name as string;
        labels[labelName] = i;
      }
    }

    return labels;
  }

  /**
   * Exécuter une commande
   */
  static executeCommand(
    command: ParsedCommand,
    context: ExecutionContext,
    onOutput: (line: OutputLine) => void,
    onClearScreen: () => void
  ): void {
    switch (command.type) {
      case 'DISP': {
        const expressions = command.params.expressions as string[];

        if (expressions.length === 0) {
          // Disp sans argument = ligne vide
          onOutput({ type: 'text', content: '' });
        } else {
          // Afficher chaque expression
          for (const expr of expressions) {
            try {
              const value = this.evaluateExpression(expr, context);
              onOutput({ type: 'text', content: String(value) });
            } catch (error) {
              onOutput({ type: 'text', content: 'ERR:SYNTAX' });
            }
          }
        }
        break;
      }

      case 'OUTPUT': {
        const row = command.params.row as number;
        const col = command.params.col as number;
        const valueExpr = command.params.value as string;

        try {
          const value = this.evaluateExpression(valueExpr, context);
          onOutput({
            type: 'positioned',
            content: String(value),
            row,
            col,
          });
        } catch (error) {
          onOutput({ type: 'text', content: 'ERR:SYNTAX' });
        }
        break;
      }

      case 'CLRHOME': {
        onClearScreen();
        break;
      }

      case 'ASSIGN': {
        const variable = command.params.variable as string;
        const expression = command.params.expression as string;

        try {
          const value = this.evaluateExpression(expression, context);
          // Conserver les chaînes (Str1-Str9) ; coercer numérique sinon.
          context.variables[variable] = typeof value === 'string' ? value : Number(value);
        } catch (error) {
          throw new Error('ERR:SYNTAX');
        }
        break;
      }

      case 'PAUSE': {
        context.isPaused = true;
        const message = command.params.message as string | undefined;

        if (message) {
          try {
            const value = this.evaluateExpression(message, context);
            onOutput({ type: 'text', content: String(value) });
          } catch (error) {
            onOutput({ type: 'text', content: 'ERR:SYNTAX' });
          }
        }
        break;
      }

      case 'INPUT': {
        const prompt = command.params.prompt as string | undefined;
        const variable = command.params.variable as string;

        // Afficher le prompt s'il existe
        if (prompt) {
          onOutput({ type: 'text', content: prompt });
        }

        // Mettre le programme en attente d'input
        context.isWaitingInput = true;
        context.inputVariable = variable;
        context.inputPrompt = prompt || `${variable}=?`;
        break;
      }

      case 'PROMPT': {
        const variables = command.params.variables as string[];

        // Prompt demande la première variable de la liste
        if (variables.length > 0) {
          const variable = variables[0];
          onOutput({ type: 'text', content: `${variable}=?` });

          context.isWaitingInput = true;
          context.inputVariable = variable;
          context.inputPrompt = `${variable}=?`;

          // Stocker les variables restantes pour les demander après
          if (variables.length > 1) {
            context.promptQueue = variables.slice(1);
          }
        }
        break;
      }

      case 'STOP': {
        // Arrêter l'exécution
        context.error = 'STOP';
        break;
      }

      case 'LBL': {
        // Les labels sont déjà scannés au début, ne rien faire à l'exécution
        break;
      }

      case 'GOTO': {
        const label = command.params.label as string;
        const lineNumber = context.labels[label];

        if (lineNumber === undefined) {
          throw new Error(`ERR:LABEL ${label}`);
        }

        // Marquer qu'on doit sauter à cette ligne
        // (la ligne sera changée dans executeProgram)
        context.gotoLine = lineNumber;
        break;
      }

      case 'RETURN': {
        // Retourner d'un sous-programme
        if (context.stack.length === 0) {
          // Pas de sous-programme, arrêter le programme
          context.error = 'STOP';
        } else {
          // Dépiler la frame et retourner à la ligne de retour
          const frame = context.stack.pop()!;
          context.gotoLine = frame.returnLine;
          // Restaurer les variables (optionnel selon le comportement souhaité)
          // Sur TI-83, les variables sont globales, donc on ne restaure pas
        }
        break;
      }

      case 'DELVAR': {
        const variable = command.params.variable as string;
        // Supprimer la variable du contexte
        delete context.variables[variable];
        break;
      }

      case 'GETKEY': {
        // getKey utilisé seul sur une ligne : idiome TI-BASIC pour vider
        // le tampon clavier (ex. avant une boucle d'attente). La forme
        // usuelle « getKey→K » passe, elle, par evaluateExpression (ASSIGN).
        ProgramInterpreter.lastKeyCode = 0;
        break;
      }

      case 'CLRLIST': {
        // ClrList sera géré plus tard avec l'intégration complète des listes
        // Pour l'instant, on ne fait rien (les listes sont gérées ailleurs)
        console.log('ClrList: à implémenter avec le système de listes');
        break;
      }

      case 'PRGM': {
        const programName = command.params.programName as string;

        // Vérifier que le programme existe
        if (!context.programLines || !context.programLines[programName]) {
          throw new Error(`ERR:UNDEFINED ${programName}`);
        }

        // Marquer qu'on doit appeler un sous-programme
        context.callProgram = programName;
        break;
      }

      case 'MENU': {
        const title = command.params.title as string;
        const options = command.params.options as { label: string; targetLabel: string }[];

        // Afficher le titre du menu
        onOutput({ type: 'text', content: title });
        onOutput({ type: 'text', content: '' }); // Ligne vide

        // Afficher les options
        options.forEach((option, index) => {
          onOutput({ type: 'text', content: `${index + 1}:${option.label}` });
        });

        // Marquer qu'on attend une sélection de menu
        context.isWaitingMenu = true;
        context.menuTitle = title;
        context.menuOptions = options;
        break;
      }

      case 'COMMENT':
      case 'END':
        // Ne rien faire
        break;

      default:
        console.warn('Commande non implémentée:', command.type);
    }
  }

  /**
   * Exécuter une ligne de programme
   */
  static executeLine(
    line: string,
    context: ExecutionContext,
    onOutput: (line: OutputLine) => void,
    onClearScreen: () => void
  ): void {
    const command = this.parseLine(line);

    if (command) {
      this.executeCommand(command, context, onOutput, onClearScreen);
    }
  }

  /**
   * Trouver le End correspondant à une structure de contrôle
   */
  static findMatchingEnd(
    lines: string[],
    startLine: number
  ): number {
    let depth = 1;

    for (let i = startLine + 1; i < lines.length; i++) {
      const command = this.parseLine(lines[i]);
      if (!command) continue;

      // Structures qui ouvrent un bloc
      if (command.type === 'IF' || command.type === 'FOR' ||
          command.type === 'WHILE' || command.type === 'REPEAT') {
        depth++;
      }
      // Then ne compte pas comme ouverture (fait partie de If)
      else if (command.type === 'END') {
        depth--;
        if (depth === 0) {
          return i;
        }
      }
    }

    throw new Error('ERR:NO END');
  }

  /**
   * Trouver le Then correspondant à un If
   */
  static findThen(lines: string[], ifLine: number): number {
    if (ifLine + 1 >= lines.length) return -1; // If sur la dernière ligne
    const command = this.parseLine(lines[ifLine + 1]);
    if (command?.type === 'THEN') {
      return ifLine + 1;
    }
    return -1; // If sur une seule ligne
  }

  /**
   * Trouver le Else dans un bloc If/Then
   */
  static findElse(lines: string[], ifLine: number, endLine: number): number {
    let depth = 0;

    for (let i = ifLine + 1; i < endLine; i++) {
      const command = this.parseLine(lines[i]);
      if (!command) continue;

      if (command.type === 'IF' || command.type === 'FOR' ||
          command.type === 'WHILE' || command.type === 'REPEAT') {
        depth++;
      } else if (command.type === 'END') {
        depth--;
      } else if (command.type === 'ELSE' && depth === 0) {
        return i;
      }
    }

    return -1; // Pas de Else
  }

  /**
   * Exécuter un programme complet
   */
  static async executeProgram(
    lines: string[],
    context: ExecutionContext,
    onOutput: (line: OutputLine) => void,
    onClearScreen: () => void,
    onComplete: () => void,
    onError: (error: string) => void
  ): Promise<void> {
    try {
      // Scanner les labels au début du programme (si pas déjà fait)
      if (Object.keys(context.labels).length === 0) {
        context.labels = this.scanLabels(lines);
      }

      while (context.currentLine < lines.length) {
        // Vérifier si le programme est en pause
        if (context.isPaused) {
          break;
        }

        // Vérifier si le programme attend un input
        if (context.isWaitingInput) {
          break;
        }

        // Vérifier si le programme attend une sélection de menu
        if (context.isWaitingMenu) {
          break;
        }

        // Vérifier si le programme est arrêté
        if (context.error === 'STOP') {
          onComplete();
          return;
        }

        const line = lines[context.currentLine];
        const command = this.parseLine(line);

        if (!command) {
          context.currentLine++;
          continue;
        }

        // Gérer les structures de contrôle
        if (command.type === 'IF') {
          const rawCondition = command.params.condition as string;
          const thenLine = this.findThen(lines, context.currentLine);

          if (thenLine === -1) {
            // If mono-ligne : soit "If cond" (commande sur la ligne suivante),
            // soit "If cond:commande" (commande sur la même ligne, séparateur ':')
            let condition = rawCondition;
            let inlineCommand: string | null = null;
            const colonIdx = this.indexOfColonOutsideQuotes(condition);
            if (colonIdx !== -1) {
              inlineCommand = condition.substring(colonIdx + 1).trim();
              condition = condition.substring(0, colonIdx).trim();
            }
            const conditionResult = this.evaluateCondition(condition, context);
            if (conditionResult) {
              if (inlineCommand !== null) {
                this.executeLine(inlineCommand, context, onOutput, onClearScreen);
              }
              // avancer après la ligne If (et sa commande inline éventuelle)
              context.currentLine++;
            } else {
              // condition fausse : sauter la commande (ligne suivante, ou inline sur la même ligne)
              context.currentLine += inlineCommand !== null ? 1 : 2;
            }
          } else {
            // If/Then/End (multilignes)
            const conditionResult = this.evaluateCondition(rawCondition, context);
            const endLine = this.findMatchingEnd(lines, context.currentLine);
            const elseLine = this.findElse(lines, context.currentLine, endLine);

            if (conditionResult) {
              // Exécuter le bloc Then
              context.currentLine = thenLine + 1;
            } else if (elseLine !== -1) {
              // Exécuter le bloc Else
              context.currentLine = elseLine + 1;
            } else {
              // Pas de Else, sauter au End
              context.currentLine = endLine + 1;
            }
          }
          continue;
        }

        if (command.type === 'ELSE') {
          // On est dans un Else après un Then exécuté, sauter au End
          const endLine = this.findMatchingEnd(lines, context.currentLine - 1);
          context.currentLine = endLine + 1;
          continue;
        }

        if (command.type === 'FOR') {
          const variable = command.params.variable as string;
          const startExpr = command.params.start as string;
          const endExpr = command.params.end as string;
          const stepExpr = command.params.step as string;

          const startVal = Number(this.evaluateExpression(startExpr, context));
          const endVal = Number(this.evaluateExpression(endExpr, context));
          const stepVal = Number(this.evaluateExpression(stepExpr, context));

          const endLine = this.findMatchingEnd(lines, context.currentLine);

          // Ajouter la boucle au stack
          context.forLoops.push({
            variable,
            start: startVal,
            end: endVal,
            step: stepVal,
            current: startVal,
            startLine: context.currentLine,
            endLine,
          });

          // Initialiser la variable
          context.variables[variable] = startVal;

          // Passer à la première ligne du corps de la boucle
          context.currentLine++;
          continue;
        }

        if (command.type === 'END') {
          // Vérifier s'il y a une boucle For active
          if (context.forLoops.length > 0) {
            const loop = context.forLoops[context.forLoops.length - 1];

            // Incrémenter le compteur
            loop.current += loop.step;
            context.variables[loop.variable] = loop.current;

            // Vérifier la condition de continuation
            const shouldContinue = loop.step > 0
              ? loop.current <= loop.end
              : loop.current >= loop.end;

            if (shouldContinue) {
              // Revenir au début de la boucle
              context.currentLine = loop.startLine + 1;
            } else {
              // Sortir de la boucle
              context.forLoops.pop();
              context.currentLine++;
            }
            continue;
          }

          // Vérifier s'il y a une boucle While active
          if (context.whileLoops.length > 0) {
            const loop = context.whileLoops[context.whileLoops.length - 1];
            const conditionResult = this.evaluateCondition(loop.condition, context);

            if (conditionResult) {
              // Revenir au début de la boucle
              context.currentLine = loop.startLine + 1;
            } else {
              // Sortir de la boucle
              context.whileLoops.pop();
              context.currentLine++;
            }
            continue;
          }

          // Vérifier s'il y a une boucle Repeat active
          if (context.repeatLoops.length > 0) {
            const loop = context.repeatLoops[context.repeatLoops.length - 1];
            const conditionResult = this.evaluateCondition(loop.condition, context);

            if (!conditionResult) {
              // Condition pas encore vraie, continuer la boucle
              context.currentLine = loop.startLine + 1;
            } else {
              // Condition vraie, sortir de la boucle
              context.repeatLoops.pop();
              context.currentLine++;
            }
            continue;
          }

          // End d'un If/Then/Else, simplement passer à la suite
          context.currentLine++;
          continue;
        }

        if (command.type === 'WHILE') {
          const condition = command.params.condition as string;
          const conditionResult = this.evaluateCondition(condition, context);
          const endLine = this.findMatchingEnd(lines, context.currentLine);

          if (conditionResult) {
            // Ajouter la boucle au stack
            context.whileLoops.push({
              condition,
              startLine: context.currentLine,
            });
            // Exécuter le corps de la boucle
            context.currentLine++;
          } else {
            // Sauter la boucle
            context.currentLine = endLine + 1;
          }
          continue;
        }

        if (command.type === 'REPEAT') {
          const condition = command.params.condition as string;

          // Ajouter la boucle au stack
          context.repeatLoops.push({
            condition,
            startLine: context.currentLine,
          });

          // Exécuter le corps de la boucle (au moins une fois)
          context.currentLine++;
          continue;
        }

        // Exécuter les commandes normales
        this.executeCommand(command, context, onOutput, onClearScreen);

        // Vérifier si on doit appeler un sous-programme (prgm)
        if (context.callProgram !== undefined) {
          const subProgramName = context.callProgram;
          const subProgramLines = context.programLines?.[subProgramName];

          if (subProgramLines) {
            // Empiler la frame actuelle (pour Return)
            context.stack.push({
              programName: context.programName,
              returnLine: context.currentLine + 1,
              variables: { ...context.variables }, // Copie des variables
            });

            // Préparer le contexte pour le sous-programme
            const subContext: ExecutionContext = {
              ...context,
              programName: subProgramName,
              currentLine: 0,
              labels: {}, // Sera scanné au début
              callProgram: undefined,
            };

            // Exécuter le sous-programme de manière récursive
            await this.executeProgram(
              subProgramLines,
              subContext,
              onOutput,
              onClearScreen,
              () => {
                // Quand le sous-programme est terminé, ne rien faire
                // On va continuer l'exécution du programme principal
              },
              onError
            );

            // Après l'exécution du sous-programme, restaurer le contexte
            if (subContext.error && subContext.error !== 'STOP') {
              // Propager l'erreur
              context.error = subContext.error;
              break;
            }

            // Mettre à jour les variables (elles sont globales)
            context.variables = subContext.variables;

            // Continuer à la ligne suivante du programme principal
            context.currentLine++;
            context.callProgram = undefined;
          }
        }
        // Vérifier si on doit sauter à une ligne (Goto ou Return)
        else if (context.gotoLine !== undefined) {
          context.currentLine = context.gotoLine;
          context.gotoLine = undefined; // Réinitialiser
        } else {
          context.currentLine++;
        }

        // Petit délai pour permettre à l'UI de se mettre à jour
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Programme terminé
      if (!context.isPaused) {
        onComplete();
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'ERR:UNKNOWN';
      onError(errorMsg);
    }
  }
}
