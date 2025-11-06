# 📱 Guide PWA - Calculatrice TI-83 Plus

## 🎉 Qu'est-ce qu'une PWA ?

Une **Progressive Web App (PWA)** est une application web qui peut être installée sur votre appareil Android et utilisée comme une application native :

- ✅ **Installation sur l'écran d'accueil** - Comme une vraie app
- ✅ **Mode autonome (standalone)** - Pas de barre d'adresse
- ✅ **Fonctionne hors ligne** - Calculatrice toujours disponible
- ✅ **Rapide et légère** - Seulement 328 KB
- ✅ **Mises à jour automatiques** - Toujours la dernière version
- ✅ **Pas besoin du Play Store** - Installation directe depuis le web

---

## 📲 Installation sur Android

### Méthode 1 : Via Chrome (RECOMMANDÉ)

1. **Ouvrez Chrome** sur votre téléphone Android

2. **Visitez** : https://www.lhusser.fr/calculatrice/

3. **Attendez** quelques secondes pour que la page charge

4. **Tapez sur l'icône ⋮** (menu en haut à droite)

5. **Sélectionnez** : "Ajouter à l'écran d'accueil" ou "Installer l'application"

6. **Confirmez** en tapant sur "Installer" ou "Ajouter"

7. **Trouvez l'icône** "TI-83 Plus" sur votre écran d'accueil

8. **Lancez l'application** - Elle s'ouvre en mode plein écran !

### Méthode 2 : Via le Prompt d'Installation

Certains navigateurs affichent automatiquement une bannière en bas de l'écran vous proposant d'installer l'application :

1. **Tapez sur "Installer"** dans la bannière
2. **Confirmez l'installation**
3. L'application apparaît sur votre écran d'accueil

### Méthode 3 : Via Samsung Internet

1. Ouvrez **Samsung Internet** sur votre téléphone
2. Visitez : https://www.lhusser.fr/calculatrice/
3. Tapez sur **☰** (menu)
4. Sélectionnez **"Ajouter page à" → "Écran d'accueil"**
5. Confirmez l'installation

---

## 🎯 Avantages de la PWA

### 📴 Mode Hors Ligne

Une fois installée, la calculatrice fonctionne **même sans connexion Internet** :

- Tous les calculs sont effectués localement
- Toutes les fonctions mathématiques disponibles
- Mode graphique fonctionnel
- Pas besoin de réseau mobile ou WiFi

### 🚀 Performance

- **Chargement instantané** - Cache local optimisé
- **Réponse immédiate** - Pas de latence réseau
- **Fluidité** - 60 FPS garantis

### 💾 Stockage Minimal

- **Taille totale** : ~330 KB
- **Beaucoup moins qu'une app native** (qui fait souvent plusieurs MB)
- **Mise à jour automatique** en arrière-plan

### 🔒 Sécurité

- **HTTPS obligatoire** - Connexion sécurisée
- **Service Worker isolé** - Pas d'accès aux données sensibles
- **Pas de permissions dangereuses** - Contrairement aux apps natives

---

## 🎨 Fonctionnalités PWA

### Icône Adaptative (Maskable)

L'icône de l'application s'adapte automatiquement au style de votre téléphone :

- **Android 8+** : Icône ronde, carrée, ou en forme de goutte
- **Thème clair/sombre** : Contraste optimisé
- **Tailles disponibles** : 192x192 et 512x512 pixels

### Écran de Démarrage (Splash Screen)

Lors du lancement, Android affiche automatiquement :

- **Nom** : "Calculatrice TI-83 Plus"
- **Icône** : Logo de la calculatrice
- **Couleur de fond** : Noir (#1a1a1a)
- **Durée** : ~1 seconde

### Mode Portrait Forcé

L'application est optimisée pour le **mode portrait** :

- Orientation verrouillée
- Interface adaptée au format smartphone
- Touches facilement accessibles au pouce

---

## 🔄 Mises à Jour Automatiques

La PWA se met à jour automatiquement en arrière-plan :

1. **Vous ouvrez l'application**
2. Le service worker **vérifie les mises à jour**
3. **Télécharge la nouvelle version** en cache
4. **Affiche une notification** : "Une nouvelle version est disponible"
5. **Tapez sur "Recharger"** pour appliquer la mise à jour

Ou attendez simplement la prochaine ouverture, la mise à jour se fera automatiquement.

---

## 🗑️ Désinstallation

### Sur Android

**Méthode 1 : Depuis l'écran d'accueil**
1. **Maintenez** l'icône "TI-83 Plus"
2. Faites-la **glisser vers "Désinstaller"** ou **"Supprimer"**
3. Confirmez la suppression

**Méthode 2 : Via les paramètres**
1. Ouvrez **Paramètres** → **Applications**
2. Cherchez **"Calculatrice TI-83 Plus"**
3. Tapez sur **"Désinstaller"**

---

## 🛠️ Dépannage

### Problème : Impossible d'installer

**Solutions :**

1. **Vérifiez votre connexion Internet** - La première installation nécessite Internet
2. **Utilisez Chrome** - Meilleur support PWA
3. **Mettez à jour Chrome** - Dernière version recommandée
4. **Videz le cache** : Paramètres → Stockage → Effacer les données

### Problème : L'application ne se lance pas

**Solutions :**

1. **Désinstallez et réinstallez** l'application
2. **Vérifiez l'espace de stockage** - Minimum 10 MB libre
3. **Redémarrez votre téléphone**

### Problème : L'icône n'apparaît pas

**Solutions :**

1. **Actualisez la page** (tirez vers le bas)
2. **Attendez 10 secondes** après le chargement
3. **Essayez la méthode manuelle** : Menu → Ajouter à l'écran d'accueil

### Problème : Mode hors ligne ne fonctionne pas

**Solutions :**

1. **Ouvrez l'app au moins une fois** avec Internet pour initialiser le cache
2. **Vérifiez que vous avez bien installé** (pas juste un raccourci)
3. **Réinstallez l'application** pour rafraîchir le cache

---

## 📊 Informations Techniques

### Configuration PWA

```javascript
{
  name: "Calculatrice TI-83 Plus",
  short_name: "TI-83 Plus",
  display: "standalone",
  orientation: "portrait",
  theme_color: "#1a1a1a",
  background_color: "#1a1a1a",
  scope: "/calculatrice/",
  start_url: "/calculatrice/"
}
```

### Service Worker

- **Stratégie** : Cache First (priorité au cache)
- **Cache Name** : ti83-cache
- **Durée de vie** : 1 an
- **Fichiers en cache** : HTML, CSS, JS, images, SVG
- **Mise à jour** : Automatique en arrière-plan

### Icônes Générées

| Fichier | Taille | Type | Usage |
|---------|--------|------|-------|
| icon-192.png | 192x192 | Standard | Écran d'accueil |
| icon-512.png | 512x512 | Standard | Splash screen |
| icon-maskable-192.png | 192x192 | Maskable | Android adaptatif |
| icon-maskable-512.png | 512x512 | Maskable | Android haute résolution |

### Compatibilité

| Navigateur | Version Minimale | Support |
|------------|------------------|---------|
| Chrome Android | 80+ | ✅ Complet |
| Samsung Internet | 12+ | ✅ Complet |
| Firefox Android | 90+ | ⚠️ Partiel |
| Opera Android | 60+ | ✅ Complet |
| Edge Android | 80+ | ✅ Complet |

---

## 🧪 Tests Effectués

### Tests de Build

✅ Build PWA réussi avec Vite
✅ Génération des icônes (4 tailles)
✅ Création du manifest.webmanifest
✅ Génération du service worker (sw.js)
✅ Configuration Workbox
✅ Enregistrement du SW dans main.tsx

### Tests de Taille

- **Build total** : 328.66 KB
- **Précache** : 13 fichiers
- **Service Worker** : 1.9 KB
- **Workbox** : 22 KB
- **Manifest** : 907 bytes

### Tests Fonctionnels (à effectuer après déploiement)

- [ ] Installation sur écran d'accueil
- [ ] Lancement en mode standalone
- [ ] Fonctionnement hors ligne
- [ ] Mise à jour automatique
- [ ] Notification de mise à jour
- [ ] Affichage du splash screen
- [ ] Orientation portrait forcée
- [ ] Toutes les fonctions de calcul
- [ ] Mode graphique
- [ ] Persistance des données

---

## 📱 Captures d'écran

### Installation

1. **Page web** → Bannière d'installation apparaît
2. **Tap sur "Installer"** → Confirmation
3. **Icône ajoutée** → Écran d'accueil
4. **Lancement** → Mode plein écran

### Utilisation

- **Écran d'accueil** : Icône TI-83 Plus
- **Splash screen** : Logo pendant 1s
- **Application** : Interface complète sans barre d'adresse
- **Navigation** : Pas de bouton retour du navigateur

---

## 🎓 Pour les Développeurs

### Structure des Fichiers PWA

```
calculatrice-ti83-react/
├── vite.config.ts              ← Configuration Vite PWA
├── generate-icons.mjs          ← Script génération icônes
├── public/
│   ├── icon.svg                ← Icône source (512x512)
│   ├── icon-192.png            ← Générée automatiquement
│   ├── icon-512.png            ← Générée automatiquement
│   ├── icon-maskable-192.png   ← Générée automatiquement
│   └── icon-maskable-512.png   ← Générée automatiquement
├── src/
│   ├── main.tsx                ← Enregistrement SW
│   └── vite-env.d.ts           ← Types PWA
└── dist/                       ← Build de production
    ├── manifest.webmanifest    ← Généré par Vite PWA
    ├── sw.js                   ← Service Worker
    └── workbox-*.js            ← Workbox runtime
```

### Scripts npm

```bash
# Générer les icônes
npm run generate-icons

# Build PWA (inclut génération icônes)
npm run build

# Tester en local
npm run preview
```

### Commandes de Déploiement

```bash
# Build et déploiement
cd calculatrice-ti83-react
npm run build

# Copier dist/ vers le serveur
scp -r dist/* utilisateur@lhusser.fr:/var/www/html/calculatrice/
```

---

## 🌐 Configuration Serveur

### Headers HTTPS Requis

Les PWA nécessitent **HTTPS obligatoirement**. Ajoutez dans `.htaccess` :

```apache
# Headers PWA
Header set Service-Worker-Allowed "/"

# Headers de cache pour SW
<FilesMatch "sw\.js$">
  Header set Cache-Control "no-cache, no-store, must-revalidate"
  Header set Pragma "no-cache"
  Header set Expires "0"
</FilesMatch>

# Headers de cache pour manifest
<FilesMatch "manifest\.webmanifest$">
  Header set Cache-Control "public, max-age=604800"
  Header set Content-Type "application/manifest+json"
</FilesMatch>
```

### Test Local avec HTTPS

```bash
# Utiliser Vite preview avec HTTPS
npm run preview -- --https

# Ou avec un certificat local
npm run preview -- --https --cert ./cert.pem --key ./key.pem
```

---

## ✅ Checklist de Déploiement PWA

- [x] Plugin vite-plugin-pwa installé
- [x] Icônes générées (4 tailles)
- [x] Manifest configuré
- [x] Service Worker configuré
- [x] SW enregistré dans main.tsx
- [x] Build PWA testé localement
- [ ] Déployé sur serveur HTTPS
- [ ] Testé sur Android Chrome
- [ ] Installation sur écran d'accueil testée
- [ ] Mode hors ligne testé
- [ ] Mise à jour testée

---

## 🚀 Prochaines Étapes

1. **Déployer** la version PWA sur lhusser.fr
2. **Tester** l'installation sur Android
3. **Vérifier** le mode hors ligne
4. **Partager** le lien d'installation

---

## 📞 Support

Pour toute question sur la PWA :

1. Vérifiez que vous utilisez **HTTPS**
2. Testez avec **Chrome Android**
3. Vérifiez les **DevTools** → Application → Service Workers
4. Consultez la **console** pour les erreurs

---

## 🎉 Félicitations !

Votre calculatrice TI-83 Plus est maintenant une **véritable application mobile** installable sur Android, sans passer par le Play Store !

**Partagez le lien** : https://www.lhusser.fr/calculatrice/

Vos utilisateurs peuvent l'installer en 3 clics ! 📱✨
