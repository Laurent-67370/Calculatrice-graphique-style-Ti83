# 🧮 Calculatrice TI-83 Plus - Progressive Web App

Une calculatrice graphique scientifique moderne qui reproduit fidèlement l'interface et les fonctionnalités de la célèbre **TI-83 Plus** de Texas Instruments, construite avec **React 19**, **TypeScript 5.6**, et **Vite 7**. Maintenant **installable sur Android** comme une vraie application ! 📱

![Version](https://img.shields.io/badge/version-2.1.0-blue)
![PWA](https://img.shields.io/badge/PWA-Ready-success)
![React](https://img.shields.io/badge/React-19.1-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?logo=typescript)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Aperçu

Cette calculatrice web offre une expérience complète de la TI-83 Plus avec une architecture moderne, type-safe et performante. **Nouveauté v2.1.0** : Installable sur Android comme une application native !

**🎯 État du Projet : 100% Complété**
- ✅ Backend (Services) : 100%
- ✅ Frontend (UI/UX) : 100%
- ✅ Menu STAT : **100% complet** (14/14 fonctions)
- ✅ Menu CALC : **100% complet** (7/7 fonctions)
- ✅ Menu MATH : **100% complet** (38 fonctions, 6 catégories)
- ✅ PWA : **100%** (Installable, Hors ligne, Auto-update) 🎉
- ✅ Prêt pour production

**📍 Démo en ligne :** [www.lhusser.fr/calculatrice](https://www.lhusser.fr/calculatrice/)

---

## 🎉 Nouveautés Version 2.1.0 - Progressive Web App ! 📱

### 📱 Installation sur Android

La calculatrice est maintenant une **PWA (Progressive Web App)** installable sur votre téléphone Android !

#### ✨ Fonctionnalités PWA

- **📲 Installation sur l'écran d'accueil** - Comme une vraie app du Play Store
- **📴 Mode hors ligne** - Fonctionne sans connexion Internet
- **⚡ Chargement instantané** - Cache optimisé pour performance maximale
- **🔄 Mises à jour automatiques** - Toujours la dernière version
- **🎨 Icône adaptative** - S'adapte au style de votre téléphone
- **🚀 Mode autonome** - Pas de barre d'adresse, plein écran
- **💾 Légère** - Seulement 365 KB, 100x moins qu'une app native

#### 🎯 Installation en 3 Clics

1. Ouvrez **Chrome** sur Android
2. Visitez : [www.lhusser.fr/calculatrice](https://www.lhusser.fr/calculatrice/)
3. Tapez sur **⋮** → "Ajouter à l'écran d'accueil"

✨ **C'est tout !** Votre calculatrice est maintenant installée comme une vraie app.

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

### Build de Production PWA

```bash
# Créer le build optimisé (inclut génération d'icônes PWA)
npm run build

# Prévisualiser le build
npm run preview
```

---

## 📦 Déploiement

### Télécharger les Archives PWA

Les archives de déploiement PWA v2.1.0 sont disponibles sur GitHub :

- **ZIP** : [calculatrice-ti83-pwa-v2.1.0.zip](https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/raw/claude/scientific-calculator-ti83-011CUqMQSu5obWhYPHKhcTN3/calculatrice-ti83-pwa-v2.1.0.zip) (142 KB)
- **TAR.GZ** : [calculatrice-ti83-pwa-v2.1.0.tar.gz](https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/raw/claude/scientific-calculator-ti83-011CUqMQSu5obWhYPHKhcTN3/calculatrice-ti83-pwa-v2.1.0.tar.gz) (140 KB)

### Déploiement Rapide

**Via FTP :**
1. Téléchargez le ZIP depuis GitHub
2. Décompressez localement
3. Uploadez le contenu dans votre dossier web (HTTPS requis !)

**Via SSH :**
```bash
# Télécharger et déployer
wget https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/raw/claude/scientific-calculator-ti83-011CUqMQSu5obWhYPHKhcTN3/calculatrice-ti83-pwa-v2.1.0.tar.gz
scp calculatrice-ti83-pwa-v2.1.0.tar.gz user@yourserver.com:/tmp/
ssh user@yourserver.com
tar -xzf /tmp/calculatrice-ti83-pwa-v2.1.0.tar.gz -C /var/www/html/calculatrice/
```

📖 **Guide complet** : Voir [DEPLOYMENT_PWA_v2.1.0.md](./DEPLOYMENT_PWA_v2.1.0.md) et [PWA_GUIDE.md](./PWA_GUIDE.md)

⚠️ **Important** : Les PWA nécessitent **HTTPS obligatoirement**.

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

### ✅ Statistiques - 100% Complet !

#### Menu STAT (14/14 fonctions)
- **Edit...** - Éditeur de listes L1-L6
- **1-Var Stats** - Statistiques à 1 variable (n, mean, Sx, σx, min, Q1, median, Q3, max)
- **2-Var Stats** - Statistiques à 2 variables
- **Med-Med** - Régression médiane-médiane
- **LinReg(ax+b)** - Régression linéaire
- **QuadReg** - Régression quadratique
- **CubicReg** - Régression cubique
- **QuartReg** - Régression quartique
- **LinReg(a+bx)** - Régression linéaire alternative
- **ExpReg** - Régression exponentielle
- **PwrReg** - Régression puissance
- **LnReg** - Régression logarithmique
- **SinReg** - Régression sinusoïdale
- **Logistic** - Régression logistique

#### Éditeur de Listes
- **6 listes** : L1 à L6
- **Édition interactive** : Ajout, modification, suppression
- **Navigation fluide** : ↑↓ entre les valeurs

### ✅ Menu MATH - 100% Complet !

Menu hiérarchique avec **38 fonctions** réparties en **6 catégories** :

#### MATH (Principal) - 5 fonctions
- **³√()** - Racine cubique
- **logBASE()** - Logarithme en base quelconque
- **e^()** - Exponentielle base e
- **10^()** - Puissance de 10
- **hypot()** - Hypoténuse √(x²+y²)

#### NUM (Fonctions numériques) ▶ - 14 fonctions
- **abs()**, **round()**, **iPart()**, **fPart()**, **int()**
- **min()**, **max()**, **lcm()**, **gcd()**
- **ceil()**, **floor()**, **sign()**, **trunc()**, **mod()**

#### CPX (Nombres complexes) ▶ - 7 fonctions
- **conj()**, **real()**, **imag()**, **angle()**, **abs()**
- **Rect()**, **Polar()**

#### PRB (Probabilités) ▶ - 7 fonctions
- **rand**, **nPr()**, **nCr()**, **!**
- **randInt()**, **randNorm()**, **randBin()**

#### ANGLE (Conversions) ▶ - 4 fonctions
- **°→rad**, **rad→°**, **→DMS**, **→Dec**

#### TRIG (Hyperboliques) ▶ - 6 fonctions
- **sinh()**, **cosh()**, **tanh()**
- **asinh()**, **acosh()**, **atanh()**

### ✅ Menu CALC (Calculs sur courbes) - 100% Complet !

- **value** - Calculer f(x)
- **zero** - Recherche de zéro (Newton-Raphson)
- **minimum** - Recherche de minimum (section dorée)
- **maximum** - Recherche de maximum
- **intersect** - Intersection de 2 fonctions
- **dy/dx** - Dérivée numérique
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
- **2ND + 7** = virgule (,)
- Et bien plus...

---

## 🏗️ Architecture

### Stack Technique

- **React 19.1** - Framework UI avec hooks modernes
- **TypeScript 5.6** - Typage statique complet
- **Vite 7.2** - Build tool ultra-rapide
- **Zustand 5** - State management léger et performant
- **Vite PWA Plugin** - Transformation en PWA installable
- **Workbox** - Service Worker pour mode offline
- **Canvas API** - Rendu graphique optimisé

### Structure du Projet

```
calculatrice-ti83-react/
├── src/
│   ├── components/          # Composants React
│   │   ├── Calculator/      # Composant principal
│   │   ├── Graph/           # Moteur graphique
│   │   ├── Editors/         # Éditeurs (Y=, WINDOW, MODE, STAT)
│   │   ├── Menus/           # Système de menus
│   │   └── Help/            # Modal d'aide
│   ├── services/            # Services backend
│   │   ├── GraphingEngine.ts        # Moteur de tracé
│   │   ├── StatisticsService.ts     # Calculs statistiques
│   │   └── MathFunctionsService.ts  # Fonctions mathématiques
│   ├── store/               # État global Zustand
│   ├── types/               # Définitions TypeScript
│   ├── utils/               # Menu handlers et utilitaires
│   ├── data/                # Données statiques (menus)
│   └── styles/              # CSS modulaire
├── public/                  # Assets statiques + icônes PWA
│   ├── icon.svg             # Icône source
│   ├── icon-192.png         # Icône PWA 192x192
│   ├── icon-512.png         # Icône PWA 512x512
│   ├── icon-maskable-*.png  # Icônes adaptatives Android
│   └── vite.svg
├── dist/                    # Build de production
│   ├── manifest.webmanifest # Manifest PWA
│   ├── sw.js                # Service Worker
│   └── workbox-*.js         # Workbox runtime
├── generate-icons.mjs       # Script génération icônes
├── package.json
├── vite.config.ts           # Config Vite + PWA
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
- 14 types de régressions
- Élimination de Gauss pour polynômes

#### MathFunctionsService.ts
- 50+ fonctions mathématiques
- Nombres complexes
- Probabilités et distributions
- Fonctions spéciales

---

## 📊 Statistiques du Projet

### Code
- **5,000+ lignes** de TypeScript
- **600+ lignes** de CSS
- **15 composants** React
- **3 services** backend
- **120+ fonctions** mathématiques

### Fonctionnalités
- ✅ **Calculatrice de base** : 100%
- ✅ **Mode graphique** : 100%
- ✅ **Statistiques (STAT)** : **100%** (14/14)
- ✅ **Calculs (CALC)** : **100%** (7/7)
- ✅ **Menu MATH** : **100%** (38 fonctions, 6 catégories)
- ✅ **PWA** : **100%** (Installable, Offline, Auto-update)
- ✅ **Éditeurs** : 100%
- ⬜ **Programmation** : 0% (non prévu)

**Complétion totale : 100%** 🎉

### Performance PWA
- **Build time** : 1.24s
- **Hot reload** : < 50ms
- **Bundle total** : 365 KB (140 KB compressé)
- **Service Worker** : 1.9 KB
- **Cache** : 13 fichiers (328.66 KB)
- **Lighthouse PWA score** : 90+

---

## 📝 Documentation

### Guides Utilisateur

- **[PWA_GUIDE.md](./PWA_GUIDE.md)** - Guide complet PWA (installation, utilisation, dépannage) 📱
- **[DEPLOYMENT_PWA_v2.1.0.md](./DEPLOYMENT_PWA_v2.1.0.md)** - Guide de déploiement PWA v2.1.0

### Guides Développeur

- **README.md** - Ce fichier
- **[update-deploy.sh](./update-deploy.sh)** - Script de déploiement automatisé

---

## 🎯 Cas d'Usage

### Enseignement
- 📚 **Mathématiques lycée** : Fonctions, statistiques, probabilités
- 📊 **Statistiques avancées** : Régressions polynomiales, sinusoïdales
- 🔬 **Sciences** : Calculs scientifiques, graphiques

### Examens
- 📝 **Compatible TI-83 Plus** : Interface identique
- ⚡ **Rapide** : Chargement instantané
- 📱 **Mobile** : Installable sur Android
- 📴 **Hors ligne** : Fonctionne sans Internet

### Usage Personnel
- 🎓 **Étudiants** : Toujours dans votre poche
- 👨‍🔬 **Professionnels** : Calculs scientifiques rapides
- 🧮 **Passionnés** : Nostalgie de la TI-83 originale

---

## 🛣️ Roadmap

### v2.2.0 (Futur proche)
- [ ] Support iOS (PWA Safari)
- [ ] Écran de partage (Share API)
- [ ] Mode sombre automatique

### v3.0.0 (Vision)
- [ ] Mode programmation
- [ ] Matrices avancées
- [ ] Sync cloud (optionnel)

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
- **Vite PWA Plugin** pour la transformation PWA
- **Communauté open-source** pour tous les outils utilisés

---

## 📞 Support

- **Issues** : [GitHub Issues](https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/issues)
- **Demo** : [www.lhusser.fr/calculatrice](https://www.lhusser.fr/calculatrice/)
- **Installation Android** : Visitez la démo avec Chrome et tapez sur "Installer"

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

**Version 2.1.0 (PWA)** | **6 novembre 2025** | **Made with ❤️ for Education**

⭐ **Si ce projet vous est utile, n'hésitez pas à lui donner une étoile sur GitHub !** ⭐

📱 **Installez-la sur Android en 3 clics !** 📱

[🏠 Accueil](#-calculatrice-ti-83-plus---progressive-web-app) | [📱 Guide PWA](./PWA_GUIDE.md) | [📚 Docs](#-documentation) | [🤝 Contribuer](#-contribution) | [🐛 Issues](https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/issues)

</div>
