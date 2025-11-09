# 🚀 Guide de Déploiement sur votre Blog
## Version 2.5.0.0 - DISTR, TEST & LOGIC

---

## 📦 Fichiers de Déploiement

Vous disposez de 2 archives prêtes à l'emploi :

- ✅ **calculatrice-ti83-blog-v2.5.0.0.tar.gz** (348 KB)
- ✅ **calculatrice-ti83-blog-v2.5.0.0.zip** (348 KB)

Ces archives contiennent l'intégralité de l'application compilée et optimisée.

---

## 🎯 Méthode Recommandée : Script SSH Automatique

### Prérequis
- Accès SSH à votre serveur
- Utilisateur avec permissions d'écriture sur le répertoire web

### Utilisation

1. **Modifiez le script** `INSTALL-BLOG.sh` avec vos informations :
```bash
BLOG_USER="votre-utilisateur"        # Votre nom d'utilisateur SSH
BLOG_HOST="www.lhusser.fr"           # Votre nom de domaine
BLOG_PATH="/var/www/html/calculatrice"  # Chemin sur le serveur
```

2. **Lancez le déploiement** :
```bash
./INSTALL-BLOG.sh
```

3. **Confirmez** et attendez la fin du déploiement

Le script va automatiquement :
- ✅ Uploader l'archive
- ✅ Sauvegarder l'ancienne version
- ✅ Extraire la nouvelle version
- ✅ Configurer les permissions
- ✅ Nettoyer les fichiers temporaires

---

## 🌐 Méthode Alternative : Upload Manuel

### Via FTP/SFTP (FileZilla, WinSCP, Cyberduck)

1. **Téléchargez** l'archive `.zip` depuis votre serveur
2. **Connectez-vous** à votre FTP/SFTP
3. **Naviguez** vers le dossier web (ex: `public_html/calculatrice/`)
4. **Uploadez** et **décompressez** l'archive
5. **Vérifiez** que `index.html` est bien à la racine du dossier

### Via cPanel/Plesk

1. **Connectez-vous** à votre panneau d'administration
2. **Gestionnaire de fichiers** → `public_html/`
3. **Créez** le dossier `calculatrice/` si nécessaire
4. **Uploadez** le fichier `.zip`
5. **Clic droit** → **Extraire** → **Extraire les fichiers**
6. **Supprimez** l'archive après extraction

### Via SSH Manuel

```bash
# Upload de l'archive
scp calculatrice-ti83-blog-v2.5.0.0.tar.gz user@www.lhusser.fr:/tmp/

# Connexion SSH
ssh user@www.lhusser.fr

# Extraction
mkdir -p /var/www/html/calculatrice
tar -xzf /tmp/calculatrice-ti83-blog-v2.5.0.0.tar.gz -C /var/www/html/calculatrice/

# Permissions
chmod -R 755 /var/www/html/calculatrice

# Nettoyage
rm /tmp/calculatrice-ti83-blog-v2.5.0.0.tar.gz
```

---

## 📁 Structure Attendue Après Déploiement

```
calculatrice/
├── index.html                  ← Page principale
├── manifest.webmanifest        ← Manifest PWA
├── sw.js                       ← Service Worker
├── workbox-42774e1b.js        ← Service Worker Workbox
├── _redirects                  ← Redirections (pour Netlify/SPA)
├── assets/
│   ├── index-DwaTEGE2.js      ← JavaScript (1.0 MB)
│   ├── index-CKZwlRT9.css     ← CSS (13 KB)
│   └── workbox-window.prod.es5-CwtvwXb3.js
├── icon-192.png                ← Icône PWA 192x192
├── icon-512.png                ← Icône PWA 512x512
├── icon-maskable-192.png       ← Icône PWA maskable
├── icon-maskable-512.png       ← Icône PWA maskable
├── icon.svg                    ← Icône vectorielle
└── vite.svg                    ← Logo Vite
```

---

## ✅ Vérification Post-Déploiement

Après déploiement, testez :

1. **Accédez à l'URL** : `https://www.lhusser.fr/calculatrice/`
2. **Vérifiez que la page se charge** correctement
3. **Testez les fonctionnalités** :
   - Calcul simple : `5 + 3 =` → doit afficher `8`
   - Graphique : `Y=` → `X^2` → `ENTER` → `GRAPH` → parabole
   - DISTR : `2ND` + `VARS` → menu DISTR apparaît
   - TEST : `2ND` + `MATH` → menu TEST apparaît
4. **Console navigateur** (F12) : Aucune erreur

---

## 🔧 Configuration .htaccess (Optionnel pour Apache)

Si votre serveur utilise Apache, créez un fichier `.htaccess` dans le dossier `calculatrice/` :

```apache
# Activer la réécriture d'URL pour SPA
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /calculatrice/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /calculatrice/index.html [L]
</IfModule>

# Compression GZIP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json
</IfModule>

# Cache des assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/manifest+json "access plus 1 week"
</IfModule>

# Headers de sécurité
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

---

## 🎉 Nouvelle Version 2.5.0.0

Cette version inclut :

### 📊 DISTR - Distributions Statistiques (15 fonctions)
- **Distributions Continues** : normalpdf, normalcdf, invNorm, tpdf, tcdf, χ²pdf, χ²cdf, Fpdf, Fcdf
- **Distributions Discrètes** : binompdf, binomcdf, poissonpdf, poissoncdf, geometpdf, geometcdf
- **Accès** : `2ND` + `VARS` (DISTR)

### 🔍 TEST - Opérateurs de Comparaison (6 opérateurs)
- `=`, `≠`, `>`, `≥`, `<`, `≤`
- Retournent 1 (vrai) ou 0 (faux)
- **Accès** : `2ND` + `MATH` (TEST)

### 🧠 LOGIC - Opérateurs Logiques (4 opérateurs)
- `and`, `or`, `xor`, `not`
- Retournent 1 (vrai) ou 0 (faux)
- **Accès** : `2ND` + `MATH` (LOGIC)

---

## 📞 Support

En cas de problème :

1. Vérifiez les permissions du dossier (755)
2. Vérifiez que tous les fichiers sont présents
3. Consultez la console navigateur (F12)
4. Vérifiez les logs du serveur web

---

## 📈 Statistiques de Performance

- **Taille totale** : 1.06 MB (non compressée)
- **Taille compressée** : 348 KB (archive)
- **Taille gzip** : ~295 KB (JavaScript)
- **Temps de chargement** : < 2s (4G), < 1s (WiFi)
- **PWA** : Installable sur mobile et bureau
- **Mode hors ligne** : ✅ Disponible après première visite

---

**Bon déploiement ! 🚀**
