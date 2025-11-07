# 🔄 Guide pour Vider le Cache et Voir la Nouvelle Version

## 🎯 Problème : Version en Cache

Avec les PWA et le Service Worker, le navigateur garde l'ancienne version en cache. Voici comment forcer la nouvelle version.

---

## 💻 Sur PC/Mac (Chrome, Edge, Firefox)

### Méthode 1 : Hard Reload (Le plus rapide)

1. **Ouvrez** : https://www.lhusser.fr/calculatrice/
2. **Appuyez** sur :
   - **Windows/Linux** : `Ctrl + Shift + R`
   - **Mac** : `Cmd + Shift + R`
3. La page se recharge en **ignorant le cache**

### Méthode 2 : Vider le Cache via DevTools (Recommandé)

1. **Ouvrez** : https://www.lhusser.fr/calculatrice/
2. **Ouvrez DevTools** : `F12` ou `Ctrl + Shift + I` (Mac : `Cmd + Option + I`)
3. **Cliquez** sur l'onglet **Application** (ou **Storage** sur Firefox)
4. **Dans le menu de gauche** :
   - Cliquez sur **Service Workers**
   - Cochez **"Update on reload"**
   - Cliquez sur **"Unregister"** pour désinscrire l'ancien Service Worker
5. **Toujours dans Application** :
   - Cliquez sur **Cache Storage** (dans le menu de gauche)
   - Faites clic droit sur chaque cache → **Delete**
6. **Allez dans** :
   - **Clear storage** (menu de gauche)
   - Cliquez sur **"Clear site data"**
7. **Fermez les DevTools**
8. **Rechargez** : `Ctrl + Shift + R` (Windows) ou `Cmd + Shift + R` (Mac)

### Méthode 3 : Mode Navigation Privée (Pour tester)

1. **Ouvrez une fenêtre privée** :
   - **Chrome/Edge** : `Ctrl + Shift + N`
   - **Firefox** : `Ctrl + Shift + P`
   - **Mac** : `Cmd + Shift + N` ou `P`
2. **Allez sur** : https://www.lhusser.fr/calculatrice/
3. Vous verrez la version **sans cache**

---

## 📱 Sur Android (App Installée)

### Méthode 1 : Forcer la Mise à Jour

1. **Ouvrez Chrome** (pas l'app PWA)
2. **Allez sur** : https://www.lhusser.fr/calculatrice/
3. **Menu ⋮** → **Paramètres du site**
4. **Tapez** sur **"Effacer et réinitialiser"**
5. **Confirmez**
6. **Revenez** sur la page
7. **Hard reload** : Menu ⋮ → **Actualiser**

### Méthode 2 : Réinstaller l'App (Le plus sûr)

1. **Maintenez appuyé** sur l'icône de la calculatrice sur l'écran d'accueil
2. **Sélectionnez** "Désinstaller" ou "Supprimer"
3. **Ouvrez Chrome**
4. **Allez sur** : https://www.lhusser.fr/calculatrice/
5. **Menu ⋮** → "Ajouter à l'écran d'accueil"
6. **Installez** à nouveau

### Méthode 3 : Vider le Cache de Chrome

1. **Ouvrez Chrome** (le navigateur)
2. **Menu ⋮** → **Paramètres**
3. **Confidentialité et sécurité**
4. **Effacer les données de navigation**
5. **Cochez** :
   - Images et fichiers en cache
   - Données de site
6. **Période** : "Toutes les périodes"
7. **Effacer les données**
8. **Réinstallez l'app**

---

## 🔍 Comment Vérifier Quelle Version Vous Avez ?

### Vérification Rapide du Clavier

**Version 2.2.0** (nouvelle) :
- ✅ Ligne 5 commence par **X⁻¹**
- ✅ Ligne 6 commence par **X²**
- ✅ Ligne 2 contient **←** et **↑**
- ✅ Ligne 9 contient **STO→**
- ✅ Ligne 10 contient **ON**

**Version 2.1.0** (ancienne) :
- ❌ Ligne 5 commence par **X,T,θ,n**
- ❌ Ligne 6 commence par **√**
- ❌ Flèches en bas du clavier

### Vérification du Numéro de Version

1. **Cliquez** sur le bouton **?** (Aide) en haut à droite
2. **Regardez le footer** (en bas de la fenêtre d'aide)
3. **Version 2.2.0** doit afficher :
   ```
   Version 2.2.0 (PWA) • 📱 Installable sur Android • 📴 Hors ligne • ⌨️ Clavier TI-83 Plus exact
   ```
4. **Version 2.1.0** affiche :
   ```
   Version 2.1.0 (PWA) • 📱 Installable sur Android • 📴 Hors ligne
   ```

### Vérification Technique (DevTools)

1. **Ouvrez** : https://www.lhusser.fr/calculatrice/
2. **Ouvrez DevTools** : `F12`
3. **Onglet Network**
4. **Rechargez** : `Ctrl + R`
5. **Cherchez** le fichier JavaScript principal :
   - **Version 2.2.0** : `index-DbFGl4qJ.js` (269.06 KB)
   - **Version 2.1.0** : `index-Cu6NyO2l.js` ou autre nom
6. Si vous voyez `index-DbFGl4qJ.js`, c'est la **bonne version** ✅

---

## 🛠️ Procédure Complète (Garantie à 100%)

Si vous voulez être **absolument sûr** d'avoir la nouvelle version :

### Sur PC/Mac

```bash
1. Fermez TOUS les onglets de lhusser.fr/calculatrice
2. Ouvrez DevTools (F12)
3. Application → Service Workers → Unregister ALL
4. Application → Cache Storage → Delete ALL
5. Application → Clear storage → Clear site data
6. Fermez le navigateur complètement
7. Rouvrez le navigateur
8. Allez sur https://www.lhusser.fr/calculatrice/
9. Hard reload (Ctrl + Shift + R)
10. Vérifiez le clavier (ligne 5 doit commencer par X⁻¹)
```

### Sur Android

```bash
1. Désinstallez l'app PWA de l'écran d'accueil
2. Ouvrez Chrome
3. Menu ⋮ → Paramètres → Confidentialité → Effacer données
4. Fermez Chrome complètement (Paramètres Android → Forcer l'arrêt)
5. Rouvrez Chrome
6. Allez sur https://www.lhusser.fr/calculatrice/
7. Menu ⋮ → "Ajouter à l'écran d'accueil"
8. Installez à nouveau
9. Vérifiez le clavier dans l'app
```

---

## 🚨 Problèmes Courants

### "J'ai fait tout ça mais j'ai encore l'ancienne version"

**Causes possibles :**

1. **Le fichier n'est pas encore déployé sur le serveur**
   - Vérifiez que vous avez bien uploadé les nouveaux fichiers
   - Le fichier doit être `index-DbFGl4qJ.js` (pas l'ancien)

2. **Cache du serveur (CDN)**
   - Si vous utilisez Cloudflare ou un CDN, videz le cache du CDN
   - Attendez 5-10 minutes pour la propagation

3. **Service Worker têtu**
   - Ouvrez DevTools → Application → Service Workers
   - Cliquez sur "Skip waiting" si un nouveau SW est en attente
   - Puis rechargez

4. **Plusieurs onglets ouverts**
   - Fermez TOUS les onglets de lhusser.fr/calculatrice
   - Le Service Worker ne se met pas à jour si des onglets sont ouverts

### "Le Service Worker ne se met pas à jour"

1. **DevTools** → **Application** → **Service Workers**
2. Si vous voyez "**waiting to activate**" :
   - Cliquez sur **"skipWaiting"**
   - Puis **rechargez** la page
3. Si rien ne change :
   - Cliquez sur **"Unregister"**
   - Rechargez avec `Ctrl + Shift + R`

### "L'app Android ne se met pas à jour"

La PWA se met à jour automatiquement, mais parfois il faut :

1. **Ouvrir l'app**
2. **Fermer complètement l'app** (Paramètres Android → Forcer l'arrêt)
3. **Attendre 30 secondes**
4. **Rouvrir l'app**

Si ça ne marche toujours pas → **Réinstaller l'app**

---

## ✅ Checklist de Vérification

Après avoir vidé le cache, vérifiez :

- [ ] La page se charge à https://www.lhusser.fr/calculatrice/
- [ ] Ligne 5 du clavier commence par **X⁻¹** (pas X,T,θ,n)
- [ ] Ligne 6 commence par **X²** (pas √)
- [ ] Ligne 2 contient **←** et **↑**
- [ ] Ligne 9 contient **STO→**
- [ ] Ligne 10 contient **ON**
- [ ] Bouton **?** → Footer affiche "Version 2.2.0"
- [ ] DevTools → Network → Le fichier JS est `index-DbFGl4qJ.js`

Si tous ces points sont ✅, vous avez la **bonne version** ! 🎉

---

## 💡 Astuce pour le Futur

Pour éviter ce problème lors des prochaines mises à jour :

### Pendant le Développement
- Toujours avoir **"Update on reload"** coché dans DevTools
- Vider le cache avant chaque test

### Pour les Utilisateurs
- La PWA se met à jour **automatiquement** en arrière-plan
- Il suffit de **fermer et rouvrir** l'app pour voir la nouvelle version
- Si problème : Réinstaller l'app (3 clics)

---

## 🎯 Résumé Ultra-Rapide

**Sur PC** : `Ctrl + Shift + R` (ou `Cmd + Shift + R` sur Mac)

**Sur Android** : Désinstaller l'app → Réinstaller

**Pour vérifier** : Ligne 5 doit commencer par **X⁻¹** ✅

**Si ça ne marche toujours pas** : DevTools → Application → Clear storage → Clear site data

---

Besoin d'aide ? Vérifiez que les nouveaux fichiers sont bien sur le serveur ! 🔍
