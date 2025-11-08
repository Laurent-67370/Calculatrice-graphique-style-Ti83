# 🧮 Calculatrice Graphique TI-83 Plus

## Version 2.4.0.0 - React + TypeScript + PWA

Une implémentation moderne et performante de la calculatrice graphique TI-83 Plus, entièrement reconstruite avec **React**, **TypeScript** et **Zustand**. Disponible en **Progressive Web App** (PWA) installable sur mobile et bureau.

---

## ✨ Améliorations par rapport à la version JavaScript

### 🔒 **Sécurité et Robustesse**
- ✅ **Typage statique complet** avec TypeScript
- ✅ **Détection d'erreurs à la compilation**
- ✅ **Interfaces strictes** pour tous les composants
- ✅ **Validation des types** à chaque étape

### ⚡ **Performance Optimisée**
- ✅ **React.memo** pour éviter les re-rendus inutiles
- ✅ **useCallback** pour optimiser les callbacks
- ✅ **Zustand** : gestion d'état 10x plus rapide que Redux
- ✅ **Virtual DOM** de React pour des mises à jour efficaces
- ✅ **Build optimisé** avec tree-shaking et minification (68 KB gzip)

### 🏗️ **Architecture Moderne**
- ✅ **Composants modulaires** et réutilisables
- ✅ **Séparation des responsabilités** (UI / Logic / State)
- ✅ **Services dédiés** pour le graphique, les stats, les maths
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

### 🚀 Déploiement sur Netlify

```bash
# Déployer en production
npm run deploy

# Déployer en mode preview
npm run deploy:preview
```

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour le guide complet de déploiement.

---

## 🎯 Fonctionnalités Principales

### 💰 **FINANCE TVM** (Nouveauté v2.4.0.0)
- **TVM Solver** (APPS) : Calculateur financier professionnel
  - Time Value of Money (Valeur Temporelle de l'Argent)
  - 7 variables : N, I%, PV, PMT, FV, P/Y, C/Y
  - Calcul automatique de n'importe quelle variable
  - Mode END/BEGIN pour paiements
  - Exemples : prêts hypothécaires, épargne retraite, crédits auto
  - Précision financière professionnelle
  - Interface intuitive avec navigation ↑↓

### 🎯 **SOLVER & CATALOG** (v2.3.0.0)
- **SOLVER** (MATH > 0) : Résolveur d'équations f(X)=0
  - Méthode de Newton-Raphson avec fallback bisection
  - Précision : 10 décimales
  - Support complet des fonctions mathématiques
  - Affichage du nombre d'itérations
- **CATALOG** (2ND + 0) : Liste alphabétique de 100+ fonctions
  - Recherche rapide par lettre (A-Z)
  - Navigation intuitive ↑↓
  - Insertion directe dans l'input

### 📊 **Graphiques**
- Tracer jusqu'à 6 fonctions simultanément (Y1 à Y6)
- **Modes graphiques** : Function, Parametric, Polar
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

### 🧮 **MATH - 38 Fonctions en 6 Catégories**
- **MATH** : ³√, logBASE, e^x, 10^x, hypot
- **NUM** : abs, round, iPart, fPart, min, max, gcd, lcm, ceil, floor, sign, trunc, mod
- **CPX** : conj, real, imag, angle, abs, Rect, Polar
- **PRB** : rand, nPr, nCr, !, randInt, randNorm, randBin
- **ANGLE** : °→rad, rad→°, →DMS, →Dec
- **TRIG** : sinh, cosh, tanh, asinh, acosh, atanh

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

4. **Autres exemples financiers**
   ```
   Épargne retraite :
   PMT=-500, I%=5, N=300, PV=0 → FV = 295 488€

   Durée d'un crédit auto :
   PV=15000, PMT=-350, I%=4.2, FV=0 → N = 46.27 mois

   Taux effectif d'un placement :
   PV=-10000, FV=15000, N=60, PMT=0 → I% = 8.44%
   ```

### Résoudre une équation avec le SOLVER

1. **Ouvrir le Solver**
   - Cliquer sur **MATH**
   - Sélectionner **0:Solver...**

2. **Entrer l'équation**
   - **Équation** : Taper `X^2-4` (résout X²-4=0)
   - **Estimation** : Taper `1` (valeur de départ)
   - Appuyer sur **GRAPH** pour résoudre

3. **Résultat**
   - X = 2.0000000000 (10 décimales)
   - Affiche le nombre d'itérations

### Exemples d'équations pour le Solver

```
X^2-4            → Racines: X = ±2
X^3-2*X-5        → X = 2.0945514815
sin(X)-0.5       → X = 0.5235987756 (rad)
ln(X)-2          → X = 7.3890560989
cos(X)-X         → X = 0.7390851332
```

### Tracer un graphique

1. **Définir une fonction**
   - Cliquer sur **Y=**
   - Taper `X^2` (ou `X*X`, `X×X`)
   - Appuyer sur **ENTER**

2. **Afficher le graphique**
   - Cliquer sur **GRAPH**
   - La parabole apparaît !

3. **Ajuster la vue**
   - **WINDOW** : Modifier xMin, xMax, yMin, yMax
   - **ZOOM** : Choisir un preset (Standard, Decimal, Trig)

### Exemples de fonctions valides

```
X^2              → Parabole
X^3 - 2*X        → Cubique
sin(X)           → Sinusoïde
cos(X)           → Cosinusoïde
2^X              → Exponentielle
ln(X)            → Logarithme
sqrt(X)          → Racine carrée
abs(X)           → Valeur absolue
```

### Utiliser le CATALOG

1. **Ouvrir le Catalog**
   - Appuyer sur **2ND + 0**
   - Liste de 100+ fonctions apparaît

2. **Recherche rapide**
   - Taper **S** pour sauter aux fonctions commençant par S
   - Utiliser **↑↓** pour naviguer

3. **Insérer**
   - Appuyer sur **ENTER** pour insérer la fonction sélectionnée

---

## 🏗️ Architecture du Projet

```
src/
├── types/                    # Types TypeScript
│   ├── calculator.types.ts   # Types calculatrice
│   ├── graph.types.ts        # Types graphiques
│   └── menu.types.ts         # Types menus
│
├── store/                    # Gestion d'état Zustand
│   └── calculatorStore.ts    # Store global
│
├── services/                 # Logique métier
│   └── GraphingEngine.ts     # Moteur de graphiques
│
├── components/               # Composants React
│   ├── Calculator/
│   │   ├── Calculator.tsx    # Composant principal
│   │   ├── Display.tsx       # Écran LCD
│   │   └── Keyboard.tsx      # Clavier
│   └── Graph/
│       └── GraphCanvas.tsx   # Canvas graphique
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

## 📊 Comparaison JavaScript vs TypeScript

| Critère | JavaScript | React + TypeScript |
|---------|-----------|-------------------|
| Erreurs runtime | Fréquentes | Rares (détectées à la compilation) |
| Performance | Bonne | Excellente (Virtual DOM) |
| Maintenabilité | Moyenne | Excellente (types + composants) |
| Refactoring | Risqué | Sûr (TypeScript) |
| Build size | ~50KB | ~68KB (optimisé) |
| Hot reload | Non | Oui (HMR de Vite) |

---

## 🐛 Dépannage

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

**Technologies** : React 18, TypeScript 5, Zustand, Vite

---

**Profitez de cette calculatrice graphique moderne ! 🎉**
