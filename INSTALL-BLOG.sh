#!/bin/bash
# Script d'installation sur un serveur web via SSH
# Version 2.5.0.0 - DISTR, TEST & LOGIC

# Configuration - MODIFIEZ CES VALEURS
BLOG_USER="votre-utilisateur"
BLOG_HOST="www.lhusser.fr"
BLOG_PATH="/var/www/html/calculatrice"
ARCHIVE_NAME="calculatrice-ti83-blog-v2.5.0.0.tar.gz"

echo "🚀 Déploiement de la Calculatrice TI-83 Plus v2.5.0.0"
echo "================================================"
echo ""

# Vérifier que l'archive existe
if [ ! -f "$ARCHIVE_NAME" ]; then
    echo "❌ Erreur: L'archive $ARCHIVE_NAME n'existe pas"
    echo "   Assurez-vous d'être dans le bon répertoire"
    exit 1
fi

echo "📦 Archive trouvée: $ARCHIVE_NAME"
echo "🌐 Serveur cible: $BLOG_USER@$BLOG_HOST:$BLOG_PATH"
echo ""
read -p "Continuer? (o/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Oo]$ ]]; then
    echo "❌ Déploiement annulé"
    exit 1
fi

echo ""
echo "📤 Upload de l'archive sur le serveur..."
scp "$ARCHIVE_NAME" "$BLOG_USER@$BLOG_HOST:/tmp/"

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'upload"
    exit 1
fi

echo "✅ Upload réussi"
echo ""
echo "📂 Création du répertoire et extraction..."

ssh "$BLOG_USER@$BLOG_HOST" << EOF
    # Créer le répertoire si nécessaire
    mkdir -p "$BLOG_PATH"

    # Sauvegarder l'ancienne version si elle existe
    if [ -f "$BLOG_PATH/index.html" ]; then
        echo "💾 Sauvegarde de l'ancienne version..."
        tar -czf "$BLOG_PATH/../calculatrice-backup-\$(date +%Y%m%d-%H%M%S).tar.gz" -C "$BLOG_PATH" .
    fi

    # Nettoyer le répertoire
    rm -rf "$BLOG_PATH"/*

    # Extraire la nouvelle version
    echo "📦 Extraction de la nouvelle version..."
    tar -xzf /tmp/"$ARCHIVE_NAME" -C "$BLOG_PATH"

    # Nettoyer le fichier temporaire
    rm /tmp/"$ARCHIVE_NAME"

    # Vérifier les permissions
    echo "🔒 Configuration des permissions..."
    chmod -R 755 "$BLOG_PATH"

    echo "✅ Déploiement terminé!"
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Déploiement réussi!"
    echo "📍 Votre calculatrice est accessible à:"
    echo "   https://$BLOG_HOST/calculatrice/"
    echo ""
    echo "📊 Version déployée: 2.5.0.0"
    echo "✨ Nouvelles fonctionnalités:"
    echo "   - 15 distributions statistiques (DISTR)"
    echo "   - 6 opérateurs de comparaison (TEST)"
    echo "   - 4 opérateurs logiques (LOGIC)"
else
    echo ""
    echo "❌ Erreur lors du déploiement"
    exit 1
fi
