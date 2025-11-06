#!/bin/bash

# Script de mise à jour et déploiement automatisé
# Pour la Calculatrice TI-83 Plus sur www.lhusser.fr/calculatrice/

set -e  # Arrêter en cas d'erreur

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  Mise à jour Calculatrice TI-83 Plus                     ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Vérifier qu'on est dans le bon répertoire
if [ ! -f "calculatrice-ti83-react/package.json" ]; then
    echo "❌ Erreur: Exécutez ce script depuis le dossier racine du projet"
    exit 1
fi

echo "📥 Étape 1/5 : Récupération des dernières modifications..."
git pull origin main || {
    echo "⚠️  Avertissement: Impossible de récupérer les mises à jour"
    echo "   Continuez avec la version locale actuelle ? (o/n)"
    read -r response
    if [ "$response" != "o" ]; then
        exit 1
    fi
}

echo ""
echo "📦 Étape 2/5 : Installation des dépendances..."
cd calculatrice-ti83-react

# Vérifier si package.json a changé
if git diff --name-only HEAD@{1} HEAD | grep -q "package.json"; then
    echo "   → Nouvelles dépendances détectées, installation..."
    npm install
else
    echo "   → Aucune nouvelle dépendance, installation ignorée"
fi

echo ""
echo "🔨 Étape 3/5 : Build de l'application..."
npm run build

if [ $? -eq 0 ]; then
    echo "   ✅ Build réussi!"
else
    echo "   ❌ Erreur lors du build"
    exit 1
fi

echo ""
echo "📦 Étape 4/5 : Création des archives de déploiement..."
cd ..

# Archive ZIP
zip -r calculatrice-ti83-deploy.zip calculatrice-ti83-react/dist/* > /dev/null 2>&1
echo "   ✅ calculatrice-ti83-deploy.zip créé"

# Archive TAR.GZ
tar -czf calculatrice-ti83-deploy.tar.gz -C calculatrice-ti83-react/dist .
echo "   ✅ calculatrice-ti83-deploy.tar.gz créé"

echo ""
echo "📊 Étape 5/5 : Informations de build..."
BUILD_SIZE=$(du -sh calculatrice-ti83-react/dist | cut -f1)
ZIP_SIZE=$(du -sh calculatrice-ti83-deploy.zip | cut -f1)
TAR_SIZE=$(du -sh calculatrice-ti83-deploy.tar.gz | cut -f1)

echo "   📁 Taille du build: $BUILD_SIZE"
echo "   📦 Archive ZIP:     $ZIP_SIZE"
echo "   📦 Archive TAR.GZ:  $TAR_SIZE"

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  ✅ Mise à jour terminée avec succès!                     ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "📤 PROCHAINE ÉTAPE : Déploiement sur le serveur"
echo ""
echo "Option 1 : Via FTP"
echo "  1. Connectez-vous à votre serveur"
echo "  2. Allez dans /public_html/calculatrice/"
echo "  3. Supprimez l'ancien contenu"
echo "  4. Uploadez le contenu de calculatrice-ti83-react/dist/"
echo ""
echo "Option 2 : Via SSH"
echo "  scp calculatrice-ti83-deploy.tar.gz utilisateur@lhusser.fr:/tmp/"
echo "  ssh utilisateur@lhusser.fr"
echo "  rm -rf /var/www/html/calculatrice/*"
echo "  tar -xzf /tmp/calculatrice-ti83-deploy.tar.gz -C /var/www/html/calculatrice/"
echo ""
echo "🌐 URL de déploiement: https://www.lhusser.fr/calculatrice/"
echo ""
