# 📤 Guide de Déploiement - Version 2.0.5

## 🎯 Déploiement sur lhusser.fr/calculatrice

Cette version 2.0.5 inclut les améliorations suivantes :

### ✨ Nouvelles Fonctionnalités

1. **Amélioration du comportement d'input avec gestion du curseur**
   - Les fonctions MATH ne s'ajoutent plus aux anciens résultats
   - La saisie se fait maintenant à l'intérieur des parenthèses des fonctions
   - Gestion intelligente de la position du curseur

2. **Menu MATH interactif complet**
   - Navigation hiérarchique avec sous-menus (NUM, CPX, PRB, ANGLE, TRIG)
   - 38 fonctions mathématiques disponibles
   - Support complet de toutes les fonctions trigonométriques et hyperboliques

3. **Correction de l'évaluateur mathématique**
   - Support complet de 39 fonctions (abs, max, min, gcd, lcm, nPr, nCr, etc.)
   - Évaluation correcte des expressions complexes

4. **Ajout des touches manquantes**
   - Touche point décimal (.) pour les nombres décimaux (9.45)
   - Touche virgule (,) via 2ND+7 pour séparer les arguments (max(5,3))

---

## 📦 Archives Disponibles

Deux formats d'archives sont disponibles :

- **calculatrice-ti83-deploy-v2.0.5.zip** (84K) - Pour Windows/Mac
- **calculatrice-ti83-deploy-v2.0.5.tar.gz** (83K) - Pour Linux/Unix

---

## 🚀 Option 1 : Déploiement via FTP (RECOMMANDÉ)

### Étape 1 : Télécharger l'archive

Récupérez l'archive `calculatrice-ti83-deploy-v2.0.5.zip` depuis le repository.

### Étape 2 : Extraire localement

```bash
unzip calculatrice-ti83-deploy-v2.0.5.zip
```

### Étape 3 : Upload via FTP

1. Connectez-vous à votre serveur FTP (lhusser.fr)
2. Naviguez vers `/public_html/calculatrice/`
3. **Sauvegardez l'ancienne version** (optionnel mais recommandé)
4. Supprimez tous les fichiers du répertoire `/calculatrice/`
5. Uploadez le contenu de `calculatrice-ti83-react/dist/` :
   - `index.html`
   - `vite.svg`
   - `_redirects`
   - Dossier `assets/` complet

### Étape 4 : Vérifier le déploiement

Visitez : https://www.lhusser.fr/calculatrice/

Testez :
- ✅ La page se charge
- ✅ Les touches fonctionnent
- ✅ Les fonctions MATH fonctionnent (ex: max(5,3))
- ✅ L'input se comporte correctement après sélection de fonction

---

## 🔐 Option 2 : Déploiement via SSH

Si vous avez un accès SSH à votre serveur :

### Méthode A : Upload et extraction

```bash
# 1. Copier l'archive sur le serveur
scp calculatrice-ti83-deploy-v2.0.5.tar.gz utilisateur@lhusser.fr:/tmp/

# 2. Se connecter au serveur
ssh utilisateur@lhusser.fr

# 3. Sauvegarder l'ancienne version (optionnel)
cp -r /var/www/html/calculatrice /var/www/html/calculatrice.backup

# 4. Supprimer l'ancien contenu
rm -rf /var/www/html/calculatrice/*

# 5. Extraire la nouvelle version
tar -xzf /tmp/calculatrice-ti83-deploy-v2.0.5.tar.gz -C /var/www/html/calculatrice/

# 6. Vérifier les permissions
chmod -R 755 /var/www/html/calculatrice/
```

### Méthode B : Clone et build sur le serveur

```bash
# 1. Se connecter au serveur
ssh utilisateur@lhusser.fr

# 2. Aller dans le dossier du projet
cd /chemin/vers/Calculatrice-graphique-style-Ti83

# 3. Récupérer les dernières modifications
git pull origin claude/scientific-calculator-ti83-011CUqMQSu5obWhYPHKhcTN3

# 4. Build
cd calculatrice-ti83-react
npm install
npm run build

# 5. Déployer
cp -r dist/* /var/www/html/calculatrice/
```

---

## 📁 Structure des Fichiers Déployés

Après déploiement, votre répertoire `/calculatrice/` devrait contenir :

```
/var/www/html/calculatrice/
├── index.html              (509 bytes)
├── vite.svg                (1.5K)
├── _redirects              (24 bytes)
└── assets/
    ├── index-L2SSw7Zp.js   (261.46 KB)
    └── index-DpKtdQXP.css  (9.50 KB)
```

**Taille totale : 276 KB**

---

## 🔍 Vérification Post-Déploiement

### Tests Fonctionnels

1. **Calculs de base**
   ```
   9.45 + 3.2 = 12.65 ✓
   ```

2. **Fonctions mathématiques**
   ```
   max(5,3) = 5 ✓
   gcd(24,18) = 6 ✓
   nPr(10,3) = 720 ✓
   ```

3. **Comportement de l'input**
   - Faire un calcul : `5+3 [ENTER]` → Résultat : `8`
   - Sélectionner une fonction MATH : `max(`
   - Vérifier que le `8` a été remplacé par `max(` ✓
   - Taper `5,3)` → Vérifier que cela s'insère dans les parenthèses ✓

4. **Navigation MATH**
   - Appuyer sur `MATH`
   - Naviguer avec ↑ ↓
   - Entrer dans un sous-menu avec `ENTER` ✓

### Tests de Performance

- ✅ Temps de chargement < 2 secondes
- ✅ Pas d'erreurs dans la console (F12)
- ✅ Responsive sur mobile

---

## 🌐 Configuration Serveur

### Headers Recommandés

Si vous avez accès au fichier `.htaccess`, ajoutez :

```apache
# Cache pour les assets
<FilesMatch "\.(js|css|svg)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

# Compression Gzip
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>

# Headers de sécurité
Header set X-Frame-Options "DENY"
Header set X-Content-Type-Options "nosniff"
Header set X-XSS-Protection "1; mode=block"
```

### Redirection SPA

Le fichier `_redirects` est déjà inclus dans le build pour gérer les routes SPA.

---

## 📝 Changelog v2.0.5

### Ajouts

- ✅ Gestion de position du curseur dans l'input
- ✅ Flag `isInputResult` pour identifier les résultats de calcul
- ✅ Méthode `setInputResult()` pour marquer les résultats
- ✅ Insertion intelligente à la position du curseur

### Corrections

- ✅ Les fonctions MATH remplacent maintenant les anciens résultats au lieu de s'y ajouter
- ✅ La saisie s'effectue correctement à l'intérieur des parenthèses des fonctions
- ✅ Support complet de 39 fonctions mathématiques dans l'évaluateur

### Documentation

- ✅ Mise à jour complète du README.md
- ✅ Mise à jour de l'aide intégrée (HelpModal)
- ✅ Notes de version RELEASE_NOTES_v2.0.5.md

---

## 🐛 Dépannage

### Problème : Les fichiers ne s'affichent pas

**Solution :** Vérifiez les permissions
```bash
chmod -R 755 /var/www/html/calculatrice/
```

### Problème : Erreur 404 sur les assets

**Solution :** Vérifiez que le dossier `assets/` est bien uploadé

### Problème : La page est blanche

**Solution :**
1. Ouvrez la console (F12)
2. Vérifiez s'il y a des erreurs JavaScript
3. Vérifiez que tous les fichiers sont bien présents

### Problème : Ancienne version toujours affichée

**Solution :** Videz le cache du navigateur (Ctrl + F5)

---

## 📞 Support

Pour toute question ou problème :

1. Vérifiez les logs du serveur
2. Vérifiez la console du navigateur (F12)
3. Comparez avec l'archive de déploiement

---

## 🎉 Félicitations !

Votre calculatrice TI-83 Plus v2.0.5 est maintenant déployée sur :

**https://www.lhusser.fr/calculatrice/**

Partagez-la avec vos utilisateurs ! 🚀

---

## 📅 Informations de Version

- **Version :** 2.0.5
- **Date :** 6 novembre 2025
- **Branche :** claude/scientific-calculator-ti83-011CUqMQSu5obWhYPHKhcTN3
- **Commit :** 9e9418e - Feat: Amélioration du comportement d'input avec gestion du curseur
- **Taille du build :** 276 KB (non compressé)
- **Taille des archives :** 83-84 KB (compressé)
