# 🧪 Guide de Test - Calculatrice TI-83 Plus

> **Serveur de développement** : Le serveur Vite est accessible sur http://localhost:5173/

---

## 📋 Plan de Test

Ce guide vous permet de tester systématiquement toutes les fonctionnalités nouvellement intégrées.

---

## 1. Test du Menu ZOOM 🔍

### Objectif
Vérifier que les 6 presets de zoom fonctionnent correctement et redessinent le graphique.

### Prérequis
1. Ouvrez la calculatrice dans votre navigateur
2. Entrez une fonction : `Y= → sin(X) → ENTER`
3. Affichez le graphique : `GRAPH`

### Tests à Effectuer

#### Test 1.1 : ZStandard
**Actions :**
- Appuyez sur `ZOOM`
- Sélectionnez "ZStandard" (option 1) avec ↓ si nécessaire
- Appuyez sur `ENTER`

**Résultat attendu :**
- ✅ Le graphique se redessine avec x∈[-10,10], y∈[-10,10]
- ✅ La fonction sin(X) est visible avec plusieurs périodes
- ✅ Le menu se ferme automatiquement

#### Test 1.2 : ZDecimal
**Actions :**
- Appuyez sur `ZOOM`
- Naviguez jusqu'à "ZDecimal" (↓)
- Appuyez sur `ENTER`

**Résultat attendu :**
- ✅ Le graphique se redessine avec x∈[-4.7,4.7], y∈[-3.1,3.1]
- ✅ Format décimal optimal pour les calculs
- ✅ Menu fermé

#### Test 1.3 : ZTrig
**Actions :**
- Appuyez sur `ZOOM`
- Naviguez jusqu'à "ZTrig"
- Appuyez sur `ENTER`

**Résultat attendu :**
- ✅ Le graphique se redessine avec x∈[-2π,2π], y∈[-4,4]
- ✅ Deux périodes complètes de sin(X) visibles
- ✅ Échelle parfaite pour les fonctions trigonométriques

#### Test 1.4 : ZSquare
**Actions :**
- Appuyez sur `ZOOM`
- Naviguez jusqu'à "ZSquare"
- Appuyez sur `ENTER`

**Résultat attendu :**
- ✅ Le graphique se redessine avec x∈[-7.5,7.5], y∈[-5,5]
- ✅ Ratio 1:1 pour un cercle parfait

#### Test 1.5 : Zoom In
**Actions :**
- Appuyez sur `ZOOM`
- Naviguez jusqu'à "Zoom In"
- Appuyez sur `ENTER`

**Résultat attendu :**
- ✅ Le graphique zoom ×2 (fenêtre divisée par 2)
- ✅ La fonction est plus détaillée

#### Test 1.6 : Zoom Out
**Actions :**
- Appuyez sur `ZOOM`
- Naviguez jusqu'à "Zoom Out"
- Appuyez sur `ENTER`

**Résultat attendu :**
- ✅ Le graphique zoom ÷2 (fenêtre multipliée par 2)
- ✅ Vue plus large de la fonction

---

## 2. Test du Menu MATH 🧮

### Objectif
Vérifier que les fonctions mathématiques s'insèrent correctement dans l'input.

### Tests à Effectuer

#### Test 2.1 : Menu NUM
**Actions :**
1. Mode normal (appuyez `CLEAR` si nécessaire)
2. Appuyez sur `MATH`
3. Vous voyez le menu avec NUM/CPX/PRB
4. Sélectionnez "abs(" avec ↓ et `ENTER`

**Résultat attendu :**
- ✅ "abs(" apparaît dans l'input
- ✅ Menu fermé
- ✅ Vous pouvez continuer à taper : `-5) → ENTER`
- ✅ Résultat : 5

**Autres fonctions NUM à tester :**
- `round(` → round(3.7) = 4
- `iPart(` → iPart(5.8) = 5
- `fPart(` → fPart(5.8) = 0.8
- `min(` → min(3,7) = 3
- `max(` → max(3,7) = 7
- `gcd(` → gcd(12,18) = 6
- `lcm(` → lcm(4,6) = 12

#### Test 2.2 : Menu PRB (Probabilités)
**Actions :**
1. Appuyez sur `MATH`
2. Naviguez jusqu'à "rand" (dans PRB)
3. Appuyez sur `ENTER`

**Résultat attendu :**
- ✅ Un nombre aléatoire entre 0 et 1 apparaît (ex: 0.7234)
- ✅ Menu fermé

**Autres fonctions PRB à tester :**
- `randInt(` → randInt(1,6) = nombre entre 1 et 6 (dé)
- `factorial` → 5! = 120
- `nPr(` → nPr(5,2) = 20 (permutations)
- `nCr(` → nCr(5,2) = 10 (combinaisons)

#### Test 2.3 : Menu CPX (Nombres Complexes)
**Actions :**
1. Appuyez sur `MATH`
2. Naviguez jusqu'à "conj(" (dans CPX)
3. Appuyez sur `ENTER`

**Résultat attendu :**
- ✅ "conj(" apparaît dans l'input
- ✅ Prêt pour entrer un nombre complexe

**Autres fonctions CPX à tester :**
- `real(` → partie réelle
- `imag(` → partie imaginaire
- `angle(` → argument θ
- `Rect(` → conversion polaire → rectangulaire
- `Polar(` → conversion rectangulaire → polaire

---

## 3. Test du Menu STAT - Éditeur de Listes 📊

### Objectif
Vérifier que l'éditeur de listes permet de saisir et modifier des données.

### Test 3.1 : Ouvrir l'Éditeur
**Actions :**
1. Appuyez sur `STAT`
2. Sélectionnez "Edit..." (option 1)
3. Appuyez sur `ENTER`

**Résultat attendu :**
- ✅ L'éditeur de listes s'ouvre
- ✅ Vous voyez les colonnes L1, L2, L3, L4, L5, L6
- ✅ L1 est sélectionné par défaut
- ✅ Instructions affichées en bas

### Test 3.2 : Navigation entre Listes
**Actions :**
1. Dans l'éditeur, appuyez sur `→` (flèche droite)
2. Appuyez sur `→` encore
3. Appuyez sur `←` (flèche gauche)

**Résultat attendu :**
- ✅ L'onglet actif change : L1 → L2 → L3 → L2
- ✅ Les valeurs de chaque liste s'affichent

### Test 3.3 : Saisir des Données dans L1
**Actions :**
1. Assurez-vous d'être sur L1
2. Sélectionnez la ligne 1 (devrait déjà être sélectionnée)
3. Appuyez sur `ENTER` pour passer en mode édition
4. Tapez `10` puis `ENTER`
5. Tapez `20` puis `ENTER`
6. Tapez `30` puis `ENTER`
7. Tapez `40` puis `ENTER`
8. Tapez `50` puis `ENTER`

**Résultat attendu :**
- ✅ Chaque valeur est enregistrée dans la liste
- ✅ Le curseur descend automatiquement après chaque ENTER
- ✅ Les valeurs restent visibles

### Test 3.4 : Saisir des Données dans L2
**Actions :**
1. Appuyez sur `→` pour passer à L2
2. Entrez les valeurs : 2, 4, 6, 8, 10

**Résultat attendu :**
- ✅ L2 contient maintenant : [2, 4, 6, 8, 10]

### Test 3.5 : Fermer l'Éditeur
**Actions :**
- Appuyez sur `CLEAR` ou `2ND + QUIT`

**Résultat attendu :**
- ✅ Retour à l'écran principal
- ✅ Les données sont sauvegardées en mémoire

---

## 4. Test des Calculs Statistiques 📈

### Objectif
Vérifier que les statistiques et régressions fonctionnent avec les données saisies.

### Prérequis
**Données dans les listes :**
- L1 = [10, 20, 30, 40, 50]
- L2 = [2, 4, 6, 8, 10]

Si vous n'avez pas encore saisi ces données, suivez le Test 3 ci-dessus.

### Test 4.1 : Statistiques à 1 Variable
**Actions :**
1. Appuyez sur `STAT`
2. Naviguez jusqu'à "1-Var Stats" (option 2)
3. Appuyez sur `ENTER`

**Résultat attendu :**
```
1-Var Stats (L1)
n=5
mean=30.0000
Σx=150.0000
Σx²=5500.0000
Sx=15.8114
σx=14.1421
min=10.0000
Q1=20.0000
Med=30.0000
Q3=40.0000
max=50.0000
```

**Vérifications :**
- ✅ n = 5 (nombre de valeurs)
- ✅ mean = 30 (moyenne)
- ✅ Σx = 150 (somme)
- ✅ min = 10, max = 50
- ✅ Med = 30 (médiane)

### Test 4.2 : Statistiques à 2 Variables
**Actions :**
1. Appuyez sur `STAT`
2. Naviguez jusqu'à "2-Var Stats"
3. Appuyez sur `ENTER`

**Résultat attendu :**
```
2-Var Stats (L1,L2)
n=5
mean(x)=30.0000
mean(y)=6.0000
Σx=150.0000
Σy=30.0000
Σxy=1100.0000
```

**Vérifications :**
- ✅ mean(x) = 30
- ✅ mean(y) = 6
- ✅ Corrélation entre L1 et L2 affichée

### Test 4.3 : Régression Linéaire
**Actions :**
1. Appuyez sur `STAT`
2. Naviguez jusqu'à "LinReg(ax+b)"
3. Appuyez sur `ENTER`

**Résultat attendu :**
```
LinReg (L1,L2)
y=ax+b
a=0.200000
b=0.000000
r=1.000000
r²=1.000000
```

**Vérifications :**
- ✅ Équation : y = 0.2x (pente = 0.2)
- ✅ Ordonnée à l'origine : b = 0
- ✅ Corrélation parfaite : r = 1.0 (relation linéaire parfaite)
- ✅ r² = 1.0 (100% de variance expliquée)

**Explication :**
Les données L1=[10,20,30,40,50] et L2=[2,4,6,8,10] suivent la relation y=x/5, donc la régression doit trouver y=0.2x.

### Test 4.4 : Régression Quadratique
**Actions :**
1. D'abord, créons des données quadratiques :
   - Allez dans STAT Edit
   - L3 = [1, 2, 3, 4, 5]
   - L4 = [1, 4, 9, 16, 25] (x²)
2. Appuyez sur `STAT`
3. Naviguez jusqu'à "QuadReg"
4. Appuyez sur `ENTER`

**Résultat attendu :**
```
QuadReg (L1,L2)
y=ax²+bx+c
a=1.000000
b=0.000000
c=0.000000
r²≈1.000000
```

**Vérifications :**
- ✅ Équation : y = x² détectée
- ✅ Coefficient a = 1

### Test 4.5 : Régression Exponentielle
**Actions :**
1. Appuyez sur `STAT`
2. Naviguez jusqu'à "ExpReg"
3. Appuyez sur `ENTER`

**Résultat attendu :**
```
ExpReg (L1,L2)
y=a*b^x
a=...
b=...
r=...
r²=...
```

**Vérifications :**
- ✅ Les paramètres a et b sont calculés
- ✅ Pas d'erreur "Données insuffisantes"

### Test 4.6 : Autres Régressions
**À tester de la même manière :**
- PwrReg (régression puissance : y = ax^b)
- LnReg (régression logarithmique : y = a + b*ln(x))

---

## 5. Tests de Navigation et UI 🎮

### Test 5.1 : Navigation au Clavier
**Actions physiques sur les touches :**
- Flèches ↑↓ : navigation dans les menus
- ENTER : sélection
- CLEAR : fermeture de menu / retour

**Raccourcis clavier :**
- Flèches du clavier → ↑↓ dans les menus
- Enter → ENTER
- Escape → CLEAR

**Résultat attendu :**
- ✅ Navigation fluide
- ✅ Aucun lag
- ✅ Les touches répondent immédiatement

### Test 5.2 : Gestion des Erreurs
**Test : Liste vide**
1. Sans avoir saisi de données dans L1
2. Appuyez sur STAT → 1-Var Stats
3. Résultat attendu : `Erreur: Liste vide`

**Test : Données insuffisantes pour régression**
1. Ne mettez qu'une valeur dans L1
2. Appuyez sur STAT → LinReg
3. Résultat attendu : `Erreur: Données insuffisantes`

### Test 5.3 : Persistance des Données
**Actions :**
1. Saisissez des données dans STAT Edit
2. Fermez l'éditeur (CLEAR)
3. Calculez 1-Var Stats
4. Rouvrez STAT Edit

**Résultat attendu :**
- ✅ Les données sont toujours présentes dans l'éditeur
- ✅ Les statistiques utilisent les bonnes données
- ✅ Rien n'est perdu entre les modes

---

## 6. Tests d'Intégration Complète 🚀

### Scénario : Analyse Complète de Données

**Objectif :** Tester un workflow complet de l'entrée des données à la visualisation.

**Étapes :**

1. **Saisie des données :**
   - STAT → Edit
   - L1 = [1, 2, 3, 4, 5]
   - L2 = [2, 4.1, 5.8, 8.2, 9.9]
   - CLEAR (fermer)

2. **Statistiques descriptives :**
   - STAT → 1-Var Stats
   - Noter les valeurs de mean, Sx, min, max

3. **Régression linéaire :**
   - STAT → LinReg(ax+b)
   - Noter a et b

4. **Graphique de la fonction de régression :**
   - Y= → Y1 = 2.02*X+0.04 (selon votre résultat)
   - GRAPH
   - ZOOM → ZStandard

5. **Ajustement de la fenêtre :**
   - ZOOM → ZSquare
   - Vérifiez que la droite est visible

**Résultat attendu :**
- ✅ Workflow fluide sans interruption
- ✅ Les calculs sont cohérents
- ✅ Le graphique montre la droite de régression
- ✅ Tous les menus se ferment correctement
- ✅ Retour au mode normal après chaque opération

---

## 7. Tests de Performance ⚡

### Test 7.1 : Temps de Réponse des Menus
**Actions :**
- Ouvrir STAT/MATH/ZOOM plusieurs fois
- Naviguer rapidement avec ↑↓

**Résultat attendu :**
- ✅ Ouverture instantanée (< 100ms)
- ✅ Navigation fluide sans lag
- ✅ Aucun freeze de l'interface

### Test 7.2 : Calculs sur Grandes Listes
**Actions :**
1. Créer une liste L1 avec 50 valeurs
2. Calculer 1-Var Stats

**Résultat attendu :**
- ✅ Calcul rapide (< 500ms)
- ✅ Résultats exacts

### Test 7.3 : Redessins de Graphique
**Actions :**
- Appliquer plusieurs ZOOM consécutifs
- Observer les redraws

**Résultat attendu :**
- ✅ Redraw fluide
- ✅ Pas de clignotement
- ✅ Courbes lissées

---

## 8. Checklist Finale ✅

### Fonctionnalités Essentielles

- [ ] ZOOM : Les 6 presets fonctionnent
- [ ] MATH : Les fonctions s'insèrent correctement
- [ ] STAT Edit : On peut saisir et modifier des listes
- [ ] STAT 1-Var : Les statistiques sont exactes
- [ ] STAT LinReg : La régression calcule correctement
- [ ] Navigation : ↑↓ ENTER CLEAR fonctionnent
- [ ] Erreurs : Messages d'erreur appropriés
- [ ] Performance : Réponse instantanée

### Cas Limites

- [ ] Liste vide → Erreur affichée
- [ ] Une seule donnée → Erreur pour régression
- [ ] Valeurs négatives → Traitées correctement
- [ ] Grands nombres → Pas de débordement
- [ ] Switching rapide entre menus → Pas de bug

---

## 📝 Rapport de Test

Utilisez ce template pour noter vos résultats :

```markdown
## Rapport de Test - [Date]

### Environnement
- Navigateur : Chrome/Firefox/Safari/Edge
- Version :
- OS : Windows/Mac/Linux

### Résultats

#### Menu ZOOM
- ZStandard : ✅/❌
- ZDecimal : ✅/❌
- ZTrig : ✅/❌
- ZSquare : ✅/❌
- Zoom In : ✅/❌
- Zoom Out : ✅/❌

#### Menu MATH
- Fonctions NUM : ✅/❌
- Fonctions CPX : ✅/❌
- Fonctions PRB : ✅/❌

#### Menu STAT
- Éditeur de listes : ✅/❌
- 1-Var Stats : ✅/❌
- 2-Var Stats : ✅/❌
- LinReg : ✅/❌
- QuadReg : ✅/❌
- ExpReg : ✅/❌
- PwrReg : ✅/❌
- LnReg : ✅/❌

### Bugs Trouvés
1. [Description du bug]
2. [Description du bug]

### Améliorations Suggérées
1. [Suggestion]
2. [Suggestion]

### Conclusion
- Taux de réussite : X/Y tests
- Prêt pour production : Oui/Non
- Prochaines étapes : [...]
```

---

## 🎯 Instructions pour Lancer les Tests

1. **Démarrer le serveur** (déjà fait) :
   ```bash
   cd calculatrice-ti83-react
   npm run dev
   ```

2. **Ouvrir dans le navigateur** :
   - http://localhost:5173/

3. **Suivre les sections dans l'ordre** :
   - Section 1 : ZOOM
   - Section 2 : MATH
   - Section 3 : STAT Edit
   - Section 4 : Calculs statistiques
   - Section 5 : Navigation
   - Section 6 : Intégration complète
   - Section 7 : Performance
   - Section 8 : Checklist

4. **Noter les résultats** dans le rapport

5. **Signaler tout bug** trouvé

---

Bonne chance pour les tests! 🚀
