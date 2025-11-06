# 🚀 Guide de Téléchargement et Déploiement Rapide

## 📦 Fichiers Disponibles sur GitHub

Les archives de déploiement sont maintenant disponibles **directement sur GitHub** à la racine du repository :

### Liens de Téléchargement Direct

**Repository :** https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83

**Branche :** `claude/scientific-calculator-ti83-011CUqMQSu5obWhYPHKhcTN3`

### Option 1 : Téléchargement via Interface Web

1. **Allez sur GitHub** :
   ```
   https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83
   ```

2. **Sélectionnez la branche** :
   - Cliquez sur le menu déroulant des branches (en haut à gauche)
   - Sélectionnez `claude/scientific-calculator-ti83-011CUqMQSu5obWhYPHKhcTN3`

3. **Téléchargez les archives** :
   - Cliquez sur `calculatrice-ti83-deploy.zip` (82 KB)
   - Ou `calculatrice-ti83-deploy.tar.gz` (81 KB)
   - Cliquez sur le bouton **"Download"** ou **"Raw"**

### Option 2 : Téléchargement via URL Directe

**ZIP :**
```
https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/raw/claude/scientific-calculator-ti83-011CUqMQSu5obWhYPHKhcTN3/calculatrice-ti83-deploy.zip
```

**TAR.GZ :**
```
https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/raw/claude/scientific-calculator-ti83-011CUqMQSu5obWhYPHKhcTN3/calculatrice-ti83-deploy.tar.gz
```

### Option 3 : Téléchargement via Git

```bash
# Cloner uniquement les fichiers nécessaires
git clone --depth 1 --branch claude/scientific-calculator-ti83-011CUqMQSu5obWhYPHKhcTN3 \
  https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83.git

cd Calculatrice-graphique-style-Ti83

# Les archives sont à la racine
ls -lh calculatrice-ti83-deploy.*
```

---

## 🌐 Déploiement sur www.lhusser.fr/calculatrice/

### Méthode 1 : Via FTP (Recommandé pour Débutants)

1. **Téléchargez l'archive ZIP** depuis GitHub

2. **Décompressez localement** sur votre ordinateur

3. **Connectez-vous à votre FTP** :
   - Hôte : `ftp.lhusser.fr`
   - Utilisateur : votre_username
   - Mot de passe : votre_password

4. **Allez dans le dossier** : `/public_html/calculatrice/`

5. **Supprimez l'ancien contenu** :
   - Sélectionnez tous les fichiers dans `/calculatrice/`
   - Supprimez-les

6. **Uploadez le nouveau contenu** :
   - Uploadez tous les fichiers décompressés :
     - `index.html`
     - `vite.svg`
     - `_redirects`
     - Dossier `assets/` (avec tous ses fichiers)

7. **Vérifiez les permissions** :
   - Fichiers : 644 ou 755
   - Dossiers : 755

### Méthode 2 : Via SSH (Plus Rapide)

```bash
# 1. Télécharger l'archive depuis GitHub
wget https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/raw/claude/scientific-calculator-ti83-011CUqMQSu5obWhYPHKhcTN3/calculatrice-ti83-deploy.tar.gz

# 2. Copier sur le serveur
scp calculatrice-ti83-deploy.tar.gz utilisateur@lhusser.fr:/tmp/

# 3. Se connecter au serveur
ssh utilisateur@lhusser.fr

# 4. Nettoyer l'ancien contenu
rm -rf /var/www/html/calculatrice/*

# 5. Extraire la nouvelle version
tar -xzf /tmp/calculatrice-ti83-deploy.tar.gz -C /var/www/html/calculatrice/

# 6. Ajuster les permissions
chmod -R 755 /var/www/html/calculatrice/
find /var/www/html/calculatrice -type f -exec chmod 644 {} \;

# 7. Nettoyer
rm /tmp/calculatrice-ti83-deploy.tar.gz

# 8. Vérifier
ls -la /var/www/html/calculatrice/
```

### Méthode 3 : Via Panel d'Hébergement (cPanel, Plesk)

1. **Connectez-vous** à votre panel d'hébergement

2. **Ouvrez le Gestionnaire de Fichiers**

3. **Naviguez** vers `public_html/calculatrice/`

4. **Supprimez** tous les fichiers existants

5. **Cliquez sur "Upload"**

6. **Uploadez** `calculatrice-ti83-deploy.zip`

7. **Clic droit** sur le fichier → **"Extract"** ou **"Décompresser"**

8. **Supprimez** le fichier ZIP après extraction

---

## ✅ Vérification Post-Déploiement

### Tests à Effectuer

1. **Accédez au site** :
   ```
   https://www.lhusser.fr/calculatrice/
   ```

2. **Vérifiez le chargement** :
   - ✅ La page s'affiche correctement
   - ✅ Pas d'erreurs dans la console (F12)
   - ✅ Les styles sont appliqués

3. **Testez les fonctionnalités de base** :
   - ✅ Appuyez sur les touches numériques
   - ✅ Testez une opération : `2 + 2 = `
   - ✅ Résultat : `4`

4. **Testez les nouvelles fonctions STAT** :
   - ✅ Appuyez sur `STAT`
   - ✅ Vérifiez que 14 options sont affichées
   - ✅ Sélectionnez `CubicReg` → Devrait fonctionner

5. **Testez le graphique** :
   - ✅ Appuyez sur `Y=`
   - ✅ Entrez : `X²`
   - ✅ Appuyez sur `GRAPH`
   - ✅ Une parabole doit s'afficher

### En Cas de Problème

**Page blanche ?**
- Vérifiez que tous les fichiers ont été uploadés
- Vérifiez les permissions (644 pour fichiers, 755 pour dossiers)

**Erreur 404 ?**
- Vérifiez que le fichier `index.html` est bien présent
- Vérifiez le chemin : `/calculatrice/index.html`

**Styles manquants ?**
- Vérifiez que le dossier `assets/` a été uploadé
- Vérifiez que les fichiers CSS et JS sont présents dans `assets/`

**Erreurs JavaScript ?**
- Ouvrez la console (F12)
- Vérifiez les erreurs
- Assurez-vous que `base: '/calculatrice/'` est configuré dans vite.config.ts

---

## 📊 Contenu de l'Archive

```
calculatrice-ti83-deploy.tar.gz (81 KB)
│
├── index.html                     509 bytes
├── vite.svg                       1.5 KB
├── _redirects                     24 bytes
└── assets/
    ├── index-DpKtdQXP.css        9.3 KB
    └── index-dmiKIz1d.js         248 KB (78.45 KB gzippé)
```

**Total décompressé :** ~268 KB

---

## 🎯 Version Déployée

- **Version :** 2.0.3
- **Date :** 6 novembre 2025
- **Fonctionnalités :**
  - ✅ Menu STAT complet (14/14 fonctions)
  - ✅ 6 nouvelles régressions
  - ✅ Graphiques optimisés
  - ✅ Performance améliorée

---

## 🔄 Mises à Jour Futures

Pour déployer une nouvelle version :

1. Téléchargez la nouvelle archive depuis GitHub
2. Supprimez l'ancien contenu de `/calculatrice/`
3. Uploadez et extrayez la nouvelle archive
4. Vérifiez que tout fonctionne

**Recommandation :** Gardez une sauvegarde de la version actuelle avant de mettre à jour.

---

## 📞 Support

**En cas de problème :**

1. Vérifiez les logs d'erreur (F12 dans le navigateur)
2. Vérifiez les permissions des fichiers
3. Assurez-vous que tous les fichiers ont été uploadés
4. Testez en navigation privée pour éviter le cache

---

## 🎉 C'est Tout !

Votre calculatrice TI-83 Plus est maintenant déployée avec :
- ✅ Menu STAT 100% complet
- ✅ 58+ fonctions mathématiques
- ✅ Interface optimisée
- ✅ Compatible TI-83 Plus

**URL de production :** https://www.lhusser.fr/calculatrice/

Bonne utilisation ! 🚀
