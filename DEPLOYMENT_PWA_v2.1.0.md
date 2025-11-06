# 📤 Guide de Déploiement PWA - Version 2.1.0

## 🎯 Déploiement sur lhusser.fr/calculatrice

Cette version 2.1.0 transforme la calculatrice en **Progressive Web App (PWA)** installable sur Android !

---

## ✨ Nouveautés de la v2.1.0 (PWA)

### 📱 PWA Features

1. **Installation sur Android**
   - Icône sur l'écran d'accueil
   - Mode autonome (standalone) sans barre d'adresse
   - Icônes adaptatives (maskable) pour Android

2. **Mode Hors Ligne**
   - Fonctionne sans connexion Internet
   - Service Worker avec cache optimisé
   - Toutes les fonctions disponibles offline

3. **Mises à Jour Automatiques**
   - Détection automatique des nouvelles versions
   - Notification à l'utilisateur
   - Update en arrière-plan

4. **Performance Optimale**
   - Cache First strategy
   - Chargement instantané
   - 365 KB seulement

---

## 📦 Archives Disponibles

Deux formats d'archives PWA sont disponibles :

- **calculatrice-ti83-pwa-v2.1.0.zip** (142K) - Pour Windows/Mac
- **calculatrice-ti83-pwa-v2.1.0.tar.gz** (140K) - Pour Linux/Unix

---

## 🚀 Déploiement via FTP

### Étape 1 : Télécharger l'archive PWA

Récupérez l'archive `calculatrice-ti83-pwa-v2.1.0.zip` depuis le repository GitHub.

### Étape 2 : Extraire localement

```bash
unzip calculatrice-ti83-pwa-v2.1.0.zip
```

### Étape 3 : Upload via FTP

1. **Connectez-vous** à votre serveur FTP (lhusser.fr)
2. **Naviguez** vers `/public_html/calculatrice/`
3. **Sauvegardez** l'ancienne version (optionnel)
4. **Supprimez** tous les fichiers du répertoire `/calculatrice/`
5. **Uploadez** le contenu de `calculatrice-ti83-react/dist/` :
   - `index.html`
   - `manifest.webmanifest` ⭐ **NOUVEAU**
   - `sw.js` ⭐ **NOUVEAU** (Service Worker)
   - `workbox-*.js` ⭐ **NOUVEAU**
   - `icon-*.png` (4 icônes) ⭐ **NOUVEAU**
   - `icon.svg`
   - `vite.svg`
   - `_redirects`
   - Dossier `assets/` complet

### Étape 4 : Vérifier le déploiement

Visitez : https://www.lhusser.fr/calculatrice/

Testez :
- ✅ La page se charge
- ✅ Le manifest est accessible : https://www.lhusser.fr/calculatrice/manifest.webmanifest
- ✅ Le service worker s'enregistre (ouvrez DevTools → Application → Service Workers)
- ✅ Les icônes sont accessibles

---

## 🔐 Déploiement via SSH

### Méthode Rapide

```bash
# 1. Copier l'archive sur le serveur
scp calculatrice-ti83-pwa-v2.1.0.tar.gz utilisateur@lhusser.fr:/tmp/

# 2. Se connecter au serveur
ssh utilisateur@lhusser.fr

# 3. Sauvegarder l'ancienne version (optionnel)
cp -r /var/www/html/calculatrice /var/www/html/calculatrice.backup

# 4. Supprimer l'ancien contenu
rm -rf /var/www/html/calculatrice/*

# 5. Extraire la nouvelle version PWA
tar -xzf /tmp/calculatrice-ti83-pwa-v2.1.0.tar.gz -C /var/www/html/calculatrice/

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
├── manifest.webmanifest               (907 bytes) ⭐ NOUVEAU
├── sw.js                              (1.9 KB)    ⭐ NOUVEAU
├── workbox-b833909e.js                (22 KB)     ⭐ NOUVEAU
├── icon.svg                           (3.8 KB)
├── icon-192.png                       (7.1 KB)    ⭐ NOUVEAU
├── icon-512.png                       (20 KB)     ⭐ NOUVEAU
├── icon-maskable-192.png              (5.2 KB)    ⭐ NOUVEAU
├── icon-maskable-512.png              (20 KB)     ⭐ NOUVEAU
├── vite.svg                           (1.5 KB)
├── _redirects                         (24 bytes)
└── assets/
    ├── index-Cu6NyO2l.js              (263.5 KB)
    ├── index-DpKtdQXP.css             (9.5 KB)
    └── workbox-window.prod.es5-*.js   (5.76 KB)   ⭐ NOUVEAU
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

Ajoutez ces headers dans `/calculatrice/.htaccess` :

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

### Alternative Nginx

Si vous utilisez Nginx, ajoutez dans votre config :

```nginx
location /calculatrice/ {
    # Headers PWA
    add_header Service-Worker-Allowed "/";

    # Cache du Service Worker
    location ~ sw\.js$ {
        add_header Content-Type "application/javascript; charset=utf-8";
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        expires 0;
    }

    # Cache du Manifest
    location ~ manifest\.webmanifest$ {
        add_header Content-Type "application/manifest+json; charset=utf-8";
        add_header Cache-Control "public, max-age=604800";
    }

    # Cache des assets
    location ~* \.(js|css|png|jpg|svg)$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

---

## 🧪 Tests Post-Déploiement

### 1. Vérifier le Manifest

Ouvrez : https://www.lhusser.fr/calculatrice/manifest.webmanifest

Vous devez voir :
```json
{
  "name": "Calculatrice TI-83 Plus",
  "short_name": "TI-83 Plus",
  "display": "standalone",
  ...
}
```

### 2. Vérifier le Service Worker

1. Ouvrez : https://www.lhusser.fr/calculatrice/
2. Ouvrez **DevTools** (F12)
3. Allez dans **Application** → **Service Workers**
4. Vérifiez que le SW est **activé** et **en cours d'exécution**

### 3. Tester l'Installation sur Android

1. **Ouvrez Chrome** sur Android
2. Visitez : https://www.lhusser.fr/calculatrice/
3. **Attendez** 5 secondes
4. **Tapez sur ⋮** → "Ajouter à l'écran d'accueil"
5. **Installez** l'application
6. **Lancez** depuis l'écran d'accueil
7. Vérifiez que l'app s'ouvre en **mode standalone** (sans barre d'adresse)

### 4. Tester le Mode Hors Ligne

1. **Installez** l'application sur Android
2. **Ouvrez** l'application
3. **Activez** le mode avion
4. **Fermez** et **réouvrez** l'application
5. Vérifiez que tout fonctionne ✅

### 5. Vérifier la Performance

Ouvrez **DevTools** → **Lighthouse** → Cochez **Progressive Web App** → **Analyze**

Score attendu : **90+/100**

---

## 🔍 Diagnostic PWA

### Problème : Installation impossible

**Causes possibles :**
- ❌ Site pas en HTTPS
- ❌ Manifest mal configuré
- ❌ Service Worker pas enregistré
- ❌ Icônes manquantes

**Solutions :**
1. Vérifiez l'URL : doit commencer par `https://`
2. Testez le manifest : `/calculatrice/manifest.webmanifest`
3. Vérifiez les icônes : `/calculatrice/icon-192.png`
4. Consultez les erreurs dans DevTools → Console

### Problème : Service Worker ne s'enregistre pas

**Solutions :**
1. Vérifiez que `sw.js` est accessible : https://www.lhusser.fr/calculatrice/sw.js
2. Vérifiez les headers HTTP :
   ```bash
   curl -I https://www.lhusser.fr/calculatrice/sw.js
   ```
3. Doit retourner : `Content-Type: application/javascript`
4. Videz le cache et rechargez (Ctrl+Shift+R)

### Problème : Mode hors ligne ne fonctionne pas

**Solutions :**
1. Ouvrez l'app **au moins une fois** avec Internet
2. Vérifiez que le SW est actif dans DevTools
3. Vérifiez le cache dans DevTools → Application → Cache Storage
4. Réinstallez l'application

### Problème : Icône ne s'affiche pas

**Solutions :**
1. Vérifiez que toutes les icônes sont uploadées :
   - icon-192.png
   - icon-512.png
   - icon-maskable-192.png
   - icon-maskable-512.png
2. Vérifiez les permissions : `chmod 644 icon-*.png`
3. Vérifiez le MIME type : doit être `image/png`

---

## 📊 Statistiques PWA v2.1.0

### Fichiers Ajoutés

- ✅ manifest.webmanifest (907 bytes)
- ✅ sw.js (1.9 KB)
- ✅ workbox-b833909e.js (22 KB)
- ✅ icon-192.png (7.1 KB)
- ✅ icon-512.png (20 KB)
- ✅ icon-maskable-192.png (5.2 KB)
- ✅ icon-maskable-512.png (20 KB)
- ✅ workbox-window dans assets (5.76 KB)

**Total ajouté : ~89 KB**

### Tailles

- **Build total** : 365 KB (vs 276 KB avant)
- **Archive ZIP** : 142 KB
- **Archive TAR.GZ** : 140 KB
- **Service Worker** : 1.9 KB
- **Workbox** : 22 KB

### Performance

- **Précache** : 13 fichiers (328.66 KB)
- **Cache First** : Priorité au cache local
- **Durée de vie du cache** : 1 an
- **Mise à jour** : Automatique en arrière-plan

---

## 📝 Changelog v2.1.0

### Ajouts PWA

- ✅ Plugin vite-plugin-pwa intégré
- ✅ Manifest PWA configuré
- ✅ Service Worker généré (Workbox)
- ✅ 4 icônes PNG générées (192px et 512px, standard et maskable)
- ✅ Icône SVG source créée
- ✅ Script de génération d'icônes
- ✅ Enregistrement du SW dans main.tsx
- ✅ Notification de mise à jour
- ✅ Mode standalone
- ✅ Orientation portrait forcée
- ✅ Mode hors ligne complet

### Configuration

- ✅ vite.config.ts mis à jour avec VitePWA
- ✅ package.json mis à jour (scripts + dépendances)
- ✅ Types TypeScript ajoutés (vite-env.d.ts)

### Documentation

- ✅ PWA_GUIDE.md - Guide complet utilisateur
- ✅ DEPLOYMENT_PWA_v2.1.0.md - Guide déploiement

---

## 🎯 Prochaines Étapes

1. **Déployez** la version PWA sur lhusser.fr
2. **Testez** l'installation sur Android
3. **Vérifiez** le mode hors ligne
4. **Partagez** avec vos utilisateurs !

---

## 📱 Instructions pour les Utilisateurs

Une fois déployé, partagez ces instructions :

> 📱 **Installez la Calculatrice TI-83 Plus sur votre téléphone !**
>
> 1. Ouvrez **Chrome** sur Android
> 2. Visitez : https://www.lhusser.fr/calculatrice/
> 3. Tapez sur **⋮** → "Ajouter à l'écran d'accueil"
> 4. Installez l'application
>
> ✨ Fonctionne même **hors ligne** !

---

## 🎉 Félicitations !

Votre calculatrice TI-83 Plus est maintenant une **Progressive Web App** complète :

✅ Installable sur Android
✅ Mode hors ligne
✅ Mises à jour automatiques
✅ Performance optimale
✅ Légère (365 KB)

**Déployez sur** : https://www.lhusser.fr/calculatrice/

Vos utilisateurs peuvent maintenant l'installer comme une vraie app ! 🚀📱

---

## 📅 Informations de Version

- **Version :** 2.1.0 (PWA)
- **Date :** 6 novembre 2025
- **Branche :** claude/scientific-calculator-ti83-011CUqMQSu5obWhYPHKhcTN3
- **Commit :** À venir
- **Taille du build :** 365 KB (non compressé)
- **Taille des archives :** 140-142 KB (compressé)
- **Nouveauté majeure :** Progressive Web App installable sur Android
