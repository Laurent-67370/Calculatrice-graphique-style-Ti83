# 📝 Changelog - Calculatrice TI-83 Plus PWA

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

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
