# 📝 Changelog - Calculatrice TI-83 Plus PWA

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

---

## [3.3.1] - 2026-06-21

### 🐛 Corrigé - Mapping ALPHA du clavier (partiel)
Correctif partiel du mapping ALPHA dans `Keyboard.tsx` — seules les touches confirmées à 100 % par le guidebook TI officiel sont corrigées ; le reste attend la table autoritaire complète.
- **Rang du haut** : MATH/APPS/PRGM/VARS/CLEAR = alpha A/B/C/D/E (avant : aucune lettre — confirmé guidebook « ƒ [A] above MATH », « ƒ [B] above APPS »). `ALPHA + MATH` tape désormais « A ».
- **Doublon `X`** : la touche `÷` produisait à tort `X` (doublon avec `X,T,θ,n`, la vraie touche X). Supprimé.
- **Doublons A-E** : les touches numériques 7/8/9/4/5 portaient les mauvaises lettres A/B/C/D/E ; retirées pour éviter les doublons avec le rang haut désormais correct.
- **⚠️ Non corrigé (doute)** : F-M et N-Z sur les touches scientifiques/numériques, caractères spéciaux (`0`/`.`/`)`/`+`), et `LN='n'` minuscule — sources web contradictoires, à aligner avec le diagramme officiel du guidebook TI.

## [3.3.0] - 2026-06-21

### ✨ Ajouté - Module PRGM : `getKey` & support des jeux
- **`getKey`** : lecture de l'entrée clavier dans les programmes TI-BASIC. Renvoie le code de la dernière touche pressée (0 si aucune), puis remet le tampon à 0 (la lecture consomme, comme une vraie TI-83). Permet d'écrire des jeux et programmes interactifs.
- **Codes officiels TI-BASIC** (`ligne×10+colonne`) : table `GETKEY_CODES` dans `Calculator.tsx` — flèches gauche 24 / haut 25 / droite 26 / bas 34, CLEAR 45, ENTER 105, chiffres 1-9 (92-100) et 0 (102).
- **Routage des touches** : hors des modes `Input`/`Menu`/`Prompt`, les touches alimentent `pushKey()` au lieu de déclencher la calculatrice.
- **Tampon vidé** au lancement de chaque programme (`programStore.ts`) ; `getKey` seul sur une ligne vide le tampon (idiome de reset).
- Testé 5/5, banc 22/22, syntaxe validée.

## [3.2.3] - 2026-06-21

### 🐛 Corrigé - Module PRGM (saisie Input/Prompt & affichage)
- **`Input`/`Prompt` sautait la ligne suivante** : double-incrément de `currentLine` dans `provideInput` — l'interpréteur avançait déjà passé la commande, qui était incrémentée une 2ᵉ fois avant la reprise. `Input N:Disp N*2` affiche désormais `N*2`. (PR [#124](https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/pull/124), commit `dd24362`)
- **`onComplete` prématuré en attente de Input/Menu** : la condition de fin d'exécution ne vérifiait que `isPaused` → le statut [TERMINÉ] s'affichait pendant la saisie. Ajout des gardes `isWaitingInput`/`isWaitingMenu`. (commit `0fc3c59`)
- **Drapeaux d'attente non propagés vers le store** : `isWaitingInput` posé sur `context` était figé à `false` par la recopie de `addOutput()` → champ de saisie absent, touches non routées. Resynchronisation des drapeaux réels du contexte vers le store après chaque exécution (run, resume, provideInput, provideMenuSelection). (commit `68d6489`)
- **Clavier Android intempestif** : le champ `Input` n'ouvre plus le clavier système — seules les touches calc (1-9, ENTER…) l'alimentent. (commit `6899447`)
- **Résultat effacé après saisie (FACT)** : les chemins `resume`/`provideInput`/`menu` appelaient `stopProgram()` → le programme se fermait en fin d'Input et le résultat disparaissait. Désormais `isCompleted = true` (sortie persistée avec [TERMINÉ] et bouton Fermer). (commit `b95b868`)
- **Champ tronqué au scroll (TEST)** : blocs interactifs (saisie/menu/erreur/pause) en flux normal au lieu de `position: absolute` → toujours visibles, jamais coupés par le défilement. (commit `b95b868`)

## [3.2.2] - 2026-06-21

### 🐛 Corrigé - Module PRGM (interpréteur TI-BASIC)
- **Opérateurs de comparaison `=` `≠` `≥` `≤` dans les conditions** : ces opérateurs (insérés par le menu TEST) faisaient planter l'évaluation — `=` était traité comme une assignation par mathjs, et `≠`/`≥`/`≤` (Unicode) n'étaient pas reconnus. `If X=3`, `While X≠0`, `Repeat X≥5`, `If X≤3` fonctionnent désormais (conversion TI-BASIC → mathjs dans `evaluateCondition`).
- **Substitution de variables dans les littéraux chaîne** : `Disp "ENTREZ N"` avec `N=5` n'affiche plus `ENTREZ 5` — les chaînes entre guillemets sont retournées telles quelles, sans interpolation.
- **`If` mono-ligne `If cond:commande`** : le séparateur `:` est désormais géré (la commande inline est exécutée si la condition est vraie).
- **`findThen`** : ne plante plus quand `If` est sur la dernière ligne d'un programme.

## [3.2.1] - 2026-06-21

### 🐛 Corrigé - Mathématiques, Finance & Graphique
- **`ln(X)` en mode graphique** : les remplacements `log`/`ln` s'effectuaient dans le mauvais ordre (`Math.Math.log10` indéfini) ; `ln` se trace désormais correctement.
- **`QuadReg`** : coefficients erronés (formule de Cramer manuelle) → remplacée par élimination de Gauss 3×3 (cohérent avec `CubicReg`/`QuartReg`).
- **Séquences récursives `u(n-1)`/`u(n-2)`** : la substitution de `n` se faisait avant celle de `u(n-k)`, faisant crasher le tracé ; ordre corrigé.
- **TVM `solveN`** : renvoyait « Pas de solution » pour un prêt standard (ratio inversé) ; formule corrigée.
- **TVM `solveI`** : la dérivée de Newton-Raphson avait son signe inversé (divergence) ; dérivée corrigée.
- **`DrawInv`** : le pas d'échantillonnage Y divisait par `canvasWidth` au lieu de `canvasHeight` ; corrigé.

## [3.0.0.0] - 2025-11-10

### 🎓 Ajouté - Programmation TI-BASIC Complète
- **PRGM** (Bouton PRGM) : Menu de programmation complet
  - **ProgramMenu** : Interface avec 3 onglets (NEW, EDIT, EXEC)
  - **ProgramEditor** : Éditeur de code TI-BASIC avec syntaxe highlighting
  - **ProgramOutput** : Affichage de sortie avec état [TERMINÉ] persistant
  - **ProgramStore** : Gestion d'état Zustand pour programmes
  - **ProgramInterpreter** : Interpréteur TI-BASIC complet

- **38+ Commandes TI-BASIC** avec compatibilité 95% TI-83 Plus :
  - **I/O (5 commandes)** :
    - Disp : Afficher valeurs et textes (support multi-valeurs)
    - Input : Demander une valeur avec prompt personnalisé
    - Prompt : Saisie rapide de variables (multi-variables)
    - Output : Affichage positionné (ligne, colonne, texte)
    - ClrHome : Effacer l'écran de sortie

  - **Structures de contrôle (7 commandes)** :
    - If/Then/Else/End : Conditions avec branchements
    - For/End : Boucles avec compteur (variable, début, fin, pas)
    - While/End : Boucles avec condition en début
    - Repeat/End : Boucles avec condition en fin

  - **Navigation (4 commandes)** :
    - Lbl : Définir des labels (A-Z, 0-9, θ)
    - Goto : Sauter à un label (avec scan préalable)
    - prgm : Appeler un sous-programme (récursif avec stack)
    - Return : Retourner au programme appelant

  - **Fonctionnalités avancées (4 commandes)** :
    - Menu : Menus interactifs avec boutons cliquables
    - DelVar : Supprimer des variables
    - Stop : Arrêter le programme immédiatement
    - Pause : Pause avec message optionnel

- **Fonctionnalités techniques** :
  - **Variables globales** : A-Z et θ partagées entre tous les programmes
  - **Stack d'appels** : Support des appels récursifs de programmes
  - **Label scanning** : Pré-scan des labels pour Goto performant
  - **Context suspension** : Pause pour Input et Menu avec reprise
  - **Affichage persistant** : L'output reste visible après exécution
  - **Gestion d'erreurs** : Messages d'erreur TI-83 compatibles

### 📚 Documentation
- **PRGM_USER_GUIDE.md** : Guide complet de programmation (10 chapitres)
- **EXAMPLES_PROGRAMS.md** : 17 programmes d'exemple :
  - Débutant (4) : Hello World, Factorielle, Fibonacci, Somme
  - Intermédiaire (5) : Conversion température, Calculatrice avec menus, Plus/Moins
  - Avancé (4) : Gestionnaire de notes, Convertisseur universel
  - Projets complets (4) : Jeux et applications complexes
- **Aide intégrée** : Nouvel onglet 🎓 PRGM avec documentation complète
- **README.md** : Mise à jour complète avec exemples PRGM
- **docs/** : Organisation de la documentation développeur
  - TEST_PHASE4.md : Tests Lbl/Goto/Return
  - TEST_PHASE5.md : Tests prgm/Menu/DelVar
  - ROADMAP_PRGM_v3.0.md : Roadmap des 6 phases
  - V3.0_COMPLETION_SUMMARY.md : Résumé technique complet
  - AVANCEMENT_TI83_PLUS.md : Historique d'avancement

### 🔧 Amélioré
- **HelpModal** : Nouvelle version 3.0.0.0 affichée
  - Nouvel onglet 🎓 PRGM avec 214 lignes de documentation
  - Mise à jour footer : "🎓 PRGM TI-BASIC (38+ cmd)"
  - Mise à jour taille : 362 KB (308 KB compressé)
  - Mise à jour cache : 14 fichiers
- **ExecutionContext** : Ajout du flag `isCompleted` pour garder l'output visible
- **ProgramOutput** : Affichage "[TERMINÉ]" et bouton "Fermer" au lieu de "Arrêter"
- **Archives de déploiement** : Nouvelles archives v3.0.0.0
  - calculatrice-ti83-blog-v3.0.0.0.tar.gz (363 KB)
  - calculatrice-ti83-blog-v3.0.0.0.zip (364 KB)

### 🧹 Nettoyage
- Suppression des anciennes archives de déploiement (v2.7)
- Suppression de DEPLOIEMENT-BLOG.md (remplacé par V3.0)
- Suppression de RELEASE_NOTES_v2.7.0.0.md
- Organisation de la documentation dans docs/

### 📊 Statistiques
- **+3,000 lignes de code** ajoutées
- **+2,500 lignes de documentation** créées
- **17 programmes d'exemple** fournis
- **6 phases de développement** complétées (~20h)
- **95% compatibilité** TI-83 Plus
- **Build size** : 1,076 KB JS (310 KB gzippé)
- **Total précache** : 1,136 KB (14 fichiers)

---

## [2.7.0.0] - 2025-11-09

### Transition vers la version 3.0.0.0
Version intermédiaire préparant l'implémentation de PRGM.

---

## [2.6.0.0] - 2025-11-09

### ✨ Ajouté
- **DRAW** (2ND + PRGM) : Outils de dessin graphique complets
  - **DrawingService** : Service dédié pour le rendu des éléments graphiques
  - **Commandes de base** :
    - ClrDraw : Effacer tous les dessins
    - Line( : Tracer une ligne entre deux points
    - Horizontal : Ligne horizontale à une valeur Y
    - Vertical : Ligne verticale à une valeur X
    - Circle( : Dessiner un cercle (centre + rayon)
    - Text( : Afficher du texte sur le graphique
  - **Commandes avancées** :
    - Tangent( : Tracer la tangente à une fonction en un point
    - DrawF : Dessiner une fonction
    - DrawInv : Dessiner l'inverse d'une fonction
    - Shade( : Ombrage entre deux courbes
  - **POINTS** (sous-menu) :
    - Pt-On( : Activer un point
    - Pt-Off( : Désactiver un point
    - Pt-Change( : Inverser l'état d'un point
  - **STO** (sous-menu) :
    - StorePic : Sauvegarder le graphique actuel (Pic1-Pic10)
    - RecallPic : Rappeler un graphique sauvegardé
    - StoreGDB : Sauvegarder la base de données graphique
    - RecallGDB : Rappeler une base de données graphique
  - Conversion automatique coordonnées graphiques ↔ pixels
  - Rendu canvas optimisé avec anti-aliasing

- **LIST OPS & MATH** (2ND + STAT) : Opérations complètes sur les listes
  - **ListService** : Service dédié avec 15 fonctions statistiques
  - **NAMES** (sous-menu) : Accès rapide aux listes
    - L₁, L₂, L₃, L₄, L₅, L₆ (avec indices en exposant)
  - **OPS** (sous-menu) : 7 opérations sur listes
    - SortA( : Tri croissant
    - SortD( : Tri décroissant
    - dim( : Dimension (taille) d'une liste
    - Fill( : Remplir une liste avec une valeur
    - seq( : Générer une séquence selon une expression
    - cumSum( : Somme cumulée
    - ΔList( : Différences successives (delta)
  - **MATH** (sous-menu) : 8 fonctions mathématiques
    - min( : Minimum d'une liste
    - max( : Maximum d'une liste
    - mean( : Moyenne arithmétique
    - median( : Médiane
    - sum( : Somme de tous les éléments
    - prod( : Produit de tous les éléments
    - stdDev( : Écart-type (échantillon)
    - variance( : Variance (échantillon)
  - Support des expressions mathématiques dans seq()
  - Intégration avec MathJS pour évaluation d'expressions

### 🔧 Amélioré
- **calculatorStore** : Ajout de l'état DRAW (drawElements, pictures)
  - Actions : addDrawElement, clearDraw, storePicture, recallPicture
- **GraphCanvas** : Rendu des éléments DRAW par-dessus les graphiques
  - Intégration transparente avec le moteur graphique
- **Menu System** : Nouveaux menus DRAW et LIST avec sous-menus
- **Types TypeScript** : draw.types.ts avec 8 types d'éléments dessinés
  - DrawLine, DrawHorizontal, DrawVertical, DrawCircle
  - DrawText, DrawFunction, DrawShade, DrawPoint

### 📚 Documentation
- README : Ajout des sections DRAW et LIST OPS
- Types draw.types.ts entièrement documentés
- ROADMAP-DRAW-LIST.md : Plan détaillé d'implémentation

---

## [2.5.0.0] - 2025-11-09

### ✨ Ajouté
- **DISTR** (2ND + VARS) : 15 distributions statistiques professionnelles
  - **Distributions Continues** :
    - Loi Normale : normalpdf(x,μ,σ), normalcdf(lower,upper,μ,σ), invNorm(area,μ,σ)
    - Loi de Student t : tpdf(x,df), tcdf(lower,upper,df)
    - Loi du Chi-carré : χ²pdf(x,df), χ²cdf(lower,upper,df)
    - Loi de Fisher F : Fpdf(x,df1,df2), Fcdf(lower,upper,df1,df2)
  - **Distributions Discrètes** :
    - Loi Binomiale : binompdf(n,p,x), binomcdf(n,p,x)
    - Loi de Poisson : poissonpdf(λ,x), poissoncdf(λ,x)
    - Loi Géométrique : geometpdf(p,x), geometcdf(p,x)
  - Méthodes numériques : fonction d'erreur (erf), fonction Gamma, fonction Beta
  - Intégration de Simpson pour les CDF complexes
  - Approximation Beasley-Springer-Moro pour invNorm

- **TEST** (2ND + MATH) : 6 opérateurs de comparaison
  - Égalité : = (testEqual)
  - Différence : ≠ (testNotEqual)
  - Supériorité : > (testGreater), ≥ (testGreaterEqual)
  - Infériorité : < (testLess), ≤ (testLessEqual)
  - Retournent 1 (vrai) ou 0 (faux)

- **LOGIC** (2ND + MATH, sous-menu) : 4 opérateurs logiques
  - ET logique : and
  - OU logique : or
  - OU exclusif : xor
  - NON logique : not(
  - Retournent 1 (vrai) ou 0 (faux)

### 🔧 Amélioré
- **DistributionService** : Service dédié avec toutes les distributions
  - Précision numérique professionnelle
  - Gestion robuste des cas limites
  - Optimisation des calculs itératifs
- **MathFunctionsService** : Intégration des 15 distributions + TEST + LOGIC
- **CatalogViewer** : Ajout des nouvelles fonctions dans le catalogue alphabétique
  - chi2cdf, chi2pdf, Fcdf, Fpdf, invNorm, tcdf, tpdf
  - χ²cdf, χ²pdf (avec caractère spécial)
- **Menu System** : 3 nouveaux menus (DISTR, TEST, LOGIC)
  - Navigation fluide
  - Insertion automatique dans l'input
  - Handlers dédiés pour chaque menu

### 📝 Documentation
- **HelpModal** : Documentation complète DISTR, TEST & LOGIC
  - Exemples d'utilisation avec résultats
  - Description des paramètres
  - Guide d'utilisation
- **README.md** : Ajout des sections DISTR, TEST & LOGIC
- **CHANGELOG.md** : Mise à jour avec v2.5.0.0
- Mise à jour de la version affichée à 2.5.0.0

### 🎯 Impact
- **Fonctionnalités statistiques** : 100% implémentées
- **Tests et logique** : 100% implémentés
- **Compatibilité TI-83 Plus** : 80% (ajout de 25+ fonctions)
- Applications : statistiques descriptives, inférence statistique, tests d'hypothèses, probabilités

---

## [2.4.0.0] - 2025-11-08

### ✨ Ajouté
- **FINANCE TVM** (APPS) : Calculateur financier professionnel complet
  - **TVM Solver** : Time Value of Money (Valeur Temporelle de l'Argent)
  - **7 variables** : N, I%, PV, PMT, FV, P/Y, C/Y
  - Calcul automatique de n'importe quelle variable
  - **Mode END/BEGIN** : Paiements en fin ou début de période
  - **Méthode de Newton-Raphson** pour le calcul du taux d'intérêt I%
  - Précision financière professionnelle (6 décimales)
  - Interface intuitive avec navigation ↑↓
  - **Exemples d'utilisation** :
    - Prêts hypothécaires : calcul de mensualités
    - Épargne retraite : projection du capital futur
    - Crédits auto : calcul de la durée de remboursement
    - Investissements : calcul du taux de rendement effectif

### 📝 Fonctionnalités TVM
- **solveN()** : Calcul du nombre de périodes
- **solveI()** : Calcul du taux d'intérêt annuel (Newton-Raphson)
- **solvePV()** : Calcul de la valeur actuelle
- **solvePMT()** : Calcul du paiement périodique
- **solveFV()** : Calcul de la valeur future
- Conversion automatique des taux périodiques
- Support des fréquences de paiement et composition différentes
- Gestion des paiements en début ou fin de période

### 🎨 Interface Finance
- Affichage clair des 7 variables avec valeurs
- Indicateur visuel du champ sélectionné
- Bouton END/BEGIN pour basculer le mode de paiement
- Messages d'erreur explicites
- Affichage du nombre d'itérations pour I%

### 📚 Documentation
- Section Finance complète dans le HelpModal
- Guide d'utilisation avec 3 exemples détaillés
- Documentation des conventions financières (flux positifs/négatifs)
- Exemples dans le README.md
- Mise à jour de la version à 2.4.0.0

---

## [2.3.0.1] - 2025-11-08

### 🐛 Corrigé
- **Solver - Touche ^2** : Ajout du support de la touche x² dans le Solver
  - La touche X² insère maintenant correctement `^2` en mode édition
- **Solver - Touche DEL** : Correction de l'effacement arrière
  - DEL était intercepté avant d'atteindre le Solver
  - Ajout du mode SOLVER aux exceptions de gestion générale de DEL
  - DEL fonctionne maintenant correctement pour effacer les caractères

### ✨ Ajouté
- **Solver - Fonctions mathématiques étendues**
  - Support complet : sin, cos, tan, sqrt, ln, log, 1/X
  - Facilite l'écriture d'équations complexes directement dans le Solver

### 📝 Documentation
- Mise à jour du HelpModal avec exemples détaillés du Solver
- Mise à jour du README.md avec toutes les nouvelles fonctionnalités
- Mise à jour du CHANGELOG.md

---

## [2.3.0.0] - 2025-11-08

### ✨ Ajouté
- **CATALOG** (2ND + 0) : Liste alphabétique de 100+ fonctions mathématiques
  - Navigation intuitive avec ↑↓
  - Recherche rapide par lettre (A-Z)
  - Insertion directe dans l'input avec ENTER
  - Toutes les fonctions TI-83 Plus disponibles
- **SOLVER** (MATH > 0) : Résolveur d'équations f(X)=0
  - Méthode de Newton-Raphson avec convergence rapide
  - Fallback automatique sur méthode de bisection si nécessaire
  - Précision numérique : 10 décimales (10⁻¹⁰)
  - Affichage du nombre d'itérations effectuées
  - Support complet des fonctions mathématiques
  - Interface intuitive avec navigation clavier
    - ↑↓ : Naviguer entre Équation et Estimation
    - ENTER : Éditer/Valider
    - DEL : Effacer
    - GRAPH : Résoudre
    - CLEAR : Fermer

### 🔧 Amélioré
- **Menu MATH** : Ajout du Solver en première position (0:Solver...)
- **Services** : Nouveau SolverService.ts avec algorithmes numériques
- **Navigation** : Support clavier complet dans le Solver
- **Types** : Ajout du mode 'SOLVER' et 'CATALOG' dans CalculatorMode

### 📝 Documentation
- Ajout d'exemples détaillés dans le HelpModal
  - Équations polynomiales (X^2-4, X^3-2*X-5)
  - Équations trigonométriques (sin(X)-0.5, cos(X)-X)
  - Équations logarithmiques (ln(X)-2, log(X)-1)
  - Équations complexes (X^3-sin(X)-1, e^X-5*X)
- Guide d'utilisation du Catalog avec recherche rapide
- Mise à jour de la version affichée à 2.3.0.0

---

## [2.2.8.0] - 2025-11-08

### ✨ Ajouté
- **Menu VARS dynamique** : Le sous-menu Window s'adapte automatiquement au mode graphique
  - Mode PAR : Ajout de Tmin, Tmax, Tstep
  - Mode POL : Ajout de θmin, θmax, θstep
  - Mode SEQ : Ajout de nMin, nMax, PlotStart, PlotStep
- **Touche X,T,θ,n intelligente** : Insère automatiquement la bonne variable selon le mode
  - Mode FUNC → X
  - Mode PAR → T
  - Mode POL → θ
  - Mode SEQ → n
- **Indicateur de mode graphique** : Affichage en temps réel dans la barre d'état
  - Affiche PAR/POL/SEQ (FUNC n'affiche rien)
- **TABLE paramétrique** : Support complet du mode paramétrique dans TABLE
  - Colonnes T, X1T, Y1T en mode PAR
  - Colonnes X, Y1, Y2 en mode FUNC
  - Évaluation correcte de X(T) et Y(T)

### 🔧 Amélioré
- **Service Worker optimisé** pour des mises à jour plus rapides
  - Stratégie NetworkFirst au lieu de CacheFirst
  - Cache valide 7 jours au lieu de 1 an
  - Nettoyage automatique des anciens caches (cleanupOutdatedCaches)
  - Nouveau nom de cache : ti83-cache-v2
  - Timeout réseau de 3 secondes

### 🐛 Corrigé
- Menu VARS affiche maintenant correctement les variables selon le mode actif
- Touche X,T,θ,n insère θ en mode POL au lieu de X
- Cache PWA ne bloque plus les mises à jour

---

## [2.2.7.0] - 2025-11-08

### ✨ Ajouté
- **TABLE & TBLSET** : Affichage tabulaire complet des fonctions
  - TABLE (2ND + GRAPH) : Tableau de valeurs pour Y1-Y6
  - TBLSET (2ND + WINDOW) : Configuration TblStart, ΔTbl
  - Navigation verticale et horizontale
  - 50 lignes de valeurs calculées
- **STAT PLOT** : 3 plots statistiques configurables
  - Types : Scatter, xyLine, Histogram, Box Plot, Normal Probability Plot
  - Marqueurs : □, +, •
  - Support listes L1-L6
  - Superposition avec fonctions Y1-Y6
- **Modes graphiques Parametric et Polar**
  - Mode PAR : X(T), Y(T) avec tMin, tMax, tStep
  - Mode POL : r(θ) avec θMin, θMax, θStep
  - Conversion automatique polaire → cartésien
  - Intégration complète dans Y= et WINDOW

### 🔧 Amélioré
- Sélection du mode graphique dans l'écran MODE
- Navigation clavier complète dans tous les éditeurs
- Intégration GraphCanvas avec support PAR/POL

---

## [2.2.6.4] - 2025-11-07

### ✨ Ajouté
- Menu VARS avec sous-menu Matrix
- Champ vide au démarrage

### 🔧 Amélioré
- CLEAR pour sortir du mode graphique

---

## [2.2.6.3] - 2025-11-07

### ✨ Ajouté
- **STO→ et RCL** : Stockage et rappel de 26 variables (A-Z)
- **Menu VARS** complet
  - Sous-menu Window (Xmin, Xmax, Xscl, Ymin, Ymax, Yscl)
  - Sous-menu Zoom (ZXmin, ZXmax, ZXscl, ZYmin, ZYmax, ZYscl)
  - Sous-menu XY (coordonnées du dernier point tracé)

---

## [2.2.6.0] - 2025-11-06

### ✨ Ajouté
- **Menu MEM** (2ND + +) : Gestion complète de la mémoire
  - About : Informations système
  - Reset : Réinitialisation (All RAM, Defaults)
  - Mem Mgmt/Del : Gestion de la mémoire
- **Menu MATRIX** complet
  - 10 matrices éditables [A]-[J]
  - Éditeur de grille 2D avec navigation
  - Opérations matricielles (transpose, inverse, déterminant)
  - Support des opérations arithmétiques

---

## [2.2.5.0] - 2025-11-05

### 🐛 Corrigé
- **Puissance intelligente** (^) : Réutilisation automatique des résultats
- **Logarithmes** : ln() et log() fonctionnent correctement
- Arrondi des résultats pour éviter les erreurs de précision

---

## [2.2.4.0] - 2025-11-05

### 🐛 Corrigé
- Mode SECOND auto-désactivé après chaque action
- Mode ALPHA corrigé et fonctionnel
- Navigation améliorée

---

## [2.2.3.0] - 2025-11-04

### 🔧 Amélioré
- **Opérateurs arithmétiques intelligents** : Continuation automatique avec le résultat précédent
- Calculs en chaîne fluides

---

## [2.2.0.0] - 2025-11-04

### ✨ Ajouté
- **Clavier réorganisé** : Conforme à la TI-83 Plus physique
- **30+ lettres ALPHA** : A-Z, θ, u, v, w, n

### 🔧 Amélioré
- Disposition exacte du clavier TI-83 Plus
- Couleurs et labels fidèles

---

## [2.1.0.0] - 2025-11-03

### ✨ Ajouté
- **PWA installable** sur Android
- **Mode hors ligne** complet
- **Service Worker** avec cache optimisé
- **Icônes PWA** adaptatives (maskable)
- **Manifest** avec configuration complète

### 🔧 Amélioré
- Mises à jour automatiques
- Chargement instantané
- Taille réduite : 340 KB

---

## [2.0.0.0] - 2025-11-01

### ✨ Ajouté
- Version initiale complète
- **Mode graphique** : Y=, WINDOW, ZOOM, TRACE, GRAPH
- **Menu STAT** : 14 fonctions statistiques et régressions
- **Menu CALC** : 7 fonctions de calcul sur courbes
- **Menu MATH** : 38 fonctions mathématiques
- **Services backend** : GraphingEngine, StatisticsService, MathFunctionsService
- Architecture React 19 + TypeScript 5.6 + Vite 7
- State management avec Zustand

---

## Légende

- ✨ **Ajouté** : Nouvelles fonctionnalités
- 🔧 **Amélioré** : Améliorations de fonctionnalités existantes
- 🐛 **Corrigé** : Corrections de bugs
- 🗑️ **Supprimé** : Fonctionnalités retirées
- 🔒 **Sécurité** : Corrections de sécurité
- 📝 **Documentation** : Modifications de documentation
