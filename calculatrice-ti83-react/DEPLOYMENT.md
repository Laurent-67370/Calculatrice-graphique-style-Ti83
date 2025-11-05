# 🚀 Guide de Déploiement sur Netlify

Ce guide vous explique comment déployer la calculatrice TI-83 Plus sur Netlify.

---

## 📋 Prérequis

- Un compte Netlify (gratuit) : https://app.netlify.com/signup
- Git installé sur votre machine
- Le projet committé sur GitHub/GitLab/Bitbucket

---

## 🌐 Option 1 : Déploiement via l'Interface Web (RECOMMANDÉ)

C'est la méthode la plus simple et la plus rapide !

### Étape 1 : Push vers GitHub

```bash
# Si ce n'est pas déjà fait, pushez votre code sur GitHub
git push origin claude/scientific-calculator-ti83-011CUqMQSu5obWhYPHKhcTN3
```

### Étape 2 : Connecter à Netlify

1. Allez sur https://app.netlify.com
2. Cliquez sur **"Add new site"** → **"Import an existing project"**
3. Choisissez votre provider Git (GitHub, GitLab, ou Bitbucket)
4. Autorisez Netlify à accéder à vos repos
5. Sélectionnez le repo **Calculatrice-graphique-style-Ti83**

### Étape 3 : Configurer le Build

Netlify détectera automatiquement la configuration depuis `netlify.toml`, mais vérifiez :

```
Base directory: calculatrice-ti83-react
Build command: npm run build
Publish directory: calculatrice-ti83-react/dist
```

### Étape 4 : Déployer !

1. Cliquez sur **"Deploy site"**
2. Attendez 1-2 minutes pendant le build
3. Votre site est en ligne ! 🎉

Netlify vous donnera une URL du type : `https://random-name-123456.netlify.app`

### Étape 5 : Personnaliser le nom (Optionnel)

1. Allez dans **Site settings** → **Domain management**
2. Cliquez sur **"Change site name"**
3. Choisissez un nom : `calculatrice-ti83.netlify.app`

---

## 💻 Option 2 : Déploiement via Netlify CLI

Pour les utilisateurs avancés qui préfèrent la ligne de commande.

### Étape 1 : Installer Netlify CLI

```bash
# Déjà installé dans ce projet !
npm install -g netlify-cli
```

### Étape 2 : Se connecter à Netlify

```bash
cd calculatrice-ti83-react
netlify login
```

Cela ouvrira votre navigateur pour authentification.

### Étape 3 : Initialiser le projet

```bash
netlify init
```

Choisissez :
- **Create & configure a new site**
- Votre équipe (team)
- Un nom pour votre site
- Build command : `npm run build`
- Publish directory : `dist`

### Étape 4 : Déployer

```bash
# Build et déploiement en production
netlify deploy --prod

# Ou déploiement en mode preview d'abord
netlify deploy
```

### Étape 5 : Ouvrir le site

```bash
netlify open:site
```

---

## 🔄 Déploiement Continu (CD)

Une fois configuré via l'interface web, chaque push sur la branche déclenchera automatiquement :

1. ✅ Un nouveau build
2. ✅ Des tests (si configurés)
3. ✅ Un déploiement automatique

```bash
# Faire des modifications
git add .
git commit -m "Amélioration de la calculatrice"
git push

# Netlify déploie automatiquement ! 🚀
```

---

## ⚙️ Configuration Avancée

### Variables d'Environnement

Si vous avez besoin de variables d'environnement :

1. Allez dans **Site settings** → **Environment variables**
2. Ajoutez vos variables (ex: `VITE_API_KEY=xxx`)
3. Redéployez

### Domaine Personnalisé

Pour utiliser votre propre domaine :

1. **Site settings** → **Domain management**
2. **Add custom domain**
3. Suivez les instructions pour configurer les DNS

### HTTPS

HTTPS est activé automatiquement et gratuit avec Let's Encrypt ! 🔒

### Redirections et Headers

Tout est déjà configuré dans `netlify.toml` :
- ✅ Redirections SPA (Single Page App)
- ✅ Headers de sécurité
- ✅ Cache optimisé pour les assets

---

## 🧪 Tester le Déploiement

Après déploiement, testez :

1. ✅ La page se charge correctement
2. ✅ Les touches répondent
3. ✅ Y= → X^2 → ENTER → GRAPH affiche une parabole
4. ✅ Les styles sont corrects
5. ✅ Pas d'erreurs dans la console (F12)

---

## 📊 Monitoring et Analytics

### Voir les Builds

```bash
netlify watch
```

Ou dans l'interface : **Deploys** → Voir tous les déploiements

### Analytics (Optionnel)

Netlify Analytics (payant) vous donne :
- Nombre de visiteurs
- Pages vues
- Performance

Ou utilisez Google Analytics gratuitement.

---

## 🐛 Dépannage

### Build échoue

```bash
# Vérifier localement
npm run build

# Vérifier les logs Netlify
netlify logs
```

### Site ne se charge pas

1. Vérifier que `dist/index.html` existe après build
2. Vérifier la configuration dans `netlify.toml`
3. Vérifier les redirections

### Erreur 404 sur refresh

C'est normal pour une SPA. La solution est déjà dans `netlify.toml` :

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 📁 Structure des Fichiers pour Netlify

```
calculatrice-ti83-react/
├── netlify.toml              ← Configuration Netlify
├── public/
│   └── _redirects            ← Redirections SPA
├── dist/                     ← Build de production (généré)
│   ├── index.html
│   └── assets/
│       ├── index-*.js
│       └── index-*.css
└── package.json
```

---

## 🎯 URLs Utiles

- **Dashboard Netlify** : https://app.netlify.com
- **Documentation** : https://docs.netlify.com
- **Support** : https://answers.netlify.com
- **Status** : https://www.netlifystatus.com

---

## 🚀 Déploiement en Une Commande

Si vous avez déjà configuré Netlify CLI :

```bash
cd calculatrice-ti83-react
npm run build && netlify deploy --prod
```

---

## 📈 Optimisations Post-Déploiement

### 1. Activer la Compression Brotli

Déjà activé par défaut sur Netlify ! 🎉

### 2. Activer le HTTP/2

Déjà activé par défaut sur Netlify ! 🎉

### 3. Prerender (Optionnel)

Pour améliorer le SEO :

```toml
# Dans netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[plugins]]
  package = "@netlify/plugin-sitemap"
```

### 4. Optimisation des Images

Les SVG sont déjà optimisés dans le build Vite.

---

## ✅ Checklist de Déploiement

- [ ] Code committé et pushé sur GitHub
- [ ] Build local fonctionne (`npm run build`)
- [ ] `netlify.toml` présent
- [ ] Compte Netlify créé
- [ ] Site configuré sur Netlify
- [ ] Premier déploiement réussi
- [ ] Site accessible via l'URL Netlify
- [ ] Tests fonctionnels OK
- [ ] Nom de site personnalisé (optionnel)
- [ ] Domaine personnalisé configuré (optionnel)

---

## 🎉 Félicitations !

Votre calculatrice TI-83 Plus est maintenant en ligne et accessible à tous ! 🌍

**Exemple d'URL finale** : `https://calculatrice-ti83.netlify.app`

Partagez-la avec le monde ! 🚀

---

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs de build sur Netlify
2. Consultez la documentation : https://docs.netlify.com
3. Demandez de l'aide sur : https://answers.netlify.com
