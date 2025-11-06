# 🚀 Déploiement Version 2.0.2 - Avec aide intégrée

## ✨ Nouveautés de cette version

### Ajout d'une aide interactive
- ✅ Bouton d'aide "?" en haut à droite de la calculatrice
- ✅ Modal d'aide avec 3 onglets complets :
  - Fonctions de base
  - Graphiques
  - Fonctions avancées
- ✅ Exemples de fonctions
- ✅ Astuces d'utilisation

### Amélioration de l'interface
- ✅ Suppression du texte encombrant en bas
- ✅ Interface plus épurée et professionnelle
- ✅ Design responsive pour mobile

---

## 📦 Fichiers prêts pour le déploiement

✅ **calculatrice-ti83-deploy.zip** (80 KB)
✅ **calculatrice-ti83-deploy.tar.gz** (79 KB)
✅ **calculatrice-ti83-react/dist/** (dossier source)

**Taille totale :** 247 KB (77 KB gzippé)

---

## 🔄 Instructions de mise à jour

### Méthode 1 : Via FTP (Recommandée)

1. **Connectez-vous** à votre serveur FTP (FileZilla, Cyberduck, etc.)

2. **Naviguez** vers `/public_html/calculatrice/`

3. **Supprimez** TOUT le contenu ancien du dossier
   - Sélectionnez tous les fichiers
   - Appuyez sur Supprimer

4. **Uploadez** le nouveau contenu
   - Allez dans le dossier local : `calculatrice-ti83-react/dist/`
   - Sélectionnez TOUT le contenu
   - Glissez-déposez dans `/public_html/calculatrice/`

5. **Vérifiez** la structure finale sur le serveur :
   ```
   /public_html/calculatrice/
   ├── index.html
   ├── vite.svg
   ├── _redirects
   └── assets/
       ├── index-DpKtdQXP.css
       └── index-Cv5yUlbk.js
   ```

### Méthode 2 : Via SSH

```bash
# Sur votre machine locale
scp calculatrice-ti83-deploy.tar.gz utilisateur@lhusser.fr:/tmp/

# Connexion au serveur
ssh utilisateur@lhusser.fr

# Sur le serveur
cd /var/www/html/calculatrice/  # ou /public_html/calculatrice/
rm -rf *  # Supprimer l'ancien contenu
tar -xzf /tmp/calculatrice-ti83-deploy.tar.gz -C .
chmod -R 755 .

# Vérifier
ls -la
```

### Méthode 3 : Via cPanel

1. Ouvrez le **Gestionnaire de fichiers** dans cPanel
2. Naviguez vers `/public_html/calculatrice/`
3. Sélectionnez tous les fichiers et supprimez
4. Cliquez sur **Upload**
5. Uploadez l'archive `calculatrice-ti83-deploy.zip`
6. Cliquez-droit sur l'archive > **Extract**
7. Supprimez l'archive ZIP après extraction

---

## ✅ Vérification après déploiement

1. **Videz le cache** de votre navigateur
   - Chrome/Firefox : Ctrl+Shift+R (Cmd+Shift+R sur Mac)
   - Ou Ctrl+F5

2. **Visitez** : https://www.lhusser.fr/calculatrice/

3. **Vérifiez** :
   - ✅ La calculatrice s'affiche correctement
   - ✅ Le bouton "?" est visible en haut à droite
   - ✅ Cliquer sur "?" ouvre le modal d'aide
   - ✅ Les 3 onglets du modal fonctionnent
   - ✅ Tous les boutons de la calculatrice répondent

---

## 🎯 Test rapide

1. Cliquez sur le bouton **"?"**
2. Parcourez les 3 onglets d'aide
3. Fermez le modal
4. Appuyez sur **Y=**
5. Tapez **X^2**
6. Appuyez sur **GRAPH**
7. La parabole devrait s'afficher

---

## 🐛 Dépannage

### Le bouton d'aide n'apparaît pas

**Solution :**
1. Videz complètement le cache (Ctrl+Shift+Del)
2. Vérifiez que le fichier `assets/index-Cv5yUlbk.js` existe
3. Vérifiez la console (F12) pour les erreurs

### Le style est cassé

**Solution :**
1. Vérifiez que `assets/index-DpKtdQXP.css` a bien été uploadé
2. Les permissions doivent être 644 pour les fichiers, 755 pour les dossiers
3. Videz le cache du navigateur

### Page blanche

**Solution :**
1. Vérifiez que `index.html` est à la racine de `/calculatrice/`
2. Vérifiez que le dossier `assets/` existe et contient les 2 fichiers
3. Consultez les logs du serveur

---

## 📝 Notes de version

**Version :** 2.0.2
**Date :** 6 novembre 2025
**Taille :** 247.77 kB (77.12 kB gzippé)

**Commits inclus :**
- `3e5e376` - Feature: Add interactive help modal and remove footer text
- `37da9e9` - Docs: Add comprehensive update and deployment guides
- `42e1f4e` - Deployment: Configure for www.lhusser.fr/calculatrice/
- `abbaf9f` - Fix: Enable ListEditor (STAT > Edit) keyboard navigation
- `a5d1792` - Feature: Implement 2ND (SECOND) function key support
- `fe0a7fa` - Fix: Enable CLEAR/QUIT to close and save WINDOW and MODE editors

**Fonctionnalités principales :**
- ✅ Calculatrice TI-83 Plus complète
- ✅ Graphiques avec TRACE
- ✅ Menus ZOOM, CALC, STAT, MATH
- ✅ Éditeur de listes statistiques
- ✅ Mode 2ND pour fonctions secondaires
- ✅ Aide interactive complète ⭐ NOUVEAU
- ✅ Interface épurée ⭐ NOUVEAU

---

## 🎉 Après le déploiement

Votre calculatrice TI-83 Plus est maintenant en ligne avec :
- Une aide complète accessible en un clic
- Une interface propre et moderne
- Toutes les fonctionnalités d'une vraie TI-83 Plus

**URL :** https://www.lhusser.fr/calculatrice/

---

**Besoin d'aide ?** Consultez GUIDE_MISE_A_JOUR.md pour plus de détails.
