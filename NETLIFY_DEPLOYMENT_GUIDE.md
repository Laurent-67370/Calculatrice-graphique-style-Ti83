# Guide de Déploiement Netlify

## 🚀 Déploiement de la Calculatrice TI-83 Plus sur Netlify

Le build de production a été créé avec succès. Voici les options pour déployer sur Netlify :

---

## Option 1 : Déploiement via l'Interface Netlify (Recommandé)

### Méthode A : Depuis GitHub (Automatique)

1. **Connectez-vous à Netlify** : https://app.netlify.com
2. **Cliquez sur "Add new site" → "Import an existing project"**
3. **Sélectionnez "Deploy with GitHub"**
4. **Autorisez Netlify** à accéder à votre repository GitHub
5. **Sélectionnez le repository** : `Laurent-67370/Calculatrice-graphique-style-Ti83`
6. **Configurez le déploiement** :
   - **Branch to deploy** : `claude/scientific-calculator-ti83-011CUqMQSu5obWhYPHKhcTN3` (ou main après PR)
   - **Base directory** : `calculatrice-ti83-react`
   - **Build command** : `npm run build`
   - **Publish directory** : `calculatrice-ti83-react/dist`
7. **Cliquez sur "Deploy site"**

Netlify détectera automatiquement le fichier `netlify.toml` et utilisera sa configuration.

### Méthode B : Déploiement Manuel (Drag & Drop)

1. **Connectez-vous à Netlify** : https://app.netlify.com
2. **Faites glisser le dossier `dist`** directement sur la zone de déploiement
3. **Netlify uploadera et déploiera** votre site instantanément

Le dossier `dist` est situé à :
```
/home/user/Calculatrice-graphique-style-Ti83/calculatrice-ti83-react/dist/
```

---

## Option 2 : Déploiement via CLI (Nécessite Authentification)

### Étape 1 : Authentification

```bash
cd /home/user/Calculatrice-graphique-style-Ti83/calculatrice-ti83-react
netlify login
```

Cela ouvrira un navigateur pour vous authentifier.

### Étape 2 : Lier le Site (Première fois)

```bash
netlify init
```

Suivez les instructions pour :
- Créer un nouveau site ou lier un site existant
- Configurer les paramètres de build

### Étape 3 : Déployer

```bash
npm run deploy
```

Ou directement :

```bash
netlify deploy --prod --dir=dist
```

---

## 📦 Fichiers de Build Disponibles

Le build de production a été créé avec succès :

```
dist/
├── index.html (0.47 kB)
├── assets/
│   ├── index-CwA5y8dL.css (6.43 kB, gzipped: 1.77 kB)
│   └── index-CtT7Houy.js (233.73 kB, gzipped: 73.71 kB)
```

**Taille totale** : ~240 kB (non compressé), ~75 kB (gzipped)

---

## ⚙️ Configuration Netlify (netlify.toml)

La configuration est déjà en place et inclut :

- **Build Command** : `npm run build`
- **Publish Directory** : `dist`
- **Node Version** : 18
- **Redirections SPA** : Toutes les routes redirigent vers `index.html`
- **Headers de sécurité** :
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin
- **Cache optimisé** : Assets statiques mis en cache pour 1 an

---

## 🔑 Utilisation d'un Token d'Accès (Alternative)

Si vous préférez utiliser un token d'accès :

1. **Créez un token** sur : https://app.netlify.com/user/applications/personal
2. **Exportez le token** :
   ```bash
   export NETLIFY_AUTH_TOKEN=votre_token_ici
   ```
3. **Déployez** :
   ```bash
   netlify deploy --prod --dir=dist
   ```

---

## 📊 Après le Déploiement

Une fois déployé, vous obtiendrez :

- **URL de production** : `https://votre-site.netlify.app`
- **Dashboard Netlify** : Statistiques, logs, paramètres
- **Déploiements continus** : Automatiques depuis GitHub (si Option 1A)
- **HTTPS automatique** : Certificat SSL gratuit
- **CDN global** : Performance optimale partout dans le monde

---

## 🎉 Fonctionnalités Déployées

Votre calculatrice TI-83 Plus inclut :

✅ **Mode Graphique Complet**
  - Éditeur Y= avec 10 fonctions
  - Graphiques en temps réel
  - WINDOW configuration
  - Menu ZOOM (ZoomIn, ZoomOut, ZoomFit, ZoomStandard)

✅ **Statistiques Complètes**
  - STAT Edit (L1-L6)
  - 1-Var Stats (moyenne, écart-type, min, max, Q1, Q2, Q3)
  - 2-Var Stats (corrélation, covariance)
  - Régressions (LinReg, QuadReg, ExpReg)

✅ **Fonctions Mathématiques**
  - MATH NUM (abs, round, iPart, fPart, int, min, max, lcm, gcd)
  - MATH CPX (nombres complexes)
  - MATH PRB (factorial, nPr, nCr, randInt)

✅ **Menu CALC** (Nouveau !)
  - Zero (recherche de zéros)
  - Minimum (recherche de minima)
  - Maximum (recherche de maxima)
  - Integral (intégration numérique)

✅ **Éditeur MODE** (Nouveau !)
  - DEGREE/RADIAN toggle
  - FLOAT/FIXED toggle

✅ **Interface TI-83 Authentique**
  - Écran LCD haute résolution
  - Clavier physique complet
  - Navigation intuitive

---

## 🆘 Support

Si vous rencontrez des problèmes :

1. **Vérifiez les logs Netlify** : Dans le dashboard Netlify
2. **Build local** : `npm run build` pour tester localement
3. **Preview local** : `npm run preview` pour tester le build
4. **Documentation Netlify** : https://docs.netlify.com

---

## 📝 Notes

- Le déploiement prend généralement **30-60 secondes**
- Les déploiements depuis GitHub sont **automatiques** après configuration initiale
- Vous pouvez avoir **plusieurs environnements** (production, preview, branches)
- **Domaine personnalisé** configurable dans les paramètres Netlify

**Projet prêt pour le déploiement !** 🚀
