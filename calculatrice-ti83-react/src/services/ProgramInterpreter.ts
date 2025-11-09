/**
 * Interpréteur de programmes TI-BASIC
 * Compatible TI-83 Plus
 */

import { create, all } from 'mathjs';
import type {
  ParsedCommand,
  ExecutionContext,
  OutputLine,
} from '../types/program.types';

// Créer une instance de mathjs avec toutes les fonctions
const math = create(all);

/**
 * Service d'interprétation de programmes TI-BASIC
 */
export class ProgramInterpreter {
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
    const assignMatch = trimmedLine.match(/^(.+?)\s*→\s*([A-Z])$/i);
    if (assignMatch) {
      return {
        type: 'ASSIGN',
        params: {
          variable: assignMatch[2].toUpperCase(),
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
    const inputMatch = trimmedLine.match(/^Input\s+(?:"(.+?)"\s*,\s*)?([A-Z])$/i);
    if (inputMatch) {
      return {
        type: 'INPUT',
        params: {
          prompt: inputMatch[1]?.trim(),
          variable: inputMatch[2].toUpperCase(),
        },
      };
    }

    // Prompt variable1,variable2,...
    const promptMatch = trimmedLine.match(/^Prompt\s+(.+)$/i);
    if (promptMatch) {
      const variables = promptMatch[1].split(',').map(v => v.trim().toUpperCase());
      return {
        type: 'PROMPT',
        params: {
          variables,
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
      // Remplacer les variables par leurs valeurs
      let processedExpr = expr;

      // Remplacer les variables A-Z et θ
      const varMatches = expr.match(/[A-Zθ]/g);
      if (varMatches) {
        for (const varName of varMatches) {
          const value = context.variables[varName];
          if (value !== undefined) {
            // Utiliser une regex pour remplacer uniquement les variables isolées
            const regex = new RegExp(`\\b${varName}\\b`, 'g');
            processedExpr = processedExpr.replace(regex, value.toString());
          }
        }
      }

      // Si l'expression est entre guillemets, c'est une chaîne
      const stringMatch = processedExpr.match(/^"(.+)"$/);
      if (stringMatch) {
        return stringMatch[1]; // Retourner la chaîne sans guillemets
      }

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

      // Remplacer les variables A-Z et θ
      const varMatches = condition.match(/[A-Zθ]/g);
      if (varMatches) {
        for (const varName of varMatches) {
          const value = context.variables[varName];
          if (value !== undefined) {
            const regex = new RegExp(`\\b${varName}\\b`, 'g');
            processedCondition = processedCondition.replace(regex, value.toString());
          }
        }
      }

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
          context.variables[variable] = Number(value);
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
      while (context.currentLine < lines.length) {
        // Vérifier si le programme est en pause
        if (context.isPaused) {
          break;
        }

        // Vérifier si le programme attend un input
        if (context.isWaitingInput) {
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
          const condition = command.params.condition as string;
          const conditionResult = this.evaluateCondition(condition, context);

          const thenLine = this.findThen(lines, context.currentLine);

          if (thenLine === -1) {
            // If sur une seule ligne : If condition:commande
            if (conditionResult) {
              // Exécuter la ligne suivante
              context.currentLine++;
            } else {
              // Sauter la ligne suivante
              context.currentLine += 2;
            }
          } else {
            // If/Then/End (multilignes)
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
        context.currentLine++;

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
