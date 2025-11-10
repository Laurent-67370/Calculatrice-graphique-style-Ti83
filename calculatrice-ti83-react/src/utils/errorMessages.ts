/**
 * Service de gestion des messages d'erreur améliorés
 * Fournit des explications détaillées et des suggestions de correction
 */

export interface ErrorInfo {
  title: string;
  explanation: string;
  suggestions: string[];
  example?: string;
}

/**
 * Dictionnaire des messages d'erreur avec explications
 */
const ERROR_MESSAGES: Record<string, ErrorInfo> = {
  'SYNTAX': {
    title: 'ERR:SYNTAX',
    explanation: 'Erreur de syntaxe dans l\'expression',
    suggestions: [
      'Vérifiez que toutes les parenthèses sont bien fermées',
      'Vérifiez les opérateurs (+, -, *, /)',
      'Assurez-vous que la fonction est bien écrite'
    ],
    example: 'Correct: sin(30)\nIncorrect: sin(30'
  },
  'DOMAIN': {
    title: 'ERR:DOMAIN',
    explanation: 'Valeur en dehors du domaine de définition',
    suggestions: [
      'La fonction n\'est pas définie pour cette valeur',
      'Exemples: √(-1), log(-5), 1/0',
      'Vérifiez les valeurs d\'entrée'
    ],
    example: 'ln(x) requiert x > 0\n√(x) requiert x ≥ 0'
  },
  'DIVIDE BY 0': {
    title: 'ERR:DIVIDE BY 0',
    explanation: 'Division par zéro impossible',
    suggestions: [
      'Vérifiez le dénominateur',
      'Assurez-vous qu\'aucune variable ne vaut 0',
      'Utilisez une condition If/Then pour tester'
    ],
    example: 'Utilisez: If B≠0:Then:A/B'
  },
  'ARGUMENT': {
    title: 'ERR:ARGUMENT',
    explanation: 'Arguments incorrects pour la fonction',
    suggestions: [
      'Vérifiez le nombre d\'arguments',
      'Vérifiez le type des arguments',
      'Consultez l\'aide (F1) pour la syntaxe correcte'
    ],
    example: 'sin(x) : 1 argument\nmax(liste) : 1 liste'
  },
  'DIM MISMATCH': {
    title: 'ERR:DIM MISMATCH',
    explanation: 'Dimensions incompatibles',
    suggestions: [
      'Les matrices/listes doivent avoir des dimensions compatibles',
      'Vérifiez dim(L1) et dim(L2)',
      'Pour multiplier: colonnes(A) = lignes(B)'
    ],
    example: '[2×3] × [3×2] = [2×2] ✓\n[2×3] × [2×2] = ERR ✗'
  },
  'INVALID': {
    title: 'ERR:INVALID',
    explanation: 'Opération invalide dans ce contexte',
    suggestions: [
      'Cette opération n\'est pas disponible actuellement',
      'Vérifiez que vous êtes dans le bon mode',
      'Certaines fonctions nécessitent des données'
    ]
  },
  'DATA TYPE': {
    title: 'ERR:DATA TYPE',
    explanation: 'Type de données incompatible',
    suggestions: [
      'Vérifiez que vous utilisez le bon type',
      'Nombres, listes, matrices ne sont pas interchangeables',
      'Utilisez les fonctions de conversion si nécessaire'
    ],
    example: 'dim(L1) fonctionne sur listes\ndet([A]) fonctionne sur matrices'
  },
  'WINDOW RANGE': {
    title: 'ERR:WINDOW RANGE',
    explanation: 'Paramètres de fenêtre incorrects',
    suggestions: [
      'Xmin doit être < Xmax',
      'Ymin doit être < Ymax',
      'Les valeurs ne doivent pas être trop grandes',
      'Utilisez ZOOM > 6:ZStandard pour réinitialiser'
    ],
    example: 'Xmin=-10, Xmax=10 ✓\nXmin=10, Xmax=-10 ✗'
  },
  'UNDEFINED': {
    title: 'ERR:UNDEFINED',
    explanation: 'Variable ou fonction non définie',
    suggestions: [
      'La variable n\'a pas encore de valeur',
      'Utilisez STO→ pour stocker une valeur',
      'Vérifiez l\'orthographe (majuscules/minuscules)'
    ],
    example: '5→A puis utiliser A\nA+B sans définir B = ERR'
  },
  'STAT': {
    title: 'ERR:STAT',
    explanation: 'Erreur dans les calculs statistiques',
    suggestions: [
      'Vérifiez que vos listes contiennent des données',
      'Les listes doivent avoir la même longueur',
      'Utilisez STAT > EDIT pour vérifier les données'
    ]
  }
};

/**
 * Améliore un message d'erreur basique
 */
export function enhanceErrorMessage(error: string): ErrorInfo {
  // Rechercher le type d'erreur
  const errorType = Object.keys(ERROR_MESSAGES).find(key =>
    error.toUpperCase().includes(key)
  );

  if (errorType && ERROR_MESSAGES[errorType]) {
    return ERROR_MESSAGES[errorType];
  }

  // Message d'erreur générique
  return {
    title: error,
    explanation: 'Une erreur s\'est produite',
    suggestions: [
      'Vérifiez votre expression',
      'Consultez l\'aide (F1) pour plus d\'informations',
      'Essayez de simplifier votre calcul'
    ]
  };
}

/**
 * Formate un message d'erreur pour l'affichage
 */
export function formatErrorMessage(errorInfo: ErrorInfo): string {
  let message = `${errorInfo.title}\n\n`;
  message += `${errorInfo.explanation}\n\n`;

  if (errorInfo.suggestions.length > 0) {
    message += 'Suggestions:\n';
    errorInfo.suggestions.forEach((suggestion, index) => {
      message += `${index + 1}. ${suggestion}\n`;
    });
  }

  if (errorInfo.example) {
    message += `\nExemple:\n${errorInfo.example}`;
  }

  return message;
}

/**
 * Affiche un message d'erreur dans la console avec style
 */
export function logEnhancedError(error: string): void {
  const errorInfo = enhanceErrorMessage(error);
  console.group(`🔴 ${errorInfo.title}`);
  console.log(`📝 ${errorInfo.explanation}`);
  if (errorInfo.suggestions.length > 0) {
    console.log('\n💡 Suggestions:');
    errorInfo.suggestions.forEach((s, i) => console.log(`   ${i + 1}. ${s}`));
  }
  if (errorInfo.example) {
    console.log(`\n📚 Exemple:\n${errorInfo.example}`);
  }
  console.groupEnd();
}
