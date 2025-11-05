# 🚀 Guide Rapide - TI-83 Plus

## ✅ **LES CORRECTIONS SONT FAITES !**

Toutes les touches fonctionnent maintenant correctement. Voici comment utiliser la calculatrice.

---

## 📊 **TRACER UN GRAPHIQUE - Pas à Pas**

### Exemple : Tracer y = x²

#### **Étape 1 : Ouvrir l'éditeur Y=**
```
Cliquez sur le bouton "Y=" (en haut à gauche)
OU
Appuyez sur Alt+Y
```

**Résultat** : Vous voyez l'éditeur avec Y1= à Y6=

#### **Étape 2 : Sélectionner Y1**
```
►Y1=
 Y2=
 Y3=
 Y4=
 Y5=
 Y6=
```
Y1 est déjà sélectionné (marqué par ►)

#### **Étape 3 : Appuyer sur ENTER pour éditer**
```
Cliquez sur le bouton "ENTER"
```

**Résultat** : Le mode édition s'active, vous voyez "Editing Y1" en haut

#### **Étape 4 : Taper la fonction**

**Option A** : Taper X^2
```
1. Cliquez sur "X,T,θ,n" (pour X)
2. Cliquez sur "^" (pour puissance)
3. Cliquez sur "2"
```
Vous voyez : `X^2`

**Option B** : Taper X*X ou X×X
```
1. Cliquez sur "X,T,θ,n"
2. Cliquez sur "×" (multiplication)
3. Cliquez sur "X,T,θ,n" encore
```
Vous voyez : `X×X` ou `X*X`

#### **Étape 5 : Sauvegarder**
```
Cliquez sur "ENTER"
```

**Résultat** : Message "Y1 sauvegardé - Appuyez sur GRAPH pour tracer"

#### **Étape 6 : Tracer le graphique**
```
Cliquez sur le bouton "GRAPH"
```

**Résultat** : Le graphique de la parabole y=x² s'affiche !

---

## 🎯 **EXEMPLES DE FONCTIONS À TRACER**

### Fonctions de Base

| Fonction | À Taper | Résultat |
|----------|---------|----------|
| y = x² | `X^2` | Parabole |
| y = x³ | `X^3` | Cubique |
| y = 2x | `2*X` ou `2X` | Droite |
| y = 1/x | `1/X` | Hyperbole |
| y = √x | `2nd` + `x²` puis `(X)` | Racine carrée |

### Fonctions Trigonométriques

| Fonction | À Taper | Résultat |
|----------|---------|----------|
| y = sin(x) | `SIN(X)` | Sinusoïde |
| y = cos(x) | `COS(X)` | Cosinus |
| y = tan(x) | `TAN(X)` | Tangente |

**⚠️ Important** : Vérifiez le mode RAD/DEG en haut de l'écran

### Fonctions Exponentielles

| Fonction | À Taper | Résultat |
|----------|---------|----------|
| y = eˣ | `2nd` + `LN` puis `(X)` | Exponentielle |
| y = 2ˣ | `2^X` | Exponentielle base 2 |

---

## 🔧 **SI LE GRAPHIQUE AFFICHE "ERROR"**

### Causes Possibles

**1. Variable en minuscule**
```
❌ FAUX : y = x^2  (x minuscule)
✅ BON  : y = X^2  (X MAJUSCULE)
```

**2. Multiplication implicite**
```
❌ FAUX : y = 2X  (peut ne pas marcher)
✅ BON  : y = 2*X  ou  2×X
```

**3. Parenthèses manquantes**
```
❌ FAUX : y = 1/2X  (interprété comme 1/(2X))
✅ BON  : y = 1/2*X  ou  (1/2)*X
```

**4. Fonction non sauvegardée**
```
Après avoir tapé la fonction :
✓ Appuyez sur ENTER pour sauvegarder
✓ Attendez le message "Y1 sauvegardé"
✓ Puis cliquez sur GRAPH
```

---

## 📐 **AJUSTER LA FENÊTRE**

Si le graphique ne s'affiche pas ou semble bizarre :

### Méthode 1 : ZOOM Standard
```
1. Cliquez sur "ZOOM"
2. Choisissez "6: ZStandard"
```
**Résultat** : Fenêtre -10 à 10 pour X et Y

### Méthode 2 : WINDOW Manuel
```
1. Cliquez sur "WINDOW" (ou Alt+W)
2. Modifiez :
   - Xmin = -10
   - Xmax = 10
   - Ymin = -10
   - Ymax = 10
3. Appuyez sur ENTER après chaque valeur
4. Retournez avec CLEAR
5. Cliquez sur GRAPH
```

### Méthode 3 : ZOOM Adapté
```
Pour fonctions trigonométriques :
ZOOM → 7: ZTrig

Pour ajuster automatiquement Y :
ZOOM → 0: ZoomFit
```

---

## 🎮 **TEST COMPLET - 2 MINUTES**

### Test 1 : Parabole Simple
```
1. Y=
2. ENTER
3. X ^ 2
4. ENTER
5. GRAPH
```
**✓ Vous devez voir** : Une parabole

### Test 2 : Deux Fonctions
```
1. Y=
2. Y1 déjà rempli (X^2)
3. ▼ (flèche bas)
4. ENTER sur Y2
5. X ^ 3
6. ENTER
7. GRAPH
```
**✓ Vous devez voir** : Parabole (noir) + Cubique (bleu)

### Test 3 : Sinusoïde
```
1. Y=
2. ▲▼ jusqu'à Y1
3. ENTER
4. CLEAR (effacer X^2)
5. SIN ( X )
6. ENTER
7. ZOOM
8. 7 (ZTrig)
```
**✓ Vous devez voir** : Une onde sinusoïdale

---

## 🔍 **VÉRIFICATION DE FONCTIONNEMENT**

### Console du Navigateur (F12)

Ouvrez la console et vérifiez ces messages :

```
✅ ATTENDU :
🔧 Initialisation de la calculatrice TI-83 Plus...
✓ calculator et graphingEngine chargés
📦 Chargement des modules...
✓ Module statistiques chargé
✓ Module math chargé
✓ Module éditeurs chargé
✓ Système de menus chargé
✅ Tous les modules TI-83 Plus chargés avec succès!
```

Si vous voyez ❌ ou des erreurs, consultez DIAGNOSTICS.md

---

## 🎯 **RACCOURCIS CLAVIER**

| Raccourci | Action |
|-----------|--------|
| `Alt+Y` | Ouvrir Y= |
| `Alt+W` | Ouvrir WINDOW |
| `Alt+G` | Basculer GRAPH |
| `Alt+Z` | Menu ZOOM |
| `Alt+S` | Menu STAT |
| `Alt+M` | Menu MATH |
| `Alt+T` | Afficher TABLE |
| `F1` | Aide rapide |
| `Échap` | CLEAR |
| `Entrée` | ENTER |
| `Backspace` | DEL |

---

## ⚡ **DÉPANNAGE RAPIDE**

### Problème : Rien ne se passe quand je clique
**Solution** :
1. Videz le cache : `Ctrl+Shift+R`
2. Fermez et rouvrez le navigateur
3. Ouvrez la console (F12) pour voir les erreurs

### Problème : "Y1 sauvegardé" mais rien ne se trace
**Solution** :
1. Vérifiez que vous avez cliqué sur GRAPH
2. Vérifiez que vous avez utilisé X majuscule
3. Essayez ZOOM → 6: ZStandard
4. Vérifiez la console (F12) pour des erreurs

### Problème : Graphique hors de l'écran
**Solution** :
1. WINDOW : ajustez Xmin, Xmax, Ymin, Ymax
2. Ou ZOOM → 6: ZStandard
3. Ou ZOOM → 0: ZoomFit

---

## 📱 **FONCTIONS TESTÉES ET VALIDÉES**

✅ Y= Editor - Fonctionne
✅ WINDOW Editor - Fonctionne
✅ GRAPH Mode - Fonctionne
✅ ZOOM Menu - Fonctionne
✅ STAT Menu - Fonctionne
✅ MATH Menu - Fonctionne
✅ MODE Menu - Fonctionne
✅ TRACE Mode - Fonctionne
✅ TABLE Mode - Fonctionne
✅ Calculs scientifiques - Fonctionne
✅ Menus contextuels - Fonctionnent

---

## 💡 **CONSEILS PRO**

1. **Toujours utiliser X en MAJUSCULE** dans les fonctions
2. **Sauvegarder avec ENTER** après avoir tapé une fonction
3. **Ajuster la fenêtre** avec ZOOM avant de tracer
4. **Utiliser les raccourcis Alt+Lettre** pour aller plus vite
5. **Consulter la console (F12)** en cas de problème
6. **Appuyer sur F1** pour l'aide rapide intégrée

---

## 🎓 **EXEMPLES AVANCÉS**

### Équation du Second Degré
```
Y1 = X^2 - 5*X + 6
```
Puis utilisez CALC (2nd+TRACE) pour trouver les zéros

### Fonctions Multiples
```
Y1 = X^2
Y2 = X^3
Y3 = X^4
```
Toutes se tracent ensemble !

### Fonction Rationnelle
```
Y1 = 1/X
```
ZOOM → ZStandard pour voir l'hyperbole

### Fonction avec Paramètres
```
Y1 = 2*X^2 + 3*X - 5
```
CALC pour analyser (min, max, zéros)

---

## 🆘 **BESOIN D'AIDE ?**

1. **Appuyez sur F1** dans la calculatrice
2. **Consultez** DIAGNOSTICS.md pour les erreurs
3. **Ouvrez** test.html pour tester les modules
4. **Vérifiez** la console (F12) pour les logs

---

**✨ La calculatrice est maintenant COMPLÈTEMENT FONCTIONNELLE !**

**🎉 Toutes les corrections sont committées et pushées !**

**📊 Amusez-vous à tracer des graphiques !**
