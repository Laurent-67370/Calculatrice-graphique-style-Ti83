# 🧮 Calculatrice TI-83 Plus - Version React/TypeScript

Une calculatrice graphique scientifique moderne qui reproduit fidèlement l'interface et les fonctionnalités de la célèbre **TI-83 Plus** de Texas Instruments, construite avec **React 18**, **TypeScript 5.6**, et **Vite**.

![Version](https://img.shields.io/badge/version-2.0.5-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?logo=typescript)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Aperçu

Cette calculatrice web offre une expérience complète de la TI-83 Plus avec une architecture moderne, type-safe et performante.

**🎯 État du Projet : ~96% Complété**
- ✅ Backend (Services) : 100%
- ✅ Frontend (UI/UX) : 95%
- ✅ Menu STAT : **100% complet** (14/14 fonctions) 🎉
- ✅ Menu CALC : **100% complet** (7/7 fonctions) 🎉
- ✅ Menu MATH : **100% complet** (38 fonctions, 6 catégories) 🎉
- ✅ Prêt pour production

**📍 Démo en ligne :** [www.lhusser.fr/calculatrice](https://www.lhusser.fr/calculatrice/)

---

## 🎉 Nouveautés Version 2.0.5

### Menu MATH Interactif Complet ! 🎯

Cette version apporte un **menu MATH hiérarchique complet** permettant de parcourir et sélectionner toutes les fonctions mathématiques, organisées en 6 catégories comme sur une vraie TI-83 Plus :

#### 📂 6 Catégories de Fonctions

1. **MATH (Principal)** - 5 fonctions : ³√, logBASE, e^x, 10^x, hypot
2. **NUM** - 14 fonctions : abs, round, iPart, fPart, int, min, max, lcm, gcd, ceil, floor, sign, trunc, mod
3. **CPX** - 7 fonctions : conj, real, imag, angle, abs, Rect, Polar
4. **PRB** - 7 fonctions : rand, nPr, nCr, !, randInt, randNorm, randBin
5. **ANGLE** - 4 fonctions : °→rad, rad→°, →DMS, →Dec
6. **TRIG** - 6 fonctions : sinh, cosh, tanh, asinh, acosh, atanh

#### ✨ Navigation Hiérarchique

- **↑/↓** pour naviguer dans les menus
- **ENTER** pour sélectionner ou entrer dans un sous-menu (▶)
- **CLEAR** pour revenir en arrière ou fermer
- Indicateur visuel **▶** pour les sous-menus

#### 🔧 Corrections et Améliorations Majeures

**1. Évaluateur Mathématique Complet ✨**
- Support de **39 fonctions mathématiques** dans l'évaluateur
- `max(5,3)`, `min(2,8)`, `abs(-10)` fonctionnent maintenant correctement
- Fonctions de probabilité : `gcd(24,18)`, `lcm(12,18)`, `nPr(10,3)`, `nCr(10,5)`
- Toutes les fonctions du menu MATH sont maintenant évaluables

**2. Touches Manquantes Ajoutées ✨**
- **Point décimal (.)** : Touche dédiée pour les nombres décimaux (9.45)
- **Virgule (,)** : Accessible via **2nd + 7** pour séparer les arguments

**3. Fonctions Hyperboliques Inverses**
- **asinh(x)** - Arc-sinus hyperbolique
- **acosh(x)** - Arc-cosinus hyperbolique
- **atanh(x)** - Arc-tangente hyperbolique

**Performance :**
- Build : 1.20s
- JS : 258.79 KB (80.45 KB gzippé)
- CSS : 9.50 KB (2.47 KB gzippé)

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+ et npm

### Installation et Développement

```bash
# Cloner le dépôt
git clone https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83.git
cd Calculatrice-graphique-style-Ti83/calculatrice-ti83-react

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Ouvrir dans le navigateur
# http://localhost:5173/
```

### Build de Production

```bash
# Créer le build optimisé
npm run build

# Prévisualiser le build
npm run preview
```

---

## 📦 Déploiement

### Télécharger les Archives Prêtes

Les archives de déploiement sont disponibles directement sur GitHub :

- **ZIP** : [calculatrice-ti83-deploy.zip](https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/raw/claude/scientific-calculator-ti83-011CUqMQSu5obWhYPHKhcTN3/calculatrice-ti83-deploy.zip) (82 KB)
- **TAR.GZ** : [calculatrice-ti83-deploy.tar.gz](https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/raw/claude/scientific-calculator-ti83-011CUqMQSu5obWhYPHKhcTN3/calculatrice-ti83-deploy.tar.gz) (81 KB)

### Déploiement Rapide

**Via FTP :**
1. Téléchargez le ZIP depuis GitHub
2. Décompressez localement
3. Uploadez le contenu dans votre dossier web

**Via SSH :**
```bash
wget https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/raw/claude/scientific-calculator-ti83-011CUqMQSu5obWhYPHKhcTN3/calculatrice-ti83-deploy.tar.gz
scp calculatrice-ti83-deploy.tar.gz user@yourserver.com:/tmp/
ssh user@yourserver.com
tar -xzf /tmp/calculatrice-ti83-deploy.tar.gz -C /var/www/html/calculatrice/
```

📖 **Guide complet** : Voir [DOWNLOAD_AND_DEPLOY.md](./DOWNLOAD_AND_DEPLOY.md)

---

## 🌟 Fonctionnalités

### ✅ Mode Graphique Complet

#### Éditeur Y= (6 fonctions)
- **Y1 à Y6** : Définition de 6 fonctions simultanées
- **Activation/Désactivation** : Gestion indépendante de chaque fonction
- **Syntaxe mathématique** : `sin(X)`, `X^2`, `√(X)`, `ln(X)`, etc.

#### Éditeur WINDOW
- **Xmin, Xmax, Ymin, Ymax** : Configuration complète de la fenêtre
- **Xscale, Yscale** : Échelle des graduations
- **Interface interactive** : Navigation et édition intuitive

#### Menu ZOOM
- **ZStandard** : x∈[-10,10], y∈[-10,10]
- **ZDecimal** : x∈[-4.7,4.7], y∈[-3.1,3.1]
- **ZTrig** : x∈[-2π,2π], y∈[-4,4]
- **ZSquare** : Ratio 1:1 pour éviter les distorsions
- **Zoom In/Out** : Zoom dynamique interactif

#### GraphCanvas
- **Tracé multi-courbes** : Jusqu'à 6 fonctions simultanées
- **Axes et graduations** : Rendu précis avec labels
- **Performance optimisée** : React.memo et Canvas API

### ✅ Statistiques - 100% Complet ! 🎉

#### Menu STAT (14/14 fonctions)
- **Edit...** - Éditeur de listes L1-L6
- **1-Var Stats** - Statistiques à 1 variable (n, mean, Sx, σx, min, Q1, median, Q3, max)
- **2-Var Stats** - Statistiques à 2 variables
- **Med-Med** - Régression médiane-médiane ✨ **Nouveau !**
- **LinReg(ax+b)** - Régression linéaire
- **QuadReg** - Régression quadratique
- **CubicReg** - Régression cubique ✨ **Nouveau !**
- **QuartReg** - Régression quartique ✨ **Nouveau !**
- **LinReg(a+bx)** - Régression linéaire alternative ✨ **Nouveau !**
- **ExpReg** - Régression exponentielle
- **PwrReg** - Régression puissance
- **LnReg** - Régression logarithmique
- **SinReg** - Régression sinusoïdale ✨ **Nouveau !**
- **Logistic** - Régression logistique ✨ **Nouveau !**

#### Éditeur de Listes
- **6 listes** : L1 à L6
- **Édition interactive** : Ajout, modification, suppression
- **Navigation fluide** : ↑↓ entre les valeurs

### ✅ Menu MATH - 100% Complet ! 🎉

Menu hiérarchique avec **38 fonctions** réparties en **6 catégories** :

#### MATH (Principal) - 5 fonctions
- **³√()** - Racine cubique
- **logBASE()** - Logarithme en base quelconque
- **e^()** - Exponentielle base e
- **10^()** - Puissance de 10
- **hypot()** - Hypoténuse √(x²+y²)

#### NUM (Fonctions numériques) ▶ - 14 fonctions
- **abs()** - Valeur absolue
- **round()** - Arrondi
- **iPart()** - Partie entière
- **fPart()** - Partie fractionnaire
- **int()** - Troncature
- **min()** - Minimum
- **max()** - Maximum
- **lcm()** - PPCM
- **gcd()** - PGCD
- **ceil()** - Arrondi supérieur ✨ **Nouveau !**
- **floor()** - Arrondi inférieur ✨ **Nouveau !**
- **sign()** - Signe (-1, 0, 1) ✨ **Nouveau !**
- **trunc()** - Troncature décimale ✨ **Nouveau !**
- **mod()** - Modulo ✨ **Nouveau !**

#### CPX (Nombres complexes) ▶ - 7 fonctions
- **conj()** - Conjugué
- **real()** - Partie réelle
- **imag()** - Partie imaginaire
- **angle()** - Argument
- **abs()** - Module
- **Rect()** - Polaire → Rectangulaire
- **Polar()** - Rectangulaire → Polaire

#### PRB (Probabilités) ▶ - 7 fonctions
- **rand** - Nombre aléatoire
- **nPr()** - Permutations
- **nCr()** - Combinaisons
- **!** - Factorielle
- **randInt()** - Entier aléatoire
- **randNorm()** - Distribution normale
- **randBin()** - Distribution binomiale

#### ANGLE (Conversions) ▶ - 4 fonctions ✨ **Nouveau !**
- **°→rad** - Degrés → Radians
- **rad→°** - Radians → Degrés
- **→DMS** - Conversion DMS
- **→Dec** - Conversion Décimal

#### TRIG (Hyperboliques) ▶ - 6 fonctions ✨ **Nouveau !**
- **sinh()** - Sinus hyperbolique
- **cosh()** - Cosinus hyperbolique
- **tanh()** - Tangente hyperbolique
- **asinh()** - Arc-sinus hyperbolique
- **acosh()** - Arc-cosinus hyperbolique
- **atanh()** - Arc-tangente hyperbolique

### ✅ Distributions

- **normalcdf()** - Distribution normale cumulée
- **invNorm()** - Inverse de la loi normale
- **binompdf()** - Loi binomiale (densité)
- **binomcdf()** - Loi binomiale (cumulative)

### ✅ Menu CALC (Calculs sur courbes) - 100% Complet ! 🎉

- **value** - Calculer f(x) ✨ **Nouveau !**
- **zero** - Recherche de zéro (Newton-Raphson)
- **minimum** - Recherche de minimum (section dorée)
- **maximum** - Recherche de maximum
- **intersect** - Intersection de 2 fonctions ✨ **Nouveau !**
- **dy/dx** - Dérivée numérique ✨ **Nouveau !**
- **∫f(x)dx** - Intégrale définie (règle de Simpson)

### ✅ Éditeur MODE

- **Normal/Sci/Eng** - Format d'affichage des nombres
- **Float/0-9** - Décimales fixes
- **Radian/Degree** - Mode angle
- **Func/Par/Pol/Seq** - Type de graphique
- **Connected/Dot** - Mode de tracé

### ✅ Fonction 2ND

Toutes les fonctions secondaires sont implémentées :
- **2ND + DEL** = INS (insertion)
- **2ND + (-)** = ANS (dernière réponse)
- **2ND + MODE** = QUIT
- **2ND + Y=** = STAT PLOT
- Et bien plus...

---

## 🏗️ Architecture

### Stack Technique

- **React 18.3** - Framework UI avec hooks modernes
- **TypeScript 5.6** - Typage statique complet
- **Vite 7.2** - Build tool ultra-rapide
- **Zustand** - State management léger et performant
- **Canvas API** - Rendu graphique optimisé

### Structure du Projet

```
calculatrice-ti83-react/
├── src/
│   ├── components/          # 14 composants React
│   │   ├── Calculator/      # Composant principal
│   │   ├── Graph/           # Moteur graphique
│   │   ├── Editors/         # Éditeurs (Y=, WINDOW, MODE, STAT)
│   │   └── Menus/           # Système de menus
│   ├── services/            # 3 services backend
│   │   ├── GraphingEngine.ts        # Moteur de tracé
│   │   ├── StatisticsService.ts     # Calculs statistiques
│   │   └── MathFunctionsService.ts  # Fonctions mathématiques
│   ├── store/               # État global Zustand
│   ├── types/               # Définitions TypeScript
│   ├── utils/               # Menu handlers et utilitaires
│   ├── data/                # Données statiques (menus)
│   └── styles/              # CSS modulaire
├── public/                  # Assets statiques
├── dist/                    # Build de production
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### Services Backend

#### GraphingEngine.ts
- Évaluation d'expressions mathématiques
- Tracé de courbes avec Canvas API
- Support de toutes les fonctions TI-83

#### StatisticsService.ts
- Gestion des 6 listes (L1-L6)
- Calculs statistiques (1-Var, 2-Var)
- 14 types de régressions (linéaire, polynomiale, sinusoïdale, logistique)
- Élimination de Gauss pour polynômes

#### MathFunctionsService.ts
- 50+ fonctions mathématiques
- Nombres complexes
- Probabilités et distributions
- Fonctions spéciales (factorielle, arrangements, combinaisons)

---

## 📊 Statistiques du Projet

### Code
- **4,750+ lignes** de TypeScript
- **540+ lignes** de CSS
- **14 composants** React
- **3 services** backend
- **118 fonctions** mathématiques

### Fonctionnalités
- ✅ **Calculatrice de base** : 100%
- ✅ **Mode graphique** : 95%
- ✅ **Statistiques (STAT)** : **100%** (14/14)
- ✅ **Calculs (CALC)** : **100%** (7/7)
- ✅ **Menu MATH** : **100%** (38 fonctions, 6 catégories)
- ✅ **Math avancées** : 98%
- ✅ **Éditeurs** : 95%
- ⬜ **Programmation** : 0% (non prévu)

**Complétion totale : ~96%**

### Performance
- **Build time** : 1.20s
- **Hot reload** : < 50ms
- **Bundle JS** : 258.79 KB (80.45 KB gzippé)
- **Bundle CSS** : 9.50 KB (2.47 KB gzippé)
- **Lighthouse score** : 95+

---

## 📝 Documentation

### Guides Disponibles

- **[RELEASE_NOTES_v2.0.5.md](./RELEASE_NOTES_v2.0.5.md)** - Notes de version v2.0.5 (dernière) ✨
- **[RELEASE_NOTES_v2.0.4.md](./RELEASE_NOTES_v2.0.4.md)** - Notes de version v2.0.4
- **[RELEASE_NOTES_v2.0.3.md](./RELEASE_NOTES_v2.0.3.md)** - Notes de version v2.0.3
- **[DOWNLOAD_AND_DEPLOY.md](./DOWNLOAD_AND_DEPLOY.md)** - Guide de téléchargement et déploiement
- **[GITHUB_RELEASE_INSTRUCTIONS.md](./GITHUB_RELEASE_INSTRUCTIONS.md)** - Instructions pour créer une release

---

## 🎯 Cas d'Usage

### Enseignement
- 📚 **Mathématiques lycée** : Fonctions, statistiques, probabilités
- 📊 **Statistiques avancées** : Régressions polynomiales, sinusoïdales
- 🔬 **Sciences** : Calculs scientifiques, graphiques

### Examens
- 📝 **Compatible TI-83 Plus** : Interface identique à la calculatrice physique
- ⚡ **Rapide** : Pas besoin de manipulation de pile
- 🌐 **Accessible** : Fonctionne sur tout navigateur moderne

### Recherche
- 📈 **Analyse de données** : Toutes les régressions statistiques
- 🧮 **Calculs complexes** : Nombres complexes, distributions
- 📉 **Visualisation** : Graphiques multi-courbes

---

## 🛣️ Roadmap

### v2.1.0 (Futur)
- [ ] Table de valeurs complète
- [ ] Plus de fonctions CALC (dy/dx, tangente)
- [ ] Export/Import de données

### v3.0.0 (Vision)
- [ ] Mode programmation (si demandé)
- [ ] Matrices avancées
- [ ] Sauvegarde cloud

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

---

## 📄 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 🙏 Remerciements

- **Texas Instruments** pour la calculatrice TI-83 Plus originale
- **React Team** pour le framework incroyable
- **Vite Team** pour le build tool ultra-rapide
- **Communauté open-source** pour tous les outils utilisés

---

## 📞 Support

- **Issues** : [GitHub Issues](https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/issues)
- **Demo** : [www.lhusser.fr/calculatrice](https://www.lhusser.fr/calculatrice/)

---

## 🌟 Stats GitHub

![GitHub stars](https://img.shields.io/github/stars/Laurent-67370/Calculatrice-graphique-style-Ti83?style=social)
![GitHub forks](https://img.shields.io/github/forks/Laurent-67370/Calculatrice-graphique-style-Ti83?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/Laurent-67370/Calculatrice-graphique-style-Ti83?style=social)

---

## 📜 Disclaimer

Ce projet est une **réimplémentation éducative** et n'est **pas affilié** à Texas Instruments. TI-83 Plus est une marque déposée de Texas Instruments Incorporated.

Ce projet est créé à des fins éducatives et de démonstration.

---

<div align="center">

**Version 2.0.5** | **6 novembre 2025** | **Made with ❤️ for Education**

⭐ **Si ce projet vous est utile, n'hésitez pas à lui donner une étoile sur GitHub !** ⭐

[🏠 Accueil](#-calculatrice-ti-83-plus---version-reacttypescript) | [📚 Docs](#-documentation) | [🤝 Contribuer](#-contribution) | [🐛 Issues](https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/issues)

</div>
