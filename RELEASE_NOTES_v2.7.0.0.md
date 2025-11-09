# 📦 Release Notes - Version 2.7.0.0

**Date:** 2025-11-09  
**Type:** Release majeure - DRAW 100% complet  
**Compatibilité globale TI-83 Plus:** ~90%

---

## 🎨 Nouveautés majeures

### DRAW - 100% Compatibilité TI-83 Plus (15/15 commandes)

**9 nouvelles commandes DRAW implémentées :**

1. **Tangent(expr,x)** - Tangente à une fonction en un point
   - Calcul de dérivée numérique
   - Exemple : `Tangent(X^2,3)` → Tangente à x² au point x=3

2. **DrawF expr** - Dessiner une fonction
   - Exemple : `DrawF X^3-2*X`

3. **DrawInv expr** - Inverse d'une fonction (symétrie y=x)
   - Exemple : `DrawInv X^2`

4. **Shade(f1,f2,xmin,xmax)** - Ombrage entre deux courbes
   - Exemple : `Shade(X^2,2*X,-2,2)`

5. **Pt-On(x,y)** - Activer un point
   - Exemple : `Pt-On(3,5)`

6. **Pt-Off(x,y)** - Désactiver un point
   - Exemple : `Pt-Off(3,5)`

7. **Pt-Change(x,y)** - Basculer l'état d'un point
   - Exemple : `Pt-Change(3,5)`

8. **StorePic n** - Sauvegarder l'écran (Pic1-Pic10)
   - Exemple : `StorePic 1`

9. **RecallPic n** - Rappeler une image sauvegardée
   - Exemple : `RecallPic 1`

### Corrections importantes

- **Guillemets fonctionnels** : ALPHA + + insère maintenant `"` pour Text()
  - Correction du mapping clavier (STO→ = L, + = ")
  - Documentation ajoutée dans l'aide

- **Version mise à jour partout** : 2.7.0.0 dans package.json et aide

---

## 📊 Récapitulatif DRAW complet (15/15)

| Commande | Syntaxe | Statut |
|----------|---------|--------|
| ClrDraw | `ClrDraw` | ✅ |
| Line | `Line(x1,y1,x2,y2)` | ✅ |
| Horizontal | `Horizontal y` | ✅ |
| Vertical | `Vertical x` | ✅ |
| Tangent | `Tangent(expr,x)` | ✅ NEW |
| DrawF | `DrawF expr` | ✅ NEW |
| Shade | `Shade(f1,f2,xmin,xmax)` | ✅ NEW |
| DrawInv | `DrawInv expr` | ✅ NEW |
| Circle | `Circle(x,y,r)` | ✅ |
| Text | `Text(x,y,"texte")` | ✅ |
| Pt-On | `Pt-On(x,y)` | ✅ NEW |
| Pt-Off | `Pt-Off(x,y)` | ✅ NEW |
| Pt-Change | `Pt-Change(x,y)` | ✅ NEW |
| StorePic | `StorePic n` | ✅ NEW |
| RecallPic | `RecallPic n` | ✅ NEW |

---

## 🔧 Améliorations techniques

### DrawingService.ts
- Ajout `drawTangent()` : dérivée numérique avec approximation
- Ajout `drawInverse()` : parcours en Y pour symétrie y=x
- Mise à jour `drawAll()` pour gérer tangent et inverse

### Types TypeScript
- Nouveaux types : `DrawTangent`, `DrawInverse`
- Type union `DrawElement` étendu

### Parsers Calculator.tsx
- 9 nouveaux regex pour détecter les commandes DRAW
- Gestion StorePic/RecallPic avec validation Pic1-Pic10
- Logique Pt-Change avec vérification point existant

### Clavier virtuel
- Correction mapping ALPHA : + = `"` (guillemets)
- Correction mapping ALPHA : STO→ = `L`

### Aide utilisateur
- Documentation complète des 9 nouvelles commandes
- 20+ exemples pratiques ajoutés
- Récapitulatif 15 commandes avec syntaxe
- Astuce guillemets : "ALPHA + + = `"`"

---

## 📦 Archives de déploiement

**Optimisation : archives sans wrapper dist/**

```bash
# Extraction directe dans /calculatrice/
tar -xzf calculatrice-ti83-deploy.tar.gz
# Fichiers prêts immédiatement !
```

**Fichiers disponibles :**
- `calculatrice-ti83-deploy.tar.gz` (355 KB)
- `calculatrice-ti83-deploy.zip` (1.1 MB)
- `releases/calculatrice-ti83-blog-v2.7.0.0.tar.gz` (355 KB)
- `releases/calculatrice-ti83-blog-v2.7.0.0.zip` (710 KB)

---

## 📈 Évolution de compatibilité

| Version | DRAW | Global |
|---------|------|--------|
| v2.5.0.0 | 0% | 80% |
| v2.6.0.0 | 40% (6/15) | 85% |
| **v2.7.0.0** | **100% (15/15)** ✅ | **~90%** ✅ |

---

## 🚀 Prochaines étapes (v3.0.0.0)

Pour atteindre 95% de compatibilité :

1. **PRGM** (Programmation TI-BASIC)
   - Variables de boucle (For, While, Repeat)
   - Conditions (If, Then, Else, End)
   - Labels et Goto

2. **I/O** (Entrées/Sorties)
   - Get/Send entre calculatrices

3. **MODE avancés**
   - SEQUENCE mode
   - DOT/CONNECTED
   - SIMUL

---

## 🐛 Bugs corrigés

- ✅ DRAW menu handlers maintenant fonctionnels (factory pattern)
- ✅ Guillemets accessibles pour Text() via ALPHA + +
- ✅ Version cohérente partout (2.7.0.0)
- ✅ Archives optimisées sans wrapper dist/

---

## 💾 Installation

```bash
# Option 1: tar.gz (recommandé)
cd /chemin/vers/www/calculatrice/
tar -xzf calculatrice-ti83-deploy.tar.gz

# Option 2: zip
cd /chemin/vers/www/calculatrice/
unzip calculatrice-ti83-deploy.zip
```

---

## 📝 Notes techniques

- **Build system**: Vite 7 + TypeScript 5.6
- **Framework**: React 19.1.1
- **State management**: Zustand 5.0.8
- **Math engine**: MathJS 15.1.0
- **PWA**: Service Worker avec cache offline
- **Taille**: 355 KB (1.1 MB décompressé)

---

## 🎯 Compatibilité

- **Chrome** 80+
- **Safari** 14+
- **Samsung Internet** 12+
- **Firefox** 90+
- **Edge** 80+

---

**Déployé sur:** www.lhusser.fr/calculatrice/  
**Repository:** github.com/Laurent-67370/Calculatrice-graphique-style-Ti83  
**Licence:** MIT
