# 🔧 Guide de Diagnostic TI-83 Plus

## Problèmes Identifiés et Solutions

### ✅ Corrections Apportées

Le système d'intégration a été amélioré avec :

1. **Vérifications de chargement** : Le système vérifie maintenant que tous les modules sont bien chargés avant de les utiliser
2. **Gestion d'erreurs robuste** : Chaque module est chargé dans un bloc try-catch séparé
3. **Logs de débogage** : Messages console détaillés pour identifier les problèmes
4. **Délai de chargement augmenté** : 300ms au lieu de 200ms pour laisser le temps aux scripts de se charger

### 🧪 Comment Tester

1. **Ouvrir la page de test** :
   ```bash
   # Ouvrir test.html dans votre navigateur
   open test.html
   ```

2. **Vérifier la console du navigateur** :
   - Appuyez sur F12 pour ouvrir les DevTools
   - Onglet "Console"
   - Cherchez les messages ✓ ou ❌

3. **Tester chaque fonction** :
   - Utilisez les boutons de test dans test.html
   - Chaque bouton teste une fonctionnalité spécifique

### 🐛 Si les Fonctions Ne Marchent Toujours Pas

#### Étape 1 : Vérifier le Chargement des Scripts

Ouvrez la console (F12) et vérifiez ces messages :
```
✓ calculator et graphingEngine chargés
✓ Module statistiques chargé
✓ Module math chargé
✓ Module éditeurs chargé
✓ Système de menus chargé
```

**Si vous voyez des ❌** : Un script n'a pas pu se charger

**Solution** :
- Vérifiez que tous les fichiers .js sont dans le même dossier
- Vérifiez qu'il n'y a pas d'erreurs de syntaxe JavaScript
- Essayez de vider le cache du navigateur (Ctrl+Shift+R)

#### Étape 2 : Tester avec test.html

1. Ouvrez `test.html`
2. Regardez la section "État des modules"
3. Tous les modules doivent avoir une ✓ verte

**Si certains modules sont ✗** :
- Ouvrez la console (F12)
- Cherchez l'erreur spécifique
- Le message d'erreur vous dira quel fichier/ligne pose problème

#### Étape 3 : Tester les Fonctions Individuellement

Dans test.html, cliquez sur chaque bouton :
- Test Y= Editor
- Test WINDOW
- Test GRAPH
- Test ZOOM
- etc.

La console vous dira exactement quelle fonction échoue.

### 🔍 Erreurs Courantes

#### Erreur : "calculator is not defined"
**Cause** : calculator.js n'a pas fini de charger
**Solution** :
- Augmenter le délai dans integration.js (ligne 586)
- Vérifier l'ordre des scripts dans index.html

#### Erreur : "Cannot read property 'openYEditor' of undefined"
**Cause** : editorsModule n'a pas été initialisé
**Solution** :
- Vérifier que editors.js se charge sans erreur
- Ouvrir la console et taper : `calculator.editorsModule`
- Si undefined, chercher l'erreur dans editors.js

#### Erreur : "graphingEngine is not defined"
**Cause** : graphing.js n'a pas initialisé window.graphingEngine
**Solution** :
- Vérifier que graphing.js est bien chargé
- Dans la console, taper : `window.graphingEngine`
- Vérifier que le code d'initialisation à la fin de graphing.js s'exécute

### 📝 Logs Utiles

Pour déboguer, ajoutez ces lignes dans la console du navigateur :

```javascript
// Vérifier calculator
console.log('Calculator:', typeof calculator);
console.log('GraphingEngine:', typeof calculator.graphingEngine);

// Vérifier les modules
console.log('StatModule:', typeof calculator.statModule);
console.log('MathModule:', typeof calculator.mathModule);
console.log('EditorsModule:', typeof calculator.editorsModule);
console.log('MenuSystem:', typeof calculator.menuSystem);

// Tester une fonction spécifique
calculator.handleKeyPress('y-vars');
```

### 🛠️ Tests Manuels dans la Calculatrice

Une fois index.html ouvert :

**Test Y= Editor** :
1. Cliquez sur le bouton "Y="
2. Devrait afficher l'éditeur de fonctions
3. Ou appuyez Alt+Y

**Test WINDOW** :
1. Cliquez sur "WINDOW"
2. Devrait afficher l'éditeur de paramètres
3. Ou appuyez Alt+W

**Test GRAPH** :
1. Cliquez sur "GRAPH"
2. L'écran devrait passer en mode graphique
3. Ou appuyez Alt+G

**Test ZOOM** :
1. Cliquez sur "ZOOM"
2. Le menu ZOOM devrait apparaître
3. Ou appuyez Alt+Z

**Test STAT** :
1. Cliquez sur "STAT"
2. Le menu STAT devrait apparaître
3. Ou appuyez Alt+S

**Test MATH** :
1. Cliquez sur "MATH"
2. Le menu MATH devrait apparaître
3. Ou appuyez Alt+M

**Test 2nd+TRACE (CALC)** :
1. Appuyez sur "2nd" (jaune)
2. Puis sur "TRACE"
3. Le menu CALC devrait apparaître

**Test TABLE** :
1. Appuyez sur "2nd"
2. Puis sur "GRAPH"
3. La table de valeurs devrait apparaître

### 🎯 Fonctionnement Attendu

Voici ce qui devrait se passer quand vous cliquez sur chaque touche :

| Touche | Action Attendue |
|--------|-----------------|
| Y= | Ouvre l'éditeur Y= avec Y1-Y6 |
| WINDOW | Ouvre l'éditeur WINDOW avec Xmin, Xmax, etc. |
| ZOOM | Affiche le menu ZOOM avec 10 options |
| TRACE | Active le mode trace (graphique doit être affiché) |
| GRAPH | Bascule le mode graphique ON/OFF |
| 2nd+WINDOW | Ouvre TBLSET |
| 2nd+GRAPH | Affiche la TABLE |
| 2nd+TRACE | Ouvre le menu CALC |
| STAT | Affiche le menu STAT (Edit, Calc) |
| MATH | Affiche le menu MATH (NUM, CPX, PRB) |
| MODE | Affiche le menu MODE |
| VARS | Affiche le menu VARS |

### 💡 Aide Rapide

**Dans la calculatrice, appuyez sur F1** pour afficher l'aide rapide.

**Raccourcis utiles** :
- Alt+Y : Y= Editor
- Alt+W : WINDOW
- Alt+G : GRAPH
- Alt+T : TABLE
- Alt+Z : ZOOM
- Alt+S : STAT
- Alt+M : MATH
- F1 : Aide

### 📧 Rapport de Bug

Si après avoir suivi ce guide, les fonctions ne marchent toujours pas :

1. **Ouvrir test.html**
2. **Copier la sortie de la console**
3. **Noter quelle fonction spécifique ne marche pas**
4. **Noter le navigateur et la version** (Chrome 120, Firefox 115, etc.)
5. **Noter le système d'exploitation** (Windows 11, macOS 14, etc.)

### ✅ Checklist de Vérification

Avant de signaler un problème, vérifiez :

- [ ] Tous les fichiers .js sont dans le bon dossier
- [ ] Les fichiers se chargent sans erreur 404 (F12 > Network)
- [ ] La console ne montre pas d'erreurs JavaScript (F12 > Console)
- [ ] test.html affiche tous les modules en vert
- [ ] Le cache du navigateur a été vidé (Ctrl+Shift+R)
- [ ] Vous utilisez un navigateur moderne (Chrome 90+, Firefox 88+, Safari 14+)
- [ ] JavaScript est activé dans le navigateur

### 🔄 Recharger Complètement

Si rien ne fonctionne, essayez :

1. **Fermer complètement le navigateur**
2. **Vider le cache** :
   - Chrome : Ctrl+Shift+Del
   - Firefox : Ctrl+Shift+Del
   - Safari : Cmd+Option+E
3. **Rouvrir index.html**
4. **Ouvrir la console** (F12)
5. **Vérifier les messages de chargement**

---

**Note** : Avec les corrections apportées dans cette version, le système de menus et les éditeurs devraient maintenant fonctionner correctement. Le fichier `integration.js` a été complètement refactorisé avec une meilleure gestion d'erreurs et des vérifications de sécurité.
