# 📦 Télécharger la Calculatrice TI-83 Plus v3.1.0

## 🚀 Déploiement Rapide pour Blog

### Étape 1: Télécharger les Archives

Les archives de build sont disponibles localement:

```bash
📁 Localisation:
/home/user/Calculatrice-graphique-style-Ti83/calculatrice-ti83-react/

📦 Fichiers disponibles:
- ti83-calculator-v3.1.0.tar.gz (368 KB)
- ti83-calculator-v3.1.0.zip (368 KB)
```

### Étape 2: Déployer sur votre Blog

#### Option A: Hébergement avec Serveur Web

**Pour un serveur Apache/Nginx/Caddy:**

```bash
# Extraire l'archive
unzip ti83-calculator-v3.1.0.zip -d /chemin/vers/votre/blog/ti83/

# Ou avec tar
tar -xzf ti83-calculator-v3.1.0.tar.gz -C /chemin/vers/votre/blog/ti83/

# Vérifier les permissions
chmod -R 755 /chemin/vers/votre/blog/ti83/
```

**URL d'accès:**
```
https://votre-blog.com/ti83/
```

#### Option B: GitHub Pages

```bash
# Cloner votre repo de blog
git clone https://github.com/votre-username/votre-blog.git
cd votre-blog

# Créer un dossier pour la calculatrice
mkdir -p calculatrice-ti83

# Extraire l'archive
unzip ti83-calculator-v3.1.0.zip -d calculatrice-ti83/

# Committer et pousser
git add calculatrice-ti83/
git commit -m "Ajout Calculatrice TI-83 Plus v3.1.0"
git push origin main
```

**URL d'accès:**
```
https://votre-username.github.io/votre-blog/calculatrice-ti83/
```

#### Option C: Netlify

**Méthode 1 - Drag & Drop:**
1. Allez sur https://app.netlify.com/drop
2. Glissez-déposez `ti83-calculator-v3.1.0.zip`
3. Netlify déploie automatiquement
4. Récupérez l'URL générée

**Méthode 2 - CLI:**
```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Extraire et déployer
unzip ti83-calculator-v3.1.0.zip -d deploy-temp
netlify deploy --dir=deploy-temp --prod
```

#### Option D: Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Extraire
unzip ti83-calculator-v3.1.0.zip -d deploy-temp

# Déployer
cd deploy-temp
vercel --prod
```

---

## 🔗 Intégration dans votre Blog

### Lien Direct

```html
<a href="/ti83/" target="_blank">
  🧮 Ouvrir la Calculatrice TI-83 Plus
</a>
```

### iFrame Intégré

```html
<iframe
  src="/ti83/"
  width="400"
  height="600"
  style="border: 2px solid #333; border-radius: 8px;"
  title="Calculatrice TI-83 Plus">
</iframe>
```

### Bouton Stylisé

```html
<a href="/ti83/"
   style="display: inline-block;
          padding: 12px 24px;
          background: #2563eb;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;">
  🧮 Lancer la Calculatrice TI-83 Plus
</a>
```

### Card avec Description

```html
<div style="max-width: 400px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;">
  <h3>🧮 Calculatrice TI-83 Plus</h3>
  <p>
    Émulateur web complet de la TI-83 Plus avec support des graphiques,
    programmation TI-BASIC, statistiques, et mode SEQUENCE.
  </p>
  <ul>
    <li>✅ 100% Compatible TI-83 Plus</li>
    <li>✅ Mode SEQUENCE avec u(n), v(n), w(n)</li>
    <li>✅ Programmation TI-BASIC</li>
    <li>✅ Graphiques et Statistiques</li>
  </ul>
  <a href="/ti83/"
     style="display: inline-block;
            padding: 10px 20px;
            background: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 10px;">
    Ouvrir la Calculatrice
  </a>
</div>
```

---

## 📱 Fonctionnalités à Mettre en Avant

### Pour Article de Blog

**Titre suggéré:**
> "Calculatrice TI-83 Plus Complète dans votre Navigateur - Version 3.1"

**Points clés à mentionner:**

1. **100% Compatibilité TI-83 Plus**
   - Tous les modes graphiques (FUNC, PAR, POL, SEQ)
   - Programmation TI-BASIC complète
   - Statistiques et régressions

2. **Nouveau: Mode SEQUENCE**
   - Tracer des suites récurrentes
   - Support de u(n-1), u(n-2)
   - Parfait pour l'enseignement

3. **Progressive Web App (PWA)**
   - Fonctionne hors ligne
   - Installable sur PC et mobile
   - Pas besoin de compte

4. **Gratuit et Open Source**
   - Aucune publicité
   - Aucune collecte de données
   - Code source disponible sur GitHub

---

## 🎨 Personnalisation

### Ajuster la Taille

```html
<!-- Version compacte -->
<iframe src="/ti83/" width="384" height="600"></iframe>

<!-- Version agrandie -->
<iframe src="/ti83/" width="600" height="900"></iframe>

<!-- Plein écran -->
<iframe src="/ti83/" width="100%" height="800px"></iframe>
```

### Thème du Site

La calculatrice s'adapte automatiquement:
- Fond gris-vert authentique TI-83
- Police monospace pour l'affichage
- Boutons tactiles responsive

### Configuration .htaccess (Apache)

```apache
# Activer la compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>

# Cache des assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Support PWA
<IfModule mod_headers.c>
  Header set Service-Worker-Allowed "/"
</IfModule>
```

---

## 🧪 Test avant Déploiement

### Vérification Locale

```bash
# Extraire
unzip ti83-calculator-v3.1.0.zip -d test-local

# Tester
cd test-local
python3 -m http.server 8000

# Ouvrir
open http://localhost:8000
```

### Checklist de Test

- [ ] La calculatrice s'affiche correctement
- [ ] Les boutons répondent au clic
- [ ] Les calculs fonctionnent (ex: 2+2)
- [ ] MODE accessible (touche MODE)
- [ ] Y= pour définir des fonctions
- [ ] GRAPH pour tracer
- [ ] Mode SEQUENCE fonctionne
- [ ] PWA installable (icône dans la barre d'adresse)

---

## 📊 Performance

### Optimisations Incluses

✅ **Bundle Optimisé:**
- JS: 314 KB gzippé (1.09 MB non compressé)
- CSS: 4.8 KB gzippé (24 KB non compressé)
- Total: ~320 KB gzippé

✅ **PWA Features:**
- Service Worker pour cache offline
- Manifest pour installation
- Icônes 192x192 et 512x512

✅ **SEO Friendly:**
- HTML sémantique
- Meta tags appropriés
- Sitemap compatible

### Temps de Chargement Attendus

- **Connexion rapide (4G/Fiber)**: < 1 seconde
- **Connexion moyenne (3G)**: 2-3 secondes
- **Offline (après 1ère visite)**: instantané

---

## 🔒 Sécurité

### Bonnes Pratiques

✅ **Pas de données sensibles:**
- Aucune collecte de données utilisateur
- Pas de cookies tiers
- localStorage uniquement local

✅ **CSP Headers Recommandés:**

```apache
# Dans .htaccess ou config serveur
Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
```

✅ **HTTPS Obligatoire:**
- Pour PWA
- Pour Service Workers
- Pour une meilleure sécurité

---

## 📞 Support

### Questions Fréquentes

**Q: Puis-je utiliser cette calculatrice commercialement?**
R: Oui, elle est disponible pour usage éducatif et personnel. Vérifiez la licence pour usage commercial.

**Q: Fonctionne-t-elle sur mobile?**
R: Oui ! Responsive et installable comme app native.

**Q: Les programmes sont-ils sauvegardés?**
R: Oui, dans le localStorage du navigateur. Ils persistent entre les sessions.

**Q: Puis-je personnaliser l'apparence?**
R: Le code source est disponible sur GitHub pour modifications.

### Liens Utiles

- **Repository GitHub**: https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83
- **Issues**: https://github.com/Laurent-67370/Calculatrice-graphique-style-Ti83/issues
- **Documentation**: Incluse dans l'archive (RELEASE_NOTES_v3.1.md)

---

## 🎉 C'est Parti !

Votre calculatrice TI-83 Plus est prête à être déployée sur votre blog. Profitez de toutes ses fonctionnalités pour créer du contenu éducatif de qualité !

**Besoin d'aide?** Créez une issue sur GitHub ou consultez la documentation complète dans `RELEASE_NOTES_v3.1.md`.

---

*Dernière mise à jour: 10 Novembre 2025*
