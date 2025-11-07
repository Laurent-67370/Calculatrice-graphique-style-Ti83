# 📤 Guide de Déploiement PWA - Version 2.2.0

## 🎯 Déploiement sur lhusser.fr/calculatrice

Cette version 2.2.0 apporte un **clavier réorganisé** pour correspondre exactement à la **TI-83 Plus physique** !

---

## ✨ Nouveautés de la v2.2.0 (Clavier TI-83 Plus Exact)

### ⌨️ Clavier Réorganisé

1. **Disposition Matérielle Exacte**
   - 10 lignes repositionnées selon le matériel réel
   - Flèches déplacées aux lignes 2-3
   - X⁻¹ ajouté en ligne 5
   - X² déplacé en ligne 6
   - STO→ et ON ajoutés

2. **Nouvelles Touches Fonctionnelles**
   - X⁻¹ : Inverse (1/)
   - STO→ : Stockage de variable
   - RCL : Rappel de variable
   - ON/OFF : Contrôle d'alimentation
   - i : Unité imaginaire
   - u, v, w : Variables paramétriques
   - EE : Notation scientifique
   - {, }, [, ] : Accolades et crochets

3. **Lettres Alpha Corrigées**
   - Lignes 5-6 : P, Q, R, S, T, U, V, W, θ, X
   - Lignes 7-8 : Y, A, B, C, Z, n, D, E, F, G
   - Lignes 9-10 : H, I, J, K, L, espace, :, M

4. **Amélioration de l'Expérience Utilisateur**
   - Correspondance exacte avec le matériel physique
   - Meilleure mémorisation pour les utilisateurs de TI-83 Plus
   - Accès rapide aux fonctions scientifiques

---

## 📦 Archives Disponibles

Deux formats d'archives PWA sont disponibles :

- **calculatrice-ti83-pwa-v2.2.0.zip** (144K) - Pour Windows/Mac
- **calculatrice-ti83-pwa-v2.2.0.tar.gz** (143K) - Pour Linux/Unix

---

## 🚀 Déploiement via FTP

### Étape 1 : Télécharger l'archive PWA

Récupérez l'archive `calculatrice-ti83-pwa-v2.2.0.zip` depuis le repository GitHub.

### Étape 2 : Extraire localement

```bash
unzip calculatrice-ti83-pwa-v2.2.0.zip
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
- ✅ Le nouveau clavier s'affiche correctement
- ✅ Les nouvelles touches fonctionnent (X⁻¹, STO→, ON, etc.)
- ✅ Le manifest est accessible
- ✅ Le service worker s'enregistre
- ✅ La version 2.2.0 apparaît dans l'aide (bouton ?)

---

## 🔐 Déploiement via SSH

### Méthode Rapide

```bash
# 1. Copier l'archive sur le serveur
scp calculatrice-ti83-pwa-v2.2.0.tar.gz utilisateur@lhusser.fr:/tmp/

# 2. Se connecter au serveur
ssh utilisateur@lhusser.fr

# 3. Sauvegarder l'ancienne version (optionnel)
cp -r /var/www/html/calculatrice /var/www/html/calculatrice.backup.v2.1.0

# 4. Supprimer l'ancien contenu
rm -rf /var/www/html/calculatrice/*

# 5. Extraire la nouvelle version PWA
cd /tmp
tar -xzf calculatrice-ti83-pwa-v2.2.0.tar.gz
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
    ├── index-DbFGl4qJ.js              (269.06 KB) ⭐ NOUVEAU
    ├── index-DpKtdQXP.css             (9.5 KB)
    └── workbox-window.prod.es5-*.js   (5.76 KB)
```

**Taille totale : 365 KB**

---

## ⚙️ Configuration Serveur pour PWA

### HTTPS Requis

⚠️ **IMPORTANT** : Les PWA nécessitent **HTTPS obligatoirement**.

Vérifiez que votre site utilise bien HTTPS :
```
https://www.lhusser.fr/calculatrice/
```

### Headers Apache (.htaccess)

Les headers configurés lors de la v2.1.0 restent valides. Si nécessaire, ajoutez ces headers dans `/calculatrice/.htaccess` :

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

### 1. Vérifier le Nouveau Clavier

Ouvrez : https://www.lhusser.fr/calculatrice/

Vérifiez :
- ✅ **Ligne 5** commence par **X⁻¹** (pas X,T,θ,n)
- ✅ **Ligne 6** commence par **X²** (pas √)
- ✅ **Ligne 2** contient **←** et **↑**
- ✅ **Ligne 3** contient **↓** et **→**
- ✅ **Ligne 9** contient **STO→**
- ✅ **Ligne 10** contient **ON**

### 2. Tester les Nouvelles Fonctions

1. **X⁻¹** : Entrez `5`, tapez `X⁻¹`, puis `ENTER` → Résultat : `0.2`
2. **STO→** : Entrez `42`, tapez `STO→`, tapez `A` (en mode ALPHA) → Variable stockée
3. **EE** : Entrez `3`, tapez `.`, `2`, `2ND+,` (EE), `8` → `3.2E8`
4. **i** : Tapez `2ND+.` (i) → `i` apparaît

### 3. Vérifier la Version

1. Tapez sur le bouton **?** (Aide)
2. Vérifiez que le footer indique : **"Version 2.2.0 (PWA) • ⌨️ Clavier TI-83 Plus exact"**

### 4. Vérifier le Service Worker (Mise à Jour)

Pour les utilisateurs ayant déjà installé la v2.1.0 :

1. Ouvrez **DevTools** (F12)
2. Allez dans **Application** → **Service Workers**
3. Cliquez sur **Update** pour forcer la mise à jour
4. Rechargez la page (F5)
5. Vérifiez que le nouveau clavier s'affiche

### 5. Tester sur Android (Mise à Jour)

Pour les utilisateurs ayant déjà installé l'app :

1. **Ouvrez** l'application depuis l'écran d'accueil
2. La mise à jour se fait **automatiquement** en arrière-plan
3. **Fermez** et **réouvrez** l'app
4. Vérifiez le nouveau clavier

---

## 🔍 Diagnostic

### Problème : Ancien clavier toujours affiché

**Causes possibles :**
- ❌ Cache non vidé
- ❌ Service Worker pas mis à jour
- ❌ Fichiers non uploadés correctement

**Solutions :**
1. **Videz le cache** : Ctrl+Shift+R (hard reload)
2. **Mettez à jour le SW** : DevTools → Application → Service Workers → Update
3. **Vérifiez les fichiers** : Le fichier JS doit être `index-DbFGl4qJ.js` (pas l'ancien)
4. **Désinstallez et réinstallez** l'app Android

### Problème : Nouvelles touches ne fonctionnent pas

**Solutions :**
1. Vérifiez que le bon fichier JS est chargé (F12 → Network)
2. Videz le cache du navigateur
3. Vérifiez la console pour les erreurs JavaScript
4. Réinstallez l'application PWA

---

## 📊 Statistiques PWA v2.2.0

### Fichiers Modifiés

- ✅ `index-DbFGl4qJ.js` (269.06 KB) - Nouveau build avec clavier corrigé
- ✅ HelpModal.tsx - Version mise à jour
- ✅ Keyboard.tsx - Clavier réorganisé
- ✅ calculator.types.ts - 20+ nouveaux KeyAction
- ✅ Calculator.tsx - Handlers pour nouvelles actions

### Tailles

- **Build total** : 365 KB (inchangé)
- **Archive ZIP** : 144 KB
- **Archive TAR.GZ** : 143 KB
- **JavaScript** : 269.06 KB (vs 269.02 KB avant)

### Changements Fonctionnels

- **Nouvelles actions** : +20 KeyAction types
- **Touches ajoutées** : X⁻¹, STO→, RCL, ON, OFF, i, u, v, w, EE, etc.
- **Touches repositionnées** : Flèches, X², √, et autres
- **Lettres alpha** : Toutes corrigées pour correspondre au matériel

---

## 📝 Changelog v2.2.0

### Clavier TI-83 Plus Exact

- ✅ 10 lignes réorganisées pour correspondre au matériel physique
- ✅ X⁻¹ ajouté en ligne 5, première position
- ✅ X² déplacé en ligne 6, première position
- ✅ Flèches repositionnées (←↑ ligne 2, ↓→ ligne 3)
- ✅ STO→ ajouté en ligne 9
- ✅ ON ajouté en ligne 10
- ✅ 20+ nouvelles KeyAction types
- ✅ Toutes les lettres alpha corrigées
- ✅ Handlers pour inverse, sto, rcl, on/off, i, u, v, w, ee
- ✅ Support des accolades et crochets

### Documentation

- ✅ README.md mis à jour avec section v2.2.0
- ✅ HelpModal.tsx mis à jour avec nouvelle version
- ✅ DEPLOYMENT_PWA_v2.2.0.md créé

### Compatibilité

- ✅ 100% compatible avec v2.1.0 (PWA features)
- ✅ Mise à jour automatique via Service Worker
- ✅ Pas de réinstallation nécessaire

---

## 🎯 Prochaines Étapes

1. **Déployez** la version 2.2.0 sur lhusser.fr
2. **Testez** le nouveau clavier
3. **Vérifiez** les nouvelles touches (X⁻¹, STO→, etc.)
4. **Informez** vos utilisateurs de la mise à jour !

---

## 📱 Message pour les Utilisateurs

Une fois déployé, partagez ce message :

> ⌨️ **Mise à jour v2.2.0 disponible !**
>
> Le clavier a été **complètement réorganisé** pour correspondre exactement à la **TI-83 Plus physique** !
>
> ✨ **Nouveautés :**
> - X⁻¹ : Inverse d'un nombre
> - STO→ : Stockage de variables
> - ON : Contrôle d'alimentation
> - Lettres alpha exactes
> - Et bien plus !
>
> 🔄 **Mise à jour automatique** pour les apps déjà installées.
> 📱 Si vous rencontrez des problèmes, réinstallez l'application.

---

## 🎉 Félicitations !

Votre calculatrice TI-83 Plus v2.2.0 est maintenant déployée avec :

✅ Clavier TI-83 Plus exact
✅ 20+ nouvelles touches fonctionnelles
✅ Lettres alpha corrigées
✅ PWA complète
✅ Mode hors ligne
✅ Mises à jour automatiques

**Déployez sur** : https://www.lhusser.fr/calculatrice/

Vos utilisateurs peuvent maintenant utiliser un clavier fidèle au matériel ! ⌨️🎯

---

## 📅 Informations de Version

- **Version :** 2.2.0 (PWA + Clavier TI-83 Plus Exact)
- **Date :** 7 novembre 2025
- **Branche :** claude/scientific-calculator-ti83-011CUqMQSu5obWhYPHKhcTN3
- **Commit :** d8fe577 (Correction clavier) + à venir (déploiement)
- **Taille du build :** 365 KB (non compressé)
- **Taille des archives :** 143-144 KB (compressé)
- **Nouveauté majeure :** Clavier réorganisé pour correspondre exactement à la TI-83 Plus physique
- **Évolution depuis v2.1.0 :** +20 KeyAction types, clavier réorganisé, nouvelles touches fonctionnelles
