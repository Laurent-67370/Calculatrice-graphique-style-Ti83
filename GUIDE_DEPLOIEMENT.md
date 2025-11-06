# Guide de déploiement - Calculatrice TI-83 Plus

## Déploiement sur www.lhusser.fr/calculatrice/

L'application a été configurée et buildée pour être déployée dans le sous-répertoire `/calculatrice/` de votre blog.

---

## Option A : Via FTP/SFTP (FileZilla, Cyberduck, etc.)

### 1. Préparer les fichiers

Les fichiers de production sont dans le dossier :
```
calculatrice-ti83-react/dist/
```

### 2. Connexion à votre serveur

- Ouvrez votre client FTP (FileZilla, Cyberduck, WinSCP, etc.)
- Connectez-vous à votre serveur avec vos identifiants

### 3. Upload des fichiers

1. Sur votre serveur, naviguez vers le répertoire racine de votre site
   - Généralement : `/public_html/` ou `/www/` ou `/var/www/html/`

2. Créez un nouveau dossier nommé `calculatrice`

3. Entrez dans ce dossier

4. Uploadez **TOUT le contenu** du dossier `dist/` dans `calculatrice/` :
   ```
   - index.html
   - vite.svg
   - _redirects
   - assets/ (dossier complet)
   ```

### 4. Vérification

Visitez : **https://www.lhusser.fr/calculatrice/**

Vous devriez voir la calculatrice TI-83 Plus s'afficher !

---

## Option B : Via SSH/Terminal

Si vous avez accès SSH à votre serveur :

### 1. Transférer l'archive

```bash
# Depuis votre machine locale
scp calculatrice-ti83-deploy.tar.gz utilisateur@lhusser.fr:/tmp/
```

### 2. Se connecter au serveur

```bash
ssh utilisateur@lhusser.fr
```

### 3. Extraire dans le bon répertoire

```bash
# Aller dans le répertoire web (à adapter selon votre configuration)
cd /var/www/html/

# Ou si c'est dans public_html
cd ~/public_html/

# Créer le dossier calculatrice
mkdir -p calculatrice

# Extraire l'archive
tar -xzf /tmp/calculatrice-ti83-deploy.tar.gz -C calculatrice/

# Vérifier que les fichiers sont bien là
ls -la calculatrice/
```

### 4. Ajuster les permissions (si nécessaire)

```bash
# Donner les bonnes permissions
chmod -R 755 calculatrice/
```

### 5. Vérification

Visitez : **https://www.lhusser.fr/calculatrice/**

---

## Option C : Via cPanel / Panneau d'administration

Si votre hébergeur utilise cPanel ou un panneau similaire :

### 1. Connexion au panneau

- Connectez-vous à votre cPanel
- Cherchez "Gestionnaire de fichiers" ou "File Manager"

### 2. Navigation

- Allez dans `public_html/` (ou le dossier racine de votre site)
- Créez un nouveau dossier : `calculatrice`
- Entrez dans ce dossier

### 3. Upload

- Utilisez le bouton "Upload" ou "Télécharger"
- Sélectionnez **tous les fichiers** du dossier `dist/`
- Uploadez-les dans le dossier `calculatrice/`

### 4. Vérification

Visitez : **https://www.lhusser.fr/calculatrice/**

---

## Fichiers à uploader

Assurez-vous que ces fichiers sont présents dans `/calculatrice/` :

```
calculatrice/
├── index.html
├── vite.svg
├── _redirects
└── assets/
    ├── index-CwA5y8dL.css
    └── index-EhrTX25n.js
```

---

## Configuration .htaccess (Optionnel mais recommandé)

Si vous utilisez Apache, créez un fichier `.htaccess` dans le dossier `calculatrice/` avec ce contenu :

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

# Activer la compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Cache pour les assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## Intégration dans une page de votre blog

Si vous voulez intégrer la calculatrice dans une page existante de votre blog :

### Via iframe :

```html
<iframe
  src="https://www.lhusser.fr/calculatrice/"
  width="100%"
  height="800px"
  frameborder="0"
  title="Calculatrice TI-83 Plus"
></iframe>
```

### Via lien :

```html
<a href="https://www.lhusser.fr/calculatrice/" target="_blank">
  Ouvrir la Calculatrice TI-83 Plus
</a>
```

---

## Dépannage

### Problème : Page blanche ou erreur 404

**Vérifiez :**
1. Que tous les fichiers du dossier `dist/` ont bien été uploadés
2. Que le dossier s'appelle exactement `calculatrice` (en minuscules)
3. Que le fichier `index.html` est bien à la racine de `calculatrice/`

### Problème : Les styles ne s'appliquent pas

**Vérifiez :**
1. Que le dossier `assets/` a bien été uploadé
2. Les permissions des fichiers (755 pour dossiers, 644 pour fichiers)
3. Inspectez la console du navigateur (F12) pour voir les erreurs

### Problème : Certificat SSL invalide

**Solution :**
- Assurez-vous que votre certificat SSL couvre le sous-répertoire
- Forcez HTTPS dans votre .htaccess :

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## Mise à jour de l'application

Pour mettre à jour la calculatrice plus tard :

1. Récupérez les nouveaux fichiers depuis GitHub
2. Rebuild : `cd calculatrice-ti83-react && npm run build`
3. Supprimez l'ancien contenu du dossier `calculatrice/` sur votre serveur
4. Uploadez le nouveau contenu de `dist/`

---

## Support

Si vous rencontrez des problèmes, vérifiez :
- Les logs de votre serveur web
- La console du navigateur (F12 > Console)
- Que votre hébergeur supporte les applications JavaScript

---

**L'application sera accessible à :** https://www.lhusser.fr/calculatrice/

**Taille totale :** ~250 KB (très léger !)
