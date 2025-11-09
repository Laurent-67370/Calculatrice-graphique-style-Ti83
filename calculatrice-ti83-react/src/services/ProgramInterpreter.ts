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

        // Vérifier si le programme est arrêté
        if (context.error === 'STOP') {
          onComplete();
          return;
        }

        const line = lines[context.currentLine];

        // Exécuter la ligne
        this.executeLine(line, context, onOutput, onClearScreen);

        // Passer à la ligne suivante
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
