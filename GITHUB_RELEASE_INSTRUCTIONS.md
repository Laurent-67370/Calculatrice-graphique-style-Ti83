# 📦 Instructions pour Créer une Release GitHub - v2.0.3

## 🎯 Objectif

Créer une release publique sur GitHub pour la version 2.0.3 de la Calculatrice TI-83 Plus avec le menu STAT complet.

---

## 📋 Méthode 1 : Via l'Interface Web GitHub (RECOMMANDÉ)

### Étape 1 : Accéder à la Page des Releases

1. Allez sur votre repository GitHub :
   ```
   https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83
   ```

2. Cliquez sur **"Releases"** dans la barre latérale droite
   - Ou allez directement sur : `https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/releases`

3. Cliquez sur **"Draft a new release"** ou **"Create a new release"**

### Étape 2 : Configurer le Tag de Version

1. **Choose a tag** : Cliquez sur le menu déroulant
2. Tapez `v2.0.3` (nouveau tag)
3. Cliquez sur **"Create new tag: v2.0.3 on publish"**
4. **Target** : Sélectionnez la branche `claude/scientific-calculator-ti83-011CUqMQSu5obWhYPHKhcTN3`

### Étape 3 : Remplir les Informations de Release

**Release title :**
```
v2.0.3 - Menu STAT Complet (14/14 Fonctions) 🎉
```

**Description :**
Copiez-collez le contenu suivant (ou utilisez RELEASE_NOTES_v2.0.3.md) :

```markdown
## 🎯 Résumé

Version majeure qui complète à **100%** le menu STAT de la calculatrice TI-83 Plus avec l'ajout de 6 nouvelles fonctions de régression avancées.

**Menu STAT : 14/14 fonctions (100%)** ✅

---

## ✨ Nouvelles Fonctionnalités

### 6 Nouvelles Régressions Statistiques

1. **Med-Med** - Régression médiane-médiane (résistante aux outliers)
2. **CubicReg** - Régression cubique (y = ax³ + bx² + cx + d)
3. **QuartReg** - Régression quartique (degré 4)
4. **LinReg(a+bx)** - Régression linéaire (notation alternative)
5. **SinReg** - Régression sinusoïdale (y = a·sin(bx+c)+d)
6. **Logistic** - Régression logistique (courbe en S)

---

## 🔧 Améliorations Techniques

- ✅ Élimination de Gauss pour régressions polynomiales
- ✅ Algorithme médiane-médiane avec division en 3 groupes
- ✅ Transformation logit pour régression logistique
- ✅ Estimation automatique des paramètres sinusoïdaux

**Code ajouté :** +385 lignes TypeScript

---

## 📊 Performance

- **Build time :** 1.13s
- **JS bundle :** 252.94 KB (78.45 KB gzippé)
- **CSS bundle :** 9.50 KB (2.47 KB gzippé)
- **Total :** ~268 KB

---

## 📦 Fichiers de Déploiement

Deux archives prêtes pour déploiement sur serveur web :

- `calculatrice-ti83-deploy.tar.gz` (81 KB)
- `calculatrice-ti83-deploy.zip` (82 KB)

**URL de démo :** https://www.lhusser.fr/calculatrice/

---

## 🧪 Comment Tester

1. **Cloner le projet :**
   ```bash
   git clone https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83.git
   cd Calculatrice-graphique-style-Ti83
   git checkout claude/scientific-calculator-ti83-011CUqMQSu5obWhYPHKhcTN3
   ```

2. **Installer et lancer :**
   ```bash
   cd calculatrice-ti83-react
   npm install
   npm run dev
   ```

3. **Tester les nouvelles fonctions :**
   - Appuyez sur `STAT`
   - Sélectionnez `CubicReg`, `SinReg`, ou `Logistic`
   - Les résultats s'affichent avec tous les coefficients

---

## 📈 Statistiques du Projet

- **4,385+ lignes** de TypeScript
- **14 composants** React
- **3 services** backend
- **58+ fonctions** mathématiques
- **Complétion globale : ~92%**

---

## 🎓 Cas d'Usage

- 📚 **Enseignement** : Statistiques avancées et modélisation
- 🔬 **Recherche** : Croissance biologique, phénomènes périodiques
- 📝 **Examens** : Compatibilité TI-83 Plus complète

---

## 📝 Documentation Complète

Voir `RELEASE_NOTES_v2.0.3.md` pour tous les détails techniques.

---

## 🔗 Liens Utiles

- **Demo Live :** https://www.lhusser.fr/calculatrice/
- **Documentation :** Voir fichiers .md dans le repo
- **Tests :** Voir `TEST_GUIDE.md`

---

**100% Compatible TI-83 Plus** | **Made with ❤️ for Education**
```

### Étape 4 : Ajouter les Fichiers de Déploiement (Optionnel)

1. Cliquez sur **"Attach binaries"** en bas de la page
2. Uploadez les fichiers suivants (créés dans le répertoire racine) :
   - `calculatrice-ti83-deploy.tar.gz`
   - `calculatrice-ti83-deploy.zip`

### Étape 5 : Options Supplémentaires

- ✅ Cochez **"Set as the latest release"**
- ⬜ Ne cochez PAS "Set as a pre-release" (c'est une version stable)

### Étape 6 : Publier

1. Cliquez sur **"Publish release"**
2. Votre release est maintenant publique ! 🎉

---

## 📋 Méthode 2 : Via GitHub CLI (Si disponible)

Si vous avez installé GitHub CLI (`gh`) :

```bash
# Télécharger les archives
cd /home/user/Calculatrice-graphique-style-Ti83

# Créer la release avec les assets
gh release create v2.0.3 \
  --title "v2.0.3 - Menu STAT Complet (14/14 Fonctions) 🎉" \
  --notes-file RELEASE_NOTES_v2.0.3.md \
  --target claude/scientific-calculator-ti83-011CUqMQSu5obWhYPHKhcTN3 \
  calculatrice-ti83-deploy.tar.gz \
  calculatrice-ti83-deploy.zip
```

---

## 📋 Méthode 3 : Via API GitHub (Avancé)

Si vous préférez utiliser l'API GitHub :

```bash
# Créer le tag
curl -X POST \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/Laurent-67370/Calculatrice-graphique-style-Ti83/git/tags \
  -d '{
    "tag": "v2.0.3",
    "message": "Release v2.0.3 - Menu STAT Complet",
    "object": "230ce4b",
    "type": "commit"
  }'

# Créer la release
curl -X POST \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/Laurent-67370/Calculatrice-graphique-style-Ti83/releases \
  -d '{
    "tag_name": "v2.0.3",
    "target_commitish": "claude/scientific-calculator-ti83-011CUqMQSu5obWhYPHKhcTN3",
    "name": "v2.0.3 - Menu STAT Complet (14/14 Fonctions) 🎉",
    "body": "...",
    "draft": false,
    "prerelease": false
  }'
```

---

## ✅ Vérification Post-Release

Après avoir créé la release :

1. **Vérifier la page de release :**
   - Allez sur `https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/releases`
   - Vérifiez que v2.0.3 apparaît
   - Vérifiez que le tag est créé

2. **Vérifier les assets :**
   - Les fichiers .tar.gz et .zip doivent être téléchargeables
   - Testez un téléchargement pour confirmer

3. **Vérifier le badge "Latest" :**
   - La release doit avoir le badge vert "Latest"

4. **Partager la release :**
   - L'URL sera : `https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/releases/tag/v2.0.3`

---

## 🎯 Résultat Final

Une fois la release créée, les utilisateurs pourront :

1. **Télécharger les archives** directement depuis GitHub
2. **Voir toutes les nouveautés** dans les release notes
3. **Cloner une version spécifique** :
   ```bash
   git clone --branch v2.0.3 https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83.git
   ```

---

## 📈 Promotion de la Release

Après publication, vous pouvez :

1. **Annoncer sur votre blog** www.lhusser.fr
2. **Partager sur les réseaux sociaux**
3. **Mettre à jour le README** avec lien vers la release
4. **Créer un post de blog** détaillant les nouvelles fonctionnalités

---

## 🔄 Mises à Jour Futures

Pour les prochaines releases :

1. Suivez le même processus
2. Incrémentez le numéro de version (v2.0.4, v2.1.0, etc.)
3. Mettez à jour les release notes
4. Publiez !

---

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez que vous avez les droits d'administration sur le repo
2. Assurez-vous que le tag n'existe pas déjà
3. Consultez la documentation GitHub : https://docs.github.com/en/repositories/releasing-projects-on-github

---

**Bonne publication ! 🚀**
