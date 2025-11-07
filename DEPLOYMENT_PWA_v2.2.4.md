# 📤 Guide de Déploiement PWA - Version 2.2.4

## 🎯 Déploiement sur lhusser.fr/calculatrice

Cette version 2.2.4 corrige le **mode SECOND** qui se désactive maintenant automatiquement après utilisation, comme sur une vraie TI-83 Plus !

---

## ✨ Nouveautés de la v2.2.4 (Mode SECOND Corrigé)

### 🔧 Désactivation Automatique du Mode SECOND

**Correction importante** : Le mode SECOND se comporte maintenant exactement comme sur une TI-83 Plus réelle !

#### 🐛 Avant la v2.2.4

- ❌ Le mode SECOND restait actif après avoir utilisé une fonction secondaire
- ❌ Par exemple : `SECOND` + `SIN` → mode SECOND toujours actif après
- ❌ Comportement non conforme à la TI-83 Plus réelle

#### ✅ Après la v2.2.4

- ✅ `SECOND` + touche → mode SECOND se désactive automatiquement
- ✅ `ALPHA` + touche → mode ALPHA se désactive automatiquement (déjà fonctionnel)
- ✅ Appui sur `SECOND` seul → mode SECOND reste actif
- ✅ Appui sur `ALPHA` seul → mode ALPHA reste actif
- ✅ Comportement 100% conforme à la TI-83 Plus

#### 🎯 Exemples de Comportement

**Mode SECOND** :
```
SECOND + sin → Insère "sin("
Mode SECOND désactivé automatiquement ✅

SECOND + x² → Insère "^2"
Mode SECOND désactivé automatiquement ✅

SECOND + ANS → Insère le dernier résultat
Mode SECOND désactivé automatiquement ✅
```

**Mode ALPHA** :
```
ALPHA + A → Insère "A"
Mode ALPHA désactivé automatiquement ✅

ALPHA + X → Insère "X"
Mode ALPHA désactivé automatiquement ✅
```

**Activation seule** :
```
SECOND seul → Mode SECOND reste actif (pour saisir plusieurs fonctions)
ALPHA seul → Mode ALPHA reste actif (pour saisir plusieurs lettres)
```

---

### 🔧 Solution Technique

- Création d'une fonction wrapper `handleKeyPressWithAutoDeactivate`
- Sauvegarde des états des modes AVANT l'exécution de l'action
- Désactivation automatique APRÈS l'exécution si nécessaire
- Garantit la désactivation pour tous les chemins de code (menus, trace, navigation, etc.)
- Évite les problèmes liés aux `return` prématurés dans le code

---

## 📦 Archives Disponibles

Deux formats d'archives PWA sont disponibles :

- **calculatrice-ti83-pwa-v2.2.4.zip** (144 KB) - Pour Windows/Mac
- **calculatrice-ti83-pwa-v2.2.4.tar.gz** (142 KB) - Pour Linux/Unix

---

## 🚀 Déploiement via FTP

### Étape 1 : Télécharger l'archive PWA

Récupérez l'archive `calculatrice-ti83-pwa-v2.2.4.zip` depuis le repository GitHub.

### Étape 2 : Extraire localement

```bash
unzip calculatrice-ti83-pwa-v2.2.4.zip
```

### Étape 3 : Upload via FTP

1. **Connectez-vous** à votre serveur FTP (lhusser.fr)
2. **Naviguez** vers `/public_html/calculatrice/`
3. **Sauvegardez** l'ancienne version (optionnel)
4. **Supprimez** tous les fichiers du répertoire `/calculatrice/`
5. **Uploadez** le contenu de `dist/` :
   - `index.html`
   - `manifest.webmanifest`
   - `sw.js` (Service Worker)
   - `workbox-*.js`
   - `icon-*.png` (4 icônes)
   - `icon.svg`
   - `vite.svg`
   - `_redirects`
   - Dossier `assets/` complet

### Étape 4 : Vérifier le déploiement

Visitez : https://www.lhusser.fr/calculatrice/

Testez :
- ✅ La page se charge
- ✅ Le mode SECOND se désactive après utilisation (SECOND + SIN)
- ✅ Le mode ALPHA se désactive après utilisation (ALPHA + A)
- ✅ Les opérateurs intelligents fonctionnent (8 = 8, puis + 5 → 8 + 5)
- ✅ La touche ANS fonctionne (2ND + (-))
- ✅ Le manifest est accessible
- ✅ Le service worker s'enregistre
- ✅ La version 2.2.4 apparaît dans l'aide (bouton ?)

---

## 🔐 Déploiement via SSH

### Méthode Rapide

```bash
# 1. Copier l'archive sur le serveur
scp calculatrice-ti83-pwa-v2.2.4.tar.gz utilisateur@lhusser.fr:/tmp/

# 2. Se connecter au serveur
ssh utilisateur@lhusser.fr

# 3. Sauvegarder l'ancienne version (optionnel)
cp -r /var/www/html/calculatrice /var/www/html/calculatrice.backup.v2.2.3

# 4. Supprimer l'ancien contenu
rm -rf /var/www/html/calculatrice/*

# 5. Extraire la nouvelle version PWA
cd /tmp
tar -xzf calculatrice-ti83-pwa-v2.2.4.tar.gz
cp -r dist/* /var/www/html/calculatrice/

# 6. Vérifier les permissions
chmod -R 755 /var/www/html/calculatrice/

# 7. Vérifier les fichiers
ls -la /var/www/html/calculatrice/
```

---

## 📁 Structure des Fichiers PWA Déployés

Après déploiement, votre répertoire `/calculatrice/` devrait contenir :

```
/var/www/html/calculatrice/
├── index.html                          (572 bytes)
├── manifest.webmanifest               (907 bytes)
├── sw.js                              (1.9 KB)
├── workbox-b833909e.js                (22 KB)
├── icon.svg                           (3.8 KB)
├── icon-192.png                       (7.1 KB)
├── icon-512.png                       (20 KB)
├── icon-maskable-192.png              (5.2 KB)
├── icon-maskable-512.png              (20 KB)
├── vite.svg                           (1.5 KB)
├── _redirects                         (24 bytes)
└── assets/
    ├── index-DeqsUAtP.js              (271.41 KB) ⭐ NOUVEAU (Mode SECOND corrigé)
    ├── index-DpKtdQXP.css             (9.5 KB)
    └── workbox-window.prod.es5-CwtvwXb3.js   (5.76 KB)
```

**Taille totale : 372 KB**

---

## ⚙️ Configuration Serveur pour PWA

### HTTPS Requis

⚠️ **IMPORTANT** : Les PWA nécessitent **HTTPS obligatoirement**.

Vérifiez que votre site utilise bien HTTPS :
```
https://www.lhusser.fr/calculatrice/
```

### Headers Apache (.htaccess)

Les headers configurés lors des versions précédentes restent valides.

---

## 🧪 Tests Post-Déploiement

### 1. Tester le Mode SECOND (NOUVEAU - CRITIQUE)

Ouvrez : https://www.lhusser.fr/calculatrice/

**Test 1 : SECOND + Fonction trigonométrique**
1. Appuyez sur `SECOND` → Indicateur SECOND s'allume
2. Appuyez sur `SIN` → Insère `sin(`
3. ✅ Vérifiez que l'indicateur SECOND s'éteint automatiquement
4. Tapez `45)` → `ENTER`
5. ✅ Résultat : `0.8509...`

**Test 2 : SECOND + X²**
1. Tapez `5`
2. Appuyez sur `SECOND` → Indicateur SECOND s'allume
3. Appuyez sur `X²` → Insère `^2`
4. ✅ Vérifiez que l'indicateur SECOND s'éteint automatiquement
5. `ENTER` → ✅ Résultat : `25`

**Test 3 : SECOND + ANS**
1. Calculez `5 + 3` → `ENTER` → `8`
2. Appuyez sur `SECOND` → Indicateur SECOND s'allume
3. Appuyez sur `(-)` (ANS) → Insère `8`
4. ✅ Vérifiez que l'indicateur SECOND s'éteint automatiquement

**Test 4 : Mode ALPHA**
1. Appuyez sur `ALPHA` → Indicateur ALPHA s'allume
2. Appuyez sur `X` → Insère `X`
3. ✅ Vérifiez que l'indicateur ALPHA s'éteint automatiquement

### 2. Tester les Opérateurs Intelligents (v2.2.3)

**Test 1 : Addition automatique**
1. Tapez `8` → `ENTER` → `8`
2. Appuyez sur `+`
3. ✅ Vérifiez que l'écran affiche `8+`
4. Tapez `5` → `ENTER` → ✅ Résultat : `13`

### 3. Tester la Touche ANS (v2.2.2)

**Test 1 : Calcul avec ANS**
1. Tapez `5 + 3` → `ENTER` → `8`
2. `SECOND` + `(-)` (ANS)
3. ✅ Vérifiez que `8` apparaît
4. `× 2` → `ENTER` → ✅ Résultat : `16`

### 4. Vérifier la Version

1. Tapez sur le bouton **?** (Aide)
2. Vérifiez que le footer indique : **"Version 2.2.4 (PWA) • 🔧 Mode SECOND corrigé"**

### 5. Vérifier le Service Worker (Mise à Jour)

Pour les utilisateurs ayant déjà installé la v2.2.3 :

1. Ouvrez **DevTools** (F12)
2. Allez dans **Application** → **Service Workers**
3. Cliquez sur **Update** pour forcer la mise à jour
4. Rechargez la page (F5)
5. Vérifiez que le mode SECOND se désactive automatiquement

### 6. Tester sur Android (Mise à Jour)

Pour les utilisateurs ayant déjà installé l'app :

1. **Ouvrez** l'application depuis l'écran d'accueil
2. La mise à jour se fait **automatiquement** en arrière-plan
3. **Fermez** et **réouvrez** l'app
4. Testez le mode SECOND

---

## 🔍 Diagnostic

### Problème : Le mode SECOND ne se désactive pas

**Causes possibles :**
- ❌ Cache non vidé
- ❌ Service Worker pas mis à jour
- ❌ Fichiers non uploadés correctement

**Solutions :**
1. **Videz le cache** : Ctrl+Shift+R (hard reload)
2. **Mettez à jour le SW** : DevTools → Application → Service Workers → Update
3. **Vérifiez les fichiers** : Le fichier JS doit être `index-DeqsUAtP.js` (271.41 KB)
4. **Désinstallez et réinstallez** l'app Android

### Problème : Les opérateurs ne fonctionnent pas

**Solutions :**
1. Vérifiez que vous êtes bien en mode NORMAL (pas en mode édition)
2. Vérifiez que le bon fichier JS est chargé (F12 → Network)
3. Videz le cache du navigateur
4. Réinstallez l'application PWA

---

## 📊 Statistiques PWA v2.2.4

### Fichiers Modifiés

- ✅ `index-DeqsUAtP.js` (271.41 KB) - Mode SECOND corrigé
- ✅ Calculator.tsx - Wrapper handleKeyPressWithAutoDeactivate
- ✅ HelpModal.tsx - Version 2.2.4
- ✅ README.md - Section v2.2.4

### Tailles

- **Build total** : 372 KB
- **Archive ZIP** : 144 KB
- **Archive TAR.GZ** : 142 KB
- **JavaScript** : 271.41 KB (+0.04 KB depuis v2.2.3)
- **Précache** : 336.38 KB (13 fichiers)

### Changements Fonctionnels

- **Correction importante** : Mode SECOND se désactive automatiquement
- **Correction importante** : Mode ALPHA se désactive automatiquement (déjà fonctionnel)
- **Architecture améliorée** : Wrapper garantit la désactivation pour tous les chemins
- **Comportement conforme** : 100% identique à la TI-83 Plus réelle

---

## 📝 Changelog v2.2.4

### Mode SECOND Corrigé

- ✅ **Mode SECOND auto-désactivé** après utilisation
- ✅ **Mode ALPHA auto-désactivé** après utilisation
- ✅ Wrapper `handleKeyPressWithAutoDeactivate` créé
- ✅ Garantit la désactivation pour tous les chemins de code
- ✅ Fonctionne avec menus, trace, navigation, édition

### Hérite de toutes les fonctionnalités précédentes

- ✅ **v2.2.3** : Opérateurs arithmétiques intelligents (+, -, ×, ÷)
- ✅ **v2.2.2** : Touche ANS et calculs en chaîne
- ✅ **v2.2.1** : Mode ALPHA corrigé (lettres au lieu de chiffres)
- ✅ **v2.2.0** : Clavier TI-83 Plus Exact

### Documentation

- ✅ README.md mis à jour avec section v2.2.4
- ✅ HelpModal.tsx mis à jour avec nouvelle version
- ✅ DEPLOYMENT_PWA_v2.2.4.md créé

### Compatibilité

- ✅ 100% compatible avec v2.2.3 (PWA features)
- ✅ Mise à jour automatique via Service Worker
- ✅ Pas de réinstallation nécessaire

---

## 🎯 Prochaines Étapes

1. **Déployez** la version 2.2.4 sur lhusser.fr
2. **Testez** le mode SECOND (CRITIQUE)
3. **Vérifiez** que l'indicateur s'éteint automatiquement
4. **Informez** vos utilisateurs de la correction !

---

## 📱 Message pour les Utilisateurs

Une fois déployé, partagez ce message :

> 🔧 **Mise à jour v2.2.4 disponible !**
>
> Correction importante du **mode SECOND** !
>
> ✨ **Correction :**
> - Le mode SECOND se désactive automatiquement après utilisation
> - Comportement 100% conforme à la TI-83 Plus réelle
> - Exemple : `SECOND` + `SIN` → insère `sin(` et désactive SECOND
>
> 🎯 **Ce qui fonctionne maintenant :**
> - Mode SECOND : Auto-désactivation ✅
> - Mode ALPHA : Auto-désactivation ✅
> - Opérateurs intelligents : Fonctionnent parfaitement ✅
> - Touche ANS : Disponible ✅
>
> 🔄 **Mise à jour automatique** pour les apps déjà installées.
> 📱 Si vous rencontrez des problèmes, videz le cache (Ctrl+Shift+R).

---

## 🎉 Félicitations !

Votre calculatrice TI-83 Plus v2.2.4 est maintenant déployée avec :

✅ Mode SECOND qui se désactive automatiquement
✅ Mode ALPHA qui se désactive automatiquement
✅ Opérateurs arithmétiques intelligents (+, -, ×, ÷)
✅ Fonctions automatiques (sin, cos, √, etc.)
✅ Touche ANS fonctionnelle
✅ Documentation complète avec exemples
✅ Calculs en chaîne ultra-fluides
✅ PWA complète
✅ Mode hors ligne
✅ Mises à jour automatiques

**Déployez sur** : https://www.lhusser.fr/calculatrice/

Vos utilisateurs peuvent maintenant profiter d'une calculatrice qui se comporte exactement comme une TI-83 Plus réelle ! 🎯🔧

---

## 📅 Informations de Version

- **Version :** 2.2.4 (PWA + Mode SECOND Corrigé)
- **Date :** 7 novembre 2025
- **Branche :** claude/fix-alpha-mode-011CUtMTEAxLXqVMAqTbyqLH
- **Commit :** À venir
- **Taille du build :** 372 KB (non compressé)
- **Taille des archives :** 142-144 KB (compressé)
- **Correction importante :** Mode SECOND auto-désactivé après utilisation
- **Évolution depuis v2.2.3 :** Correction du comportement du mode SECOND
