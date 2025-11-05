# Calculatrice TI-83 Plus - Version Web Complète

Une calculatrice scientifique et graphique complète qui reproduit fidèlement l'interface et les fonctionnalités de la célèbre TI-83 Plus de Texas Instruments.

![Version](https://img.shields.io/badge/version-2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-production-brightgreen)

## 🌟 Fonctionnalités Complètes

### 🧮 Calculs Scientifiques Avancés

#### Opérations de Base
- Addition, soustraction, multiplication, division
- Puissances (x^y, x², x³)
- Racines (√x, ³√x, ˣ√y)
- Inverse (x⁻¹)
- Factorielle (n!)

#### Fonctions Trigonométriques
- **Directes** : sin, cos, tan
- **Inverses** : asin (sin⁻¹), acos (cos⁻¹), atan (tan⁻¹)
- **Hyperboliques** : sinh, cosh, tanh
- **Modes** : RAD/DEG avec conversion automatique

#### Fonctions Logarithmiques et Exponentielles
- **Log base 10** : log(x)
- **Logarithme naturel** : ln(x)
- **Exponentielles** : e^x, 10^x
- **Puissances quelconques** : a^x

#### Constantes Mathématiques
- π (pi) ≈ 3.14159265359
- e (nombre d'Euler) ≈ 2.71828182846

### 📊 Statistiques Avancées

#### Listes de Données (L1-L6)
- **Éditeur de listes** : saisie et modification faciles
- **Import/Export** : gestion des données
- **Tri** : SortA (croissant), SortD (décroissant)
- **Effacement** : ClrList

#### Statistiques à 1 Variable
- Nombre d'éléments (n)
- Moyenne (x̄)
- Somme (Σx)
- Somme des carrés (Σx²)
- Écart-type échantillon (Sx)
- Écart-type population (σx)
- Minimum, Maximum
- Médiane, Quartiles (Q1, Q3)

#### Statistiques à 2 Variables
- Moyennes (x̄, ȳ)
- Sommes (Σx, Σy, Σxy, Σx², Σy²)
- Covariance
- Coefficient de corrélation

#### Régressions
- **Linéaire** : y = ax + b (avec r et r²)
- **Quadratique** : y = ax² + bx + c
- **Exponentielle** : y = ab^x
- **Logarithmique** : y = a + b·ln(x)
- **Puissance** : y = ax^b

### 📈 Mode Graphique Complet

#### Éditeur Y= (Fonctions)
- **6 fonctions simultanées** : Y1 à Y6
- **Activation/Désactivation** : touche DEL sur chaque fonction
- **Édition interactive** : syntaxe claire
- **Sauvegarde automatique**

#### Paramètres de Fenêtre (WINDOW)
- **Xmin, Xmax** : limites horizontales
- **Ymin, Ymax** : limites verticales
- **Xscl, Yscl** : échelle des graduations
- **Xres** : résolution du tracé

#### Zoom Avancé
- **ZBox** : zoom sur une région
- **Zoom In/Out** : zoom progressif (×2 / ÷2)
- **ZDecimal** : intervalles décimaux (-4.7 à 4.7)
- **ZSquare** : fenêtre carrée
- **ZStandard** : -10 à 10 (défaut)
- **ZTrig** : adapté aux fonctions trigonométriques
- **ZInteger** : valeurs entières
- **ZoomStat** : adapté aux données statistiques
- **ZoomFit** : ajuste Y aux valeurs de la fonction

#### Mode Trace
- **Navigation** : ← → pour explorer la courbe
- **Affichage** : coordonnées (X, Y) en temps réel
- **Curseur** : marqueur rouge sur la courbe
- **Zoom** : + et - pour zoomer pendant le trace

#### Analyse de Graphique (CALC)
1. **Value** : calculer f(x) pour un X donné
2. **Zero** : trouver les zéros (f(x) = 0)
3. **Minimum** : trouver le minimum local
4. **Maximum** : trouver le maximum local
5. **Intersect** : intersection de deux courbes
6. **dy/dx** : dérivée numérique en un point
7. **∫f(x)dx** : intégrale définie avec visualisation

### 📋 Mode TABLE

#### Configuration (TBLSET)
- **TblStart** : valeur de départ de X
- **ΔTbl** : pas d'incrémentation
- **Mode Auto** : génération automatique

#### Affichage Table
- **Multi-colonnes** : X, Y1, Y2, ...
- **7 lignes visibles** : navigation ▲▼
- **Défilement** : exploration complète
- **Valeurs exactes** : précision maximale

### 🔢 Menus MATH

#### NUM (Fonctions Numériques)
- **abs(x)** : valeur absolue
- **round(x)** : arrondi
- **iPart(x)** : partie entière
- **fPart(x)** : partie fractionnaire
- **int(x)** : plus grand entier ≤ x
- **min(a,b,...)** : minimum
- **max(a,b,...)** : maximum
- **lcm(a,b)** : plus petit commun multiple
- **gcd(a,b)** : plus grand commun diviseur
- **remainder(a,b)** : reste de division

#### CPX (Nombres Complexes)
- **conj(z)** : conjugué
- **real(z)** : partie réelle
- **imag(z)** : partie imaginaire
- **angle(z)** : argument (angle)
- **abs(z)** : module
- **►Rect** : conversion polaire → rectangulaire
- **►Polar** : conversion rectangulaire → polaire

#### PRB (Probabilités)
- **rand** : nombre aléatoire [0,1)
- **nPr(n,r)** : permutations (n!/(n-r)!)
- **nCr(n,r)** : combinaisons (n!/(r!(n-r)!))
- **!** : factorielle
- **randInt(min,max)** : entier aléatoire
- **randNorm(μ,σ)** : distribution normale
- **randBin(n,p)** : distribution binomiale

### 📐 Calcul Différentiel et Intégral

#### Dérivées Numériques
- **nDeriv(f,x,h)** : dérivée en x
- **Méthode** : différences centrales
- **Précision** : h = 0.001 par défaut
- **Applications** : tangentes, vitesse, accélération

#### Intégrales Numériques
- **fnInt(f,a,b)** : intégrale de a à b
- **Méthode** : règle de Simpson
- **Précision** : 1000 subdivisions
- **Visualisation** : région ombrée sur le graphique
- **Applications** : aires, volumes, travail

#### Solver (Résolution d'Équations)
- **Méthode** : Newton-Raphson
- **solve(f,x0)** : trouver f(x) = 0
- **Tolérance** : 1e-6
- **Convergence** : jusqu'à 100 itérations

#### Optimisation
- **fMin(f,a,b)** : minimum de f sur [a,b]
- **fMax(f,a,b)** : maximum de f sur [a,b]
- **Méthode** : section dorée
- **Précision** : 1e-6

### 📊 Distributions de Probabilité

#### Distribution Normale
- **normalPdf(x,μ,σ)** : densité de probabilité
- **normalCdf(a,b,μ,σ)** : probabilité P(a ≤ X ≤ b)
- **invNorm(p,μ,σ)** : quantile inverse

#### Distribution Binomiale
- **binomPdf(n,p,k)** : P(X = k)
- **binomCdf(n,p,k)** : P(X ≤ k)

#### Distribution de Poisson
- **poissonPdf(λ,k)** : P(X = k)
- **poissonCdf(λ,k)** : P(X ≤ k)

#### Distribution Géométrique
- **geometPdf(p,k)** : P(X = k)
- **geometCdf(p,k)** : P(X ≤ k)

### 🎛️ Système de Menus Contextuels

#### MODE
- **Normal/Sci/Eng** : notation scientifique
- **Float/Fix** : décimales
- **Radian/Degree** : angles
- **Func/Par/Pol/Seq** : type de graphique
- **Real/a+bi/re^θi** : nombres complexes

#### CATALOG
- **200+ fonctions** : accès complet
- **Navigation** : alphabétique
- **Recherche** : rapide
- **Insertion** : directe

#### VARS (Variables)
- **Window** : paramètres fenêtre
- **Zoom** : variables de zoom
- **Statistics** : résultats statistiques
- **Table** : paramètres table

#### TEST (Opérateurs)
- **Comparaisons** : =, ≠, >, ≥, <, ≤
- **Logique** : and, or, xor, not

#### ANGLE
- **Degrés (°)** : conversion
- **Minutes (')** : DMS
- **Radians (r)** : conversion
- **Coordonnées** : rectangulaire ↔ polaire

## 🚀 Démarrage Rapide

### Installation

1. **Clonez le dépôt** :
```bash
git clone https://github.com/votre-utilisateur/Calculatrice-graphique-style-Ti83.git
cd Calculatrice-graphique-style-Ti83
```

2. **Ouvrez dans un navigateur** :
```bash
# Directement
open index.html

# Ou avec un serveur local
python -m http.server 8000
# Puis ouvrir http://localhost:8000
```

### Structure du Projet

```
Calculatrice-graphique-style-Ti83/
├── index.html              # Structure HTML
├── styles.css              # Styles interface TI-83
├── calculator.js           # Moteur de calcul principal
├── graphing.js             # Moteur graphique
├── statistics.js           # Module statistiques
├── math-functions.js       # Fonctions mathématiques avancées
├── editors.js              # Éditeurs (Y=, WINDOW, TABLE)
├── menu-system.js          # Système de menus
├── integration.js          # Intégration des modules
└── README.md              # Documentation
```

## 📖 Guide d'Utilisation Complet

### Calculs de Base

```
Exemple 1 : Opération simple
Input: 25 + 17 * 3
Output: 76

Exemple 2 : Puissance
Input: 2^10
Output: 1024

Exemple 3 : Racine carrée
Input: 2nd + x² → √(144)
Output: 12
```

### Fonctions Scientifiques

```
Exemple 1 : Trigonométrie
Input: sin(30)  [MODE: DEG]
Output: 0.5

Input: cos(π/3)  [MODE: RAD]
Output: 0.5

Exemple 2 : Logarithmes
Input: log(1000)
Output: 3

Input: ln(e^2)
Output: 2

Exemple 3 : Combinatoire
Input: 10 [MATH] [PRB] [3:nCr] 3
Output: 120
```

### Statistiques

```
Exemple : Données et analyse
1. [STAT] [1:Edit]
2. Entrer dans L1 : 12, 15, 18, 20, 22, 25, 28
3. [STAT] ► [CALC] [1:1-Var Stats]
4. Résultats :
   n = 7
   x̄ = 20
   Sx = 5.715476066
   min = 12
   max = 28

Exemple : Régression linéaire
1. L1 = {1, 2, 3, 4, 5}
2. L2 = {2, 4, 6, 8, 10}
3. [STAT] ► [CALC] [4:LinReg]
4. Résultat : y = 2x + 0 (r² = 1)
```

### Mode Graphique

```
Exemple 1 : Parabole
[Y=] Y1 = X^2
[WINDOW] Xmin=-5, Xmax=5, Ymin=-1, Ymax=25
[GRAPH]

Exemple 2 : Sinusoïde
[Y=] Y1 = sin(X)
[ZOOM] [7:ZTrig]
[GRAPH]

Exemple 3 : Analyse
[Y=] Y1 = X^3 - 3X^2 + 2
[GRAPH]
[2nd] [TRACE] [3:minimum]
→ Trouve le minimum local
```

### TABLE

```
[Y=] Y1 = X^2
[2nd] [WINDOW] → TBLSET
  TblStart = -3
  ΔTbl = 1
[2nd] [GRAPH] → TABLE

Affiche :
X    | Y1
-----|-----
-3   | 9
-2   | 4
-1   | 1
 0   | 0
 1   | 1
 2   | 4
 3   | 9
```

### Calcul Différentiel

```
Exemple : Dérivée
[Y=] Y1 = X^3
[2nd] [TRACE] [6:dy/dx]
X=? 2
→ dy/dx = 12

Exemple : Intégrale
[Y=] Y1 = X^2
[2nd] [TRACE] [7:∫f(x)dx]
Lower=? 0
Upper=? 3
→ ∫f(x)dx = 9
(La région est ombrée sur le graphique)
```

## ⌨️ Raccourcis Clavier

### Généraux
| Touche | Action |
|--------|--------|
| `0-9` | Chiffres |
| `+` `-` `*` `/` | Opérateurs |
| `^` | Puissance |
| `(` `)` | Parenthèses |
| `.` | Virgule décimale |
| `Enter` | ENTER (calculer) |
| `Backspace` | DEL (supprimer) |
| `Escape` | CLEAR (effacer) |

### Navigation
| Touche | Action |
|--------|--------|
| `↑` `↓` | Naviguer dans les menus |
| `←` `→` | Mode trace / curseur |
| `+` `-` (graph) | Zoom in/out |

### Raccourcis Alt
| Combinaison | Action |
|-------------|--------|
| `Alt+Y` | Y= Editor |
| `Alt+W` | WINDOW |
| `Alt+G` | GRAPH |
| `Alt+T` | TABLE |
| `Alt+Z` | ZOOM |
| `Alt+S` | STAT |
| `Alt+M` | MATH |

### Aide
| Touche | Action |
|--------|--------|
| `F1` | Aide contextuelle |

## 🎯 Exemples Avancés

### 1. Résolution d'Équation du Second Degré

Résoudre x² - 5x + 6 = 0

**Méthode graphique :**
```
[Y=] Y1 = X^2 - 5X + 6
[GRAPH]
[2nd] [TRACE] [2:zero]
→ X = 2, X = 3
```

**Méthode analytique :**
```
a=1, b=-5, c=6
(-B + √(B^2-4AC))/(2A)
→ X1 = 3
(-B - √(B^2-4AC))/(2A)
→ X2 = 2
```

### 2. Analyse d'une Fonction

Analyser f(x) = x³ - 6x² + 9x + 1

```
[Y=] Y1 = X^3 - 6X^2 + 9X + 1
[GRAPH]

1. Points critiques (dérivée = 0) :
   [2nd] [TRACE] [6:dy/dx]
   Tester plusieurs X pour trouver dy/dx ≈ 0

2. Maximum local :
   [2nd] [TRACE] [4:maximum]
   → X ≈ 1, Y ≈ 5

3. Minimum local :
   [2nd] [TRACE] [3:minimum]
   → X ≈ 3, Y ≈ 1

4. Point d'inflexion (dérivée seconde = 0) :
   Calculer d(dy/dx)/dx numériquement
```

### 3. Probabilités - Loi Normale

Un test a une moyenne de 75 et un écart-type de 10.
Quelle est la probabilité d'avoir entre 70 et 85 ?

```
[2nd] [VARS] → DISTR
[2:normalcdf(]
normalcdf(70, 85, 75, 10)
→ 0.5328 (53.28%)
```

### 4. Régression Non-Linéaire

Données : croissance exponentielle
```
L1 = {0, 1, 2, 3, 4, 5}
L2 = {2, 4, 8, 16, 32, 64}

[STAT] [EDIT] → Entrer les données
[STAT] [CALC] [0:ExpReg]
→ y = 2·2^x (r² ≈ 1)
```

### 5. Intégrale Définie

Calculer l'aire sous sin(x) de 0 à π

```
[Y=] Y1 = sin(X)
[MODE] → Radian
[GRAPH]
[2nd] [TRACE] [7:∫f(x)dx]
Lower=? 0
Upper=? π (2nd + ^)
→ ∫sin(x)dx ≈ 2
```

## 🔧 Architecture Technique

### Technologies
- **HTML5** : structure et Canvas
- **CSS3** : design et animations
- **JavaScript ES6+** : logique et calculs

### Modules

#### calculator.js
- Classe TI83Calculator
- Gestion de l'affichage
- Parsing d'expressions
- Évaluation mathématique
- Gestion des modes

#### graphing.js
- Classe GraphingEngine
- Rendu Canvas
- Tracé de fonctions
- Transformations coordonnées
- Algorithmes d'analyse

#### statistics.js
- Classe StatisticsModule
- Gestion des listes
- Calculs statistiques
- Régressions multiples
- Tests d'hypothèse

#### math-functions.js
- Classe MathFunctionsModule
- Fonctions numériques
- Nombres complexes
- Probabilités
- Distributions
- Calcul différentiel/intégral

#### editors.js
- Classe EditorsModule
- Éditeur Y=
- Éditeur WINDOW
- Mode TABLE
- Menu CALC
- Menu ZOOM

#### menu-system.js
- Classe MenuSystem
- Système de menus contextuels
- Navigation
- CATALOG
- Menus MODE, VARS, TEST, etc.

#### integration.js
- Connecte tous les modules
- Gestionnaires d'événements
- Raccourcis clavier
- Système d'aide

## 🐛 Dépannage

### Problèmes Courants

**Q: Les calculs trigonométriques donnent des résultats bizarres**
```
A: Vérifiez le mode d'angle (RAD/DEG)
   [MODE] → Choisir Radian ou Degree
```

**Q: Le graphique ne s'affiche pas**
```
A: 1. Vérifiez qu'une fonction est définie dans Y=
   2. Vérifiez la fenêtre WINDOW (valeurs cohérentes)
   3. Essayez [ZOOM] [6:ZStandard]
```

**Q: "Error" s'affiche**
```
A: Causes possibles :
   - Division par zéro
   - Domaine invalide (ex: log(-1))
   - Parenthèses non équilibrées
   - Syntaxe incorrecte
```

**Q: Les listes statistiques sont vides**
```
A: 1. [STAT] [1:Edit]
   2. Entrer les valeurs dans L1, L2, etc.
   3. [2nd] [MODE] pour quitter l'éditeur
```

**Q: Le mode trace ne fonctionne pas**
```
A: 1. Assurez-vous d'être en mode GRAPH
   2. Appuyez sur [TRACE]
   3. Utilisez ← → pour naviguer
```

## 📱 Compatibilité

### Navigateurs
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ IE11 non supporté

### Appareils
- ✅ Desktop (Windows, Mac, Linux)
- ✅ Tablettes (iPad, Android)
- ✅ Mobiles (iOS, Android) - interface responsive

## 🚀 Fonctionnalités à Venir (V3.0)

- [ ] Mode Matrice complet
- [ ] Mode Programmation (TI-BASIC)
- [ ] Mode Séquence (récurrence)
- [ ] Mode Paramétrique complet
- [ ] Mode Polaire complet
- [ ] Export graphiques PNG/SVG
- [ ] Sauvegarde sessions (LocalStorage)
- [ ] Thèmes personnalisables
- [ ] Mode sombre
- [ ] Support tactile avancé
- [ ] Graphiques 3D basiques
- [ ] Animations de fonctions
- [ ] Mode multi-fenêtres
- [ ] Partage de calculs (URL)

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Forkez le projet
2. Créez une branche : `git checkout -b feature/AmazingFeature`
3. Committez : `git commit -m 'Add AmazingFeature'`
4. Pushez : `git push origin feature/AmazingFeature`
5. Ouvrez une Pull Request

### Guidelines
- Code propre et commenté
- Tests pour les nouvelles fonctionnalités
- Documentation mise à jour
- Respect du style existant

## 📄 Licence

Ce projet est sous licence MIT. Voir `LICENSE` pour plus de détails.

## 🙏 Remerciements

- Texas Instruments pour la TI-83 Plus originale
- La communauté mathématique et éducative
- Tous les contributeurs open source

## 📞 Support

- 🐛 **Issues** : [GitHub Issues](https://github.com/votre-utilisateur/Calculatrice-graphique-style-Ti83/issues)
- 💬 **Discussions** : [GitHub Discussions](https://github.com/votre-utilisateur/Calculatrice-graphique-style-Ti83/discussions)
- 📧 **Email** : support@example.com

## 📊 Statistiques

- **Lignes de code** : ~7000+
- **Fonctions** : 200+
- **Modules** : 8
- **Tests** : En développement
- **Performance** : 60 FPS (graphiques)

## 🎓 Utilisation Éducative

Cette calculatrice est parfaite pour :
- 📚 Cours de mathématiques (collège, lycée, université)
- 🎯 Préparation aux examens (BAC, SAT, etc.)
- 🔬 Projets scientifiques
- 👨‍🏫 Enseignement à distance
- 💻 Apprentissage de la programmation

## 🌟 Showc case

```javascript
// Exemple de code : Analyse complète d'une fonction

// 1. Définir la fonction
calculator.graphingEngine.setFunction(0, 'X^3-3X^2+2X+1');

// 2. Tracer le graphique
calculator.toggleGraphMode();

// 3. Trouver les zéros
const zeros = calculator.graphingEngine.findZeros('X^3-3X^2+2X+1', -5, 5);

// 4. Trouver les extrema
const extrema = calculator.graphingEngine.findExtrema('X^3-3X^2+2X+1', -5, 5);

// 5. Calculer la dérivée en x=2
const derivative = calculator.mathModule.nDeriv('X^3-3X^2+2X+1', 2);

// 6. Calculer l'intégrale de 0 à 3
const integral = calculator.mathModule.fnInt('X^3-3X^2+2X+1', 0, 3);
```

---

**Note** : Ce projet est une réimplémentation éducative et n'est pas affilié à Texas Instruments.

**Version** : 2.0.0 | **Date** : 2024 | **Made with ❤️ for Education**
