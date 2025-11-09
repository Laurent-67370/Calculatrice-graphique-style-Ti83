# 📦 Release Notes - Version 2.6.0.0

**Date:** 2025-11-09
**Type:** Release de test - Nouvelles fonctionnalités DRAW & LIST OPS

---

## 🎨 Nouveautés DRAW (2ND + PRGM)

### Commandes interactives fonctionnelles

Toutes les commandes DRAW sont maintenant **100% fonctionnelles** ! Sélectionnez une commande dans le menu, complétez les paramètres et appuyez sur ENTER.

#### ✅ Commandes disponibles :

**Commandes de base :**
- `ClrDraw` - Efface tous les dessins du graphique
- `Line(x1,y1,x2,y2)` - Trace une ligne entre deux points
  - Exemple : `Line(-5,-5,5,5)` → Trace une diagonale
- `Horizontal y` - Trace une ligne horizontale à y
  - Exemple : `Horizontal 0` → Trace l'axe X
- `Vertical x` - Trace une ligne verticale à x
  - Exemple : `Vertical 0` → Trace l'axe Y
- `Circle(x,y,r)` - Dessine un cercle de rayon r centré en (x,y)
  - Exemple : `Circle(0,0,3)` → Cercle de rayon 3 au centre
- `Text(x,y,"texte")` - Affiche du texte aux coordonnées (x,y)
  - Exemple : `Text(2,3,"Hello")` → Affiche "Hello" en (2,3)

#### 🎯 Mode d'utilisation :

1. **Ouvrir le menu DRAW** : Appuyez sur `2ND + PRGM`
2. **Sélectionner une commande** : Par exemple `Line(`
3. **Compléter les paramètres** : Tapez `0,0,5,5)`
4. **Exécuter** : Appuyez sur `ENTER`
5. **Résultat** : Le graphique s'affiche automatiquement avec votre dessin !

#### ⚙️ Fonctionnalités techniques :

- ✅ Parsing intelligent des arguments avec regex
- ✅ Validation automatique des paramètres
- ✅ Conversion coordonnées graphiques ↔ pixels
- ✅ Rendu canvas optimisé avec anti-aliasing
- ✅ Persistance des dessins (jusqu'à ClrDraw)
- ✅ Bascule automatique en mode graphique
- ✅ Message "Done" après exécution réussie

---

## 📊 LIST OPS & MATH (2ND + STAT)

### 15 fonctions statistiques et opérations sur listes

**NAMES** - Accès rapide aux listes :
- L₁, L₂, L₃, L₄, L₅, L₆ (indices en exposant)

**OPS** - 7 opérations :
- `SortA(` - Tri croissant
- `SortD(` - Tri décroissant
- `dim(` - Dimension d'une liste
- `Fill(` - Remplir avec une valeur
- `seq(` - Générer une séquence (expressions mathématiques supportées)
- `cumSum(` - Somme cumulée
- `ΔList(` - Différences successives

**MATH** - 8 fonctions statistiques :
- `min(`, `max(` - Minimum et maximum
- `mean(` - Moyenne arithmétique
- `median(` - Médiane
- `sum(`, `prod(` - Somme et produit
- `stdDev(` - Écart-type (échantillon)
- `variance(` - Variance (échantillon)

---

## 🔧 Améliorations techniques

### Architecture :
- **DrawingService** : Service dédié pour le rendu des éléments graphiques
- **ListService** : Service avec 15 fonctions statistiques complètes
- **calculatorStore** : État DRAW (drawElements, pictures) + actions
- **GraphCanvas** : Rendu DRAW intégré au moteur graphique

### Types TypeScript :
- `draw.types.ts` - 8 types d'éléments dessinés (DrawLine, DrawCircle, etc.)
- Support complet pour tous les éléments graphiques

---

## 📦 Fichiers de déploiement

**Pour le blog :**
- `calculatrice-ti83-blog-v2.6.0.0.tar.gz` (355 KB)
- `calculatrice-ti83-blog-v2.6.0.0.zip` (353 KB)

**Général :**
- `calculatrice-ti83-deploy.tar.gz` (355 KB)
- `calculatrice-ti83-deploy.zip` (353 KB)

**Build size:** 1.1 MB
**JS gzipped:** 299.42 KB

---

## 🚀 Instructions de déploiement

### Option 1 : Via FTP
```bash
1. Connecte-toi à ton serveur
2. Va dans /public_html/calculatrice/
3. Supprime l'ancien contenu
4. Upload le contenu de dist/
```

### Option 2 : Via SSH
```bash
scp calculatrice-ti83-deploy.tar.gz utilisateur@lhusser.fr:/tmp/
ssh utilisateur@lhusser.fr
rm -rf /var/www/html/calculatrice/*
tar -xzf /tmp/calculatrice-ti83-deploy.tar.gz -C /var/www/html/calculatrice/
```

### Option 3 : Upload manuel
- Utilise `calculatrice-ti83-deploy.zip`
- Extrais dans ton dossier de publication

---

## 🌐 URL de test

**Production :** https://www.lhusser.fr/calculatrice/

---

## 🧪 Tests recommandés

### Test DRAW :
1. Ouvrir la calculatrice
2. Appuyer sur `2ND + PRGM` (menu DRAW)
3. Sélectionner `Line(`
4. Taper `0,0,5,5)` puis `ENTER`
5. **Vérifier** : Une ligne diagonale apparaît sur le graphique

### Test Circle :
1. Taper `Circle(0,0,3)` puis `ENTER`
2. **Vérifier** : Un cercle de rayon 3 apparaît au centre

### Test ClrDraw :
1. Taper `ClrDraw` puis `ENTER`
2. **Vérifier** : Tous les dessins disparaissent

---

## 📝 Changelog complet

Voir `CHANGELOG.md` pour la liste détaillée de toutes les modifications.

---

## ⚠️ Notes importantes

- Les dessins DRAW sont **persistants** jusqu'à ce que vous exécutiez `ClrDraw`
- Les commandes DRAW basculent automatiquement en mode graphique
- Toutes les coordonnées utilisent le système de la fenêtre graphique (Window settings)
- Les commandes avancées (Tangent, DrawF, Shade) seront implémentées dans une future version

---

**Développé avec ❤️ en React 19 + TypeScript 5.6 + Zustand + MathJS**
