# Guide de mise à jour - Calculatrice TI-83 Plus

## 🔄 Processus de mise à jour en 4 étapes

Lorsque de nouvelles fonctionnalités ou corrections sont disponibles sur GitHub, suivez ces étapes pour mettre à jour votre calculatrice déployée.

---

## Étape 1 : Récupérer les dernières modifications

### Option A : Si vous avez cloné le dépôt localement

```bash
# Aller dans le dossier du projet
cd Calculatrice-graphique-style-Ti83

# Récupérer les dernières modifications
git pull origin main

# Ou si vous travaillez sur une branche spécifique
git pull origin nom-de-la-branche
```

### Option B : Télécharger depuis GitHub

1. Allez sur https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83
2. Cliquez sur le bouton **Code** (vert)
3. Sélectionnez **Download ZIP**
4. Extrayez l'archive sur votre ordinateur

---

## Étape 2 : Installer les dépendances (si nécessaire)

```bash
# Aller dans le dossier de l'application React
cd calculatrice-ti83-react

# Installer les dépendances (uniquement si de nouvelles ont été ajoutées)
npm install
```

---

## Étape 3 : Rebuilder l'application

```bash
# Toujours dans le dossier calculatrice-ti83-react
npm run build
```

Cette commande va :
- Compiler le code TypeScript
- Optimiser les fichiers JavaScript et CSS
- Générer les fichiers de production dans `dist/`

**Résultat :** Nouveau dossier `dist/` avec les fichiers à jour

---

## Étape 4 : Déployer la nouvelle version

### Méthode 1 : Via FTP (Recommandé)

1. **Connectez-vous** à votre serveur via FileZilla/Cyberduck
2. **Naviguez** vers `/public_html/calculatrice/`
3. **Supprimez** tous les anciens fichiers du dossier
4. **Uploadez** le nouveau contenu de `dist/` dans ce dossier

### Méthode 2 : Via SSH

```bash
# Créer une nouvelle archive
tar -czf calculatrice-update.tar.gz -C calculatrice-ti83-react/dist .

# Transférer sur le serveur
scp calculatrice-update.tar.gz utilisateur@lhusser.fr:/tmp/

# Se connecter au serveur
ssh utilisateur@lhusser.fr

# Sur le serveur : Supprimer l'ancien contenu
rm -rf /var/www/html/calculatrice/*

# Extraire la nouvelle version
tar -xzf /tmp/calculatrice-update.tar.gz -C /var/www/html/calculatrice/

# Vérifier les permissions
chmod -R 755 /var/www/html/calculatrice/
```

### Méthode 3 : Via cPanel

1. **Connectez-vous** à cPanel
2. Ouvrez le **Gestionnaire de fichiers**
3. Allez dans `/public_html/calculatrice/`
4. **Sélectionnez tout** et supprimez
5. **Uploadez** les nouveaux fichiers de `dist/`

---

## ✅ Vérification

Après le déploiement :

1. **Videz le cache** de votre navigateur (Ctrl+F5 ou Cmd+Shift+R)
2. Visitez **https://www.lhusser.fr/calculatrice/**
3. Vérifiez que les nouvelles fonctionnalités apparaissent

---

## 🎯 Automatisation (Optionnel)

### Script de mise à jour rapide

Créez un fichier `update-deploy.sh` :

```bash
#!/bin/bash

echo "📥 Récupération des mises à jour..."
git pull origin main

echo "📦 Installation des dépendances..."
cd calculatrice-ti83-react
npm install

echo "🔨 Build de l'application..."
npm run build

echo "📦 Création de l'archive..."
cd ..
tar -czf calculatrice-update.tar.gz -C calculatrice-ti83-react/dist .

echo "✅ Archive prête : calculatrice-update.tar.gz"
echo "📤 Uploadez maintenant cette archive sur votre serveur"
```

Rendez-le exécutable et utilisez-le :

```bash
chmod +x update-deploy.sh
./update-deploy.sh
```

---

## 📋 Checklist de mise à jour

- [ ] Récupérer les dernières modifications (git pull)
- [ ] Installer les dépendances (npm install)
- [ ] Rebuilder l'application (npm run build)
- [ ] Supprimer l'ancien contenu sur le serveur
- [ ] Uploader le nouveau contenu de dist/
- [ ] Vider le cache du navigateur
- [ ] Tester l'application mise à jour

---

## 🔔 Notifications de mises à jour

Pour être notifié des nouvelles versions :

### Option 1 : Watch le dépôt GitHub

1. Allez sur https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83
2. Cliquez sur **Watch** (en haut à droite)
3. Sélectionnez **Custom > Releases**
4. Vous recevrez un email à chaque nouvelle version

### Option 2 : Vérifier manuellement

Consultez régulièrement :
- https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/commits
- Les fichiers CHANGELOG.md ou README.md du projet

---

## 🐛 En cas de problème après mise à jour

### La page est blanche ou affiche une erreur

1. **Vérifiez** que tous les fichiers de `dist/` ont été uploadés
2. **Vérifiez** la console du navigateur (F12 > Console)
3. **Videz** le cache du navigateur
4. **Restaurez** la version précédente en attendant

### Les anciennes fonctionnalités ne marchent plus

1. **Supprimez complètement** le cache : Ctrl+Shift+Del
2. **Vérifiez** que le dossier `assets/` a bien été uploadé
3. **Comparez** la structure des fichiers avec celle attendue

### Restaurer la version précédente

Si vous avez une sauvegarde :

```bash
# Via FTP : re-uploadez les anciens fichiers
# Via SSH :
tar -xzf calculatrice-backup-YYYYMMDD.tar.gz -C /var/www/html/calculatrice/
```

**Conseil :** Avant chaque mise à jour, faites une sauvegarde du dossier actuel

---

## 💡 Bonnes pratiques

1. **Sauvegardez** toujours l'ancienne version avant de mettre à jour
2. **Testez** la nouvelle version en local avant de déployer
3. **Lisez** les notes de version (CHANGELOG) pour connaître les changements
4. **Faites** la mise à jour pendant les heures creuses de votre blog
5. **Informez** vos utilisateurs si des changements majeurs arrivent

---

## 📊 Suivi des versions

Gardez une trace des versions déployées :

| Date       | Version | Changements principaux           |
|------------|---------|----------------------------------|
| 2025-11-06 | v2.0.1  | Version initiale déployée        |
| YYYY-MM-DD | vX.X.X  | [À compléter lors des mises à jour] |

---

## ❓ Questions fréquentes

### Dois-je toujours faire `npm install` ?

Non, seulement si le fichier `package.json` a changé. Vous pouvez vérifier avec `git diff`.

### Le build prend combien de temps ?

Environ 1-2 secondes sur un ordinateur moderne.

### Puis-je automatiser complètement le déploiement ?

Oui, avec des outils comme GitHub Actions et Netlify/Vercel. Mais pour un blog personnel avec FTP, le processus manuel reste simple et suffisant.

### Que faire si la mise à jour casse quelque chose ?

1. Restaurez immédiatement l'ancienne version
2. Vérifiez les logs d'erreur dans la console
3. Contactez le développeur via GitHub Issues

---

**Temps estimé pour une mise à jour complète : 5-10 minutes**

Bon déploiement ! 🚀
