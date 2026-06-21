# 🧮 Calculatrice Graphique TI-83 Plus

## Version 3.4.1 - Aide intégrée MATRX 🔢

> Ajout d'un onglet **🔢 MATRX** dans l'aide intégrée (📖 Guide) documentant toutes les opérations matricielles introduites en v3.4.0 : accès au menu, arithmétique, onglet MATH, opérations sur lignes, conversions liste↔matrice, exemple de résolution de système, limitations. Basé sur la v3.4.0.

> 🔢 **v3.4.0** : opérations matricielles MATRX MATH/OPS (`det`, `rref`, `ref`, `identity`, `randM`, `augment`, `Matr►list`, `List►matr`, `rowSwap`/`*row`/`*row+`/`*row-`, transposée, inverse). Voir **✨ Nouveautés v3.4.0**.

> 🎮 **v3.3.0** : `getKey` lit l'entrée clavier (codes officiels TI-BASIC) avec un tampon consommable à la lecture — comportement identique à une vraie TI-83. Écrivez des jeux et programmes interactifs ! Voir la section **✨ Nouveautés v3.3.0** ci-dessous.

Une implémentation moderne et performante de la calculatrice graphique TI-83 Plus, entièrement reconstruite avec **React**, **TypeScript** et **Zustand**. Disponible en **Progressive Web App** (PWA) installable sur mobile et bureau.

**Nouveautés v3.4.0** 🔢 : opérations matricielles — menu MATRX (`2ND + X⁻¹`) avec onglets NAMES/MATH/OPS + Edit. `det(`, `rref(`, `ref(`, `identity(`, `randM(`, `augment(`, `Matr►list(`, `List►matr(`, `cumSum(`, `dim(`, opérations sur lignes (`rowSwap(`, `*row(`, `*row+(`, `*row-(`), transposée (`ᵀ`), inverse, arithmétique (`[A]*[B]`, `[A]+[B]`). Voir la section **✨ Nouveautés v3.4.0** ci-dessous.

**Correctifs v3.3.1** 🎹 : mapping ALPHA du clavier partiellement corrigé — rang haut MATH/APPS/PRGM/VARS/CLEAR = A/B/C/D/E (confirmé guidebook TI officiel), doublon `X` sur `÷` supprimé, mauvaises lettres A-E retirées des touches numériques 7/8/9/4/5. Voir la section **🔧 Correctifs v3.3.1** ci-dessous.

**Nouveautés v3.3.0** 🎮 :
- `getKey` — lecture de l'entrée clavier dans les programmes TI-BASIC (codes officiels TI-BASIC `ligne×10+colonne`), avec tampon consommable à la lecture (comme une vraie TI-83). Les touches fléchées et le pavé numérique alimentent le programme hors des modes `Input`/`Menu`. Écrivez des jeux interactifs ! Voir la section **✨ Nouveautés v3.3.0** ci-dessous.

**Nouveautés v3.2** :
- Export/Import de programmes en JSON et .8xp (format natif TI-83 Plus) - Partagez vos programmes ou transférez-les vers une vraie calculatrice !
- Documentation complète dans l'aide intégrée (onglet 🎓 PRGM)

**Nouveautés v3.1** :
- Mode SEQUENCE complet pour les suites numériques (u(n), v(n), w(n)) avec expressions récursives

**Version v3.0** : Programmation TI-BASIC complète avec 39+ commandes, structures de contrôle, menus interactifs et compatibilité 100% TI-83 Plus !

**Correctifs v3.2.3** 🐛 : 5 bugs du module PRGM corrigés (saisie `Input`/`Prompt` : ligne suivante sautée, statut [TERMINÉ] prématuré, drapeaux d'attente non propagés au store, clavier Android intempestif, résultat FACT effacé + champ tronqué au scroll) — voir la section **🔧 Correctifs v3.2.3** ci-dessous.

**Correctifs v3.2.2** 🐛 : 3 bugs du module PRGM corrigés (opérateurs `=`/`≠`/`≥`/`≤` dans les conditions, interpolation de variables dans les chaînes, `If` mono-ligne `cond:commande`) — voir la section **🔧 Correctifs v3.2.2** ci-dessous.

**Correctifs v3.2.1** 🐛 : 6 bugs mathématiques/finance/graphique corrigés (`ln` en mode graph, QuadReg, séquences récursives, TVM solveN/solveI, DrawInv) — voir la section **🔧 Correctifs v3.2.1** ci-dessous.

---

## ✨ Nouveautés Version 3.4.0

### 🔢 Opérations matricielles (MATRX MATH/OPS)

Le menu **MATRX** (accessible via `2ND + X⁻¹`) est désormais complet, avec les onglets **NAMES / MATH / OPS** (+ **Edit** pour l'éditeur de matrices). Toutes les opérations matricielles standard de la TI-83 Plus sont disponibles :

**Onglet MATH** :
| Commande | Effet |
|---|---|
| `det(` | déterminant |
| `ᵀ` | transposée (postfixe : `[A]ᵀ`) |
| `dim(` | dimensions `[lignes, colonnes]` |
| `Fill(` | matrice remplie d'une valeur |
| `identity(` | matrice identité n×n |
| `randM(` | matrice aléatoire `lignes×colonnes` |
| `augment(` | concaténation horizontale |
| `Matr►list(` | colonne d'une matrice → liste |
| `List►matr(` | listes → colonnes d'une matrice |
| `cumSum(` | sommes cumulées |
| `ref(` / `rref(` | formes échelonnée / échelonnée réduite |
| `rowSwap(`, `*row(`, `*row+(`, `*row-(` | opérations élémentaires sur lignes |

**Arithmétique** : `[A]*[B]` (produit), `[A]+[B]`, `[A]-[B]`, `[A]^n`, `[A]⁻¹` (inverse), `[A]ᵀ` (transposée).

**Exemple** — résoudre un système 2×2 :
```basic
[A] = [[1,2,5],[3,4,7]]   →  rref([A])  =  [[1,0,-3],[0,1,4]]
```
soit x = -3, y = 4.

### ⚠️ Limitations v1

- `Fill(` et `SortA(`/`SortD(` renvoient une **valeur** (ne mutent pas la variable en place comme sur la TI-83).
- Le stockage d'un résultat matriciel vers une variable matrice (`rref([A])→[B]`) n'est pas encore géré — le résultat s'affiche à l'écran.
- Messages d'erreur sur matrices singulières : génériques (pas encore les libellés TI exacts `ERR:SINGULAR MAT`).

> 🔗 Détails techniques : nouveau service `src/services/MatrixService.ts` (Gauss/Gauss-Jordan pour `ref`/`rref`, opérations sur lignes, conversions liste↔matrice) ; fonctions enregistrées dans le scope d'évaluation + rewrites de tokens TI dans `Calculator.tsx` ; menu `matrixMenuItems` dans `src/data/menus.ts` + `createMatrixHandlers` dans `src/utils/menuHandlers.ts`.

---

## 🔧 Correctifs Version 3.3.1

Correctif partiel du **mapping ALPHA** du clavier (`Keyboard.tsx`). Seules les touches confirmées à 100 % par le guidebook TI officiel (lettres vertes imprimées sur les touches) ont été corrigées ; le reste attend la table autoritaire complète.

### ✅ Corrigé (sans doute)

| Touche | Avant | Après |
|---|---|---|
| MATH / APPS / PRGM / VARS / CLEAR | (aucune lettre) | **A / B / C / D / E** |
| ÷ | `X` (doublon) | (supprimé — `X,T,θ,n` est la vraie touche X) |
| 7 / 8 / 9 | A / B / C (doublons) | (supprimé — A-C sont sur le rang haut) |
| 4 / 5 | D / E (doublons) | (supprimé — D-E sont sur le rang haut) |

- **Rang du haut A-E** : confirmé par le guidebook TI (« ƒ [A] above MATH », « ƒ [B] above APPS »). `ALPHA + MATH` tape désormais « A », comme sur une vraie TI-83.
- **Doublon `X`** : la touche `÷` produisait à tort `X` (doublon avec `X,T,θ,n`). Supprimé.
- **Doublons A-E** : les touches numériques 7/8/9/4/5 portaient les mauvaises lettres A/B/C/D/E ; retirées pour éviter les doublons avec le rang haut désormais correct.

### ⚠️ Reste à corriger (doute → table autoritaire)

Les lettres F-M et N-Z sur les touches scientifiques/numériques (`X⁻¹`, `SIN`, `COS`, `TAN`, `^`, `LOG`, `LN`, `X²`, `,`, `(`, `×`, `−`, `STO→`, `1`, `2`, `3`, `6`, `(−)`) ainsi que les caractères spéciaux (`0`=espace, `.`=:, `)`=θ, `+`=") et le bug `LN='n'` minuscule ne sont pas encore alignés sur la vraie TI-83 : les sources web consultées se contredisent. Ils seront corrigés avec le diagramme officiel du **TI-83 Plus Guidebook** (lettres vertes imprimées sur les touches).

> 🔗 Détails techniques : commit `74eceff` sur la branche par défaut. Modification dans `calculatrice-ti83-react/src/components/Calculator/Keyboard.tsx`.

---

## ✨ Nouveautés Version 3.3.0

### 🎮 `getKey` — Lecture du clavier dans les programmes

La commande TI-BASIC `getKey` est désormais **pleinement fonctionnelle**. Elle renvoie le code de la dernière touche pressée (0 si aucune), puis **remet le tampon à 0** — la lecture consomme, exactement comme sur une vraie TI-83 Plus. Cela permet d'écrire des jeux et des programmes interactifs réagissant aux touches.

**Comportement** :
- Hors des modes `Input`/`Menu`/`Prompt`, les touches du clavier alimentent le tampon `getKey` au lieu de déclencher la calculatrice.
- Le tampon est vidé au lancement de chaque programme (pas de touche parasite d'un run précédent).
- `getKey` seul sur une ligne vide le tampon (idiome de reset avant une boucle).

**Table des codes officiels TI-BASIC** (format `ligne×10 + colonne`) :

| Touche | Code | Touche | Code |
|---|:---:|---|:---:|
| Flèche gauche ◀ | 24 | Flèche haut ▲ | 25 |
| Flèche droite ▶ | 26 | Flèche bas ▼ | 34 |
| CLEAR | 45 | ENTER | 105 |
| 1 | 92 | 6 | 97 |
| 2 | 93 | 7 | 98 |
| 3 | 94 | 8 | 99 |
| 4 | 95 | 9 | 100 |
| 5 | 96 | 0 | 102 |

### 🕹️ Exemple - Curseur qui se déplace aux flèches

```basic
:0→X
:Lbl 0
:getKey→K
:If K=26:X+1→X    // flèche droite
:If K=24:X-1→X    // flèche gauche
:If K=45:Stop     // CLEAR pour quitter
:Disp "POS=",X
:Goto 0
```

> 🔗 Détails techniques : commit `badb2af` sur la branche par défaut. Implémentation : tampon statique `lastKeyCode` + `pushKey()`/`resetKeyBuffer()` dans `ProgramInterpreter.ts`, table `GETKEY_CODES` dans `Calculator.tsx`, vidage du tampon au lancement dans `programStore.ts`.

---

## 🔧 Correctifs Version 3.2.3

Version de maintenance du **module PRGM** (saisie utilisateur `Input`/`Prompt` et affichage des résultats). Cinq bugs qui empêchaient la saisie interactive de fonctionner (champ absent, résultat effacé, clavier Android intempestif). Chaque correctif vérifié ; build vert (`tsc -b` + `vite build`).

| # | Bug | Impact |
|---|---|:---:|
| 1 | `Input`/`Prompt` sautait la ligne suivante | 🔴 Haute |
| 2 | `onComplete` se déclenchait en attente de saisie → [TERMINÉ] prématuré | 🔴 Haute |
| 3 | Drapeaux `isWaitingInput`/`isWaitingMenu` non propagés au store → champ absent | 🔴 Haute |
| 4 | Le champ `Input` ouvrait le clavier système Android | 🟡 Moyenne |
| 5 | Résultat effacé après saisie (FACT) + champ tronqué au scroll (TEST) | 🔴 Haute |

### Détails

- **`Input`/`Prompt` saute la ligne suivante** : double-incrément de `currentLine` — l'interpréteur avançait déjà passé la commande `Input`/`Prompt`, mais `provideInput` incrémentait `currentLine` une 2ᵉ fois avant de reprendre → la ligne suivante était systématiquement sautée (`Input N:Disp N*2` n'affichait pas `N*2`). Désormais `provideInput` ne décale plus `currentLine`.

- **`onComplete` prématuré en attente de Input/Menu** : la condition de fin d'exécution dans `executeProgram()` ne vérifiait que `isPaused` → le statut [TERMINÉ] s'affichait dès qu'un programme rencontrait `Input`/`Prompt`/`Menu`, alors qu'il attendait encore une saisie. Ajout des gardes `isWaitingInput` et `isWaitingMenu` sur cette condition.

- **Drapeaux d'attente non propagés vers le store** : l'interpréteur posait `isWaitingInput = true` directement sur l'objet `context`, mais `addOutput()` (qui affiche le prompt `N=`) recopiait le contexte et figeait ce drapeau primitif à `false` à cet instant → le store ne savait jamais qu'une saisie était attendue → pas de champ de saisie, touches non routées. Désormais, après chaque exécution (run, resume, provideInput, provideMenuSelection), les drapeaux réels du contexte sont resynchronisés vers le store via `.then()`.

- **Clavier Android intempestif** : le champ `Input` ouvrait le clavier système Android — seules les touches de la calculatrice (1-9, ENTER…) doivent l'alimenter. Désormais le champ n'ouvre plus le clavier système.

- **Résultat effacé après saisie + champ tronqué au scroll** : (a) les chemins `resume`/`provideInput`/`menu` appelaient `stopProgram()` à la fin → le programme se fermait dès qu'il se terminait après un Input, le résultat `FACT=40320` disparaissait instantanément ; désormais `isCompleted = true` comme `runProgram` (sortie persistée avec [TERMINÉ] et bouton Fermer). (b) le champ était en `position: absolute` dans la zone d'écran qui défile → il se calait sur le contenu défilé (pas le viewport) et remontait sous l'en-tête ; les blocs interactifs (saisie, menu, erreur, pause) sont désormais en flux normal entre l'écran et le pied de page, toujours visibles.

> 🔗 Détails techniques : PR [#124](https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/pull/124) (`dd24362`), puis commits `0fc3c59`, `6899447`, `68d6489`, `b95b868` sur la branche par défaut.

---

## 🔧 Correctifs Version 3.2.2

Version de maintenance du **module PRGM** (interpréteur TI-BASIC, `ProgramInterpreter`). Trois bugs qui rendaient la programmation TI-BASIC largement inutilisable en pratique. Chaque correctif a été vérifié par un harnais de tests exécutant de vrais programmes TI-BASIC (13/13 réussis) ; build vert (`tsc -b` + `vite build`).

| # | Bug | Impact |
|---|---|:---:|
| 1 | Opérateurs `=` `≠` `≥` `≤` dans les conditions (`If`/`While`/`Repeat`) | 🔴 Haute |
| 2 | Substitution de variables à l'intérieur des littéraux chaîne (`Disp`/`Output`) | 🔴 Haute |
| 3 | `If` mono-ligne `If cond:commande` (séparateur `:`) | 🟡 Moyenne |

### Détails

- **Opérateurs de comparaison dans les conditions** : le menu TEST de la calculatrice insère `=`, `≠`, `≥`, `≤`, mais l'interpréteur les passait tels quels à mathjs — `=` était traité comme une assignation (`Invalid left hand side of assignment`) et `≠`/`≥`/`≤` (Unicode) n'étaient pas reconnus. `If X=3`, `While X≠0`, `Repeat X≥5`, `If X≤3` crashaient tous (seuls `>` et `<` fonctionnaient). Désormais conversion TI-BASIC → mathjs (`≠`→`!=`, `≥`→`>=`, `≤`→`<=`, `=` isolé → `==`).

- **Littéraux chaîne** : `evaluateExpression` substituait les variables A-Z/θ **avant** de tester la présence d'une chaîne entre guillemets. `Disp "ENTREZ N"` avec `N=5` affichait `ENTREZ 5`. Désormais les chaînes entre guillemets sont retournées telles quelles, sans interpolation.

- **`If` mono-ligne** : `If X>0:Disp "OK"` n'était pas supporté — `parseLine` captait `X>0:Disp "OK"` entier comme condition. Désormais la condition est séparée de la commande inline sur le premier `:` hors guillemets, et la commande est exécutée si la condition est vraie. Le formulaire `If cond` + commande sur la ligne suivante reste inchangé.

- **Bonus** : `findThen` ne plante plus quand `If` est sur la dernière ligne d'un programme (borne `ifLine+1 >= lines.length`).

> 🔗 Détails techniques : PR [#121](https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/pull/121)

---

## 🔧 Correctifs Version 3.2.1

Version de maintenance corrigeant **6 bugs logiques** dans les services mathématiques, financiers et graphiques. Chaque correctif a été vérifié par reproduction (cas de test indépendants) et le build reste vert (`tsc -b` + `vite build`).

| # | Bug | Service | Impact |
|---|---|---|:---:|
| 1 | `ln(X)` cassé en mode graphique (regex `log`/`ln` réordonnées) | GraphingEngine | 🔴 Haute |
| 2 | `QuadReg` renvoyait des coefficients faux (→ Gauss 3×3) | StatisticsService | 🔴 Haute |
| 3 | Séquences récursives `u(n-1)` / `u(n-2)` crashaient | GraphingEngine | 🔴 Haute |
| 4 | `solveN` (TVM) : « Pas de solution » sur prêt standard | FinanceService | 🔴 Haute |
| 5 | `solveI` (TVM) : dérivée de mauvais signe (Newton divergeait) | FinanceService | 🔴 Haute |
| 6 | `DrawInv` : pas d'échantillonnage Y corrigé (`canvasHeight`) | DrawingService | 🟡 Basse |

### Détails

- **`ln(X)` en mode graphique** : le remplacement `ln(` → `Math.log(` s'exécutait *avant* `log(` → `Math.log10(`, ce qui produisait `Math.Math.log10(...)` (`undefined`). Toute fonction utilisant `ln` échouait silencieusement en tracé/calcul. Désormais `log(` est remplacé en premier.

- **QuadReg** : la formule de Cramer manuelle positionnait mal les facteurs `sumY` / `sumXY` / `sumX2Y` et renvoyait p.ex. `a≈237.86` au lieu de `2` pour `y = 2x² + 3x + 1`. Remplacée par le solveur `gaussianElimination` 3×3 déjà utilisé par `CubicReg` / `QuartReg`.

- **Séquences récursives** : `u(n-1)` était transformé en `u((5)-1)` par la substitution de `n` *avant* la résolution des références `u(n-k)`, faisant crasher le tracé. Désormais `u(n-k)` est substitué en premier.

- **TVM `solveN`** : le ratio était l'inverse négatif du ratio correct, renvoyant « Pas de solution » pour un prêt standard. Formule corrigée : `N = -log((PV·i + pmt) / (pmt − FV·i)) / log(1+i)`.

- **TVM `solveI`** : la dérivée de Newton-Raphson avait son signe inversé (divergence ou blocage « Dérivée nulle »). Dérivée corrigée avec le facteur `/(1+i)` manquant.

- **`DrawInv`** : le pas d'échantillonnage sur l'axe Y divisait par `canvasWidth` au lieu de `canvasHeight`, distordant la courbe inverse sur les canvas non carrés.

> 🔗 Détails techniques : PR [#119](https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/pull/119)

---

## ✨ Nouveautés Version 3.2.0

### 💾 **Export/Import de Programmes** (NOUVEAU v3.2!)
- **Formats multiples** : JSON (universel) et .8xp (TI-83 Plus natif)
- **Export individuel** : Boutons dédiés 📄 JSON et 💾 .8xp pour chaque programme
- **Export global** : Sauvegardez tous vos programmes en un fichier
- **Import flexible** : Déposez vos fichiers .8xp ou JSON et ils seront importés automatiquement
- **Tokenisation complète** : Format .8xp 100% compatible avec vraies calculatrices TI-83 Plus
- **Partage facilité** : Partagez vos créations ou utilisez des programmes existants de la communauté
- **Transfert vers calculatrice réelle** : Les .8xp peuvent être envoyés via TI-Connect

### 🔢 **MODE SEQUENCE - Suites Numériques** (NOUVEAU v3.1!)
- **3 fonctions de séquence** : u(n), v(n), w(n) - Comme sur la vraie TI-83 Plus !
- **Expressions récursives** : Support complet de u(n-1), u(n-2), v(n-1), w(n-1), etc.
- **Valeurs initiales** : Configuration de u(0), u(1), v(0), v(1), w(0), w(1)
- **Paramètres de fenêtre** : nMin, nMax, PlotStart, PlotStep pour contrôle précis
- **Modes de tracé** : DOT (points discrets) ou CONNECTED (lignes continues)
- **Options MODE complètes** :
  - Graph : FUNC / PAR / POL / **SEQ** ⭐
  - Plot : CONNECTED / **DOT** ⭐
  - Sequential : SEQUENTIAL / SIMUL ⭐
- **Exemples prêts à l'emploi** :
  - Suite arithmétique : u(n) = u(n-1) + 3
  - Suite géométrique : u(n) = 2*u(n-1)
  - Suite de Fibonacci : u(n) = u(n-1) + u(n-2)
- **Compatibilité** : 100% TI-83 Plus pour les séquences !

### Exemples de suites

```basic
Suite arithmétique (raison 3):
u(n) = u(n-1) + 3
u(0) = 2
→ 2, 5, 8, 11, 14, 17, 20...

Suite géométrique (raison 2):
u(n) = 2*u(n-1)
u(0) = 1
→ 1, 2, 4, 8, 16, 32, 64...

Suite de Fibonacci:
u(n) = u(n-1) + u(n-2)
u(0) = 0, u(1) = 1
→ 0, 1, 1, 2, 3, 5, 8, 13, 21, 34...
```

---

## ✨ Fonctionnalités Version 3.0

### 🎓 **PRGM - Programmation TI-BASIC**
- **Menu PRGM complet** : NEW / EDIT / EXEC
- **38+ commandes TI-BASIC** implémentées avec compatibilité 95% TI-83 Plus
- **Structures de contrôle** :
  - If/Then/Else : Conditions avec branchements
  - For : Boucles avec compteur
  - While : Boucles avec condition en début
  - Repeat : Boucles avec condition en fin
- **Commandes I/O** :
  - Disp : Afficher des valeurs et textes
  - Input : Demander une valeur à l'utilisateur
  - Prompt : Saisie rapide de variables
  - Output : Affichage positionné (ligne, colonne)
  - ClrHome : Effacer l'écran de sortie
- **Navigation** :
  - Lbl : Définir des labels (points de repère)
  - Goto : Sauter à un label
  - prgm : Appeler un sous-programme
  - Return : Retourner au programme appelant
- **Fonctionnalités avancées** :
  - Menu : Menus interactifs avec navigation par boutons
  - DelVar : Supprimer des variables
  - Stop : Arrêter le programme
  - Pause : Pause avec message optionnel
- **Variables globales** : A-Z et θ partagées entre tous les programmes
- **Exemples fournis** : 17 programmes d'exemple (débutant à avancé)
- **Documentation complète** :
  - Guide utilisateur PRGM (PRGM_USER_GUIDE.md)
  - Exemples de programmes (EXAMPLES_PROGRAMS.md)
  - Documentation complète dans l'aide intégrée (onglet 🎓 PRGM)

### 📝 Créer votre premier programme TI-BASIC

```basic
Programme HELLO :
:Disp "BONJOUR"
:Disp "BIENVENUE"
:Input "VOTRE NOM:",A
:Disp "SALUT",A

Programme FACT (Factorielle) :
:Input "N=",N
:1→F
:For(I,1,N)
:F*I→F
:End
:Disp "FACT=",F
```

### 💾 Export/Import de Programmes (NOUVEAU v3.1!)

Sauvegardez et partagez vos programmes TI-BASIC avec support complet des formats JSON et .8xp !

**Formats supportés :**
- **📄 JSON** : Format universel, lisible et éditable - Idéal pour sauvegardes et partage web
- **💾 .8xp** : Format natif TI-83 Plus - Compatible avec vraies calculatrices et émulateurs (TilEm, Wabbitemu)

**Fonctionnalités :**
- **Export individuel** : Boutons 📄 (JSON) et 💾 (.8xp) dans l'onglet EDIT
- **Export global** : Sauvegarder tous vos programmes en un fichier JSON (onglet I/O)
- **Import flexible** : Importer des programmes depuis JSON ou .8xp (onglet I/O)
- **Tokenisation .8xp** : Conversion automatique en format binaire TI-83 Plus
- **Sauvegarde automatique** : localStorage du navigateur (pas besoin d'exporter systématiquement)

**Utilisation :**
1. **Menu PRGM > I/O** pour import/export global
2. **Menu PRGM > EDIT** pour export individuel (boutons 📄 et 💾 sur chaque programme)
3. Les fichiers .8xp peuvent être transférés vers une vraie TI-83 Plus via TI-Connect !

---

## 📊 État de compatibilité TI-83 Plus

Audit du périmètre implémenté par rapport à une vraie TI-83 Plus (basé sur `src/services/`, `src/data/menus.ts` et les éditeurs). Légende : ✅ complet · ⚠️ partiel · ❌ absent.

| Domaine | Statut | Détail / couverture |
|---|:---:|---|
| Calcul de base (arith, trig, log, π, e) | ✅ | ~100 % |
| MATH — NUM / CPX / PRB / hyperbolic | ✅ | ~95 % (complet + extras : `ceil`, `floor`, `sign`, `mod`) |
| MATH — calcul symbolique (`nDeriv(`, `fnInt(`, `fMin`, `fMax`) | ⚠️ | ~15 % — quasi absent |
| ANGLE (`R►Pr`, `R►Pθ`, `P►Rx`, `P►Ry`, `►DMS`) | ⚠️ | ~50 % — conversions génériques (rad↔deg, rect↔polar) mais pas les notations TI exactes |
| Graphing (Func / Param / Polar / Seq) | ✅ | ~95 % — 4 modes + Window/Zoom/Trace + CALC (`value`, `zero`, `min`, `max`, `intersect`, `dy/dx`, `∫f(x)`) |
| DRAW | ✅ | ~100 % — 17/17 (`Line`, `Circle`, `Text`, `Shade`, `Tangent`, `DrawInv`, `StorePic`…) |
| STAT CALC (1/2-Var, 9 régressions) | ✅ | ~95 % — `LinReg`, `QuadReg`, `CubicReg`, `ExpReg`, `SinReg`, `Logistic`… |
| **STAT TESTS** (tests d'hypothèse + intervalles) | ❌ | **~0 %** — `Z-Test`, `T-Test`, `2-Samp`, `1-PropZ`, `χ²-Test`, `ANOVA`, `LinRegTTest`… manquants |
| DISTR (15 lois) | ✅ | ~100 % — `normalpdf/cdf`, `invNorm`, `t`, `χ²`, `F`, `binom`, `poisson`, `geomet` |
| LIST OPS | ✅ | ~95 % — `SortA/D`, `dim`, `Fill`, `seq`, `cumSum`, `ΔList`, `mean`, `stdDev`… |
| MATRX (éditeur + MATH/OPS) | ✅ | ~90 % — éditeur `[A]`-`[J]` ✅ + opérations `det`, `rref`/`ref`, `identity`, `randM`, `augment`, `Matr►list`/`List►matr`, `rowSwap`/`*row`/`*row+`/`*row-`, transposée, inverse, `dim`, `cumSum` (v3.4.0). Manque : `Fill`/`SortA` en place, stockage résultat→matrice |
| FINANCE (TVM + cash flows) | ✅ | ~95 % — `tvm_PV/N/I/PMT/FV`, `NPV`, `IRR`, `bal`, `ΣPrn`, `ΣInt`, `Nom`, `Eff` |
| SOLVER | ✅ | ~100 % |
| PRGM (TI-BASIC) | ✅ | ~75 % — 39+ commandes + `getKey` (jeux) ; manquent : chaînes (`length`, `sub`, `inString`, `expr`), `Archive`, `Asm(`, link |
| TABLE / VARS / Y-VARS / MODE / MEM | ✅ | ~95 % — éditeurs présents |
| CATALOG | ⚠️ | ~70 % — construit dynamiquement à partir des menus |

### Synthèse

- **~85 %** en comptant toutes les commandes du catalogue TI-83 Plus
- **~90 %** en pondérant par l'usage courant (lycée / enseignement supérieur)

### Principal manque restant

1. **STAT TESTS** — un menu entier (tests d'hypothèses / intervalles de confiance) est absent, alors que les *distributions* (DISTR) sont complètes. C'est le plus gros écart pour un usage statistique.

Manques mineurs : `nDeriv(`/`fnInt(` (calcul), fonctions chaîne en PRGM, notations ANGLE exactes, `Fill`/`SortA` matricielles en place, stockage d'un résultat matriciel vers une variable matrice.

---

## 🔒 Améliorations par rapport à la version JavaScript

### **Sécurité et Robustesse**
- ✅ **Typage statique complet** avec TypeScript
- ✅ **Détection d'erreurs à la compilation**
- ✅ **Interfaces strictes** pour tous les composants
- ✅ **Validation des types** à chaque étape

### ⚡ **Performance Optimisée**
- ✅ **React.memo** pour éviter les re-rendus inutiles
- ✅ **useCallback** pour optimiser les callbacks
- ✅ **Zustand** : gestion d'état 10x plus rapide que Redux
- ✅ **Virtual DOM** de React pour des mises à jour efficaces
- ✅ **Build optimisé** avec tree-shaking et minification (310 KB gzip)

### 🏗️ **Architecture Moderne**
- ✅ **Composants modulaires** et réutilisables
- ✅ **Séparation des responsabilités** (UI / Logic / State)
- ✅ **Services dédiés** pour le graphique, les stats, les maths, les programmes
- ✅ **Store centralisé** avec Zustand
- ✅ **Types réutilisables** pour toute l'application

---

## 📦 Installation et Démarrage

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build de production
npm run build

# Prévisualiser le build
npm run preview
```

L'application sera disponible sur `http://localhost:5173`

### 🚀 Déploiement

Voir [DEPLOIEMENT-BLOG-V3.0.md](./DEPLOIEMENT-BLOG-V3.0.md) pour le guide complet de déploiement.

---

## 🎯 Fonctionnalités Principales

### 🎓 **PRGM - Programmation TI-BASIC** (v3.0.0.0)
- **Éditeur de programmes** avec syntaxe TI-BASIC
- **Exécution de programmes** avec affichage de sortie
- **Gestion des programmes** : NEW, EDIT, EXEC, DELETE
- **38+ commandes** : I/O, contrôle, navigation, avancées
- **Variables globales** : Partage entre programmes
- **Menus interactifs** : Interface utilisateur conviviale
- **Compatibilité** : 95% avec TI-83 Plus

### 🎨 **DRAW - Outils de dessin** (v2.6.0.0)
- **15 commandes de dessin** graphique
  - Line, Horizontal, Vertical, Circle, Text
  - Tangent, DrawF, DrawInv, Shade
  - Pt-On, Pt-Off, Pt-Change
  - StorePic, RecallPic (Pic1-Pic10)
- **Compatibilité** : 100% TI-83 Plus
- **Accès** : 2ND + PRGM (menu DRAW)

### 🎯 **SOLVER & CATALOG**
- **SOLVER** (MATH > 0) : Résolveur d'équations f(X)=0
  - Méthode de Newton-Raphson avec fallback bisection
  - Précision : 10 décimales
  - Support complet des fonctions mathématiques
- **CATALOG** (2ND + 0) : Liste alphabétique de 100+ fonctions
  - Recherche rapide par lettre (A-Z)
  - Navigation intuitive ↑↓
  - Insertion directe dans l'input

### 📊 **Graphiques**
- Tracer jusqu'à 6 fonctions simultanément (Y1 à Y6)
- **Modes graphiques** : Function, Parametric, Polar, **Sequence** ⭐
- **MODE SEQUENCE** (v3.1) : Suites u(n), v(n), w(n) avec expressions récursives
- Zoom In/Out, presets (Standard, Decimal, Trig, Square)
- Mode Trace pour suivre les courbes
- Calculs sur courbe (zéros, min, max, intégrale, dérivée)
- **TABLE** (2ND + GRAPH) : Affichage tabulaire avec TBLSET

### 📈 **Statistiques & Listes**
- Édition de listes (L1-L6) avec éditeur complet
- **STAT PLOT** (2ND + Y=) : 5 types de graphiques
  - Scatter, xyLine, Histogram, Box Plot (normal et modifié)
  - 3 plots indépendants configurables
  - Marqueurs personnalisables (□, +, •)
- Statistiques à 1 et 2 variables (mean, Sx, σx, Q1, Med, Q3)
- **12 types de régressions** :
  - LinReg, QuadReg, CubicReg, QuartReg
  - ExpReg, PwrReg, LnReg, SinReg, Logistic
  - Med-Med, LinReg(a+bx)
- **LIST OPS** (2ND + STAT) : 15 fonctions sur listes
  - SortA, SortD, dim, Fill, seq, cumSum, ΔList
  - min, max, mean, median, sum, prod, stdDev, variance

### 🧮 **MATH - 38 Fonctions en 6 Catégories**
- **MATH** : ³√, logBASE, e^x, 10^x, hypot
- **NUM** : abs, round, iPart, fPart, min, max, gcd, lcm, ceil, floor, sign, trunc, mod
- **CPX** : conj, real, imag, angle, abs, Rect, Polar
- **PRB** : rand, nPr, nCr, !, randInt, randNorm, randBin
- **ANGLE** : °→rad, rad→°, →DMS, →Dec
- **TRIG** : sinh, cosh, tanh, asinh, acosh, atanh

### 📊 **DISTR - Distributions Statistiques**
- **Distributions Continues** :
  - Normale : normalpdf, normalcdf, invNorm
  - Student t : tpdf, tcdf
  - Chi-carré : χ²pdf, χ²cdf
  - Fisher F : Fpdf, Fcdf
- **Distributions Discrètes** :
  - Binomiale : binompdf, binomcdf
  - Poisson : poissonpdf, poissoncdf
  - Géométrique : geometpdf, geometcdf
- Accès via **2ND + VARS** (DISTR)

### 🔍 **TEST & LOGIC**
- **Opérateurs de Comparaison** : =, ≠, >, ≥, <, ≤
- **Opérateurs Logiques** : and, or, xor, not
- Retournent **1** (vrai) ou **0** (faux)
- Accès via **2ND + MATH** (TEST/LOGIC)

### 💰 **Finance TVM**
- **Calculateur financier professionnel** (APPS)
- **7 variables TVM** : N, I%, PV, PMT, FV, P/Y, C/Y
- Calcul automatique de n'importe quelle variable
- Mode END/BEGIN pour paiements début/fin de période
- Applications : prêts, épargne, investissements, retraite

### 💾 **Mémoire & Variables**
- **MEM** (2ND + +) : Gestion mémoire complète
  - Reset total ou suppression sélective
  - Variables A-Z, θ (stockage avec STO→)
  - Listes L1-L6
  - Matrices A-J
- **MATRIX** (2ND + X⁻¹) : Calcul matriciel complet
  - Éditeur de grille avec navigation
  - Opérations : +, −, ×, ^, transposée
  - Fonctions : det, dim, Fill, identity, randM
  - Support des calculs complexes

### 🔢 **Calculs**
- Opérations arithmétiques de base (+, −, ×, ÷)
- Fonctions trigonométriques (sin, cos, tan, asin, acos, atan)
- Fonctions exponentielles et logarithmiques (ln, log, exp, e^x, 10^x)
- Racines et puissances (√, ³√, ^, x²)
- Parenthèses et ordre des opérations
- **ANS** : Calculs en chaîne avec le dernier résultat
- **STO→** et **RCL** : Stockage et rappel de variables

---

## 🚀 Guide d'Utilisation Rapide

### Créer un programme TI-BASIC

1. **Nouveau programme**
   - Cliquer sur **PRGM**
   - Onglet **NEW**
   - Cliquer sur "+ Nouveau programme"
   - Nom : `HELLO` (max 8 caractères)
   - Cliquer sur **Créer**

2. **Écrire le code**
   - L'éditeur s'ouvre automatiquement
   - Taper : `:Disp "BONJOUR"`
   - Appuyer sur **CLEAR** pour fermer l'éditeur

3. **Exécuter**
   - **PRGM** → Onglet **EXEC**
   - Sélectionner **HELLO**
   - Cliquer sur **Exécuter**
   - Le programme affiche "BONJOUR" puis "[TERMINÉ]"

### Exemples de programmes

#### Calculer une factorielle
```basic
:Input "N=",N
:1→F
:For(I,1,N)
:F*I→F
:End
:Disp "FACT=",F
```

#### Jeu Plus ou Moins
```basic
:randInt(1,100)→N
:0→T
:Repeat G=N
:Input "NOMBRE:",G
:T+1→T
:If G<N
:Disp "PLUS"
:If G>N
:Disp "MOINS"
:End
:Disp "GAGNE EN",T,"COUPS"
```

#### Menu interactif
```basic
:ClrHome
:Lbl 0
:Menu("CALC","ADDITION",1,"MULT",2,"QUIT",9)
:Lbl 1
:Input "A:",A
:Input "B:",B
:Disp "SOMME=",A+B
:Pause
:Goto 0
:Lbl 2
:Input "A:",A
:Input "B:",B
:Disp "PRODUIT=",A*B
:Pause
:Goto 0
:Lbl 9
:Stop
```

### Calculer un prêt avec FINANCE TVM

1. **Ouvrir le Finance TVM Solver**
   - Cliquer sur **APPS**
   - Le TVM Solver s'affiche avec 7 variables

2. **Exemple : Calculer la mensualité d'un prêt immobilier**
   - **N** = `240` (20 ans × 12 mois)
   - **I%** = `3.5` (taux annuel 3.5%)
   - **PV** = `200000` (emprunt de 200 000€)
   - **PMT** = `0` (à calculer)
   - **FV** = `0` (solde final = 0)
   - **P/Y** = `12` (12 paiements par an)
   - **C/Y** = `12` (12 compositions par an)

3. **Calculer PMT**
   - Naviguer avec **↑ ↓** jusqu'à **PMT**
   - Appuyer sur **GRAPH**
   - Résultat : PMT = **-1158.03€** (paiement mensuel)

---

## 🏗️ Architecture du Projet

```
src/
├── types/                    # Types TypeScript
│   ├── calculator.types.ts   # Types calculatrice
│   ├── graph.types.ts        # Types graphiques
│   ├── program.types.ts      # Types programmes TI-BASIC
│   ├── draw.types.ts         # Types dessin
│   └── menu.types.ts         # Types menus
│
├── store/                    # Gestion d'état Zustand
│   ├── calculatorStore.ts    # Store global
│   └── programStore.ts       # Store programmes
│
├── services/                 # Logique métier
│   ├── GraphingEngine.ts     # Moteur de graphiques
│   ├── ProgramInterpreter.ts # Interpréteur TI-BASIC
│   ├── DrawingService.ts     # Service de dessin
│   └── ListService.ts        # Service listes
│
├── components/               # Composants React
│   ├── Calculator/
│   │   ├── Calculator.tsx    # Composant principal
│   │   ├── Display.tsx       # Écran LCD
│   │   └── Keyboard.tsx      # Clavier
│   ├── Graph/
│   │   └── GraphCanvas.tsx   # Canvas graphique
│   └── Program/
│       ├── ProgramMenu.tsx   # Menu PRGM
│       ├── ProgramEditor.tsx # Éditeur de programmes
│       └── ProgramOutput.tsx # Sortie d'exécution
│
├── styles/
│   └── ti83.css             # Styles TI-83
│
├── App.tsx                   # App principale
└── main.tsx                  # Point d'entrée
```

---

## 🎨 Technologies Utilisées

| Technologie | Version | Utilisation |
|------------|---------|-------------|
| React | 19.1+ | Framework UI avec Virtual DOM |
| TypeScript | 5.6+ | Typage statique et sécurité |
| Zustand | 5.0+ | Gestion d'état centralisée |
| Vite | 7.2+ | Build tool ultra-rapide |
| MathJS | 14.0+ | Calculs mathématiques complexes |
| Workbox | 7.3+ | Service Worker pour PWA |
| Sharp | 0.34+ | Génération d'icônes PWA |

---

## 📊 Statistiques Version 3.1.0

| Métrique | Valeur |
|----------|--------|
| **Commandes TI-BASIC** | 39+ |
| **Modes graphiques** | 4 (FUNC, PAR, POL, SEQ) |
| **Compatibilité TI-83 Plus** | 100% |
| **Lignes de code totales** | +3,500 |
| **Documentation** | 3,000+ lignes |
| **Programmes exemples** | 17 |
| **Build size (gzip)** | 314 KB |
| **Fichiers précachés** | 14 |
| **Archives de déploiement** | 369 KB |

---

## 📚 Documentation

- **[calculatrice-ti83-react/RELEASE_NOTES_v3.1.md](./calculatrice-ti83-react/RELEASE_NOTES_v3.1.md)** : Notes de version 3.1.0
- **[calculatrice-ti83-react/DOWNLOAD_v3.1.md](./calculatrice-ti83-react/DOWNLOAD_v3.1.md)** : Guide de téléchargement et déploiement
- **[PRGM_USER_GUIDE.md](./PRGM_USER_GUIDE.md)** : Guide complet de programmation TI-BASIC
- **[EXAMPLES_PROGRAMS.md](./EXAMPLES_PROGRAMS.md)** : 17 programmes d'exemple
- **[DEPLOIEMENT-BLOG-V3.0.md](./DEPLOIEMENT-BLOG-V3.0.md)** : Guide de déploiement sur blog
- **[CHANGELOG.md](./CHANGELOG.md)** : Historique complet des versions
- **[PWA_GUIDE.md](./PWA_GUIDE.md)** : Guide PWA (Progressive Web App)
- **[docs/](./docs/)** : Documentation développeur complète

---

## 🐛 Dépannage

### Le programme ne s'exécute pas
- Vérifier que le programme est bien enregistré (CLEAR après édition)
- S'assurer que toutes les structures (If/For/While/Repeat) ont leur End
- Vérifier que les labels référencés par Goto/Menu existent
- Consulter l'aide intégrée (onglet 🎓 PRGM)

### Le graphique ne s'affiche pas
- Vérifier que vous avez bien cliqué sur **ENTER** après avoir tapé la fonction dans Y=
- S'assurer que X est en **majuscule**
- Utiliser **WINDOW** ou **ZOOM** pour ajuster la fenêtre de visualisation

### Les touches ne répondent pas
- Actualiser la page (Ctrl+R / Cmd+R)
- Vérifier la console du navigateur (F12) pour les erreurs

---

## 🤝 Contribution

Les contributions sont bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

MIT License - Voir le fichier LICENSE

---

## 👨‍💻 Crédits

Converti de JavaScript vers **React + TypeScript** pour une meilleure robustesse, maintenabilité et performance.

**Technologies** : React 19, TypeScript 5, Zustand, Vite, MathJS

---

**Profitez de cette calculatrice graphique moderne avec programmation TI-BASIC ! 🎉**
