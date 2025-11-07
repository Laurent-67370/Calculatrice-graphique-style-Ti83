# 📤 Guide de Déploiement PWA - Version 2.2.1

## 🎯 Déploiement sur lhusser.fr/calculatrice

Cette version 2.2.1 corrige un **bug critique du mode ALPHA** qui empêchait la saisie des lettres !

---

## ✨ Nouveautés de la v2.2.1 (Correction Mode ALPHA)

### 🔧 Correction Majeure du Mode ALPHA

**Problème résolu** : Le mode ALPHA affichait les lettres sur le clavier mais insérait les chiffres à la place.

#### 🐛 Avant la Correction
- ❌ Appuyer sur `ALPHA` puis `+` (lettre A) insérait `+` au lieu de `A`
- ❌ Appuyer sur `ALPHA` puis `7` (lettre T) insérait `7` au lieu de `T`
- ❌ Le mode ALPHA ne désactivait pas automatiquement après la lettre
- ❌ Impossible de saisir les lettres dans les expressions

#### ✅ Après la Correction
- ✅ Appuyer sur `ALPHA` puis `+` insère correctement `A`
- ✅ Toutes les lettres A-Z sont maintenant correctement insérées
- ✅ Le mode ALPHA se désactive automatiquement après la lettre (comme TI-83 réelle)
- ✅ Support des caractères spéciaux : θ (theta), n, : (deux-points), espace

#### 📝 Modifications Techniques

1. **Keyboard.tsx** (ligne ~147)
   - Envoi d'actions préfixées `alpha-X` au lieu de `alphaAction`
   - Détection correcte du mode ALPHA actif

2. **calculator.types.ts** (ligne ~52)
   - Ajout de 30 nouveaux types d'actions : `alpha-A` à `alpha-Z`, `alpha-θ`, `alpha-n`, etc.

3. **Calculator.tsx** (ligne ~236)
   - Détection des actions `alpha-X`
   - Extraction et insertion de la lettre correspondante
   - Désactivation automatique du mode ALPHA

#### 🎯 Lettres Alpha Disponibles

- **A-Z** : Toutes les lettres de l'alphabet sur les touches correspondantes
- **θ (theta)** : Touche `)` en mode ALPHA
- **n** : Touche `LN` en mode ALPHA
- **: (deux-points)** : Touche `.` en mode ALPHA
- **Espace** : Touche `0` en mode ALPHA

#### 💡 Comportement Conforme à la TI-83 Plus

1. Appuyer sur `ALPHA` active le mode (indicateur vert s'allume)
2. Appuyer sur une touche insère la lettre correspondante
3. Le mode ALPHA se désactive automatiquement après la lettre
4. Pour saisir plusieurs lettres, appuyer sur `ALPHA` avant chaque lettre

---

## 📦 Archives Disponibles

Deux formats d'archives PWA sont disponibles :

- **calculatrice-ti83-pwa-v2.2.1.zip** (144K) - Pour Windows/Mac
- **calculatrice-ti83-pwa-v2.2.1.tar.gz** (143K) - Pour Linux/Unix

---

## 🚀 Déploiement via FTP

### Étape 1 : Télécharger l'archive PWA

Récupérez l'archive `calculatrice-ti83-pwa-v2.2.1.zip` depuis le repository GitHub.

### Étape 2 : Extraire localement

```bash
unzip calculatrice-ti83-pwa-v2.2.1.zip
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
- ✅ Le mode ALPHA fonctionne correctement
- ✅ Les lettres s'insèrent au lieu des chiffres
- ✅ Le mode se désactive automatiquement
- ✅ Le manifest est accessible
- ✅ Le service worker s'enregistre
- ✅ La version 2.2.1 apparaît dans l'aide (bouton ?)

---

## 🔐 Déploiement via SSH

### Méthode Rapide

```bash
# 1. Copier l'archive sur le serveur
scp calculatrice-ti83-pwa-v2.2.1.tar.gz utilisateur@lhusser.fr:/tmp/

# 2. Se connecter au serveur
ssh utilisateur@lhusser.fr

# 3. Sauvegarder l'ancienne version (optionnel)
cp -r /var/www/html/calculatrice /var/www/html/calculatrice.backup.v2.2.0

# 4. Supprimer l'ancien contenu
rm -rf /var/www/html/calculatrice/*

# 5. Extraire la nouvelle version PWA
cd /tmp
tar -xzf calculatrice-ti83-pwa-v2.2.1.tar.gz
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
    ├── index-DmX554fe.js              (269.13 KB) ⭐ NOUVEAU (Mode ALPHA corrigé)
    ├── index-DpKtdQXP.css             (9.5 KB)
    └── workbox-window.prod.es5-*.js   (5.76 KB)
```

**Taille totale : 370 KB**

---

## ⚙️ Configuration Serveur pour PWA

### HTTPS Requis

⚠️ **IMPORTANT** : Les PWA nécessitent **HTTPS obligatoirement**.

Vérifiez que votre site utilise bien HTTPS :
```
https://www.lhusser.fr/calculatrice/
```

### Headers Apache (.htaccess)

Les headers configurés lors des versions précédentes restent valides. Si nécessaire, ajoutez ces headers dans `/calculatrice/.htaccess` :

```apache
# === CONFIGURATION PWA ===

# 1. Headers pour le Service Worker
<FilesMatch "sw\.js$">
  Header set Content-Type "application/javascript; charset=utf-8"
  Header set Cache-Control "no-cache, no-store, must-revalidate"
  Header set Pragma "no-cache"
  Header set Expires "0"
  Header set Service-Worker-Allowed "/"
</FilesMatch>

# 2. Headers pour le Manifest
<FilesMatch "manifest\.webmanifest$">
  Header set Content-Type "application/manifest+json; charset=utf-8"
  Header set Cache-Control "public, max-age=604800"
</FilesMatch>

# 3. Headers pour Workbox
<FilesMatch "workbox-.*\.js$">
  Header set Content-Type "application/javascript; charset=utf-8"
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

# 4. Headers pour les icônes PNG
<FilesMatch "\.(png|jpg|jpeg|svg)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

# 5. Headers de sécurité
Header set X-Frame-Options "DENY"
Header set X-Content-Type-Options "nosniff"
Header set X-XSS-Protection "1; mode=block"

# 6. Compression Gzip
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json
  AddOutputFilterByType DEFLATE application/manifest+json
</IfModule>
```

---

## 🧪 Tests Post-Déploiement

### 1. Tester le Mode ALPHA (CRITIQUE)

Ouvrez : https://www.lhusser.fr/calculatrice/

**Test 1 : Lettre A**
1. Appuyez sur `ALPHA` → Indicateur vert s'allume
2. Appuyez sur `+` (lettre A en mode ALPHA)
3. ✅ Vérifiez que `A` apparaît à l'écran (pas `+`)
4. ✅ Vérifiez que le mode ALPHA est désactivé (indicateur éteint)

**Test 2 : Lettre T**
1. Appuyez sur `ALPHA`
2. Appuyez sur `7` (lettre T en mode ALPHA)
3. ✅ Vérifiez que `T` apparaît à l'écran (pas `7`)

**Test 3 : Plusieurs lettres**
1. Appuyez sur `ALPHA`, puis `+` (A)
2. Appuyez sur `ALPHA`, puis `-` (B)
3. Appuyez sur `ALPHA`, puis `×` (C)
4. ✅ Vérifiez que `ABC` apparaît à l'écran

**Test 4 : Caractères spéciaux**
1. `ALPHA` + `)` → Doit insérer `θ`
2. `ALPHA` + `LN` → Doit insérer `n`
3. `ALPHA` + `.` → Doit insérer `:`
4. `ALPHA` + `0` → Doit insérer un espace

### 2. Vérifier la Version

1. Tapez sur le bouton **?** (Aide)
2. Vérifiez que le footer indique : **"Version 2.2.1 (PWA) • 🔧 Mode ALPHA corrigé"**

### 3. Vérifier le Service Worker (Mise à Jour)

Pour les utilisateurs ayant déjà installé la v2.2.0 :

1. Ouvrez **DevTools** (F12)
2. Allez dans **Application** → **Service Workers**
3. Cliquez sur **Update** pour forcer la mise à jour
4. Rechargez la page (F5)
5. Vérifiez que le mode ALPHA fonctionne

### 4. Tester sur Android (Mise à Jour)

Pour les utilisateurs ayant déjà installé l'app :

1. **Ouvrez** l'application depuis l'écran d'accueil
2. La mise à jour se fait **automatiquement** en arrière-plan
3. **Fermez** et **réouvrez** l'app
4. Testez le mode ALPHA

---

## 🔍 Diagnostic

### Problème : Mode ALPHA insère encore des chiffres

**Causes possibles :**
- ❌ Cache non vidé
- ❌ Service Worker pas mis à jour
- ❌ Fichiers non uploadés correctement

**Solutions :**
1. **Videz le cache** : Ctrl+Shift+R (hard reload)
2. **Mettez à jour le SW** : DevTools → Application → Service Workers → Update
3. **Vérifiez les fichiers** : Le fichier JS doit être `index-DmX554fe.js` (pas l'ancien `index-DbFGl4qJ.js`)
4. **Désinstallez et réinstallez** l'app Android

### Problème : Mode ALPHA ne se désactive pas

**Solutions :**
1. Vérifiez que le bon fichier JS est chargé (F12 → Network)
2. Videz le cache du navigateur
3. Vérifiez la console pour les erreurs JavaScript
4. Réinstallez l'application PWA

---

## 📊 Statistiques PWA v2.2.1

### Fichiers Modifiés

- ✅ `index-DmX554fe.js` (269.13 KB) - Mode ALPHA corrigé
- ✅ Keyboard.tsx - Envoi de `alpha-X` actions
- ✅ calculator.types.ts - 30+ nouveaux types `alpha-*`
- ✅ Calculator.tsx - Handler pour lettres ALPHA

### Tailles

- **Build total** : 370 KB
- **Archive ZIP** : 144 KB
- **Archive TAR.GZ** : 143 KB
- **JavaScript** : 269.13 KB
- **Précache** : 334.15 KB (13 fichiers)

### Changements Fonctionnels

- **Bug corrigé** : Mode ALPHA insérait les chiffres au lieu des lettres
- **Nouvelles actions** : 30 types `alpha-A` à `alpha-Z`, `alpha-θ`, etc.
- **Désactivation auto** : Mode ALPHA s'éteint après chaque lettre
- **Comportement** : 100% conforme à la TI-83 Plus réelle

---

## 📝 Changelog v2.2.1

### Correction du Mode ALPHA (Bug Critique)

- 🐛 **Corrigé** : Mode ALPHA insérait les chiffres au lieu des lettres
- ✅ Keyboard.tsx : Envoi d'actions `alpha-X` en mode ALPHA
- ✅ calculator.types.ts : Ajout de 30 types `alpha-*`
- ✅ Calculator.tsx : Détection et insertion des lettres
- ✅ Désactivation automatique du mode après chaque lettre
- ✅ Support de θ (theta), n, : (deux-points), espace
- ✅ Comportement conforme à la TI-83 Plus réelle

### Documentation

- ✅ DEPLOYMENT_PWA_v2.2.1.md créé
- ✅ Guide de test détaillé du mode ALPHA

### Compatibilité

- ✅ 100% compatible avec v2.2.0 (PWA features)
- ✅ Mise à jour automatique via Service Worker
- ✅ Pas de réinstallation nécessaire

---

## 🎯 Prochaines Étapes

1. **Déployez** la version 2.2.1 sur lhusser.fr
2. **Testez** le mode ALPHA (CRITIQUE)
3. **Vérifiez** que les lettres s'insèrent correctement
4. **Informez** vos utilisateurs de la correction !

---

## 📱 Message pour les Utilisateurs

Une fois déployé, partagez ce message :

> 🔧 **Mise à jour v2.2.1 disponible !**
>
> Un **bug critique du mode ALPHA** a été corrigé !
>
> 🐛 **Problème résolu :**
> - Le mode ALPHA insérait les chiffres au lieu des lettres
> - Maintenant, les lettres s'insèrent correctement !
>
> ✨ **Améliorations :**
> - Support complet A-Z
> - Désactivation automatique après chaque lettre
> - Comportement conforme à la TI-83 Plus réelle
>
> 🔄 **Mise à jour automatique** pour les apps déjà installées.
> 📱 Si vous rencontrez des problèmes, videz le cache (Ctrl+Shift+R).

---

## 🎉 Félicitations !

Votre calculatrice TI-83 Plus v2.2.1 est maintenant déployée avec :

✅ Mode ALPHA corrigé (bug critique résolu)
✅ Lettres A-Z correctement insérées
✅ Comportement conforme à la TI-83 Plus réelle
✅ PWA complète
✅ Mode hors ligne
✅ Mises à jour automatiques

**Déployez sur** : https://www.lhusser.fr/calculatrice/

Vos utilisateurs peuvent maintenant saisir les lettres correctement ! 🔤✅

---

## 📅 Informations de Version

- **Version :** 2.2.1 (PWA + Correction Mode ALPHA)
- **Date :** 7 novembre 2025
- **Branche :** claude/fix-alpha-mode-011CUtMTEAxLXqVMAqTbyqLH
- **Commit :** 2b9f18c (Correction mode ALPHA)
- **Taille du build :** 370 KB (non compressé)
- **Taille des archives :** 143-144 KB (compressé)
- **Correction majeure :** Mode ALPHA insérait les chiffres au lieu des lettres
- **Évolution depuis v2.2.0 :** Correction du bug critique du mode ALPHA
