# 🚀 Créer une GitHub Release v2.5.0.0

Le tag `v2.5.0.0` a été créé localement. Voici comment créer la release sur GitHub.

---

## 📋 Méthode 1 : Interface Web GitHub (RECOMMANDÉ)

### Étape 1 : Aller sur GitHub Releases

Accédez à :
```
https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/releases/new
```

### Étape 2 : Configurer la Release

**Tag version :** `v2.5.0.0`

**Release title :** `🧮 Version 2.5.0.0 - DISTR, TEST & LOGIC`

**Description :** Copiez-collez le texte ci-dessous :

```markdown
# 🎉 Version 2.5.0.0 - Distributions Statistiques et Opérateurs Logiques

Cette version majeure ajoute **25 nouvelles fonctions** pour les statistiques avancées et la logique booléenne, portant la compatibilité avec la TI-83 Plus à **80%**.

---

## ✨ Nouvelles Fonctionnalités

### 📊 DISTR - Distributions Statistiques (15 fonctions)

Accès via **2ND + VARS** (DISTR)

**Distributions Continues :**
- **Loi Normale** : `normalpdf(x,μ,σ)`, `normalcdf(lower,upper,μ,σ)`, `invNorm(area,μ,σ)`
- **Loi de Student t** : `tpdf(x,df)`, `tcdf(lower,upper,df)`
- **Loi du Chi-carré** : `χ²pdf(x,df)`, `χ²cdf(lower,upper,df)`
- **Loi de Fisher F** : `Fpdf(x,df1,df2)`, `Fcdf(lower,upper,df1,df2)`

**Distributions Discrètes :**
- **Loi Binomiale** : `binompdf(n,p,x)`, `binomcdf(n,p,x)`
- **Loi de Poisson** : `poissonpdf(λ,x)`, `poissoncdf(λ,x)`
- **Loi Géométrique** : `geometpdf(p,x)`, `geometcdf(p,x)`

**Méthodes Numériques :**
- Fonction d'erreur (erf) avec approximation Abramowitz & Stegun
- Fonction Gamma pour les distributions
- Fonction Beta pour les calculs de probabilités
- Intégration de Simpson pour les CDF complexes
- Approximation Beasley-Springer-Moro pour invNorm

### 🔍 TEST - Opérateurs de Comparaison (6 opérateurs)

Accès via **2ND + MATH** (TEST)

- `=` (égal)
- `≠` (différent)
- `>` (supérieur)
- `≥` (supérieur ou égal)
- `<` (inférieur)
- `≤` (inférieur ou égal)

Retournent **1** (vrai) ou **0** (faux)

### 🧠 LOGIC - Opérateurs Logiques (4 opérateurs)

Accès via **2ND + MATH** (LOGIC)

- `and` - ET logique
- `or` - OU logique
- `xor` - OU exclusif
- `not` - NON logique

Retournent **1** (vrai) ou **0** (faux)

---

## 🔧 Améliorations Techniques

- **DistributionService.ts** : Nouveau service dédié (362 lignes) avec précision numérique professionnelle
- **MathFunctionsService** : Intégration des 25 nouvelles fonctions
- **CatalogViewer** : Ajout dans le catalogue alphabétique (100+ fonctions)
- **Menu System** : 3 nouveaux menus avec navigation fluide

---

## 📝 Documentation

- Guide complet dans **HelpModal** avec exemples d'utilisation
- Mise à jour du **README.md** et **CHANGELOG.md**
- Guide de déploiement : **DEPLOIEMENT-BLOG.md**
- Script d'installation SSH : **INSTALL-BLOG.sh**

---

## 🎯 Statistiques

- **Fonctionnalités statistiques** : 100% ✅
- **Tests et logique** : 100% ✅
- **Compatibilité TI-83 Plus** : 80% (+25 fonctions)
- **Build optimisé** : 295 KB gzip (JavaScript)
- **PWA Ready** : Installable sur mobile et bureau

---

## 📦 Installation

### Option 1 : Archive Prête à Déployer

Téléchargez **calculatrice-ti83-blog-v2.5.0.0.tar.gz** (348 KB) et extrayez sur votre serveur web.

### Option 2 : Build depuis les Sources

```bash
git clone https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83.git
cd Calculatrice-graphique-style-Ti83
git checkout v2.5.0.0
cd calculatrice-ti83-react
npm install
npm run build
# Le dossier dist/ contient l'application
```

---

## 🌐 Démo en Ligne

**URL :** [www.lhusser.fr/calculatrice](https://www.lhusser.fr/calculatrice/)

---

## 📋 Fonctionnalités Complètes

- ✅ **Calculs** : Arithmétique, trigonométrie, exponentielles, logarithmes
- ✅ **Graphiques** : 6 fonctions simultanées, modes Function/Parametric/Polar
- ✅ **Statistiques** : 14 fonctions stats, 12 types de régressions, STAT PLOT
- ✅ **DISTR** : 15 distributions statistiques professionnelles ⭐ NOUVEAU
- ✅ **TEST & LOGIC** : Opérateurs de comparaison et logiques ⭐ NOUVEAU
- ✅ **MATH** : 38 fonctions en 6 catégories
- ✅ **Finance TVM** : Calculateur financier complet
- ✅ **SOLVER** : Résolveur d'équations avec Newton-Raphson
- ✅ **CATALOG** : 100+ fonctions avec recherche rapide
- ✅ **TABLE** : Affichage tabulaire avec TBLSET
- ✅ **Matrices** : Calcul matriciel complet (10 matrices A-J)
- ✅ **Mémoire** : Variables A-Z, listes L1-L6

---

## 🛠️ Technologies

- React 19.1
- TypeScript 5.6
- Zustand 5.0
- Vite 7.2
- MathJS 15.1
- Workbox 7.3 (PWA)

---

## 📄 Changelog Complet

Voir [CHANGELOG.md](https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/blob/v2.5.0.0/CHANGELOG.md) pour tous les détails.

---

**Merci d'utiliser la Calculatrice TI-83 Plus ! 🎉**
```

### Étape 3 : Attacher les Archives

Glissez-déposez ces fichiers dans la zone "Attach binaries" :

1. **calculatrice-ti83-blog-v2.5.0.0.tar.gz** (348 KB) - Archive prête pour déploiement
2. **calculatrice-ti83-blog-v2.5.0.0.zip** (348 KB) - Archive prête pour déploiement
3. **calculatrice-ti83-plus-v2.5.0.0.tar.gz** (352 KB) - Archive complète avec sources
4. **calculatrice-ti83-plus-v2.5.0.0.zip** (351 KB) - Archive complète avec sources

Localisation des fichiers : `/home/user/Calculatrice-graphique-style-Ti83/`

### Étape 4 : Publier

1. ☑️ Cochez **"Set as the latest release"**
2. Cliquez sur **"Publish release"**

---

## 📋 Méthode 2 : GitHub CLI (si disponible)

Si vous avez `gh` installé localement :

```bash
cd /home/user/Calculatrice-graphique-style-Ti83

# Pusher le tag
git push origin v2.5.0.0

# Créer la release avec les archives
gh release create v2.5.0.0 \
  --title "🧮 Version 2.5.0.0 - DISTR, TEST & LOGIC" \
  --notes-file CREATE-GITHUB-RELEASE-NOTES.md \
  calculatrice-ti83-blog-v2.5.0.0.tar.gz \
  calculatrice-ti83-blog-v2.5.0.0.zip \
  calculatrice-ti83-plus-v2.5.0.0.tar.gz \
  calculatrice-ti83-plus-v2.5.0.0.zip
```

---

## 📋 Méthode 3 : API GitHub avec curl (Avancé)

Si vous avez un Personal Access Token GitHub :

```bash
# Créer un token sur : https://github.com/settings/tokens
# Permissions requises : repo (full control)

GITHUB_TOKEN="votre_token_ici"
REPO="Laurent-67370/Calculatrice-graphique-style-Ti83"
TAG="v2.5.0.0"

# Créer la release
RELEASE_ID=$(curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/$REPO/releases \
  -d '{
    "tag_name": "'"$TAG"'",
    "name": "🧮 Version 2.5.0.0 - DISTR, TEST & LOGIC",
    "body": "Voir description complète dans CREATE-GITHUB-RELEASE.md",
    "draft": false,
    "prerelease": false
  }' | jq -r '.id')

# Upload les archives (répéter pour chaque fichier)
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Content-Type: application/gzip" \
  --data-binary @calculatrice-ti83-blog-v2.5.0.0.tar.gz \
  "https://uploads.github.com/repos/$REPO/releases/$RELEASE_ID/assets?name=calculatrice-ti83-blog-v2.5.0.0.tar.gz"
```

---

## ✅ Vérification

Après publication, vérifiez :

1. La release apparaît sur : `https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/releases`
2. Les 4 archives sont disponibles en téléchargement
3. Le tag `v2.5.0.0` est visible dans l'onglet "Tags"
4. Le badge "Latest" est affiché

---

## 📥 Liens de Téléchargement (Après Publication)

Une fois la release créée, les liens seront :

- **Archive Blog (tar.gz)** :
  ```
  https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/releases/download/v2.5.0.0/calculatrice-ti83-blog-v2.5.0.0.tar.gz
  ```

- **Archive Blog (zip)** :
  ```
  https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/releases/download/v2.5.0.0/calculatrice-ti83-blog-v2.5.0.0.zip
  ```

- **Archive Complète (tar.gz)** :
  ```
  https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/releases/download/v2.5.0.0/calculatrice-ti83-plus-v2.5.0.0.tar.gz
  ```

- **Archive Complète (zip)** :
  ```
  https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/releases/download/v2.5.0.0/calculatrice-ti83-plus-v2.5.0.0.zip
  ```

---

**Bonne publication ! 🚀**
